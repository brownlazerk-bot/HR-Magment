import React, { useState } from 'react';
import {
  Banknote,
  FileText,
  CheckCircle,
  Download,
  Plus,
  ShieldCheck,
  Printer,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { SystemState, CurrencyCode, PayrollRecord } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV, printERPReport } from '../../lib/exportUtils';

interface PayrollViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ state, currency, onUpdateState }) => {
  const { payroll, employees, currentUser } = state;
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const handleApprovePayroll = (payrollId: string) => {
    onUpdateState((prev) => {
      const updated = prev.payroll.map((p) => {
        if (p.id === payrollId) {
          return { ...p, status: 'Approved' as const, paymentDate: new Date().toISOString().split('T')[0] };
        }
        return p;
      });

      const pay = prev.payroll.find((p) => p.id === payrollId);
      const audit = createAuditLog(
        currentUser,
        'Payroll Processor',
        'Approve Payroll',
        `Approved monthly net payroll for ${pay?.employeeName} (${formatCurrency(pay?.netPay || 0, currency)})`,
        'Approved'
      );

      return {
        ...prev,
        payroll: updated,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });
  };

  const handleGenerateMonthlyPayroll = () => {
    onUpdateState((prev) => {
      const newRecords: PayrollRecord[] = prev.employees.map((emp) => {
        const baseSalary = emp.baseSalary;
        const overtimePay = Math.floor(Math.random() * 400);
        const allowances = Math.floor(baseSalary * 0.1);
        const bonuses = Math.floor(Math.random() * 300);
        const grossPay = baseSalary + overtimePay + allowances + bonuses;
        const taxDeduction = Math.floor(grossPay * 0.2);
        const pensionDeduction = Math.floor(grossPay * 0.06);
        const healthInsurance = 150;
        const totalDeductions = taxDeduction + pensionDeduction + healthInsurance;
        const netPay = grossPay - totalDeductions;

        return {
          id: 'pay-2026-07-' + emp.id,
          payrollMonth: '2026-07',
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          position: emp.position,
          baseSalary,
          overtimePay,
          allowances,
          bonuses,
          commissions: 0,
          tips: Math.floor(Math.random() * 150),
          grossPay,
          taxDeduction,
          pensionDeduction,
          healthInsurance,
          loanDeduction: 0,
          totalDeductions,
          netPay,
          status: 'Pending Approval'
        };
      });

      const audit = createAuditLog(
        currentUser,
        'Payroll Processor',
        'Generate Batch Payroll',
        `Generated July 2026 monthly payroll run for ${newRecords.length} employees`,
        'Pending'
      );

      return {
        ...prev,
        payroll: newRecords,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });
  };

  const handlePrintPayslip = (pay: PayrollRecord) => {
    const html = `
      <div style="border: 2px solid #0f172a; padding: 24px; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 20px; color: #0f172a;">SKY VIEW RESORT & LUXURY SUITES</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">OFFICIAL CONFIDENTIAL EMPLOYEE PAYSLIP</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #f59e0b;">PERIOD: ${pay.payrollMonth}</p>
        </div>

        <table style="width: 100%; font-size: 12px; margin-bottom: 20px;">
          <tr>
            <td><strong>Employee Name:</strong> ${pay.employeeName}</td>
            <td><strong>Department:</strong> ${pay.department}</td>
          </tr>
          <tr>
            <td><strong>Position:</strong> ${pay.position}</td>
            <td><strong>Payment Status:</strong> ${pay.status}</td>
          </tr>
        </table>

        <div style="display: flex; gap: 20px;">
          <div style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
            <h3 style="margin-top: 0; color: #10b981; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">EARNINGS</h3>
            <table style="width: 100%; font-size: 12px;">
              <tr><td>Base Salary</td><td style="text-align: right;">${formatCurrency(pay.baseSalary, currency)}</td></tr>
              <tr><td>Overtime Pay</td><td style="text-align: right;">${formatCurrency(pay.overtimePay, currency)}</td></tr>
              <tr><td>Housing & Transport Allowance</td><td style="text-align: right;">${formatCurrency(pay.allowances, currency)}</td></tr>
              <tr><td>Bonuses & Tips</td><td style="text-align: right;">${formatCurrency(pay.bonuses + pay.tips, currency)}</td></tr>
              <tr style="font-weight: bold; border-top: 1px solid #94a3b8;"><td>GROSS EARNINGS</td><td style="text-align: right; color: #10b981;">${formatCurrency(pay.grossPay, currency)}</td></tr>
            </table>
          </div>

          <div style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
            <h3 style="margin-top: 0; color: #f43f5e; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">DEDUCTIONS</h3>
            <table style="width: 100%; font-size: 12px;">
              <tr><td>PAYE Income Tax</td><td style="text-align: right;">${formatCurrency(pay.taxDeduction, currency)}</td></tr>
              <tr><td>National Pension Fund</td><td style="text-align: right;">${formatCurrency(pay.pensionDeduction, currency)}</td></tr>
              <tr><td>Health Insurance Scheme</td><td style="text-align: right;">${formatCurrency(pay.healthInsurance, currency)}</td></tr>
              <tr style="font-weight: bold; border-top: 1px solid #94a3b8;"><td>TOTAL DEDUCTIONS</td><td style="text-align: right; color: #f43f5e;">${formatCurrency(pay.totalDeductions, currency)}</td></tr>
            </table>
          </div>
        </div>

        <div style="margin-top: 24px; background: #f8fafc; border: 2px solid #10b981; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
          <span>NET PAYABLE SALARY:</span>
          <span style="color: #10b981;">${formatCurrency(pay.netPay, currency)}</span>
        </div>
      </div>
    `;
    printERPReport(`Payslip - ${pay.employeeName}`, html);
  };

  const totalPayrollGross = payroll.reduce((sum, p) => sum + p.grossPay, 0);
  const totalPayrollNet = payroll.reduce((sum, p) => sum + p.netPay, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Banknote className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Enterprise Payroll & Payslip Processing</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated tax calculations, pension deductions, overtime & PDF payslip generation
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateMonthlyPayroll}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate July Batch Payroll</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Monthly Gross Payroll</div>
          <div className="text-xl font-extrabold text-slate-100 mt-1">{formatCurrency(totalPayrollGross, currency)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Net Salary Payable</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">{formatCurrency(totalPayrollNet, currency)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-xs font-semibold uppercase">Pending CEO Sign-offs</div>
          <div className="text-xl font-extrabold text-amber-400 mt-1">
            {(payroll || []).filter((p) => p.status.includes('Pending')).length} Staff Records
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100">Current Payroll Register (July 2026)</h3>
          <button
            onClick={() => {
              const headers = ['Month', 'Employee Name', 'Department', 'Base Salary', 'Gross Pay', 'Deductions', 'Net Pay', 'Status'];
              const rows = payroll.map((p) => [
                p.payrollMonth,
                p.employeeName,
                p.department,
                p.baseSalary,
                p.grossPay,
                p.totalDeductions,
                p.netPay,
                p.status
              ]);
              exportToCSV('SkyView_Payroll_Register', headers, rows);
            }}
            className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Register CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-right">Base Salary</th>
                <th className="py-2.5 px-3 text-right">Gross Pay</th>
                <th className="py-2.5 px-3 text-right">Tax & Deductions</th>
                <th className="py-2.5 px-3 text-right">Net Payable</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payroll.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    <div>{pay.employeeName}</div>
                    <div className="text-[10px] text-amber-400">{pay.position}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{pay.department}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {formatCurrency(pay.baseSalary, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">
                    {formatCurrency(pay.grossPay, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-400">
                    {formatCurrency(pay.totalDeductions, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-slate-100">
                    {formatCurrency(pay.netPay, currency)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pay.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center space-x-2">
                    <button
                      onClick={() => handlePrintPayslip(pay)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs"
                      title="Generate & Print Payslip PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    {pay.status.includes('Pending') && (
                      <button
                        onClick={() => handleApprovePayroll(pay.id)}
                        className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
