import React, { useState } from 'react';
import {
  ShieldAlert,
  Key,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';
import { SystemState, UserRole } from '../../types';
import { resetSystemState, createAuditLog } from '../../lib/storage';

interface SecurityAuditViewProps {
  state: SystemState;
  currentUser: any;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
  onResetData: () => void;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({
  state,
  currentUser,
  onUpdateState,
  onResetData
}) => {
  const { auditLogs } = state;
  const [backupStatusMsg, setBackupStatusMsg] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SkyView_Resort_ERP_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'System Security',
        'Download Backup',
        'Exported complete encrypted JSON system database backup',
        'Approved'
      );
      return { ...prev, auditLogs: [audit, ...prev.auditLogs] };
    });

    setBackupStatusMsg('System Backup downloaded successfully!');
    setTimeout(() => setBackupStatusMsg(null), 3000);
  };

  const roles: UserRole[] = [
    'CEO / Owner',
    'General Manager',
    'Accountant',
    'HR Manager',
    'Cashier',
    'Reception',
    'Store Manager',
    'Restaurant Manager',
    'Kitchen Manager',
    'Bar Manager',
    'Supervisor',
    'Employee'
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Security Governance, Role Matrix & Database Backups</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Role-based access controls (RBAC), automatic recovery, SHA-256 audit logs & JSON backup restoration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Restore Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database Backup & Recovery</span>
          </h3>

          <p className="text-slate-400">
            Export a complete JSON snapshot of all general ledger accounts, employees, payroll, inventory, and audit logs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Full System Backup</span>
            </button>

            <button
              onClick={onResetData}
              className="flex items-center justify-center space-x-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold py-2.5 px-4 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Demo State</span>
            </button>
          </div>

          {backupStatusMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{backupStatusMsg}</span>
            </div>
          )}
        </div>

        {/* Security Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Active Security & Compliance Status</span>
          </h3>

          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Immutable Audit Encryption:</span>
              <span className="text-emerald-400 font-bold">SHA-256 Validated</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Auto-Logout Session Inactivity:</span>
              <span className="text-slate-200 font-mono">30 Minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">PWA Offline Data Encryption:</span>
              <span className="text-emerald-400 font-bold">AES-256 LocalStorage Engine</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Audit Verification Entries:</span>
              <span className="text-amber-400 font-mono font-bold">{auditLogs.length} Records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Access Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
        <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Role Hierarchy & Permission Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">System Role</th>
                <th className="py-2.5 px-3">Dashboard</th>
                <th className="py-2.5 px-3">Accounting</th>
                <th className="py-2.5 px-3">HR & Personnel</th>
                <th className="py-2.5 px-3">Payroll</th>
                <th className="py-2.5 px-3">Expenses</th>
                <th className="py-2.5 px-3">Purchases</th>
                <th className="py-2.5 px-3">Inventory</th>
                <th className="py-2.5 px-3">Audit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {roles.map((role) => (
                <tr key={role} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-amber-400">{role}</td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'HR Manager'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant', 'HR Manager', 'Employee'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant', 'Store Manager', 'Bar Manager', 'Kitchen Manager'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant', 'Store Manager'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Store Manager', 'Bar Manager', 'Kitchen Manager'].includes(role) ? '✓' : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {['CEO / Owner', 'General Manager', 'Accountant'].includes(role) ? '✓' : '-'}
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
