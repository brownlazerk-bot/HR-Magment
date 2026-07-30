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
  SystemSettings
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'u-1',
    name: 'Sir Alexander Sterling',
    email: 'alexander@skyviewresort.com',
    role: 'CEO / Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    department: 'Executive Board',
    pin: '1234'
  },
  {
    id: 'u-2',
    name: 'Victoria Vance',
    email: 'victoria.gm@skyviewresort.com',
    role: 'General Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    department: 'General Administration',
    pin: '2222'
  },
  {
    id: 'u-3',
    name: 'Marcus Thorne',
    email: 'm.thorne@skyviewresort.com',
    role: 'Accountant',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    department: 'Finance & Accounting',
    pin: '3333'
  },
  {
    id: 'u-4',
    name: 'Sarah Jenkins',
    email: 's.jenkins@skyviewresort.com',
    role: 'HR Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    department: 'Human Resources',
    pin: '4444'
  },
  {
    id: 'u-5',
    name: 'David Miller',
    email: 'd.miller@skyviewresort.com',
    role: 'Store Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    department: 'Procurement & Stores',
    pin: '5555'
  },
  {
    id: 'u-6',
    name: 'Elena Rostova',
    email: 'elena.bar@skyviewresort.com',
    role: 'Bar Manager',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    department: 'Sky Line Lounge & Bar',
    pin: '6666'
  },
  {
    id: 'u-7',
    name: 'Chef Jean-Luc Moreau',
    email: 'jeanluc@skyviewresort.com',
    role: 'Kitchen Manager',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    department: 'Culinary & Kitchen',
    pin: '7777'
  },
  {
    id: 'u-8',
    name: 'Grace Omondi',
    email: 'g.omondi@skyviewresort.com',
    role: 'Reception',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80',
    department: 'Front Desk & Rooms',
    pin: '8888'
  }
];

