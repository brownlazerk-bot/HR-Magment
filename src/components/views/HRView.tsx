import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  FileText,
  Briefcase,
  AlertOctagon,
  Calendar,
  Check,
  X,
  Phone,
  Mail,
  Award,
  Shield,
  Download,
  Building
} from 'lucide-react';
import { SystemState, CurrencyCode, Employee, LeaveRequest } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV } from '../../lib/exportUtils';

interface HRViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const HRView: React.FC<HRViewProps> = ({ state, currency, onUpdateState }) => {
  const { employees, leaveRequests, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'directory' | 'leave' | 'performance' | 'recruitment'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // New Employee Modal
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    department: 'Front Desk & Rooms',
    position: 'Customer Service Officer',
    contractType: 'Full-time' as Employee['contractType'],
    baseSalary: 3500,
    supervisor: 'Victoria Vance',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleApproveLeave = (leaveId: string, approve: boolean) => {
    onUpdateState((prev) => {
      const updated = prev.leaveRequests.map((l) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status: approve ? ('Approved' as const) : ('Rejected' as const),
            approvedBy: `${currentUser.name} (${currentUser.role})`
          };
        }
        return l;
      });

      const req = prev.leaveRequests.find((l) => l.id === leaveId);
      const audit = createAuditLog(
        currentUser,
        'HR Management',
        approve ? 'Approve Leave' : 'Reject Leave',
        `${approve ? 'Approved' : 'Rejected'} leave request for ${req?.employeeName} (${req?.totalDays} days)`,
        approve ? 'Approved' : 'Rejected'
      );

      return {
        ...prev,
        leaveRequests: updated,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Employee = {
      id: 'emp-' + Date.now(),
      employeeCode: 'SVR-' + Math.floor(100 + Math.random() * 900),
      name: newEmp.name,
      email: newEmp.email,
      phone: newEmp.phone,
      nationalId: newEmp.nationalId,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      department: newEmp.department,
      position: newEmp.position,
      contractType: newEmp.contractType,
      startDate: new Date().toISOString().split('T')[0],
      baseSalary: Number(newEmp.baseSalary),
      supervisor: newEmp.supervisor,
      emergencyContact: {
        name: newEmp.emergencyContactName || 'Family Contact',
        relation: 'Spouse/Parent',
        phone: newEmp.emergencyContactPhone || newEmp.phone
      },
      status: 'Active',
      bankDetails: {
        bankName: 'Standard Chartered Bank',
        accountNumber: '99' + Math.floor(10000000 + Math.random() * 90000000)
      }
    };

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'HR Management',
        'Add Employee',
        `Registered new staff profile: ${created.name} (${created.position} - ${created.department})`,
        'Approved'
      );

      return {
        ...prev,
        employees: [...prev.employees, created],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setShowAddEmployeeModal(false);
  };

  const filteredEmployees = (employees || []).filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Human Resources & Personnel Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Employee directory, employment contracts, leave management & evaluations for Sky View Resort
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'directory' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Staff Directory ({(employees || []).length})
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'leave' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Leave Requests ({(leaveRequests || []).filter((l) => l.status.includes('Pending')).length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'performance' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Performance & Disciplinary
        </button>
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name, code, department or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200"
              />
            </div>

            <button
              onClick={() => {
                const headers = ['Code', 'Name', 'Department', 'Position', 'Contract', 'Base Salary', 'Status', 'Phone'];
                const rows = filteredEmployees.map((e) => [
                  e.employeeCode,
                  e.name,
                  e.department,
                  e.position,
                  e.contractType,
                  e.baseSalary,
                  e.status,
                  e.phone
                ]);
                exportToCSV('SkyView_Staff_Directory', headers, rows);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-md cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <img src={emp.photoUrl} alt={emp.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/20" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-amber-400 font-bold">{emp.employeeCode}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-100 truncate mt-0.5">{emp.name}</h3>
                    <p className="text-xs text-amber-400 font-medium truncate">{emp.position}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center text-slate-400">
                    <Building className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    <span className="truncate">{emp.department}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 font-mono">
                    <span className="text-slate-400">Base Salary:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(emp.baseSalary, currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leave' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-sm text-slate-100">Employee Leave & Absence Approval Workflow</h3>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100">{req.employeeName}</span>
                    <span className="bg-slate-800 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {req.department}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Type: <strong className="text-slate-200">{req.leaveType} Leave</strong> ({req.totalDays} Days) | From{' '}
                    <span className="font-mono">{req.startDate}</span> to <span className="font-mono">{req.endDate}</span>
                  </div>
                  <p className="text-slate-400 italic">"{req.reason}"</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : req.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {req.status}
                  </span>

                  {req.status.includes('Pending') && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApproveLeave(req.id, true)}
                        className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold"
                        title="Approve Leave"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApproveLeave(req.id, false)}
                        className="p-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg font-bold"
                        title="Reject Leave"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex space-x-4 items-center">
                <img
                  src={selectedEmployee.photoUrl}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500"
                />
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedEmployee.employeeCode}</span>
                  <h2 className="text-base font-bold text-slate-100">{selectedEmployee.name}</h2>
                  <p className="text-xs text-amber-400">{selectedEmployee.position}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="font-semibold text-slate-200">{selectedEmployee.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contract Type:</span>
                <span className="font-semibold text-slate-200">{selectedEmployee.contractType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">National ID / Passport:</span>
                <span className="font-mono text-slate-200">{selectedEmployee.nationalId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Base Monthly Salary:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(selectedEmployee.baseSalary, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Direct Supervisor:</span>
                <span className="text-slate-200">{selectedEmployee.supervisor}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emergency Contact:</span>
                <span className="text-slate-200">{selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.phone})</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>Register New Employee Profile</span>
            </h3>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Front Desk & Rooms">Front Desk & Rooms</option>
                    <option value="Culinary & Kitchen">Culinary & Kitchen</option>
                    <option value="Sky Line Lounge & Bar">Sky Line Lounge & Bar</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Procurement & Stores">Procurement & Stores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Base Salary ($)</label>
                  <input
                    type="number"
                    value={newEmp.baseSalary}
                    onChange={(e) => setNewEmp({ ...newEmp, baseSalary: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
