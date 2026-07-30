import React, { useState } from 'react';
import { Settings, Save, Building, DollarSign, ShieldCheck, CheckCircle } from 'lucide-react';
import { SystemState, CurrencyCode, SystemSettings } from '../../types';
import { createAuditLog } from '../../lib/storage';

interface SettingsViewProps {
  state: SystemState;
  currentUser: any;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, currentUser, onUpdateState }) => {
  const { settings } = state;
  const [form, setForm] = useState<SystemSettings>({ ...settings });
  const [savedMsg, setSavedMsg] = useState(false);

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

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Enterprise System Settings & Branding</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure hotel business information, tax rates, currency, approval rules & system security thresholds
        </p>
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
    </div>
  );
};
