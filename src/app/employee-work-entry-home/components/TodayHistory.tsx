'use client';
import React, { useState } from 'react';
import { ClipboardList, Truck, CalendarCheck, CheckCircle, Clock, ChevronDown, ChevronUp, Camera, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';

// Backend integration: GET /api/employee/history/today?employeeId=EMP-042
const todayEntries = [
  {
    id: 'entry-001',
    type: 'attendance' as const,
    title: 'Check In',
    detail: 'Shift A — Weaving Section',
    time: '06:02 AM',
    status: 'verified' as const,
    hasPhoto: true,
    meta: 'On time',
  },
  {
    id: 'entry-002',
    type: 'production' as const,
    title: 'Production Entry',
    detail: 'M-07 (Loom #7) — Grey Fabric (40s)',
    time: '06:42 AM',
    status: 'approved' as const,
    hasPhoto: true,
    meta: '240 units',
  },
  {
    id: 'entry-003',
    type: 'production' as const,
    title: 'Production Entry',
    detail: 'M-07 (Loom #7) — Grey Fabric (40s)',
    time: '06:58 AM',
    status: 'pending' as const,
    hasPhoto: false,
    meta: '180 units',
  },
  {
    id: 'entry-004',
    type: 'dispatch' as const,
    title: 'Dispatch Entry',
    detail: 'Sharma Garments — 12 bales',
    time: '07:00 AM',
    status: 'pending' as const,
    hasPhoto: true,
    meta: '₹1.2L',
  },
];

const typeConfig = {
  attendance: { icon: <CalendarCheck size={14} />, color: 'bg-green-100 text-green-600' },
  production: { icon: <ClipboardList size={14} />, color: 'bg-blue-100 text-blue-600' },
  dispatch: { icon: <Truck size={14} />, color: 'bg-purple-100 text-purple-600' },
};

const statusConfig = {
  verified: { badge: 'success' as const, label: 'Verified', icon: <CheckCircle size={11} /> },
  approved: { badge: 'success' as const, label: 'Approved', icon: <CheckCircle size={11} /> },
  pending: { badge: 'warning' as const, label: 'Pending', icon: <Clock size={11} /> },
  rejected: { badge: 'danger' as const, label: 'Rejected', icon: <Clock size={11} /> },
};

export default function TodayHistory() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
            <ClipboardList size={14} className="text-slate-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Today&apos;s Entries</p>
            <p className="text-[11px] text-slate-400">{todayEntries.length} entries submitted</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{expanded ? 'Hide' : 'Show'}</span>
          {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      {/* Entries */}
      {expanded && (
        <div className="border-t border-slate-100">
          {todayEntries.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No entries submitted today</p>
              <p className="text-xs text-slate-300 mt-1">Your check-ins, production, and dispatch entries will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {todayEntries.map((entry) => {
                const tc = typeConfig[entry.type];
                const sc = statusConfig[entry.status];
                return (
                  <div key={entry.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${tc.color}`}>
                      {tc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                        <span className="text-[11px] text-slate-400 font-mono tabular shrink-0">{entry.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{entry.detail}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={sc.badge}>
                          {sc.label}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-600">{entry.meta}</span>
                        {entry.hasPhoto && (
                          <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-semibold">
                            <Camera size={10} /> Photo
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 shrink-0 mt-1"
                      aria-label="View entry details"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <button className="w-full text-xs text-blue-700 font-semibold hover:text-blue-800 transition-colors text-center">
              View full history →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}