export const initialChartOfAccounts: Account[] = [
  // Assets (1000 - 1999)
  { code: '1010', name: 'Petty Cash Register', type: 'Asset', category: 'Cash & Cash Equivalents', balance: 4500 },
  { code: '1020', name: 'Main Operating Bank Account (KCB)', type: 'Asset', category: 'Cash & Cash Equivalents', balance: 284500 },
  { code: '1030', name: 'Corporate Reserve Bank (Standard Chartered)', type: 'Asset', category: 'Cash & Cash Equivalents', balance: 520000 },
  { code: '1040', name: 'Mobile Money Till (M-Pesa Paybill)', type: 'Asset', category: 'Cash & Cash Equivalents', balance: 68400 },
  { code: '1110', name: 'Accounts Receivable (Guest Ledgers & Corporate)', type: 'Asset', category: 'Receivables', balance: 142500 },
  { code: '1210', name: 'Inventory - Food & Beverage', type: 'Asset', category: 'Inventory', balance: 48500 },
  { code: '1220', name: 'Inventory - Bar & Spirits', type: 'Asset', category: 'Inventory', balance: 62400 },
  { code: '1230', name: 'Inventory - Housekeeping & Linen', type: 'Asset', category: 'Inventory', balance: 35000 },
  { code: '1510', name: 'Land & Hotel Buildings', type: 'Asset', category: 'Fixed Assets', balance: 4500000 },
  { code: '1520', name: 'Kitchen & Restaurant Equipment', type: 'Asset', category: 'Fixed Assets', balance: 380000 },
  { code: '1530', name: 'Furniture, Fixtures & Fittings', type: 'Asset', category: 'Fixed Assets', balance: 290000 },

  // Liabilities (2000 - 2999)
  { code: '2010', name: 'Accounts Payable (Trade Suppliers)', type: 'Liability', category: 'Payables', balance: 84200 },
  { code: '2020', name: 'Accrued Payroll & Staff Liabilities', type: 'Liability', category: 'Payroll Payable', balance: 68500 },
  { code: '2030', name: 'VAT Payable (16%)', type: 'Liability', category: 'Taxes Payable', balance: 24800 },
  { code: '2040', name: 'Withholding Tax Payable (5%)', type: 'Liability', category: 'Taxes Payable', balance: 9400 },
  { code: '2510', name: 'Commercial Development Loan (Equity Bank)', type: 'Liability', category: 'Long Term Debt', balance: 1250000 },

  // Equity (3000 - 3999)
  { code: '3010', name: 'Shareholder Capital', type: 'Equity', category: 'Capital', balance: 3500000 },
  { code: '3020', name: 'Retained Earnings', type: 'Equity', category: 'Retained Earnings', balance: 1069900 },

  // Revenue (4000 - 4999)
  { code: '4010', name: 'Luxury Room Accommodation Revenue', type: 'Revenue', category: 'Operating Revenue', balance: 840000 },
  { code: '4020', name: 'Executive Apartments Revenue', type: 'Revenue', category: 'Operating Revenue', balance: 310000 },
  { code: '4030', name: 'Horizon Fine Dining Restaurant Sales', type: 'Revenue', category: 'Food & Beverage', balance: 420000 },
  { code: '4040', name: 'Sky Line Bar & Lounge Sales', type: 'Revenue', category: 'Food & Beverage', balance: 295000 },
  { code: '4050', name: 'Infinity Pool & Spa Club Pass', type: 'Revenue', category: 'Recreation', balance: 115000 },

  // Expenses (5000 - 5999)
  { code: '5010', name: 'Cost of Sales - Food & Ingredients', type: 'Expense', category: 'Direct Cost', balance: 145000 },
  { code: '5020', name: 'Cost of Sales - Bar & Beverage', type: 'Expense', category: 'Direct Cost', balance: 92000 },
  { code: '5110', name: 'Salaries & Wages Expense', type: 'Expense', category: 'Payroll Expense', balance: 245000 },
  { code: '5120', name: 'Staff Pension & Social Security', type: 'Expense', category: 'Payroll Expense', balance: 28000 },
  { code: '5210', name: 'Electricity & Utility Bills', type: 'Expense', category: 'Utilities', balance: 42000 },
  { code: '5220', name: 'Diesel Fuel & Generator Running', type: 'Expense', category: 'Utilities', balance: 26500 },
  { code: '5230', name: 'High-Speed Fiber Internet & IT Systems', type: 'Expense', category: 'Utilities', balance: 14000 },
  { code: '5310', name: 'Hotel Maintenance & Facility Repairs', type: 'Expense', category: 'Operations', balance: 38000 },
  { code: '5320', name: 'Marketing, PR & OTA Commissions', type: 'Expense', category: 'Sales & Marketing', balance: 52000 }
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'je-101',
    entryNumber: 'JE-2026-001',
    date: '2026-07-28',
    reference: 'ROOM-REV-0728',
    description: 'Daily Room Revenue posting from Front Desk Audit',
    lines: [
      { accountCode: '1020', accountName: 'Main Operating Bank Account (KCB)', debit: 34500, credit: 0 },
      { accountCode: '4010', accountName: 'Luxury Room Accommodation Revenue', debit: 0, credit: 34500 }
    ],
    createdBy: 'Marcus Thorne',
    status: 'Posted',
    createdAt: '2026-07-28T18:30:00Z'
  },
  {
    id: 'je-102',
    entryNumber: 'JE-2026-002',
    date: '2026-07-29',
    reference: 'FB-REST-0729',
    description: 'Horizon Restaurant & Sky Bar daily sales posting',
    lines: [
      { accountCode: '1040', accountName: 'Mobile Money Till (M-Pesa Paybill)', debit: 18200, credit: 0 },
      { accountCode: '1010', accountName: 'Petty Cash Register', debit: 4500, credit: 0 },
      { accountCode: '4030', accountName: 'Horizon Fine Dining Restaurant Sales', debit: 0, credit: 14200 },
      { accountCode: '4040', accountName: 'Sky Line Bar & Lounge Sales', debit: 0, credit: 8500 }
    ],
    createdBy: 'Marcus Thorne',
    status: 'Posted',
    createdAt: '2026-07-29T21:15:00Z'
  }
];

