import React, { useState } from 'react';
import {
  Clock,
  Fingerprint,
  QrCode,
  KeyRound,
  MapPin,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { SystemState, AttendanceRecord } from '../../types';
import { createAuditLog } from '../../lib/storage';
import { exportToCSV } from '../../lib/exportUtils';

interface AttendanceViewProps {
  state: SystemState;
  currency: any;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ state, onUpdateState }) => {
  const { attendance, employees, currentUser } = state;
  const [method, setMethod] = useState<'PIN' | 'Fingerprint' | 'QR' | 'GPS'>('Fingerprint');
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [pinCode, setPinCode] = useState('');
  const [clockSuccessMessage, setClockSuccessMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSimulateClockIn = () => {
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Determine status (Late if after 8:00 AM)
    const isLate = new Date().getHours() >= 8 && new Date().getMinutes() > 15;
    const status: AttendanceRecord['status'] = isLate ? 'Late' : 'Present';

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: todayStr,
      clockIn: currentTimeStr,
      status,
      verificationMethod: method,
      overtimeHours: Math.random() > 0.5 ? 1.5 : 0,
      location: 'Executive Main Terminal (Kiosk #1)'
    };

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'Attendance Terminal',
        'Clock In',
        `Staff Clock In: ${emp.name} (${method} Verified, ${status})`,
        'Approved'
      );
      return {
        ...prev,
        attendance: [newRecord, ...prev.attendance],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setClockSuccessMessage(`Success! ${emp.name} clocked in at ${currentTimeStr} via ${method} (${status})`);
    setTimeout(() => setClockSuccessMessage(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Time & Attendance Control Terminal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Biometric fingerprint, QR scanner, PIN & GPS location check-in terminal for Sky View Resort
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Terminal Kiosk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Biometric / PIN Clocking Station</span>
            </h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              TERMINAL ONLINE
            </span>
          </div>

          {/* Verification Method Selector */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { id: 'Fingerprint', label: 'Fingerprint', icon: Fingerprint },
              { id: 'PIN', label: 'PIN Code', icon: KeyRound },
              { id: 'QR', label: 'QR Scan', icon: QrCode },
              { id: 'GPS', label: 'GPS Loc', icon: MapPin }
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    method === m.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form / Simulation Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.department} - {e.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            {method === 'PIN' && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Enter Staff 4-Digit PIN</label>
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-lg font-mono tracking-widest text-amber-400"
                />
              </div>
            )}

            {method === 'Fingerprint' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                <Fingerprint className="w-12 h-12 text-amber-400 animate-pulse" />
                <span className="text-[11px]">Place finger on hardware scanner sensor</span>
              </div>
            )}

            {method === 'QR' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                <QrCode className="w-12 h-12 text-sky-400 animate-pulse" />
                <span className="text-[11px]">Hold staff badge QR code up to terminal camera</span>
              </div>
            )}

            {method === 'GPS' && (
              <div className="py-4 text-center space-y-1 bg-slate-900 rounded-lg border border-slate-800">
                <MapPin className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="font-semibold text-slate-200">Sky View Resort Resort GPS Bounds</div>
                <div className="text-[10px] text-slate-400 font-mono">Lat: -1.286389, Long: 36.817223 (Verified)</div>
              </div>
            )}

            <button
              onClick={handleSimulateClockIn}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all"
            >
              CLOCK IN NOW
            </button>
          </div>

          {clockSuccessMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{clockSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Today's Attendance Log Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100">Live Attendance Roster Log ({todayStr})</h3>
              <p className="text-xs text-slate-400">Automatic overtime computation & shift compliance</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Date', 'Employee Name', 'Department', 'Clock In', 'Clock Out', 'Status', 'Verification', 'Overtime Hours'];
                const rows = attendance.map((a) => [
                  a.date,
                  a.employeeName,
                  a.department,
                  a.clockIn,
                  a.clockOut || 'Shift Active',
                  a.status,
                  a.verificationMethod,
                  a.overtimeHours
                ]);
                exportToCSV('SkyView_Attendance_Log', headers, rows);
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
                  <th className="py-2.5 px-3">Employee Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Clock In</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{att.employeeName}</td>
                    <td className="py-2.5 px-3 text-slate-400">{att.department}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{att.clockIn}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.status === 'Present'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : att.status === 'Late'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        {att.verificationMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {att.overtimeHours > 0 ? `+${att.overtimeHours} hrs` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
