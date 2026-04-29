'use client';
import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Package, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

// Backend integration: GET /api/stock/alerts?status=low,critical
const stockAlerts = [
  { id: 'stock-001', item: 'Grey Yarn (40s Count)', category: 'Raw Material', currentQty: 85, reorderLevel: 200, unit: 'kg', status: 'critical' as const, lastReplenished: '18 Apr 2026', supplier: 'Sharma Textiles' },
  { id: 'stock-002', item: 'Sizing Chemical (PVA)', category: 'Chemical', currentQty: 12, reorderLevel: 25, unit: 'L', status: 'critical' as const, lastReplenished: '22 Apr 2026', supplier: 'Chem Solutions Pvt' },
  { id: 'stock-003', item: 'Polyester Yarn (150D)', category: 'Raw Material', currentQty: 340, reorderLevel: 400, unit: 'kg', status: 'low' as const, lastReplenished: '25 Apr 2026', supplier: 'Fibre King Co.' },
  { id: 'stock-004', item: 'Warp Beam (Steel)', category: 'Spare Part', currentQty: 4, reorderLevel: 8, unit: 'pcs', status: 'low' as const, lastReplenished: '10 Apr 2026', supplier: 'Metal Works India' },
  { id: 'stock-005', item: 'Lubricant Oil (ISO 46)', category: 'Maintenance', currentQty: 18, reorderLevel: 30, unit: 'L', status: 'low' as const, lastReplenished: '20 Apr 2026', supplier: 'Bharat Petroleum' },
  { id: 'stock-006', item: 'Shuttle (Wooden)', category: 'Spare Part', currentQty: 22, reorderLevel: 40, unit: 'pcs', status: 'low' as const, lastReplenished: '15 Apr 2026', supplier: 'Loom Parts Depot' },
  { id: 'stock-007', item: 'Bobbin (Plastic)', category: 'Consumable', currentQty: 180, reorderLevel: 250, unit: 'pcs', status: 'low' as const, lastReplenished: '26 Apr 2026', supplier: 'Textile Accessories' },
];

export default function LowStockAlerts() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'low'>('all');

  const filtered = filter === 'all' ? stockAlerts : stockAlerts.filter((s) => s.status === filter);

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Package size={16} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Low Stock Alerts</h3>
            <p className="text-xs text-slate-400">Items requiring immediate reorder</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-blue-700 font-medium hover:text-blue-800 transition-colors">
          View all stock <ExternalLink size={12} />
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {(['all', 'critical', 'low'] as const).map((f) => (
          <button
            key={`filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? f === 'critical' ? 'bg-red-100 text-red-700 border border-red-200'
                  : f === 'low'? 'bg-amber-100 text-amber-700 border border-amber-200' :'bg-slate-900 text-white' :'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? `All (${stockAlerts.length})` : f === 'critical' ? `Critical (${stockAlerts.filter(s => s.status === 'critical').length})` : `Low (${stockAlerts.filter(s => s.status === 'low').length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[540px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Item</th>
              <th className="text-left pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</th>
              <th className="text-right pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Current</th>
              <th className="text-right pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Reorder At</th>
              <th className="text-center pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="text-left pb-2.5 px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-slate-50 hover:bg-slate-50 transition-colors group ${
                  item.status === 'critical' ? 'bg-red-50/40' : ''
                }`}
              >
                <td className="py-3 px-1">
                  <div className="flex items-center gap-2">
                    {item.status === 'critical' && <AlertTriangle size={13} className="text-red-500 shrink-0" />}
                    <span className="font-medium text-slate-900 text-sm leading-tight">{item.item}</span>
                  </div>
                </td>
                <td className="py-3 px-1">
                  <span className="text-xs text-slate-500">{item.category}</span>
                </td>
                <td className="py-3 px-1 text-right">
                  <span className={`font-bold tabular text-sm ${item.status === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                    {item.currentQty} {item.unit}
                  </span>
                </td>
                <td className="py-3 px-1 text-right">
                  <span className="text-slate-500 tabular text-sm">{item.reorderLevel} {item.unit}</span>
                </td>
                <td className="py-3 px-1 text-center">
                  <Badge variant={item.status === 'critical' ? 'danger' : 'warning'} dot>
                    {item.status === 'critical' ? 'Critical' : 'Low'}
                  </Badge>
                </td>
                <td className="py-3 px-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs text-slate-500 truncate max-w-[100px]">{item.supplier}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <Package size={32} className="text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No {filter} stock alerts</p>
        </div>
      )}
    </div>
  );
}