import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  Wine,
  Waves,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SystemState, CurrencyCode } from '../../types';
import { formatCurrency } from '../../lib/storage';

interface DashboardViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ state, currency, onNavigate }) => {
  const { metrics, inventory, attendance, expenses, payroll, auditLogs } = state;

  // Chart Mock Data
  const revenueTrendData = [
    { day: 'Mon', Revenue: 48000, Expenses: 22000, Profit: 26000 },
    { day: 'Tue', Revenue: 52000, Expenses: 24000, Profit: 28000 },
    { day: 'Wed', Revenue: 59000, Expenses: 26000, Profit: 33000 },
    { day: 'Thu', Revenue: 61600, Expenses: 28500, Profit: 33100 },
    { day: 'Fri', Revenue: 78000, Expenses: 31000, Profit: 47000 },
    { day: 'Sat', Revenue: 94000, Expenses: 35000, Profit: 59000 },
    { day: 'Sun', Revenue: 88000, Expenses: 34000, Profit: 54000 }
  ];

  const departmentRevenuePie = [
    { name: 'Rooms & Suites', value: metrics.monthlyRevenue * 0.42, color: '#f59e0b' },
    { name: 'Horizon Restaurant', value: metrics.monthlyRevenue * 0.22, color: '#10b981' },
    { name: 'Sky Line Bar', value: metrics.monthlyRevenue * 0.16, color: '#6366f1' },
    { name: 'Executive Apartments', value: metrics.monthlyRevenue * 0.14, color: '#ec4899' },
    { name: 'Pool & Spa Club', value: metrics.monthlyRevenue * 0.06, color: '#06b6d4' }
  ];

  const cashFlowStreamData = [
    { month: 'Jan', Operating: 180000, Investing: -40000, Net: 140000 },
    { month: 'Feb', Operating: 195000, Investing: -20000, Net: 175000 },
    { month: 'Mar', Operating: 210000, Investing: -50000, Net: 160000 },
    { month: 'Apr', Operating: 230000, Investing: -30000, Net: 200000 },
    { month: 'May', Operating: 245000, Investing: -15000, Net: 230000 },
    { month: 'Jun', Operating: 260000, Investing: -25000, Net: 235000 },
    { month: 'Jul', Operating: 285000, Investing: -35000, Net: 250000 }
  ];

  const lowStockItems = (inventory || []).filter((i) => i.status === 'Low Stock' || i.quantityOnHand <= i.minStockLevel);
  const pendingExpenses = (expenses || []).filter((e) => e.status.includes('Pending'));
  const pendingPayroll = (payroll || []).filter((p) => p.status.includes('Pending'));

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Banner: CEO Executive Greeting & Health Score */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sky View Resort & Luxury Suites</span>
            </span>
            <span className="text-xs text-slate-400">Real-Time ERP Control</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
            Executive Financial & HR Command Center
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Centralized multi-ledger financial governance, automated payroll processing, real-time inventory tracking, and double-entry accounting controls.
          </p>
        </div>

