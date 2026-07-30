import React from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-12 animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">Executive Approvals & Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{(notifications || []).filter((n) => !n.read).length} unread alerts</span>
          <div className="flex items-center space-x-3">
            <button onClick={onMarkAllRead} className="text-amber-400 hover:underline flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button onClick={onClearAll} className="text-rose-400 hover:underline flex items-center space-x-1">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No pending notifications or alerts.</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl flex items-start space-x-3 transition-colors ${
                  item.read ? 'bg-slate-900/40 opacity-75' : 'bg-slate-800/60 border border-slate-700/50 shadow-sm'
                }`}
              >
                {getIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-200 truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-slate-700/60 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                      {item.module}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
