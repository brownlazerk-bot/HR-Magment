import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Building2,
  PieChart as PieIcon,
  Award,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { SystemState, CurrencyCode } from '../../types';
import { formatCurrency } from '../../lib/storage';

interface AnalyticsViewProps {
  state: SystemState;
  currency: CurrencyCode;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ state, currency }) => {
  const { metrics } = state;

  const departmentComparison = [
    { department: 'Rooms & Accommodation', Revenue: 840000, Expenses: 180000, NetContribution: 660000 },
    { department: 'Horizon Fine Dining', Revenue: 420000, Expenses: 237000, NetContribution: 183000 },
    { department: 'Sky Line Bar & Lounge', Revenue: 295000, Expenses: 110000, NetContribution: 185000 },
    { department: 'Executive Apartments', Revenue: 310000, Expenses: 65000, NetContribution: 245000 },
    { department: 'Pool & Spa Club', Revenue: 115000, Expenses: 38000, NetContribution: 77000 }
  ];

  const forecastingData = [
    { month: 'Jul 2026 (Actual)', Revenue: 1980000, Projected: 1950000 },
    { month: 'Aug 2026', Revenue: undefined, Projected: 2150000 },
    { month: 'Sep 2026', Revenue: undefined, Projected: 2300000 },
    { month: 'Oct 2026', Revenue: undefined, Projected: 2450000 },
    { month: 'Nov 2026', Revenue: undefined, Projected: 2600000 },
    { month: 'Dec 2026', Revenue: undefined, Projected: 3100000 }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Executive Business Analytics & Forecasting</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Departmental profit contribution, financial ratios & 6-month revenue forecasting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue vs Expenses Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100">Department Net Profit Contribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                <Bar dataKey="Revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="NetContribution" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Projection Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100">6-Month Revenue Forecast Trajectory</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val / 1000000}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                <Line type="monotone" dataKey="Projected" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Ratios Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
        <h3 className="font-bold text-sm text-slate-100">Core Corporate Financial Ratios</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Current Liquidity Ratio</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">10.4x</div>
            <div className="text-[10px] text-slate-500">Current Assets / Current Liabilities</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Net Profit Margin</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">43.7%</div>
            <div className="text-[10px] text-slate-500">Net Profit / Gross Revenue</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Debt to Equity</div>
            <div className="text-xl font-bold text-sky-400 font-mono mt-1">0.35</div>
            <div className="text-[10px] text-slate-500">Total Debt / Total Equity</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Inventory Turnover</div>
            <div className="text-xl font-bold text-purple-400 font-mono mt-1">13.5x</div>
            <div className="text-[10px] text-slate-500">Cost of Goods Sold / Avg Inventory</div>
          </div>
        </div>
      </div>
    </div>
  );
};
