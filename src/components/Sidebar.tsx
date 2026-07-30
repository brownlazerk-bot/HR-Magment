import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Users,
  Clock,
  Banknote,
  Receipt,
  ShoppingCart,
  Boxes,
  TrendingUp,
  FileText,
  ShieldAlert,
  FileSpreadsheet,
  Settings,
  Building2,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'dashboard'
  | 'accounting'
  | 'hr'
  | 'attendance'
  | 'payroll'
  | 'expenses'
  | 'purchases'
  | 'inventory'
  | 'analytics'
  | 'documents'
  | 'security'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  allowedRoles: UserRole[];
  category: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  pendingApprovalsCount
}) => {
  const allRoles: UserRole[] = [
    'Super Admin',
    'CEO / Owner',
    'General Manager',
    'Accountant',
    'HR Manager',
    'Cashier',
    'Reception',
    'Store Manager',
    'Restaurant Manager',
    'Kitchen Manager',
    'Bar Manager',
    'Supervisor',
    'Employee'
  ];

  const executiveRoles: UserRole[] = ['Super Admin', 'CEO / Owner', 'General Manager', 'Accountant'];

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'CEO Dashboard',
      icon: LayoutDashboard,
      allowedRoles: executiveRoles,
      category: 'Executive Overview'
    },
    {
      id: 'accounting',
      label: 'Financial Accounting',
      icon: Calculator,
      allowedRoles: executiveRoles,
      category: 'Financial Control'
    },
    {
      id: 'hr',
      label: 'HR & Personnel',
      icon: Users,
      allowedRoles: ['CEO / Owner', 'General Manager', 'HR Manager'],
      category: 'Human Resources'
    },
    {
      id: 'attendance',
      label: 'Attendance & Shifts',
      icon: Clock,
      allowedRoles: allRoles,
      category: 'Human Resources'
    },
    {
      id: 'payroll',
      label: 'Payroll & Payslips',
      icon: Banknote,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Accountant', 'HR Manager', 'Employee'],
      category: 'Financial Control'
    },
    {
      id: 'expenses',
      label: 'Expense Management',
      icon: Receipt,
      badge: pendingApprovalsCount,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Accountant', 'Store Manager', 'Restaurant Manager', 'Kitchen Manager', 'Bar Manager'],
      category: 'Financial Control'
    },
    {
      id: 'purchases',
      label: 'Purchases & Suppliers',
      icon: ShoppingCart,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Accountant', 'Store Manager'],
      category: 'Supply Chain'
    },
    {
      id: 'inventory',
      label: 'Stock & Inventory',
      icon: Boxes,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Store Manager', 'Restaurant Manager', 'Kitchen Manager', 'Bar Manager'],
      category: 'Supply Chain'
    },
    {
      id: 'analytics',
      label: 'Business Analytics',
      icon: TrendingUp,
      allowedRoles: executiveRoles,
      category: 'Intelligence'
    },
    {
      id: 'reports',
      label: 'ERP Reports Center',
      icon: FileSpreadsheet,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Accountant', 'HR Manager'],
      category: 'Intelligence'
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FileText,
      allowedRoles: ['CEO / Owner', 'General Manager', 'Accountant', 'HR Manager'],
      category: 'Administration'
    },
    {
      id: 'security',
      label: 'Security & Audit Trail',
      icon: ShieldAlert,
      allowedRoles: executiveRoles,
      category: 'Administration'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      allowedRoles: ['CEO / Owner', 'General Manager'],
      category: 'Administration'
    }
  ];

  // Filter items based on current role (Super Admin & CEO get everything automatically)
  const visibleItems = navItems.filter(
    (item) => currentRole === 'Super Admin' || currentRole === 'CEO / Owner' || item.allowedRoles.includes(currentRole)
  );

  // Group by category
  const categories = Array.from(new Set(visibleItems.map((item) => item.category)));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Role Banner */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</span>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 truncate max-w-[120px]">
          {currentRole}
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((category) => {
          const items = visibleItems.filter((i) => i.category === category);
          return (
            <div key={category}>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {category}
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Sky View Resort</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">v4.2 PRO</span>
      </div>
    </aside>
  );
};
