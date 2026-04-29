'use client';
import React, { useState } from 'react';
import {
  ChevronUp, ChevronDown, Package, Pencil, TrendingUp, TrendingDown,
  ArrowLeftRight, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { StockItem } from '../page';

interface Props {
  items: StockItem[];
  onAdjust: (item: StockItem) => void;
}

type SortKey = 'itemName' | 'category' | 'currentStock' | 'reorderLevel' | 'unitCost' | 'lastUpdated';

function getStockStatus(item: StockItem): { label: string; variant: 'success' | 'warning' | 'danger'; icon: React.ReactNode } {
  if (item.currentStock === 0)
    return { label: 'Out of Stock', variant: 'danger', icon: <XCircle size={13} className="text-red-500" /> };
  if (item.currentStock <= item.reorderLevel)
    return { label: 'Low Stock', variant: 'warning', icon: <AlertTriangle size={13} className="text-amber-500" /> };
  return { label: 'Healthy', variant: 'success', icon: <CheckCircle2 size={13} className="text-green-600" /> };
}

const movementIcon: Record<string, React.ReactNode> = {
  IN: <TrendingUp size={12} className="text-green-600" />,
  OUT: <TrendingDown size={12} className="text-orange-500" />,
  ADJUST: <ArrowLeftRight size={12} className="text-blue-500" />,
};

const movementColor: Record<string, string> = {
  IN: 'text-green-700 bg-green-50 border-green-100',
  OUT: 'text-orange-700 bg-orange-50 border-orange-100',
  ADJUST: 'text-blue-700 bg-blue-50 border-blue-100',
};

export default function StockTable({ items, onAdjust }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('itemName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...items].sort((a, b) => {
    let av: string | number = a[sortKey] as string | number;
    let bv: string | number = b[sortKey] as string | number;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-600" /> : <ChevronDown size={12} className="text-blue-600" />
    ) : (
      <ChevronUp size={12} className="text-slate-300" />
    );

  const thClass =
    'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-slate-700 transition-colors';

  return (
    <div className="metric-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Inventory Table</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {items.length} item{items.length !== 1 ? 's' : ''} matching filters
          </p>
        </div>
        <button className="btn-secondary !py-2 !text-xs">Export</button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Package size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No items found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className={thClass} onClick={() => handleSort('itemName')}>
                  <span className="flex items-center gap-1">Item <SortIcon col="itemName" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('category')}>
                  <span className="flex items-center gap-1">Category <SortIcon col="category" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('currentStock')}>
                  <span className="flex items-center gap-1">Current Stock <SortIcon col="currentStock" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('reorderLevel')}>
                  <span className="flex items-center gap-1">Reorder Level <SortIcon col="reorderLevel" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('unitCost')}>
                  <span className="flex items-center gap-1">Unit Cost <SortIcon col="unitCost" /></span>
                </th>
                <th className={thClass}>Stock Value</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Last Movement</th>
                <th className={thClass} onClick={() => handleSort('lastUpdated')}>
                  <span className="flex items-center gap-1">Updated <SortIcon col="lastUpdated" /></span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((item) => {
                const status = getStockStatus(item);
                const stockValue = item.currentStock * item.unitCost;
                const stockPct = item.maxStock > 0 ? Math.min((item.currentStock / item.maxStock) * 100, 100) : 0;
                const barColor =
                  item.currentStock === 0
                    ? 'bg-red-400'
                    : item.currentStock <= item.reorderLevel
                    ? 'bg-amber-400' :'bg-green-500';

                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors hover:bg-slate-50/70 ${
                      item.currentStock === 0 ? 'bg-red-50/20' : item.currentStock <= item.reorderLevel ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Item */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Package size={15} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-tight">{item.itemName}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {item.currentStock.toLocaleString('en-IN')}
                          <span className="text-[10px] text-slate-400 ml-0.5 font-normal">{item.unit}</span>
                        </span>
                      </div>
                    </td>

                    {/* Reorder Level */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-500 tabular-nums">
                        {item.reorderLevel.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 ml-0.5">{item.unit}</span>
                      </span>
                    </td>

                    {/* Unit Cost */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-700 tabular-nums font-medium">
                        ₹{item.unitCost.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Stock Value */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-slate-900 tabular-nums">
                        ₹{stockValue.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {status.icon}
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </td>

                    {/* Last Movement */}
                    <td className="px-4 py-3.5">
                      {item.lastMovement ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${movementColor[item.lastMovement.type]}`}>
                            {movementIcon[item.lastMovement.type]}
                            {item.lastMovement.type}
                          </span>
                          <span className="text-xs text-slate-600 tabular-nums font-medium">
                            {item.lastMovement.qty > 0 ? '+' : ''}{item.lastMovement.qty}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-500 tabular-nums">
                        {new Date(item.lastUpdated + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onAdjust(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
                      >
                        <Pencil size={12} />
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
