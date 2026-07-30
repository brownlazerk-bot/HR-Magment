import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Truck,
  CheckCircle,
  FileCheck,
  Search,
  Download,
  AlertCircle
} from 'lucide-react';
import { SystemState, CurrencyCode, PurchaseOrder, Supplier } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV } from '../../lib/exportUtils';

interface PurchasesViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ state, currency, onUpdateState }) => {
  const { purchaseOrders, suppliers, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers' | 'matching'>('orders');

  const handleVerify3WayMatch = (poId: string) => {
    onUpdateState((prev) => {
      const updated = prev.purchaseOrders.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: 'Paid' as const,
            matching3Way: {
              poMatchesGRN: true,
              grnMatchesInvoice: true,
              verifiedBy: currentUser.name
            }
          };
        }
        return po;
      });

      const po = prev.purchaseOrders.find((p) => p.id === poId);
      const audit = createAuditLog(
        currentUser,
        'Procurement & Accounts Payable',
        '3-Way Invoice Matching Verified',
        `3-Way match verified for ${po?.poNumber} (${po?.supplierName}). Paid: ${formatCurrency(po?.totalAmount || 0, currency)}`,
        'Approved'
      );

      return {
        ...prev,
        purchaseOrders: updated,
        auditLogs: [audit, ...prev.auditLogs]
      };
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Procurement, Purchase Orders & Supplier Balances</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Supplier directory, 3-way invoice matching (PO vs GRN vs Invoice) & AP settlement
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'orders' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'suppliers' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Supplier Ledger ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'matching' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          3-Way Invoice Matching
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100">Active Purchase Orders</h3>
            <button
              onClick={() => {
                const headers = ['PO Number', 'Supplier', 'Date', 'Expected Delivery', 'Department', 'Total Amount', 'Status'];
                const rows = purchaseOrders.map((po) => [
                  po.poNumber,
                  po.supplierName,
                  po.date,
                  po.expectedDelivery,
                  po.department,
                  po.totalAmount,
                  po.status
                ]);
                exportToCSV('SkyView_Purchase_Orders', headers, rows);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2 gap-2">
                  <div>
                    <span className="font-mono font-extrabold text-amber-400 text-sm mr-2">{po.poNumber}</span>
                    <span className="font-semibold text-slate-200">{po.supplierName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400">Date: {po.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        po.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-mono">
                      <tr>
                        <th className="py-1 px-2">Item Description</th>
                        <th className="py-1 px-2 text-right">Qty</th>
                        <th className="py-1 px-2 text-right">Unit Price</th>
                        <th className="py-1 px-2 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {po.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-800/40">
                          <td className="py-1 px-2">{item.itemName}</td>
                          <td className="py-1 px-2 text-right font-mono">{item.quantity} {item.unit}</td>
                          <td className="py-1 px-2 text-right font-mono">{formatCurrency(item.unitPrice, currency)}</td>
                          <td className="py-1 px-2 text-right font-mono font-bold text-emerald-400">
                            {formatCurrency(item.totalPrice, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">Department: <strong className="text-slate-200">{po.department}</strong></span>
                  <div className="space-x-4">
                    <span className="text-slate-400">Subtotal: {formatCurrency(po.subtotal, currency)}</span>
                    <span className="font-bold text-amber-400">Total PO Amount: {formatCurrency(po.totalAmount, currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">{sup.code}</span>
                  <h3 className="font-bold text-sm text-slate-100">{sup.name}</h3>
                  <p className="text-xs text-slate-400">{sup.category}</p>
                </div>
                <span className="bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">
                  ★ {sup.rating}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="text-slate-200">{sup.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span className="text-slate-200 font-mono">{sup.paymentTerms}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/80 font-mono">
                  <span className="text-slate-400">Current Outstanding AP:</span>
                  <span className="font-bold text-rose-400">{formatCurrency(sup.balance, currency)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: 3-Way Matching */}
      {activeTab === 'matching' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Audit 3-Way Matching Control (Purchase Order ↔ Goods Received ↔ Supplier Invoice)</span>
          </h3>

          <div className="space-y-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-amber-400 text-sm">{po.poNumber} - {po.supplierName}</span>
                  <span className="font-mono font-extrabold text-slate-100">{formatCurrency(po.totalAmount, currency)}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">1. Purchase Order</div>
                    <div className="font-bold text-emerald-400 mt-1">✓ PO Verified</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">2. Goods Received Note</div>
                    <div className="font-bold text-emerald-400 mt-1">✓ Items Inspected</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">3. Supplier Invoice</div>
                    <div className="font-bold text-emerald-400 mt-1">
                      {po.matching3Way.grnMatchesInvoice ? '✓ Price Matched' : 'Pending'}
                    </div>
                  </div>
                </div>

                {po.status !== 'Paid' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleVerify3WayMatch(po.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg shadow"
                    >
                      Authorize AP Settlement & Pay Supplier
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