export const initialAssets: Asset[] = [
  {
    id: 'ast-1',
    name: 'Industrial Rational Combi Oven (Kitchen Main)',
    category: 'Kitchen Equipment',
    purchaseDate: '2024-03-15',
    purchasePrice: 48000,
    currentValue: 38400,
    salvageValue: 5000,
    usefulLifeYears: 10,
    depreciationMethod: 'Straight Line',
    location: 'Main Kitchen'
  },
  {
    id: 'ast-2',
    name: 'Caterpillar 250kVA Backup Diesel Generator',
    category: 'Facilities',
    purchaseDate: '2023-01-10',
    purchasePrice: 85000,
    currentValue: 62000,
    salvageValue: 10000,
    usefulLifeYears: 12,
    depreciationMethod: 'Straight Line',
    location: 'Power Substation'
  },
  {
    id: 'ast-3',
    name: 'Teak Lounge Sunbed Sets & Pool Cabanas',
    category: 'Furniture & Fixtures',
    purchaseDate: '2025-05-20',
    purchasePrice: 32000,
    currentValue: 27200,
    salvageValue: 2000,
    usefulLifeYears: 5,
    depreciationMethod: 'Straight Line',
    location: 'Infinity Pool Terrace'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-101',
    employeeCode: 'SVR-001',
    name: 'Victoria Vance',
    email: 'victoria.gm@skyviewresort.com',
    phone: '+254 712 345 678',
    nationalId: 'ID-8849201',
    passportNo: 'A9482019',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    department: 'General Administration',
    position: 'General Manager',
    contractType: 'Full-time',
    startDate: '2022-01-15',
    baseSalary: 12500,
    supervisor: 'Sir Alexander Sterling',
    emergencyContact: { name: 'Robert Vance', relation: 'Spouse', phone: '+254 722 987 654' },
    status: 'Active',
    bankDetails: { bankName: 'Standard Chartered', accountNumber: '0102938475' }
  },
  {
    id: 'emp-102',
    employeeCode: 'SVR-002',
    name: 'Marcus Thorne',
    email: 'm.thorne@skyviewresort.com',
    phone: '+254 723 456 789',
    nationalId: 'ID-7738204',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    department: 'Finance & Accounting',
    position: 'Chief Accountant',
    contractType: 'Full-time',
    startDate: '2022-03-01',
    baseSalary: 7800,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Elena Thorne', relation: 'Sister', phone: '+254 733 111 222' },
    status: 'Active',
    bankDetails: { bankName: 'KCB Bank', accountNumber: '1102938472' }
  },
  {
    id: 'emp-103',
    employeeCode: 'SVR-003',
    name: 'Sarah Jenkins',
    email: 's.jenkins@skyviewresort.com',
    phone: '+254 734 567 890',
    nationalId: 'ID-6629103',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    department: 'Human Resources',
    position: 'HR Manager',
    contractType: 'Full-time',
    startDate: '2022-06-10',
    baseSalary: 6500,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Michael Jenkins', relation: 'Father', phone: '+254 711 444 555' },
    status: 'Active',
    bankDetails: { bankName: 'Absa Bank', accountNumber: '2209384712' }
  },
  {
    id: 'emp-104',
    employeeCode: 'SVR-004',
    name: 'David Miller',
    email: 'd.miller@skyviewresort.com',
    phone: '+254 745 678 901',
    nationalId: 'ID-5519202',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    department: 'Procurement & Stores',
    position: 'Store Manager',
    contractType: 'Full-time',
    startDate: '2023-02-01',
    baseSalary: 4800,
    supervisor: 'Marcus Thorne',
    emergencyContact: { name: 'Clara Miller', relation: 'Wife', phone: '+254 788 333 999' },
    status: 'Active',
    bankDetails: { bankName: 'Cooperative Bank', accountNumber: '3304928172' }
  },
  {
    id: 'emp-105',
    employeeCode: 'SVR-005',
    name: 'Elena Rostova',
    email: 'elena.bar@skyviewresort.com',
    phone: '+254 756 789 012',
    nationalId: 'ID-4409183',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    department: 'Sky Line Lounge & Bar',
    position: 'Head Mixologist & Bar Manager',
    contractType: 'Full-time',
    startDate: '2023-05-15',
    baseSalary: 4500,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Dmitri Rostov', relation: 'Brother', phone: '+254 799 123 789' },
    status: 'Active',
    bankDetails: { bankName: 'NCBA Bank', accountNumber: '4401928374' }
  },
  {
    id: 'emp-106',
    employeeCode: 'SVR-006',
    name: 'Jean-Luc Moreau',
    email: 'jeanluc@skyviewresort.com',
    phone: '+254 767 890 123',
    nationalId: 'ID-3398172',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    department: 'Culinary & Kitchen',
    position: 'Executive Head Chef',
    contractType: 'Full-time',
    startDate: '2023-01-05',
    baseSalary: 8200,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Sophie Moreau', relation: 'Wife', phone: '+254 700 888 777' },
    status: 'Active',
    bankDetails: { bankName: 'Stanbic Bank', accountNumber: '5501928371' }
  },
  {
    id: 'emp-107',
    employeeCode: 'SVR-007',
    name: 'Grace Omondi',
    email: 'g.omondi@skyviewresort.com',
    phone: '+254 778 901 234',
    nationalId: 'ID-2287163',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80',
    department: 'Front Desk & Rooms',
    position: 'Front Desk Lead Supervisor',
    contractType: 'Full-time',
    startDate: '2023-08-10',
    baseSalary: 3800,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Peter Omondi', relation: 'Father', phone: '+254 755 666 444' },
    status: 'Active',
    bankDetails: { bankName: 'Equity Bank', accountNumber: '6601928375' }
  },
  {
    id: 'emp-108',
    employeeCode: 'SVR-008',
    name: 'Samuel Kiprop',
    email: 'samuel.k@skyviewresort.com',
    phone: '+254 789 012 345',
    nationalId: 'ID-1176154',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    department: 'Housekeeping',
    position: 'Executive Housekeeper',
    contractType: 'Full-time',
    startDate: '2023-10-01',
    baseSalary: 3500,
    supervisor: 'Victoria Vance',
    emergencyContact: { name: 'Mary Kiprop', relation: 'Wife', phone: '+254 722 333 444' },
    status: 'Active',
    bankDetails: { bankName: 'KCB Bank', accountNumber: '7701928379' }
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-101',
    employeeName: 'Victoria Vance',
    department: 'General Administration',
    date: '2026-07-30',
    clockIn: '07:45 AM',
    status: 'Present',
    verificationMethod: 'Fingerprint',
    overtimeHours: 0,
    location: 'Executive Wing Reader'
  },
  {
    id: 'att-2',
    employeeId: 'emp-102',
    employeeName: 'Marcus Thorne',
    department: 'Finance & Accounting',
    date: '2026-07-30',
    clockIn: '08:02 AM',
    status: 'Present',
    verificationMethod: 'PIN',
    overtimeHours: 1.5,
    location: 'Finance Office Reader'
  },
  {
    id: 'att-3',
    employeeId: 'emp-103',
    employeeName: 'Sarah Jenkins',
    department: 'Human Resources',
    date: '2026-07-30',
    clockIn: '08:15 AM',
    status: 'Late',
    verificationMethod: 'QR Code',
    overtimeHours: 0,
    location: 'HR Kiosk'
  },
  {
    id: 'att-4',
    employeeId: 'emp-104',
    employeeName: 'David Miller',
    department: 'Procurement & Stores',
    date: '2026-07-30',
    clockIn: '07:50 AM',
    status: 'Present',
    verificationMethod: 'GPS',
    overtimeHours: 0.5,
    location: 'Central Stores Terminal'
  },
  {
    id: 'att-5',
    employeeId: 'emp-106',
    employeeName: 'Jean-Luc Moreau',
    department: 'Culinary & Kitchen',
    date: '2026-07-30',
    clockIn: '06:30 AM',
    status: 'Present',
    verificationMethod: 'Fingerprint',
    overtimeHours: 2.0,
    location: 'Kitchen Back Door Terminal'
  },
  {
    id: 'att-6',
    employeeId: 'emp-108',
    employeeName: 'Samuel Kiprop',
    department: 'Housekeeping',
    date: '2026-07-30',
    clockIn: '09:10 AM',
    status: 'Late',
    verificationMethod: 'PIN',
    overtimeHours: 0,
    location: 'Staff Locker Kiosk'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-105',
    employeeName: 'Elena Rostova',
    department: 'Sky Line Lounge & Bar',
    leaveType: 'Annual',
    startDate: '2026-08-05',
    endDate: '2026-08-15',
    totalDays: 10,
    reason: 'Family vacation abroad',
    status: 'Pending GM',
    appliedOn: '2026-07-28',
    approvedBy: 'Sarah Jenkins (HR)'
  },
  {
    id: 'leave-2',
    employeeId: 'emp-107',
    employeeName: 'Grace Omondi',
    department: 'Front Desk & Rooms',
    leaveType: 'Sick',
    startDate: '2026-07-25',
    endDate: '2026-07-27',
    totalDays: 3,
    reason: 'Acute seasonal influenza',
    status: 'Approved',
    appliedOn: '2026-07-24',
    approvedBy: 'Victoria Vance (GM)'
  }
];

