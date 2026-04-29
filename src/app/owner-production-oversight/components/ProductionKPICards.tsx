'use client';
import React from 'react';
import { ClipboardList, CheckCircle2, AlertTriangle, Clock, TrendingUp, XCircle } from 'lucide-react';
import type { ProductionRecord } from '../page';

interface Props {
  records: ProductionRecord[];
}

export default function ProductionKPICards({ records }: Props) {
  const totalProduced = records.reduce((s, r) => s + r.producedQty, 0);
  const totalTarget = records.reduce((s, r) => s + r.targetQty, 0);
  const totalRejected = records.reduce((s, r) => s + r.rejectedQty, 0);
  const efficiency = totalTarget > 0 ? Math.round((totalProduced / totalTarget) * 100) : 0;
  const verified = records.filter((r) => r.status === 'Verified').length;
  const flagged = records.filter((r) => r.status === 'Flagged').length;
  const pending = records.filter((r) => r.status === 'Pending').length;

  const cards = [
    {
      label: 'Total Produced',
      value: totalProduced.toLocaleString('en-IN'),
      sub: `Target: ${totalTarget.toLocaleString('en-IN')}`,
      icon: <ClipboardList size={18} />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Efficiency',
      value: `${efficiency}%`,
      sub: efficiency >= 95 ? 'On track' : efficiency >= 80 ? 'Below target' : 'Critical',
      icon: <TrendingUp size={18} />,
      color: efficiency >= 95 ? 'text-green-700' : efficiency >= 80 ? 'text-amber-700' : 'text-red-700',
      bg: efficiency >= 95 ? 'bg-green-50' : efficiency >= 80 ? 'bg-amber-50' : 'bg-red-50',
      border: efficiency >= 95 ? 'border-green-100' : efficiency >= 80 ? 'border-amber-100' : 'border-red-100',
    },
    {
      label: 'Rejected Units',
      value: totalRejected.toLocaleString('en-IN'),
      sub: totalProduced > 0 ? `${((totalRejected / totalProduced) * 100).toFixed(1)}% rejection rate` : '—',
      icon: <XCircle size={18} />,
      color: totalRejected > 20 ? 'text-red-700' : 'text-slate-600',
      bg: totalRejected > 20 ? 'bg-red-50' : 'bg-slate-50',
      border: totalRejected > 20 ? 'border-red-100' : 'border-slate-200',
    },
    {
      label: 'Verified Entries',
      value: verified,
      sub: `${records.length} total entries`,
      icon: <CheckCircle2 size={18} />,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Pending Review',
      value: pending,
      sub: 'Awaiting verification',
      icon: <Clock size={18} />,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Flagged Entries',
      value: flagged,
      sub: 'Needs attention',
      icon: <AlertTriangle size={18} />,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-100',
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
