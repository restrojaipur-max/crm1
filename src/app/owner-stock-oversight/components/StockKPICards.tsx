'use client';
import React from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import type { StockItem } from '../page';

interface Props {
  items: StockItem[];
}

export default function StockKPICards({ items }: Props) {
  const totalItems = items.length;
  const totalStockValue = items.reduce((s, i) => s + i.currentStock * i.unitCost, 0);
  const lowStockItems = items.filter((i) => i.currentStock <= i.reorderLevel).length;
  const outOfStock = items.filter((i) => i.currentStock === 0).length;
  const recentIn = items.reduce((s, i) => s + (i.lastMovement?.type === 'IN' ? i.lastMovement.qty : 0), 0);
  const recentOut = items.reduce((s, i) => s + (i.lastMovement?.type === 'OUT' ? i.lastMovement.qty : 0), 0);
  const healthyItems = items.filter((i) => i.currentStock > i.reorderLevel).length;

  const cards = [
    {
      label: 'Total Stock Items',
      value: totalItems.toLocaleString('en-IN'),
      sub: `₹${(totalStockValue / 1000).toFixed(1)}K total value`,
      icon: <Package size={18} />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockItems,
      sub: outOfStock > 0 ? `${outOfStock} out of stock` : 'All have some stock',
      icon: <AlertTriangle size={18} />,
      color: lowStockItems > 0 ? 'text-red-700' : 'text-green-700',
      bg: lowStockItems > 0 ? 'bg-red-50' : 'bg-green-50',
      border: lowStockItems > 0 ? 'border-red-100' : 'border-green-100',
    },
    {
      label: 'Recent Stock In',
      value: recentIn.toLocaleString('en-IN'),
      sub: 'Units received (last movement)',
      icon: <TrendingUp size={18} />,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Recent Stock Out',
      value: recentOut.toLocaleString('en-IN'),
      sub: 'Units dispatched (last movement)',
      icon: <TrendingDown size={18} />,
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
    },
    {
      label: 'Net Movement',
      value: (recentIn - recentOut).toLocaleString('en-IN'),
      sub: recentIn >= recentOut ? 'Positive net flow' : 'Negative net flow',
      icon: <ArrowLeftRight size={18} />,
      color: recentIn >= recentOut ? 'text-blue-700' : 'text-amber-700',
      bg: recentIn >= recentOut ? 'bg-blue-50' : 'bg-amber-50',
      border: recentIn >= recentOut ? 'border-blue-100' : 'border-amber-100',
    },
    {
      label: 'Healthy Stock',
      value: healthyItems,
      sub: `${totalItems > 0 ? Math.round((healthyItems / totalItems) * 100) : 0}% items above reorder`,
      icon: <CheckCircle2 size={18} />,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`metric-card !p-4 flex flex-col gap-2 border ${card.border}`}>
          <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{card.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