export const initialPayrollRecords: PayrollRecord[] = [
  {
    id: 'pay-2026-07-101',
    payrollMonth: '2026-07',
    employeeId: 'emp-101',
    employeeName: 'Victoria Vance',
    department: 'General Administration',
    position: 'General Manager',
    baseSalary: 12500,
    overtimePay: 0,
    allowances: 1500,
    bonuses: 1000,
    commissions: 0,
    tips: 0,
    grossPay: 15000,
    taxDeduction: 3300,
    pensionDeduction: 900,
    healthInsurance: 300,
    loanDeduction: 0,
    totalDeductions: 4500,
    netPay: 10500,
    status: 'Pending Approval',
    paymentDate: undefined
  },
  {
    id: 'pay-2026-07-102',
    payrollMonth: '2026-07',
    employeeId: 'emp-102',
    employeeName: 'Marcus Thorne',
    department: 'Finance & Accounting',
    position: 'Chief Accountant',
    baseSalary: 7800,
    overtimePay: 450,
    allowances: 800,
    bonuses: 500,
    commissions: 0,
    tips: 0,
    grossPay: 9550,
    taxDeduction: 1910,
    pensionDeduction: 573,
    healthInsurance: 200,
    loanDeduction: 400,
    totalDeductions: 3083,
    netPay: 6467,
    status: 'Pending Approval'
  },
  {
    id: 'pay-2026-07-106',
    payrollMonth: '2026-07',
    employeeId: 'emp-106',
    employeeName: 'Jean-Luc Moreau',
    department: 'Culinary & Kitchen',
    position: 'Executive Head Chef',
    baseSalary: 8200,
    overtimePay: 600,
    allowances: 700,
    bonuses: 800,
    commissions: 0,
    tips: 450,
    grossPay: 10750,
    taxDeduction: 2150,
    pensionDeduction: 645,
    healthInsurance: 200,
    loanDeduction: 0,
    totalDeductions: 2995,
    netPay: 7755,
    status: 'Approved'
  }
];

