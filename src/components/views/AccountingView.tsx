import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Scale,
  Building2,
  PieChart as PieIcon,
  Search,
  CheckCircle,
  Download,
  BookOpen,
  Landmark,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { SystemState, CurrencyCode, JournalEntry, Account, Asset } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV, printERPReport } from '../../lib/exportUtils';

interface AccountingViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ state, currency, onUpdateState }) => {
  const { accounts, journalEntries, assets, currentUser, settings } = state;
  const [activeTab, setActiveTab] = useState<
    'accounts' | 'journal' | 'pnl' | 'balance' | 'trial' | 'cashbook' | 'assets' | 'tax' | 'ratios'
  >('accounts');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // New Journal Entry Modal state
  const [showNewJEModal, setShowNewJEModal] = useState(false);
  const [jeDate, setJeDate] = useState(new Date().toISOString().split('T')[0]);
  const [jeRef, setJeRef] = useState('JE-REF-' + Math.floor(100 + Math.random() * 900));
  const [jeDesc, setJeDesc] = useState('');
  const [jeLines, setJeLines] = useState<{ accountCode: string; debit: number; credit: number; desc: string }[]>([
    { accountCode: '1020', debit: 0, credit: 0, desc: '' },
    { accountCode: '4010', debit: 0, credit: 0, desc: '' }
  ]);