        {/* Business Health Score Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center space-x-5 shadow-lg">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * metrics.businessHealthScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-black text-lg text-emerald-400">{metrics.businessHealthScore}</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Health Score</div>
            <div className="text-sm font-extrabold text-emerald-400 flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>EXCELLENT (AAA)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">High liquidity • 85% Occupancy</div>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards (4x Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Today's Revenue</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-extrabold text-xl text-slate-100">
            {formatCurrency(metrics.todayRevenue, currency)}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        {/* Cash & Bank Liquidity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Bank & Cash Balance</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-extrabold text-xl text-slate-100">
            {formatCurrency(metrics.bankBalance + metrics.cashBalance + metrics.mobileMoneyBalance, currency)}
          </div>
          <div className="mt-2 flex items-center space-x-3 text-[10px] text-slate-400">
            <span>Bank: {formatCurrency(metrics.bankBalance, currency)}</span>
            <span>M-Pesa: {formatCurrency(metrics.mobileMoneyBalance, currency)}</span>
          </div>
        </div>

        {/* Accounts Receivable vs Payable */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Receivables vs Payables</span>
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-extrabold text-xl text-slate-100">
            AR: {formatCurrency(metrics.accountsReceivable, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-rose-400">
            <span>AP: {formatCurrency(metrics.accountsPayable, currency)}</span>
            <span className="text-emerald-400 font-medium">Net +$58.3k</span>
          </div>
        </div>

        {/* Net Business Profit (Monthly) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Monthly Net Profit</span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-extrabold text-xl text-emerald-400">
            {formatCurrency(metrics.netProfit, currency)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Gross Revenue: {formatCurrency(metrics.monthlyRevenue, currency)}
          </div>
        </div>
      </div>

      {/* Hotel Department Performance Breakdown Cards (5 Cards Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <BedDouble className="w-4 h-4" />
            <span className="text-xs font-bold">Occupied Rooms</span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {metrics.occupiedRooms} / {metrics.totalRooms}
          </div>
          <div className="text-[10px] text-slate-400">85% Occupancy Rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span className="text-xs font-bold">Horizon Dining</span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {formatCurrency(metrics.restaurantSalesToday, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Today's Restaurant Sales</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <Wine className="w-4 h-4" />
            <span className="text-xs font-bold">Sky Line Lounge</span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {formatCurrency(metrics.barSalesToday, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Today's Bar Revenue</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Waves className="w-4 h-4" />
            <span className="text-xs font-bold">Pool & Spa Pass</span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {formatCurrency(metrics.poolRevenueToday, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Club Memberships & Passes</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-2 text-rose-400 mb-1">
            <Building className="w-4 h-4" />
            <span className="text-xs font-bold">Apartment Rentals</span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {formatCurrency(metrics.apartmentRevenueToday, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Long-Term Suites Revenue</div>
        </div>
      </div>

      {/* Graphs Row: Revenue/Expenses Trend & Department Revenue Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue vs Expense Trend (Recharts Area) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100">Weekly Revenue, Expense & Profit Trend</h3>
              <p className="text-xs text-slate-400">Daily financial trajectory for Sky View Resort</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center space-x-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Revenue</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Expenses</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Net Profit</span>
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue Share (Pie) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-100">Revenue Stream Share</h3>
            <p className="text-xs text-slate-400">Monthly breakdown by hotel business department</p>
          </div>

          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentRevenuePie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {departmentRevenuePie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => formatCurrency(Number(val), currency)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {departmentRevenuePie.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-mono font-bold">{formatCurrency(item.value, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Banners & Operational Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Approvals Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Clock className="w-4 h-4" />
              <span>Pending Approvals ({pendingExpenses.length + pendingPayroll.length})</span>
            </h4>
            <button onClick={() => onNavigate('expenses')} className="text-[11px] text-amber-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {pendingExpenses.slice(0, 3).map((exp) => (
              <div key={exp.id} className="p-2.5 bg-slate-800/60 rounded-lg text-xs flex justify-between items-center border border-slate-700/50">
                <div>
                  <div className="font-semibold text-slate-200">{exp.category}</div>
                  <div className="text-[10px] text-slate-400">{exp.requestedBy} • {exp.date}</div>
                </div>
                <span className="font-mono font-bold text-amber-400">{formatCurrency(exp.amount, currency)}</span>
              </div>
            ))}
            {pendingPayroll.map((pay) => (
              <div key={pay.id} className="p-2.5 bg-slate-800/60 rounded-lg text-xs flex justify-between items-center border border-slate-700/50">
                <div>
                  <div className="font-semibold text-slate-200">Payroll: {pay.employeeName}</div>
                  <div className="text-[10px] text-slate-400">{pay.department}</div>
                </div>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(pay.netPay, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts ({lowStockItems.length})</span>
            </h4>
            <button onClick={() => onNavigate('inventory')} className="text-[11px] text-amber-400 hover:underline">
              Reorder
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-2.5 bg-slate-800/60 rounded-lg text-xs flex justify-between items-center border border-slate-700/50">
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.location} • Min: {item.minStockLevel} {item.unitOfMeasure}</div>
                </div>
                <span className="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px]">
                  {item.quantityOnHand} {item.unitOfMeasure} Left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* HR Staff Attendance Live Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>HR Attendance Today</span>
            </h4>
            <button onClick={() => onNavigate('attendance')} className="text-[11px] text-amber-400 hover:underline">
              Roster
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center my-2">
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-base font-bold text-emerald-400">{metrics.presentToday}</div>
              <div className="text-[10px] text-slate-400">Present</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-base font-bold text-amber-400">{metrics.lateToday}</div>
              <div className="text-[10px] text-slate-400">Late</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-base font-bold text-rose-400">{metrics.absentToday}</div>
              <div className="text-[10px] text-slate-400">Absent</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Shift Compliance: <strong className="text-emerald-400">95.8%</strong></span>
            <span>Roster: Day Shift</span>
          </div>
        </div>
      </div>

      {/* Audit Trail Recent Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Recent System Financial & HR Activity Logs</span>
          </h3>
          <button onClick={() => onNavigate('security')} className="text-xs text-amber-400 hover:underline">
            View Immutable Audit Vault
          </button>
        </div>
        <div className="divide-y divide-slate-800/60">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                <span className="font-semibold text-slate-200">{log.userName} ({log.userRole})</span>
                <span className="text-slate-400">{log.action}: {log.details}</span>
              </div>
              <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded">
                {log.module}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