export const initialSalaryAdvances: SalaryAdvanceLoan[] = [
  {
    id: 'adv-1',
    employeeId: 'emp-102',
    employeeName: 'Marcus Thorne',
    type: 'Loan',
    amount: 2400,
    repaidAmount: 800,
    monthlyDeduction: 400,
    requestDate: '2026-05-10',
    reason: 'Emergency home repair',
    status: 'Active'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-101',
    expenseNumber: 'EXP-2026-089',
    date: '2026-07-29',
    category: 'Diesel Fuel & Generator Running',
    department: 'Facilities & Engineering',
    amount: 3200,
    currency: 'USD',
    paidTo: 'TotalEnergies Commercial',
    paymentMethod: 'Bank Transfer',
    description: '1,500 Liters Low-Sulfur Diesel for Backup Generator Plant',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    requestedBy: 'David Miller',
    approvedBy: 'Victoria Vance',
    status: 'Approved'
  },
  {
    id: 'exp-102',
    expenseNumber: 'EXP-2026-090',
    date: '2026-07-30',
    category: 'Kitchen Purchases',
    department: 'Culinary & Kitchen',
    amount: 1850,
    currency: 'USD',
    paidTo: 'Highland Fresh Organic Farm',
    paymentMethod: 'Mobile Money',
    description: 'Weekly organic vegetables, exotic mushrooms, and fresh herbs',
    receiptUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    requestedBy: 'Chef Jean-Luc Moreau',
    approvedBy: 'Marcus Thorne',
    status: 'Pending GM'
  },
  {
    id: 'exp-103',
    expenseNumber: 'EXP-2026-091',
    date: '2026-07-30',
    category: 'Maintenance & Repairs',
    department: 'Housekeeping & Rooms',
    amount: 680,
    currency: 'USD',
    paidTo: 'Apex HVAC Services Ltd',
    paymentMethod: 'Cash',
    description: 'Emergency HVAC compressor valve replacement in Suite 402',
    receiptUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    requestedBy: 'Samuel Kiprop',
    status: 'Pending Accountant'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-001',
    name: 'Premier Meat & Poultry Supplies',
    category: 'Fresh Food & Butchery',
    contactPerson: 'Arthur Pendelton',
    email: 'orders@premiermeat.com',
    phone: '+254 701 112 233',
    address: 'Industrial Area Gate 4, Nairobi',
    balance: 24500,
    paymentTerms: 'Net 30 Days',
    rating: 4.8
  },
  {
    id: 'sup-2',
    code: 'SUP-002',
    name: 'Global Premium Spirits Distributors',
    category: 'Wines & Spirits',
    contactPerson: 'Sophia Williams',
    email: 'b2b@globalspirits.com',
    phone: '+254 702 223 344',
    address: 'Commercial Hub Hub 12, Westlands',
    balance: 38200,
    paymentTerms: 'Net 15 Days',
    rating: 4.9
  },
  {
    id: 'sup-3',
    code: 'SUP-003',
    name: 'LinenLux Hotel Textiles',
    category: 'Linen & Amenities',
    contactPerson: 'Chao Zhang',
    email: 'info@linenlux.com',
    phone: '+254 703 334 455',
    address: 'Textile Zone Block C, Mombasa',
    balance: 14000,
    paymentTerms: 'Net 45 Days',
    rating: 4.6
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-501',
    poNumber: 'PO-2026-042',
    supplierId: 'sup-2',
    supplierName: 'Global Premium Spirits Distributors',
    date: '2026-07-25',
    expectedDelivery: '2026-07-29',
    department: 'Sky Line Lounge & Bar',
    items: [
      { itemId: 'inv-201', itemName: 'Single Malt Scotch Whiskey 18yr', unit: 'Bottles', quantity: 24, unitPrice: 120, totalPrice: 2880 },
      { itemId: 'inv-202', itemName: 'French Champagne Brut 750ml', unit: 'Bottles', quantity: 36, unitPrice: 85, totalPrice: 3060 }
    ],
    subtotal: 5940,
    tax: 950.4,
    totalAmount: 6890.4,
    status: 'Goods Received',
    matching3Way: {
      poMatchesGRN: true,
      grnMatchesInvoice: true,
      verifiedBy: 'David Miller (Store Mgr)'
    },
    createdBy: 'Elena Rostova',
    approvedBy: 'Victoria Vance'
  }
];

