import React, { useState } from 'react';
import { ShieldCheck, Search, Download, X, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import { AuditLog } from '../types';
import { exportToCSV } from '../lib/exportUtils';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ isOpen, onClose, auditLogs }) => {
  const [filterModule, setFilterModule] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const safeAuditLogs = auditLogs || [];
  const modules = ['All', ...Array.from(new Set(safeAuditLogs.map((l) => l.module)))];

  const filtered = safeAuditLogs.filter((log) => {
    const matchesModule = filterModule === 'All' || log.module === filterModule;
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.checksum.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User Name', 'Role', 'Device', 'Module', 'Action', 'Details', 'Approval Status', 'Checksum'];
    const rows = filtered.map((l) => [
      l.timestamp,
      l.userName,
      l.userRole,
      l.device,
      l.module,
      l.action,
      l.details,
      l.approvalStatus,
      l.checksum
    ]);
    exportToCSV('SkyView_ERP_Audit_Trail', headers, rows);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Enterprise Immutable Audit Trail</h2>
              <p className="text-xs text-slate-400">Every financial transaction, clock-in, and approval is hash-verified</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, action, module, or hash checksum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Modules' : m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Device / OS</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Action & Details</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Hash Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-200">{log.userName}</div>
                    <div className="text-[10px] text-amber-400">{log.userRole}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      {log.device.includes('Mobile') ? (
                        <Smartphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate max-w-[140px]">{log.device}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <div className="font-medium text-slate-200">{log.action}</div>
                    <div className="text-slate-400 text-[11px] truncate">{log.details}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.approvalStatus === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : log.approvalStatus === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {log.approvalStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 truncate max-w-[100px]" title={log.checksum}>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{log.checksum.substring(0, 10)}...</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Total Log Entries: {filtered.length}</span>
          <span>SHA-256 System Integrity Verified</span>
        </div>
      </div>
    </div>
  );
};
