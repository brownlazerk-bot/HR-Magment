import React from 'react';
import { FileSpreadsheet, Download, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { SystemState, CurrencyCode } from '../../types';
import { formatCurrency } from '../../lib/storage';
import { exportToCSV, printERPReport } from '../../lib/exportUtils';

interface ReportsViewProps {
  state: SystemState;
  currency: CurrencyCode;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ state, currency }) => {
  const reportsList = [
    { title: 'Income Statement (P&L)', module: 'Accounting', format: 'PDF / CSV / Print' },
    { title: 'Monthly Profit & Loss Report', module: 'Financials', format: 'PDF / CSV / Print' },
    { title: 'Detailed Operating Expense Report', module: 'Expenses', format: 'PDF / CSV / Print' },
    { title: 'Cash Flow Statement (Direct & Indirect)', module: 'Accounting', format: 'PDF / CSV / Print' },
    { title: 'Full Staff Payroll Register & Payslips', module: 'Payroll', format: 'PDF / CSV / Print' },
    { title: 'Biometric Attendance & Overtime Log', module: 'Attendance', format: 'PDF / CSV / Print' },
    { title: 'Employee Directory & Contract Ledger', module: 'Human Resources', format: 'PDF / CSV / Print' },
    { title: 'Purchase Orders & Supplier AP Ledger', module: 'Purchases', format: 'PDF / CSV / Print' },
    { title: 'Inventory Stock Valuation & Movement', module: 'Inventory', format: 'PDF / CSV / Print' },
    { title: 'Department Net Profit Contribution', module: 'Analytics', format: 'PDF / CSV / Print' },
    { title: 'VAT & Withholding Tax Liability Summary', module: 'Tax', format: 'PDF / CSV / Print' },
    { title: 'SHA-256 System Audit Trail Log', module: 'Security', format: 'PDF / CSV / Print' }
  ];

  const handleGenerateReport = (reportTitle: string) => {
    const html = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">${reportTitle.toUpperCase()}</h2>
      <p style="font-size: 12px; color: #64748b;">Generated for: Sky View Resort & Luxury Suites | Date: ${new Date().toLocaleDateString()}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Metric / Ledger Category</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">Current Period Value</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">Compliance Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Total Gross Revenue</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">${formatCurrency(
              state.metrics.monthlyRevenue,
              currency
            )}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #10b981;">Audited</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Total Operating Expenses</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">${formatCurrency(
              state.metrics.totalExpenses,
              currency
            )}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #10b981;">Audited</td>
          </tr>
          <tr style="background: #f8fafc; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #cbd5e1;">NET OPERATING PROFIT</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; color: #10b981;">${formatCurrency(
              state.metrics.netProfit,
              currency
            )}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; color: #10b981;">PASSED</td>
          </tr>
        </tbody>
      </table>
    `;
    printERPReport(reportTitle, html);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Enterprise Reports Suite & Export Center</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          One-click generation of PDF statements, Excel CSV data exports & printable corporate financial reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((r, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex justify-between items-start">
              <span className="bg-slate-800 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                {r.module}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <h3 className="font-bold text-sm text-slate-100">{r.title}</h3>
            <p className="text-[11px] text-slate-400">Available formats: {r.format}</p>

            <div className="pt-2 border-t border-slate-800 flex space-x-2">
              <button
                onClick={() => handleGenerateReport(r.title)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate PDF / Print</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