export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'inv-101',
    code: 'INV-FB-01',
    name: 'Prime Wagyu Beef Ribeye Fillet',
    category: 'Food & Beverage',
    location: 'Kitchen Store',
    quantityOnHand: 42,
    unitOfMeasure: 'Kg',
    minStockLevel: 25,
    maxStockLevel: 100,
    unitCost: 65,
    sellingPrice: 140,
    lastRestocked: '2026-07-27',
    status: 'In Stock'
  },
  {
    id: 'inv-102',
    code: 'INV-FB-02',
    name: 'Fresh Norwegian Salmon Fillets',
    category: 'Food & Beverage',
    location: 'Kitchen Store',
    quantityOnHand: 12,
    unitOfMeasure: 'Kg',
    minStockLevel: 20,
    maxStockLevel: 60,
    unitCost: 38,
    sellingPrice: 90,
    lastRestocked: '2026-07-20',
    status: 'Low Stock'
  },
  {
    id: 'inv-201',
    code: 'INV-BAR-01',
    name: 'Single Malt Scotch Whiskey 18yr',
    category: 'Bar Supplies',
    location: 'Bar Store',
    quantityOnHand: 34,
    unitOfMeasure: 'Bottles',
    minStockLevel: 15,
    maxStockLevel: 50,
    unitCost: 120,
    sellingPrice: 320,
    lastRestocked: '2026-07-29',
    status: 'In Stock'
  },
  {
    id: 'inv-202',
    code: 'INV-BAR-02',
    name: 'French Champagne Brut 750ml',
    category: 'Bar Supplies',
    location: 'Bar Store',
    quantityOnHand: 8,
    unitOfMeasure: 'Bottles',
    minStockLevel: 15,
    maxStockLevel: 60,
    unitCost: 85,
    sellingPrice: 220,
    lastRestocked: '2026-07-29',
    status: 'Low Stock'
  },
  {
    id: 'inv-301',
    code: 'INV-HK-01',
    name: 'Egyptian Cotton Luxury King Bed Sheet Sets',
    category: 'Linen',
    location: 'Housekeeping',
    quantityOnHand: 150,
    unitOfMeasure: 'Units',
    minStockLevel: 50,
    maxStockLevel: 250,
    unitCost: 95,
    lastRestocked: '2026-06-15',
    status: 'In Stock'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'sm-901',
    date: '2026-07-29 14:20',
    itemId: 'inv-201',
    itemName: 'Single Malt Scotch Whiskey 18yr',
    movementType: 'Purchase In',
    fromLocation: 'Supplier (Global Spirits)',
    toLocation: 'Bar Store',
    quantity: 24,
    unitCost: 120,
    performedBy: 'David Miller',
    reference: 'PO-2026-042'
  },
  {
    id: 'sm-902',
    date: '2026-07-30 08:45',
    itemId: 'inv-101',
    itemName: 'Prime Wagyu Beef Ribeye Fillet',
    movementType: 'Transfer Out',
    fromLocation: 'Main Warehouse',
    toLocation: 'Kitchen Store',
    quantity: 15,
    unitCost: 65,
    performedBy: 'Chef Jean-Luc Moreau',
    reference: 'KIT-REQ-0730'
  }
];

