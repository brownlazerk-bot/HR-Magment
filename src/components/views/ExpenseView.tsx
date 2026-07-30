import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Check,
  X,
  Upload,
  Download,
  Image as ImageIcon,
  DollarSign,
  Building,
  Calendar
} from 'lucide-react';
import { SystemState, CurrencyCode, Expense } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV } from '../../lib/exportUtils';

interface ExpenseViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({ state, currency, onUpdateState }) => {
  const { expenses, currentUser, settings } = state;
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  const [category, setCategory] = useState('Kitchen Purchases');
  const [department, setDepartment] = useState('Culinary & Kitchen');
  const [amount, setAmount] = useState(450);
  const [paidTo, setPaidTo] = useState('Highland Organic Farm');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'>('Mobile Money');
  const [description, setDescription] = useState('');

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine status based on approval rules
    let status: Expense['status'] = 'Approved';
    if (amount >= settings.approvalThresholdCEO) {
      status = 'Pending GM';
    } else if (amount >= settings.approvalThresholdGM) {
      status = 'Pending Accountant';
    }

    const newExpense: Expense = {
      id: 'exp-' + Date.now(),
      expenseNumber: 'EXP-2026-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      category,
      department,
      amount: Number(amount),
      currency,
      paidTo,
      paymentMethod,
      description: description || `Expense for ${category}`,
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      requestedBy: currentUser.name,
      approvedBy: status === 'Approved' ? currentUser.name : undefined,
      status
    };

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'Expense Control',
        'Record Expense',
        `Recorded ${category} expense of ${formatCurrency(newExpense.amount, currency)} to ${paidTo} (${status})`,
        status === 'Approved' ? 'Approved' : 'Pending'
      );
      return {
        ...prev,
        expenses: [newExpense, ...prev.expenses],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setShowAddModal(false);
    setDescription('');
  };

  const handleApproveExpense = (expId: string) => {
    onUpdateState((prev) => {
      const updated = prev.expenses.map((e) => {
        if (e.id === expId) {
          return { ...e, status: 'Approved' as const, approvedBy: currentUser.name };
        }
        return e;
      });

      const exp = prev.expenses.find((e) => e.id === expId);
      const audit = createAuditLog(
        currentUser,
        'Expense Control',
        'Approve Expense',
        `Approved expense voucher ${exp?.expenseNumber} (${formatCurrency(exp?.amount || 0, currency)})`,
        'Approved'
      );

      return {
        ...prev,
        expenses: updated,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });
  };

  const categories = [
    'Fuel',
    'Electricity',
    'Water',
    'Internet',
    'Rent',
    'Maintenance',
    'Repairs',
    'Cleaning',
    'Kitchen Purchases',
    'Bar Purchases',
    'Staff Meals',
    'Transport',
    'Marketing',
    'Government Fees',
    'Unexpected Expenses'
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Enterprise Expense Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational expenses, fuel, utilities, vendor vouchers & receipt verification
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Expenses List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100">Expense Vouchers Log</h3>
          <button
            onClick={() => {
              const headers = ['Voucher No', 'Date', 'Category', 'Department', 'Paid To', 'Payment Method', 'Amount', 'Status'];
              const rows = expenses.map((e) => [
                e.expenseNumber,
                e.date,
                e.category,
                e.department,
                e.paidTo,
                e.paymentMethod,
                e.amount,
                e.status
              ]);
              exportToCSV('SkyView_Expense_Vouchers', headers, rows);
            }}
            className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Voucher #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category & Details</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Vendor / Recipient</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{exp.expenseNumber}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{exp.date}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-200">{exp.category}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{exp.description}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{exp.department}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">{exp.paidTo}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                    {formatCurrency(exp.amount, currency)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exp.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {exp.status}
                    </span>
                    {exp.status.includes('Pending') && (
                      <button
                        onClick={() => handleApproveExpense(exp.id)}
                        className="ml-2 text-[10px] text-emerald-400 underline"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {exp.receiptUrl ? (
                      <button
                        onClick={() => setSelectedReceiptUrl(exp.receiptUrl!)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>Record Expense Voucher</span>
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money (M-Pesa)</option>
                    <option value="Cheque">Corporate Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Vendor / Paid To</label>
                <input
                  type="text"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purpose / Explanation</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg">
                  Submit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-lg w-full space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-100">Uploaded Receipt Voucher</h4>
              <button onClick={() => setSelectedReceiptUrl(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedReceiptUrl} alt="Receipt" className="w-full rounded-xl object-cover max-h-96" />
          </div>
        </div>
      )}
    </div>
  );
};
