import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { AuditTrailModal } from './components/AuditTrailModal';
import { NotificationModal } from './components/NotificationModal';

import { DashboardView } from './components/views/DashboardView';
import { AccountingView } from './components/views/AccountingView';
import { HRView } from './components/views/HRView';
import { AttendanceView } from './components/views/AttendanceView';
import { PayrollView } from './components/views/PayrollView';
import { ExpenseView } from './components/views/ExpenseView';
import { PurchasesView } from './components/views/PurchasesView';
import { InventoryView } from './components/views/InventoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DocumentsView } from './components/views/DocumentsView';
import { SecurityAuditView } from './components/views/SecurityAuditView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { loadSystemState, saveSystemState, resetSystemState } from './lib/storage';
import { SystemState, CurrencyCode, UserRole } from './types';

export default function App() {
  const [state, setState] = useState<SystemState>(() => loadSystemState());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Sync to localStorage on state changes
  useEffect(() => {
    saveSystemState(state);
  }, [state]);

  const handleUpdateState = (updater: (prev: SystemState) => SystemState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSystemState(next);
      return next;
    });
  };

  const handleChangeRole = (role: UserRole) => {
    const userToSet = state.users.find((u) => u.role === role) || {
      id: 'usr-custom-' + Date.now(),
      name: `Active ${role}`,
      role,
      department: 'Executive Management',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      status: 'Active' as const,
      lastLogin: new Date().toISOString()
    };

    handleUpdateState((prev) => ({
      ...prev,
      currentUser: userToSet
    }));

    // Reset default view for employee role
    if (role === 'Employee' && activeTab !== 'payroll' && activeTab !== 'attendance') {
      setActiveTab('attendance');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to factory demo defaults?')) {
      const fresh = resetSystemState();
      setState(fresh);
      alert('System state successfully reset to initial ERP baseline.');
    }
  };

  const pendingApprovalsCount = (state.expenses || []).filter((e) => e.status.includes('Pending')).length;

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <Header
        currentUser={state.currentUser}
        users={state.users || []}
        allUsers={state.users || []}
        currency={currency}
        auditLogsCount={(state.auditLogs || []).length}
        pendingApprovalsCount={pendingApprovalsCount}
        onSelectRole={handleChangeRole}
        onSelectUser={(u) => handleChangeRole(u.role)}
        onChangeCurrency={setCurrency}
        onSelectCurrency={setCurrency}
        onOpenAuditModal={() => setShowAuditModal(true)}
        onOpenAuditLogs={() => setShowAuditModal(true)}
        onOpenNotificationsModal={() => setShowNotificationsModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        settings={state.settings}
        notifications={state.notifications || []}
        isOffline={state.isOffline || false}
        lastSyncedAt={state.lastSyncedAt || new Date().toISOString()}
        onToggleOffline={() => {
          handleUpdateState((prev) => ({ ...prev, isOffline: !prev.isOffline }));
        }}
        onForceSync={() => {
          handleUpdateState((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
        }}
        onToggleDarkMode={() => {
          handleUpdateState((prev) => ({
            ...prev,
            settings: { ...prev.settings, darkMode: !prev.settings?.darkMode }
          }));
        }}
      />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentRole={state.currentUser?.role || 'CEO / Owner'}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && (
            <DashboardView
              state={state}
              currency={currency}
              onNavigate={(tab) => setActiveTab(tab as NavTab)}
            />
          )}

          {activeTab === 'accounting' && (
            <AccountingView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'hr' && (
            <HRView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              state={state}
              currency={currency}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              state={state}
              currency={currency}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              state={state}
              currentUser={state.currentUser}
              onUpdateState={handleUpdateState}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAuditView
              state={state}
              currentUser={state.currentUser}
              onUpdateState={handleUpdateState}
              onResetData={handleResetData}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              state={state}
              currency={currency}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              state={state}
              currentUser={state.currentUser}
              onUpdateState={handleUpdateState}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {showAuditModal && (
        <AuditTrailModal
          logs={state.auditLogs}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {showNotificationsModal && (
        <NotificationModal
          state={state}
          onClose={() => setShowNotificationsModal(false)}
          onUpdateState={handleUpdateState}
        />
      )}
    </div>
  );
}