export const initialDocuments: ERPDocument[] = [
  {
    id: 'doc-1',
    title: 'Sky View Resort Executive Annual Budget FY2026-2027',
    category: 'Contract',
    uploadedBy: 'Marcus Thorne',
    uploadDate: '2026-01-05',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    tags: ['Budget', 'Finance', 'Executive', 'Board'],
    description: 'Approved annual operating budget and capital investment plan for Sky View Resort.'
  },
  {
    id: 'doc-2',
    title: 'Audited Financial Statements Q2 2026',
    category: 'Audit Report',
    uploadedBy: 'Marcus Thorne',
    uploadDate: '2026-07-15',
    fileSize: '8.7 MB',
    fileType: 'PDF',
    tags: ['Audit', 'Quarterly', 'Tax', 'P&L'],
    description: 'Independent auditor report signed by Deloitte & Touche.'
  },
  {
    id: 'doc-3',
    title: 'Staff Collective Bargaining & Employment Terms 2026',
    category: 'Employee File',
    uploadedBy: 'Sarah Jenkins',
    uploadDate: '2026-02-12',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    tags: ['HR', 'Contracts', 'Policies', 'Legal'],
    description: 'Standard employment agreement terms, benefits schedule, and code of conduct.'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-8801',
    timestamp: '2026-07-30 08:30:12',
    userId: 'u-1',
    userName: 'Sir Alexander Sterling',
    userRole: 'CEO / Owner',
    device: 'MacBook Pro M3 (macOS / Chrome 127)',
    module: 'Executive Dashboard',
    action: 'Access Dashboard',
    details: 'Viewed Executive Health Score & Real-time P&L analytics',
    approvalStatus: 'Approved',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'aud-8802',
    timestamp: '2026-07-30 08:15:45',
    userId: 'u-3',
    userName: 'Marcus Thorne',
    userRole: 'Accountant',
    device: 'Windows 11 Workstation (Edge 126)',
    module: 'General Ledger',
    action: 'Post Journal Entry',
    details: 'Posted JE-2026-002: Food & Beverage daily sales revenue reconciliation',
    approvalStatus: 'Approved',
    checksum: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
  },
  {
    id: 'aud-8803',
    timestamp: '2026-07-30 07:50:00',
    userId: 'u-5',
    userName: 'David Miller',
    userRole: 'Store Manager',
    device: 'Samsung Galaxy Tab S9 (Android PWA)',
    module: 'Inventory Control',
    action: 'Stock Transfer',
    details: 'Transferred 15kg Prime Wagyu Ribeye from Main Warehouse to Kitchen Store',
    approvalStatus: 'Approved',
    checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'
  }
];