  // Calculations for Financial Statements
  const totalAssets = accounts.filter((a) => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter((a) => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accounts.filter((a) => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter((a) => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter((a) => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Total Debits and Credits for Journal verification
  const totalDebitsJE = jeLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCreditsJE = jeLines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isJEBalanced = totalDebitsJE > 0 && totalDebitsJE === totalCreditsJE;

  const handleCreateJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isJEBalanced) {
      alert('Double Entry Violation: Total Debits must strictly equal Total Credits.');
      return;
    }

    const newJE: JournalEntry = {
      id: 'je-' + Date.now(),
      entryNumber: 'JE-2026-' + Math.floor(100 + Math.random() * 900),
      date: jeDate,
      reference: jeRef,
      description: jeDesc || 'Standard ERP Journal Entry',
      lines: jeLines.map((l) => {
        const acc = accounts.find((a) => a.code === l.accountCode);
        return {
          accountCode: l.accountCode,
          accountName: acc?.name || 'Account ' + l.accountCode,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
          description: l.desc
        };
      }),
      createdBy: currentUser.name,
      status: 'Posted',
      createdAt: new Date().toISOString()
    };

    onUpdateState((prev) => {
      // Update account balances based on debit/credit
      const updatedAccounts = prev.accounts.map((acc) => {
        let delta = 0;
        newJE.lines.forEach((line) => {
          if (line.accountCode === acc.code) {
            if (acc.type === 'Asset' || acc.type === 'Expense') {
              delta += line.debit - line.credit;
            } else {
              delta += line.credit - line.debit;
            }
          }
        });
        return { ...acc, balance: acc.balance + delta };
      });

      const audit = createAuditLog(
        currentUser,
        'General Ledger',
        'Post Journal Entry',
        `Posted JE ${newJE.entryNumber}: ${newJE.description} (${formatCurrency(totalDebitsJE, currency)})`,
        'Approved'
      );

      return {
        ...prev,
        accounts: updatedAccounts,
        journalEntries: [newJE, ...prev.journalEntries],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setShowNewJEModal(false);
    setJeDesc('');
    setJeLines([
      { accountCode: '1020', debit: 0, credit: 0, desc: '' },
      { accountCode: '4010', debit: 0, credit: 0, desc: '' }
    ]);
  };

  const handlePrintPL = () => {
    const html = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">INCOME STATEMENT (PROFIT & LOSS)</h2>
      <p style="font-size: 12px; color: #64748b;">Period Ending: July 30, 2026</p>
      
      <h3 style="font-size: 14px; margin-top: 20px; color: #0f172a;">REVENUE CATEGORIES</h3>
      <table>
        <thead><tr><th>Code</th><th>Account Name</th><th style="text-align: right;">Amount</th></tr></thead>
        <tbody>
          ${accounts
            .filter((a) => a.type === 'Revenue')
            .map(
              (a) =>
                `<tr><td>${a.code}</td><td>${a.name}</td><td style="text-align: right; font-weight: bold;">${formatCurrency(
                  a.balance,
                  currency
                )}</td></tr>`
            )
            .join('')}
          <tr style="background: #f8fafc; font-weight: bold;">
            <td colspan="2">TOTAL OPERATING REVENUE</td>
            <td style="text-align: right; color: #10b981;">${formatCurrency(totalRevenue, currency)}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-size: 14px; margin-top: 24px; color: #0f172a;">EXPENSE CATEGORIES</h3>
      <table>
        <thead><tr><th>Code</th><th>Account Name</th><th style="text-align: right;">Amount</th></tr></thead>
        <tbody>
          ${accounts
            .filter((a) => a.type === 'Expense')
            .map(
              (a) =>
                `<tr><td>${a.code}</td><td>${a.name}</td><td style="text-align: right; font-weight: bold;">${formatCurrency(
                  a.balance,
                  currency
                )}</td></tr>`
            )
            .join('')}
          <tr style="background: #f8fafc; font-weight: bold;">
            <td colspan="2">TOTAL OPERATING EXPENSES</td>
            <td style="text-align: right; color: #f43f5e;">${formatCurrency(totalExpenses, currency)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px; padding: 16px; background: #f1f5f9; border-radius: 8px; font-size: 16px; font-weight: bold; display: flex; justify-content: space-between;">
        <span>NET BUSINESS PROFIT:</span>
        <span style="color: #10b981;">${formatCurrency(netIncome, currency)}</span>
      </div>
    `;
    printERPReport('Income Statement', html);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Financial Management & Double-Entry Ledger</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            General Ledger, Income Statement, Balance Sheet, Cash Books, Fixed Asset Register & Tax Compliance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewJEModal(true)}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'accounts', label: 'Chart of Accounts' },
          { id: 'journal', label: 'Journal Entries' },
          { id: 'pnl', label: 'Income Statement (P&L)' },
          { id: 'balance', label: 'Balance Sheet' },
          { id: 'trial', label: 'Trial Balance' },
          { id: 'cashbook', label: 'Cash & Bank Books' },
          { id: 'assets', label: 'Asset Register' },
          { id: 'tax', label: 'Tax & Compliance' },
          { id: 'ratios', label: 'Financial Ratios' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: Chart of Accounts */}
      {activeTab === 'accounts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter accounts by code, name, category, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200"
              />
            </div>
            <div className="text-xs text-slate-400">
              Total Accounts: <strong className="text-slate-200">{accounts.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Account Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Sub-Category</th>
                  <th className="py-2.5 px-3 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {accounts
                  .filter(
                    (a) =>
                      a.code.includes(searchTerm) ||
                      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.type.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((acc) => (
                    <tr key={acc.code} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{acc.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{acc.name}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.type === 'Asset'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : acc.type === 'Liability'
                              ? 'bg-rose-500/20 text-rose-400'
                              : acc.type === 'Revenue'
                              ? 'bg-amber-500/20 text-amber-400'
                              : acc.type === 'Expense'
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}
                        >
                          {acc.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{acc.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                        {formatCurrency(acc.balance, currency)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Journal Entries */}
      {activeTab === 'journal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100">Posted Journal Vouchers</h3>
            <button
              onClick={() => {
                const headers = ['Entry Number', 'Date', 'Reference', 'Description', 'Lines Count', 'Status'];
                const rows = journalEntries.map((je) => [
                  je.entryNumber,
                  je.date,
                  je.reference,
                  je.description,
                  je.lines.length,
                  je.status
                ]);
                exportToCSV('SkyView_Journal_Entries', headers, rows);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-4">
            {journalEntries.map((je) => (
              <div key={je.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-extrabold text-amber-400 text-sm">{je.entryNumber}</span>
                    <span className="text-slate-400">Date: {je.date}</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      Ref: {je.reference}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Created By: <strong className="text-slate-200">{je.createdBy}</strong>
                  </div>
                </div>

                <p className="text-slate-300 font-medium">{je.description}</p>

                <table className="w-full text-left text-[11px] text-slate-300 border border-slate-800/60 rounded">
                  <thead className="bg-slate-900 text-slate-400 font-mono">
                    <tr>
                      <th className="py-1.5 px-2">Account Code</th>
                      <th className="py-1.5 px-2">Account Name</th>
                      <th className="py-1.5 px-2 text-right">Debit</th>
                      <th className="py-1.5 px-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {je.lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 px-2 font-mono text-amber-400">{line.accountCode}</td>
                        <td className="py-1.5 px-2 font-semibold text-slate-200">{line.accountName}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-emerald-400">
                          {line.debit > 0 ? formatCurrency(line.debit, currency) : '-'}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-rose-400">
                          {line.credit > 0 ? formatCurrency(line.credit, currency) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Income Statement (P&L) */}
      {activeTab === 'pnl' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-100">Income Statement (Profit & Loss)</h3>
              <p className="text-xs text-slate-400">Operating Performance for Sky View Resort & Luxury Suites</p>
            </div>
            <button
              onClick={handlePrintPL}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Print Official P&L</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-emerald-400 tracking-wider">Operating Revenue Accounts</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/60 p-3 text-xs">
                {accounts
                  .filter((a) => a.type === 'Revenue')
                  .map((acc) => (
                    <div key={acc.code} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-amber-400 mr-2">{acc.code}</span>
                        <span className="text-slate-200">{acc.name}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">{formatCurrency(acc.balance, currency)}</span>
                    </div>
                  ))}
                <div className="pt-3 font-extrabold flex justify-between text-sm text-emerald-400">
                  <span>TOTAL OPERATING REVENUE</span>
                  <span>{formatCurrency(totalRevenue, currency)}</span>
                </div>
              </div>
            </div>

            {/* Expenses Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-rose-400 tracking-wider">Operating Expense Accounts</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/60 p-3 text-xs">
                {accounts
                  .filter((a) => a.type === 'Expense')
                  .map((acc) => (
                    <div key={acc.code} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-amber-400 mr-2">{acc.code}</span>
                        <span className="text-slate-200">{acc.name}</span>
                      </div>
                      <span className="font-mono font-bold text-rose-400">{formatCurrency(acc.balance, currency)}</span>
                    </div>
                  ))}
                <div className="pt-3 font-extrabold flex justify-between text-sm text-rose-400">
                  <span>TOTAL OPERATING EXPENSES</span>
                  <span>{formatCurrency(totalExpenses, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-base font-extrabold">
            <span>NET BUSINESS OPERATING PROFIT:</span>
            <span className="text-2xl text-emerald-400 font-mono">{formatCurrency(netIncome, currency)}</span>
          </div>
        </div>
      )}

      {/* Tab Content 4: Balance Sheet */}
      {activeTab === 'balance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-100">Statement of Financial Position (Balance Sheet)</h3>
              <p className="text-xs text-slate-400">Assets = Liabilities + Owner Equity Verification</p>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>BALANCED STATEMENT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Assets */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-amber-400 tracking-wider">Total Hotel Assets</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60 space-y-2">
                {accounts
                  .filter((a) => a.type === 'Asset')
                  .map((acc) => (
                    <div key={acc.code} className="py-2 flex justify-between">
                      <span>
                        <strong className="text-amber-400 font-mono mr-2">{acc.code}</strong>
                        {acc.name}
                      </span>
                      <span className="font-mono font-bold text-slate-200">{formatCurrency(acc.balance, currency)}</span>
                    </div>
                  ))}
                <div className="pt-3 font-extrabold text-sm flex justify-between text-amber-400">
                  <span>TOTAL ASSETS</span>
                  <span>{formatCurrency(totalAssets, currency)}</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-rose-400 tracking-wider">Liabilities</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60">
                  {accounts
                    .filter((a) => a.type === 'Liability')
                    .map((acc) => (
                      <div key={acc.code} className="py-2 flex justify-between">
                        <span>
                          <strong className="text-amber-400 font-mono mr-2">{acc.code}</strong>
                          {acc.name}
                        </span>
                        <span className="font-mono font-bold text-slate-200">{formatCurrency(acc.balance, currency)}</span>
                      </div>
                    ))}
                  <div className="pt-2 font-bold text-rose-400 flex justify-between">
                    <span>TOTAL LIABILITIES</span>
                    <span>{formatCurrency(totalLiabilities, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-purple-400 tracking-wider">Capital & Equity</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60">
                  {accounts
                    .filter((a) => a.type === 'Equity')
                    .map((acc) => (
                      <div key={acc.code} className="py-2 flex justify-between">
                        <span>
                          <strong className="text-amber-400 font-mono mr-2">{acc.code}</strong>
                          {acc.name}
                        </span>
                        <span className="font-mono font-bold text-slate-200">{formatCurrency(acc.balance, currency)}</span>
                      </div>
                    ))}
                  <div className="py-2 flex justify-between text-emerald-400 font-semibold">
                    <span>Retained Earnings from Current Period</span>
                    <span>{formatCurrency(netIncome, currency)}</span>
                  </div>
                  <div className="pt-2 font-bold text-purple-400 flex justify-between">
                    <span>TOTAL EQUITY</span>
                    <span>{formatCurrency(totalEquity + netIncome, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Asset Register */}
      {activeTab === 'assets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100">Hotel Fixed Asset Register & Depreciation Schedule</h3>
              <p className="text-slate-400 text-[11px]">Track plant, equipment, and straight-line/reducing balance depreciation</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Asset Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Purchase Date</th>
                  <th className="py-2.5 px-3 text-right">Cost Price</th>
                  <th className="py-2.5 px-3 text-right">Current Book Value</th>
                  <th className="py-2.5 px-3 text-center">Depreciation Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{asset.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{asset.category}</td>
                    <td className="py-2.5 px-3 text-slate-400">{asset.location}</td>
                    <td className="py-2.5 px-3 font-mono">{asset.purchaseDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                      {formatCurrency(asset.purchasePrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(asset.currentValue, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        {asset.depreciationMethod} ({asset.usefulLifeYears} yrs)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Journal Entry Modal */}
      {showNewJEModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Create Double-Entry Journal Voucher</span>
            </h3>

            <form onSubmit={handleCreateJournalEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Posting Date</label>
                  <input
                    type="date"
                    value={jeDate}
                    onChange={(e) => setJeDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Reference Code</label>
                  <input
                    type="text"
                    value={jeRef}
                    onChange={(e) => setJeRef(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Prepared By</label>
                  <input
                    type="text"
                    value={currentUser.name}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Transaction Explanation / Description</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly room revenue cash deposit to KCB bank account"
                  value={jeDesc}
                  onChange={(e) => setJeDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              {/* Lines */}
              <div className="space-y-2 border border-slate-800 rounded-xl p-3 bg-slate-950">
                <div className="flex justify-between font-bold text-slate-400 text-[10px] uppercase">
                  <span>Account</span>
                  <span>Debit Amount</span>
                  <span>Credit Amount</span>
                </div>

                {jeLines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                    <select
                      value={line.accountCode}
                      onChange={(e) => {
                        const next = [...jeLines];
                        next[idx].accountCode = e.target.value;
                        setJeLines(next);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-200"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name} ({acc.type})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Debit"
                      value={line.debit || ''}
                      onChange={(e) => {
                        const next = [...jeLines];
                        next[idx].debit = parseFloat(e.target.value) || 0;
                        setJeLines(next);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded p-1.5 text-right font-mono text-emerald-400"
                    />

                    <input
                      type="number"
                      placeholder="Credit"
                      value={line.credit || ''}
                      onChange={(e) => {
                        const next = [...jeLines];
                        next[idx].credit = parseFloat(e.target.value) || 0;
                        setJeLines(next);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded p-1.5 text-right font-mono text-rose-400"
                    />
                  </div>
                ))}
              </div>

              {/* Total Check */}
              <div className="flex justify-between items-center text-xs font-bold p-2 bg-slate-950 rounded border border-slate-800">
                <span className={isJEBalanced ? 'text-emerald-400' : 'text-rose-400'}>
                  {isJEBalanced ? '✓ Double Entry Balanced' : '⚠ Out of Balance (Debits ≠ Credits)'}
                </span>
                <div className="space-x-4 font-mono">
                  <span>Total Debit: ${totalDebitsJE}</span>
                  <span>Total Credit: ${totalCreditsJE}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewJEModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isJEBalanced}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg disabled:opacity-50"
                >
                  Post Journal Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
