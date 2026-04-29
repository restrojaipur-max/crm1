'use client';
import React from 'react';
import { Users, UserCheck, UserX, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';
import type { AttendanceRecord } from '../page';

interface Props {
  records: AttendanceRecord[];
  pendingCount: number;
}

export default function AttendanceSummaryCards({ records, pendingCount }: Props) {
  const total = records.length;
  const present = records.filter((r) => r.status === 'Present').length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const halfDay = records.filter((r) => r.status === 'Half Day').length;
  const onLeave = records.filter((r) => r.status === 'On Leave').length;

  const cards = [
    { label: 'Total Records', value: total, icon: <Users size={18} />, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Present', value: present, icon: <UserCheck size={18} />, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Absent', value: absent, icon: <UserX size={18} />, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Late Arrivals', value: late, icon: <Clock size={18} />, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Half Day', value: halfDay, icon: <CalendarCheck size={18} />, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Corrections', value: pendingCount, icon: <AlertTriangle size={18} />, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100' },
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
          </div>
        </div>
      ))}
    </div>
  );
}
