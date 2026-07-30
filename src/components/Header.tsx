import React, { useState } from 'react';
import {
  Building2,
  RefreshCw,
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  Wifi,
  WifiOff,
  Globe,
  DollarSign
} from 'lucide-react';
import { User, UserRole, CurrencyCode, NotificationItem, SystemSettings } from '../types';
import { formatCurrency } from '../lib/storage';

interface HeaderProps {
  currentUser?: User;
  allUsers?: User[];
  users?: User[];
  onSelectUser?: (user: User) => void;
  onSelectRole?: (role: UserRole) => void;
  currency?: CurrencyCode;
  onSelectCurrency?: (currency: CurrencyCode) => void;
  onChangeCurrency?: (currency: CurrencyCode) => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onForceSync?: () => void;
  lastSyncedAt?: string;
  notifications?: NotificationItem[];
  onOpenNotifications?: () => void;
  onOpenNotificationsModal?: () => void;
  onOpenAuditLogs?: () => void;
  onOpenAuditModal?: () => void;
  auditLogsCount?: number;
  pendingApprovalsCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  settings?: SystemSettings;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  users,
  onSelectUser,
  onSelectRole,
  currency = 'USD',
  onSelectCurrency,
  onChangeCurrency,
  isOffline = false,
  onToggleOffline,
  onForceSync,
  lastSyncedAt = new Date().toISOString(),
  notifications = [],
  onOpenNotifications,
  onOpenNotificationsModal,
  onOpenAuditLogs,
  onOpenAuditModal,
  searchQuery = '',
  onSearchChange,
  settings,
  onToggleDarkMode
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const userList = allUsers || users || [];
  const handleUserSelect = (u: User) => {
    if (onSelectUser) onSelectUser(u);
    if (onSelectRole) onSelectRole(u.role);
  };
  const handleCurrencySelect = (c: CurrencyCode) => {
    if (onSelectCurrency) onSelectCurrency(c);
    if (onChangeCurrency) onChangeCurrency(c);
  };
  const handleOpenAudit = () => {
    if (onOpenAuditLogs) onOpenAuditLogs();
    if (onOpenAuditModal) onOpenAuditModal();
  };
  const handleOpenNotifs = () => {
    if (onOpenNotifications) onOpenNotifications();
    if (onOpenNotificationsModal) onOpenNotificationsModal();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Branding & Hotel Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-100">
                {settings?.hotelName || 'Sky View Resort'}
              </span>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                Enterprise ERP
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <span>Financial & HR Control Platform</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">Cloud Live Sync</span>
            </div>
          </div>
        </div>

        {/* Center: Search & Sync Status */}
        <div className="hidden md:flex items-center space-x-3 flex-1 max-w-xl mx-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Ledger, Staff, POs, Inventory, Documents (Press '/' to focus)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Sync Button & Status */}
          <div className="flex items-center bg-slate-800/60 rounded-lg p-1 border border-slate-700/60 text-xs">
            <button
              onClick={onToggleOffline}
              title={isOffline ? 'Offline mode active. Click to go online.' : 'Online mode. Click to test offline mode.'}
              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                isOffline ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="font-medium text-[11px]">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </button>
            <button
              onClick={onForceSync}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 ml-1"
              title={`Last synced: ${new Date(lastSyncedAt).toLocaleTimeString()}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Currency, Audit, Notifications & User Switcher */}
        <div className="flex items-center space-x-2">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency}</span>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-xs">
                {(['USD', 'EUR', 'GBP', 'KES', 'NGN', 'GHS'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      handleCurrencySelect(c);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 ${
                      currency === c ? 'text-amber-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-slate-500">{formatCurrency(1, c)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audit Trail Button */}
          <button
            onClick={handleOpenAudit}
            className="hidden sm:flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300"
            title="Open System Audit Logs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit</span>
          </button>

          {/* Notifications */}
          <button
            onClick={handleOpenNotifs}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300"
            title="System Approvals & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300"
            title="Toggle Theme"
          >
            {settings?.darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-2.5 py-1 rounded-lg text-left"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-100 leading-tight">{currentUser?.name || 'User'}</div>
                <div className="text-[10px] text-amber-400 font-medium leading-tight">{currentUser?.role || 'Guest'}</div>
              </div>
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                <div className="px-3 py-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Simulate Role Login</p>
                  <p className="text-xs text-slate-300 mt-0.5">Switch active user profile to evaluate role permissions:</p>
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {userList.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        handleUserSelect(user);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-800/80 transition-colors ${
                        currentUser?.id === user.id ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                        <div className="text-[10px] text-amber-400">{user.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
