import {
  User,
  Account,
  JournalEntry,
  Asset,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  SalaryAdvanceLoan,
  Expense,
  Supplier,
  PurchaseOrder,
  InventoryItem,
  StockMovement,
  ERPDocument,
  AuditLog,
  HotelMetrics,
  NotificationItem,
  SystemSettings,
  CurrencyCode,
  SystemState
} from '../types';

import {
  initialUsers,
  initialChartOfAccounts,
  initialJournalEntries,
  initialAssets,
  initialEmployees,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialPayrollRecords,
  initialSalaryAdvances,
  initialExpenses,
  initialSuppliers,
  initialPurchaseOrders,
  initialInventoryItems,
  initialStockMovements,
  initialDocuments,
  initialAuditLogs,
  initialHotelMetrics,
  initialNotifications,
  initialSettings
} from '../data/mockData';

const STORAGE_KEY = 'sky_view_resort_erp_v1';

export function getInitialState(): SystemState {
  return {
    currentUser: initialUsers[0],
    users: initialUsers,
    accounts: initialChartOfAccounts,
    journalEntries: initialJournalEntries,
    assets: initialAssets,
    employees: initialEmployees,
    attendance: initialAttendanceRecords,
    leaveRequests: initialLeaveRequests,
    payroll: initialPayrollRecords,
    salaryAdvances: initialSalaryAdvances,
    expenses: initialExpenses,
    suppliers: initialSuppliers,
    purchaseOrders: initialPurchaseOrders,
    inventory: initialInventoryItems,
    stockMovements: initialStockMovements,
    documents: initialDocuments,
    auditLogs: initialAuditLogs,
    metrics: initialHotelMetrics,
    notifications: initialNotifications,
    settings: initialSettings,
    activeUserId: 'u-1', // Default CEO
    isOffline: false,
    lastSyncedAt: new Date().toISOString()
  };
}

export function loadSystemState(): SystemState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaults = getInitialState();
    if (!raw) {
      saveSystemState(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as Partial<SystemState>;
    const mergedState: SystemState = {
      ...defaults,
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : defaults.users,
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : defaults.accounts,
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : defaults.journalEntries,
      assets: Array.isArray(parsed.assets) ? parsed.assets : defaults.assets,
      employees: Array.isArray(parsed.employees) ? parsed.employees : defaults.employees,
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : defaults.attendance,
      leaveRequests: Array.isArray(parsed.leaveRequests) ? parsed.leaveRequests : defaults.leaveRequests,
      payroll: Array.isArray(parsed.payroll) ? parsed.payroll : defaults.payroll,
      salaryAdvances: Array.isArray(parsed.salaryAdvances) ? parsed.salaryAdvances : defaults.salaryAdvances,
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : defaults.expenses,
      suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : defaults.suppliers,
      purchaseOrders: Array.isArray(parsed.purchaseOrders) ? parsed.purchaseOrders : defaults.purchaseOrders,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : defaults.inventory,
      stockMovements: Array.isArray(parsed.stockMovements) ? parsed.stockMovements : defaults.stockMovements,
      documents: Array.isArray(parsed.documents) ? parsed.documents : defaults.documents,
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : defaults.auditLogs,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : defaults.notifications,
      metrics: parsed.metrics ? { ...defaults.metrics, ...parsed.metrics } : defaults.metrics,
      settings: parsed.settings ? { ...defaults.settings, ...parsed.settings } : defaults.settings,
      currentUser: parsed.currentUser || (Array.isArray(parsed.users) && parsed.users[0]) || defaults.currentUser,
      activeUserId: parsed.activeUserId || defaults.activeUserId,
      isOffline: parsed.isOffline ?? defaults.isOffline,
      lastSyncedAt: parsed.lastSyncedAt || defaults.lastSyncedAt
    };
    return mergedState;
  } catch (err) {
    console.error('Failed to load ERP state from localStorage:', err);
    return getInitialState();
  }
}

export function saveSystemState(state: SystemState) {
  try {
    const updatedState = {
      ...state,
      lastSyncedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

    // Broadcast for multi-window / multi-tab real-time sync simulation
    window.dispatchEvent(new CustomEvent('skyview-erp-state-sync', { detail: updatedState }));
  } catch (err) {
    console.error('Failed to save ERP state:', err);
  }
}

export function resetSystemState(): SystemState {
  const fresh = getInitialState();
  saveSystemState(fresh);
  return fresh;
}

// Generate checksum for Audit Integrity
export function generateChecksum(dataString: string): string {
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + 'ae94b8102';
}

export function createAuditLog(
  user: User,
  module: string,
  action: string,
  details: string,
  approvalStatus: 'Approved' | 'Pending' | 'Rejected' | 'N/A' = 'N/A'
): AuditLog {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const rawData = `${timestamp}|${user.id}|${module}|${action}|${details}`;
  return {
    id: 'aud-' + Math.floor(100000 + Math.random() * 900000),
    timestamp,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    device: navigator.userAgent.includes('Mobile') ? 'Mobile Terminal (Android/iOS)' : 'Desktop Station (Windows/macOS)',
    module,
    action,
    details,
    approvalStatus,
    checksum: generateChecksum(rawData)
  };
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh ',
    NGN: '₦',
    GHS: 'GH₵ '
  };
  const rates: Record<CurrencyCode, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    KES: 130,
    NGN: 1500,
    GHS: 15.5
  };

  const converted = amount * (rates[currency] || 1);
  return `${symbols[currency] || '$'}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
