import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, Mail, Building, DollarSign, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { User, CurrencyCode, SystemState, UserRole } from '../types';
import { generateChecksum } from '../lib/storage';

interface SuperAdminSetupViewProps {
  onCompleteSetup: (superAdmin: User, hotelName: string, currency: CurrencyCode) => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
];

export const SuperAdminSetupView: React.FC<SuperAdminSetupViewProps> = ({ onCompleteSetup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('1234');
  const [hotelName, setHotelName] = useState('Sky View Resort & Luxury Suites');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [department, setDepartment] = useState('Executive Board / System Control');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please provide your Full Name and Email Address.');
      return;
    }

    const superAdminUser: User = {
      id: 'usr-super-admin-1',
      name: name.trim(),
      email: email.trim(),
      role: 'Super Admin',
      avatar,
      department: department.trim() || 'Executive Board',
      pin: pin.trim() || '1234'
    };

    onCompleteSetup(superAdminUser, hotelName.trim(), currency);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 sm:p-8 text-slate-950 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Create Super Admin Account
            </h1>
            {hotelName && (
              <div className="text-xs sm:text-sm font-bold text-slate-950/80 uppercase tracking-wider mt-1">
                {hotelName}
              </div>
            )}
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 fill-slate-950/20" />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin Name *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chief Executive / System Owner"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@resort.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Hotel / Property Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>Resort / Property Name</span>
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="e.g. Sky View Resort & Luxury Suites"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Base Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Operating Currency</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="KES">KES (KSh) - Kenya Shilling</option>
                <option value="NGN">NGN (₦) - Nigerian Naira</option>
                <option value="GHS">GHS (GH₵) - Ghana Cedi</option>
              </select>
            </div>

            {/* Security PIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Security PIN (4-digit)</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors tracking-widest font-mono"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Department</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Executive Board"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5 fill-slate-950" />
            <span>Create Super Admin & Initialize System</span>
          </button>
        </form>
      </div>
    </div>
  );
};
