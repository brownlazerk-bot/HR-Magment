import React, { useState } from 'react';
import { Settings, Save, Building, DollarSign, ShieldCheck, CheckCircle, Trash2, RefreshCw, UserPlus, Users, UserCheck, Key, Mail, Shield } from 'lucide-react';
import { SystemState, CurrencyCode, SystemSettings, User, UserRole } from '../../types';
import { createAuditLog, getCleanState, saveSystemState } from '../../lib/storage';

interface SettingsViewProps {
  state: SystemState;
  currentUser: any;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, currentUser, onUpdateState }) => {
  const { settings } = state;
  const [form, setForm] = useState<SystemSettings>({ ...settings });
  const [savedMsg, setSavedMsg] = useState(false);
  const [resetMsg, setResetMsg] = useState(false);

  // New User Form State
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('General Manager');
  const [newUserDept, setNewUserDept] = useState('Operations');
  const [newUserPin, setNewUserPin] = useState('1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'System Settings',
        'Update Configuration',
        `Updated hotel settings: ${form.hotelName}, Tax PIN: ${form.taxPin}, VAT: ${form.vatRate}%`,
        'Approved'
      );

      return {
        ...prev,
        settings: form,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Please fill out Name and Email.');
      return;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept.trim() || 'General Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      pin: newUserPin.trim() || '1234'
    };

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'User Management',
        'Create Account',
        `Created new ${newUserRole} account for ${newUser.name} (${newUser.email})`,
        'Approved'
      );

      return {
        ...prev,
        users: [...prev.users, newUser],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (state.users.length <= 1) {
      alert('Cannot delete the last remaining user account.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove user account "${userName}"?`)) {
      onUpdateState((prev) => {
        const updatedUsers = prev.users.filter((u) => u.id !== userId);
        const nextCurrentUser = prev.currentUser?.id === userId ? updatedUsers[0] : prev.currentUser;
        const audit = createAuditLog(
          currentUser,
          'User Management',
          'Delete Account',
          `Removed user account ${userName} (${userId})`,
          'Approved'
        );

        return {
          ...prev,
          users: updatedUsers,
          currentUser: nextCurrentUser,
          auditLogs: [audit, ...prev.auditLogs]
        };
      });
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Are you sure you want to clear all data and start fresh? This will require creating a new Super Admin account.')) {
      const clean = getCleanState();
      saveSystemState(clean);
      onUpdateState(() => clean);
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 4000);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Enterprise System Settings & Accounts</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure hotel business information, manage user accounts, roles & system security thresholds
        </p>
      </div>

      {/* User Accounts & Role Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Registered System Users & Access Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage accounts, assign roles, and configure security access PINs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddUser(!showAddUser)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Account</span>
          </button>
        </div>

        {/* Add User Modal / Form */}
        {showAddUser && (
          <form onSubmit={handleCreateUser} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
            <div className="font-bold text-slate-200 text-sm flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Create New User Account</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. user@skyviewresort.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Assigned Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="CEO / Owner">CEO / Owner</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Reception">Reception</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Restaurant Manager">Restaurant Manager</option>
                  <option value="Kitchen Manager">Kitchen Manager</option>
                  <option value="Bar Manager">Bar Manager</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Department</label>
                <input
                  type="text"
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  placeholder="e.g. Finance & Accounting"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Security PIN</label>
                <input
                  type="password"
                  value={newUserPin}
                  onChange={(e) => setNewUserPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
              >
                Save Account
              </button>
            </div>
          </form>
        )}

        {/* User List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(state.users || []).map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border ${
                state.currentUser?.id === u.id
                  ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <span>{u.name}</span>
                    {state.currentUser?.id === u.id && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black">Active</span>
                    )}
                  </div>
                  <div className="text-[11px] text-amber-400 font-semibold">{u.role}</div>
                  <div className="text-[10px] text-slate-500">{u.email}</div>
                </div>
              </div>
              {state.users.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteUser(u.id, u.name)}
                  className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl text-xs max-w-4xl">
        {/* Hotel Profile */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Hotel Profile & Corporate Identity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Hotel Business Name</label>
              <input
                type="text"
                value={form.hotelName}
                onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Corporate Tax PIN / VAT Reg</label>
              <input
                type="text"
                value={form.taxPin}
                onChange={(e) => setForm({ ...form, taxPin: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Corporate Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Telephone Line</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Tax Rules & Financial Thresholds */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Tax Rates & Approval Threshold Rules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Standard VAT Rate (%)</label>
              <input
                type="number"
                value={form.vatRate}
                onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Withholding Tax Rate (%)</label>
              <input
                type="number"
                value={form.withholdingTaxRate}
                onChange={(e) => setForm({ ...form, withholdingTaxRate: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">GM Approval Threshold ($)</label>
              <input
                type="number"
                value={form.approvalThresholdGM}
                onChange={(e) => setForm({ ...form, approvalThresholdGM: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {savedMsg ? (
            <div className="text-emerald-400 text-xs font-bold flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          ) : (
            <span className="text-slate-500">Changes update instantly across all connected devices.</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* System Maintenance & Data Reset */}
      <div className="bg-slate-900 border border-rose-950/60 rounded-2xl p-6 space-y-4 shadow-xl text-xs max-w-4xl">
        <h3 className="font-bold text-sm text-rose-400 flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Database Maintenance & Demo Data Cleanup</span>
        </h3>
        <p className="text-slate-400 leading-relaxed">
          Wipe all sample demo transactions, fake staff records, mock expenses, sample inventory, and sample documents to prepare the ERP system for clean live deployment.
        </p>

        {resetMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Demo data cleared! System is clean and ready for fresh usage.</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold rounded-xl shadow flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset System & Clear All Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
