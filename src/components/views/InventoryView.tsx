import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  Search,
  Download,
  Trash2,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { SystemState, CurrencyCode, InventoryItem, StockMovement } from '../../types';
import { formatCurrency, createAuditLog } from '../../lib/storage';
import { exportToCSV } from '../../lib/exportUtils';

interface InventoryViewProps {
  state: SystemState;
  currency: CurrencyCode;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ state, currency, onUpdateState }) => {
  const { inventory, stockMovements, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'stock' | 'transfers' | 'waste'>('stock');
  const [searchTerm, setSearchTerm] = useState('');

  // Transfer Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferItemId, setTransferItemId] = useState(inventory[0]?.id || '');
  const [transferFrom, setTransferFrom] = useState('Main Warehouse');
  const [transferTo, setTransferTo] = useState('Bar Store');
  const [transferQty, setTransferQty] = useState(5);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find((i) => i.id === transferItemId);
    if (!item) return;

    if (item.quantityOnHand < transferQty) {
      alert('Insufficient stock on hand for transfer.');
      return;
    }

    const newMovement: StockMovement = {
      id: 'sm-' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      itemId: item.id,
      itemName: item.name,
      movementType: 'Transfer Out',
      fromLocation: transferFrom,
      toLocation: transferTo,
      quantity: Number(transferQty),
      unitCost: item.unitCost,
      performedBy: currentUser.name,
      reference: 'TRF-' + Math.floor(100 + Math.random() * 900)
    };

    onUpdateState((prev) => {
      const updatedInv = prev.inventory.map((inv) => {
        if (inv.id === item.id) {
          const nextQty = inv.quantityOnHand - Number(transferQty);
          return {
            ...inv,
            quantityOnHand: nextQty,
            status: (nextQty <= inv.minStockLevel ? 'Low Stock' : 'In Stock') as InventoryItem['status']
          };
        }
        return inv;
      });

      const audit = createAuditLog(
        currentUser,
        'Inventory Control',
        'Stock Department Transfer',
        `Transferred ${transferQty} ${item.unitOfMeasure} of ${item.name} from ${transferFrom} to ${transferTo}`,
        'Approved'
      );

      return {
        ...prev,
        inventory: updatedInv,
        stockMovements: [newMovement, ...prev.stockMovements],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setShowTransferModal(false);
  };

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Stock & Inventory Management Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-department stock tracking, kitchen/bar transfers, reorder alerts & waste management
          </p>
        </div>

        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Stock to Department</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'stock' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Stock Master List ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'transfers' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Stock Movement Log ({stockMovements.length})
        </button>
      </div>

      {/* Stock Master Table */}
      {activeTab === 'stock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock by code, item name, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200"
              />
            </div>

            <button
              onClick={() => {
                const headers = ['Code', 'Item Name', 'Category', 'Location', 'On Hand', 'Min Level', 'Unit Cost', 'Status'];
                const rows = filteredInventory.map((i) => [
                  i.code,
                  i.name,
                  i.category,
                  i.location,
                  `${i.quantityOnHand} ${i.unitOfMeasure}`,
                  i.minStockLevel,
                  i.unitCost,
                  i.status
                ]);
                exportToCSV('SkyView_Inventory_Master', headers, rows);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Item Code</th>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Storage Location</th>
                  <th className="py-2.5 px-3 text-right">Quantity On Hand</th>
                  <th className="py-2.5 px-3 text-right">Unit Cost</th>
                  <th className="py-2.5 px-3 text-right">Valuation Total</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{item.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.category}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium">{item.location}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                      {item.quantityOnHand} {item.unitOfMeasure}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                      {formatCurrency(item.unitCost, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(item.quantityOnHand * item.unitCost, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfers Tab */}
      {activeTab === 'transfers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-sm text-slate-100">Stock Transfer Audit Logs</h3>
          <div className="space-y-2">
            {stockMovements.map((sm) => (
              <div key={sm.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">{sm.itemName}</div>
                  <div className="text-[10px] text-slate-400">
                    {sm.fromLocation} → {sm.toLocation} | Ref: {sm.reference} ({sm.performedBy})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-amber-400">{sm.quantity} Units</div>
                  <div className="text-[10px] text-slate-500">{sm.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>Department Stock Transfer</span>
            </h3>

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Item to Transfer</label>
                <select
                  value={transferItemId}
                  onChange={(e) => setTransferItemId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.quantityOnHand} {i.unitOfMeasure} available in {i.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Location</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Kitchen Store">Kitchen Store</option>
                    <option value="Bar Store">Bar Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To Department Store</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Bar Store">Bar Store</option>
                    <option value="Kitchen Store">Kitchen Store</option>
                    <option value="Housekeeping">Housekeeping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity to Move</label>
                <input
                  type="number"
                  min={1}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg">
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
