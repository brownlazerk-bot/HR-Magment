export type UserRole =
  | 'CEO / Owner'
  | 'General Manager'
  | 'Accountant'
  | 'HR Manager'
  | 'Cashier'
  | 'Reception'
  | 'Store Manager'
  | 'Restaurant Manager'
  | 'Kitchen Manager'
  | 'Bar Manager'
  | 'Supervisor'
  | 'Employee';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'GHS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  pin?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  device: string;
  module: string;
  action: string;
  details: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected' | 'N/A';
  checksum: string;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  code: string;
  name: string;
  type: AccountType;
  category: string;
  balance: number;
  description?: string;
}

export interface JournalEntryLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
  createdBy: string;
  status: 'Draft' | 'Posted' | 'Approved';
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'Straight Line' | 'Reducing Balance';
  location: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  passportNo?: string;
  photoUrl: string;
  department: string;
  position: string;
  contractType: 'Full-time' | 'Part-time' | 'Contract' | 'Probation';
  startDate: string;
  baseSalary: number;
  supervisor: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalInfo?: string;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    swiftCode?: string;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Half Day';
  verificationMethod: 'Fingerprint' | 'QR Code' | 'PIN' | 'GPS';
  overtimeHours: number;
  location: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Compassionate' | 'Unpaid';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending HR' | 'Pending GM' | 'Approved' | 'Rejected';
  appliedOn: string;
  approvedBy?: string;
}

export interface PayrollRecord {
  id: string;
  payrollMonth: string; // YYYY-MM
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  baseSalary: number;
  overtimePay: number;
  allowances: number;
  bonuses: number;
  commissions: number;
  tips: number;
  grossPay: number;
  taxDeduction: number;
  pensionDeduction: number;
  healthInsurance: number;
  loanDeduction: number;
  totalDeductions: number;
  netPay: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid';
  paymentDate?: string;
}

export interface SalaryAdvanceLoan {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Advance' | 'Loan';
  amount: number;
  repaidAmount: number;
  monthlyDeduction: number;
  requestDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Active' | 'Repaid' | 'Rejected';
}

export interface Expense {
  id: string;
  expenseNumber: string;
  date: string;
  category: string;
  department: string;
  amount: number;
  currency: CurrencyCode;
  paidTo: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque';
  description: string;
  receiptUrl?: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'Pending Accountant' | 'Pending GM' | 'Approved' | 'Rejected' | 'Paid';
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  balance: number; // AP balance
  paymentTerms: string;
  rating: number; // 1-5
}

export type POStatus = 'Draft' | 'Sent to Supplier' | 'Goods Received' | 'Invoice Received' | 'Paid' | 'Cancelled';

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery: string;
  department: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: POStatus;
  matching3Way: {
    poMatchesGRN: boolean;
    grnMatchesInvoice: boolean;
    verifiedBy?: string;
  };
  createdBy: string;
  approvedBy?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Food & Beverage' | 'Bar Supplies' | 'Housekeeping' | 'Linen' | 'Maintenance' | 'Amenities' | 'Office Supplies';
  location: 'Main Warehouse' | 'Kitchen Store' | 'Bar Store' | 'Housekeeping' | 'Maintenance';
  quantityOnHand: number;
  unitOfMeasure: 'Kg' | 'Liters' | 'Units' | 'Packs' | 'Bottles' | 'Boxes' | 'Cartons';
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  sellingPrice?: number;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
}

export interface StockMovement {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  movementType: 'Purchase In' | 'Transfer Out' | 'Transfer In' | 'Adjustment' | 'Waste / Damaged' | 'Sales Deduction';
  fromLocation: string;
  toLocation: string;
  quantity: number;
  unitCost: number;
  performedBy: string;
  reference: string;
}

export interface ERPDocument {
  id: string;
  title: string;
  category: 'Contract' | 'Invoice' | 'Receipt' | 'Payroll File' | 'Audit Report' | 'Employee File' | 'Tax Document';
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  tags: string[];
  fileUrl?: string;
  description: string;
}

export interface DepartmentSummary {
  name: string;
  head: string;
  staffCount: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netContribution: number;
}

export interface HotelMetrics {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  cashBalance: number;
  bankBalance: number;
  mobileMoneyBalance: number;
  outstandingDebts: number;
  accountsReceivable: number;
  accountsPayable: number;
  payrollDue: number;
  grossProfit: number;
  netProfit: number;
  totalExpenses: number;
  totalPurchases: number;
  inventoryValue: number;
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  occupiedRooms: number;
  totalRooms: number;
  restaurantSalesToday: number;
  barSalesToday: number;
  poolRevenueToday: number;
  apartmentRevenueToday: number;
  businessHealthScore: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  module: string;
  link?: string;
}

export interface SystemSettings {
  hotelName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  taxPin: string;
  vatRate: number; // e.g., 16
  withholdingTaxRate: number; // e.g., 5
  baseCurrency: CurrencyCode;
  currencySymbol: string;
  autoBackupDaily: boolean;
  approvalThresholdGM: number; // e.g. 500
  approvalThresholdCEO: number; // e.g. 2000
  autoLogoutMinutes: number;
  darkMode: boolean;
}

export interface SystemState {
  currentUser: User;
  users: User[];
  accounts: Account[];
  journalEntries: JournalEntry[];
  assets: Asset[];
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
  salaryAdvances?: SalaryAdvanceLoan[];
  expenses: Expense[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  documents: ERPDocument[];
  auditLogs: AuditLog[];
  metrics: HotelMetrics;
  notifications: NotificationItem[];
  settings: SystemSettings;
  activeUserId?: string;
  isOffline?: boolean;
  lastSyncedAt?: string;
}