export const initialHotelMetrics: HotelMetrics = {
  todayRevenue: 61600,
  weeklyRevenue: 385000,
  monthlyRevenue: 1980000,
  yearlyRevenue: 22400000,
  cashBalance: 4500,
  bankBalance: 804500,
  mobileMoneyBalance: 68400,
  outstandingDebts: 84200,
  accountsReceivable: 142500,
  accountsPayable: 84200,
  payrollDue: 68500,
  grossProfit: 1250000,
  netProfit: 865000,
  totalExpenses: 385000,
  totalPurchases: 142000,
  inventoryValue: 145900,
  totalEmployees: 48,
  presentToday: 42,
  lateToday: 4,
  absentToday: 2,
  occupiedRooms: 68,
  totalRooms: 80, // 85% occupancy
  restaurantSalesToday: 18500,
  barSalesToday: 12400,
  poolRevenueToday: 4200,
  apartmentRevenueToday: 26500,
  businessHealthScore: 94
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Payroll Approval Required',
    message: 'July 2026 Monthly Payroll of $68,500 is waiting for CEO final sign-off.',
    type: 'warning',
    timestamp: '10 mins ago',
    read: false,
    module: 'Payroll'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Salmon & Champagne',
    message: 'Norwegian Salmon (12kg) & French Champagne (8 btls) fell below reorder threshold.',
    type: 'alert',
    timestamp: '25 mins ago',
    read: false,
    module: 'Inventory'
  },
  {
    id: 'notif-3',
    title: 'Expense Approval Request ($1,850)',
    message: 'Chef Jean-Luc Moreau submitted Kitchen Purchases request for fresh organic produce.',
    type: 'info',
    timestamp: '1 hour ago',
    read: false,
    module: 'Expenses'
  },
  {
    id: 'notif-4',
    title: 'Staff Attendance Alert',
    message: '4 employees arrived late today (Sarah Jenkins, Samuel Kiprop, +2 others).',
    type: 'warning',
    timestamp: '2 hours ago',
    read: true,
    module: 'Attendance'
  }
];

export const initialSettings: SystemSettings = {
  hotelName: 'Sky View Resort & Luxury Suites',
  tagline: 'Enterprise Financial Management & Hotel Operations ERP',
  address: 'Skyline Ridge Drive, P.O. Box 40822, Nairobi / Mombasa Highway',
  phone: '+254 700 900 000',
  email: 'corporate@skyviewresort.com',
  taxPin: 'P051928374M',
  vatRate: 16,
  withholdingTaxRate: 5,
  baseCurrency: 'USD',
  currencySymbol: '$',
  autoBackupDaily: true,
  approvalThresholdGM: 500,
  approvalThresholdCEO: 2000,
  autoLogoutMinutes: 30,
  darkMode: false
};
