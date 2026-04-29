'use client';
import React, { useState } from 'react';
import {
  CalendarCheck, ClipboardList, Truck, Package,
  UserCheck, AlertTriangle, Camera, RefreshCw,
} from 'lucide-react';

// Backend integration: GET /api/activity/recent?limit=20
const activities = [
  { id: 'act-001', type: 'attendance', icon: <CalendarCheck size={14} />, color: 'bg-green-100 text-green-600', message: 'Mohan Lal checked in', detail: 'Shift A — Weaving Section — Photo verified', time: '06:58 AM', actor: 'Mohan Lal' },
  { id: 'act-002', type: 'production', icon: <ClipboardList size={14} />, color: 'bg-blue-100 text-blue-600', message: 'Production entry submitted', detail: 'Geeta Sharma — 240 units — Machine M-07 (Loom #7)', time: '06:42 AM', actor: 'Geeta Sharma' },
  { id: 'act-003', type: 'dispatch', icon: <Truck size={14} />, color: 'bg-purple-100 text-purple-600', message: 'Dispatch confirmed', detail: 'Sharma Garments — 12 bales of 40s grey fabric — ₹1.2L — Driver: Ramu Singh', time: '06:35 AM', actor: 'Vinod Kumar' },
  { id: 'act-004', type: 'alert', icon: <AlertTriangle size={14} />, color: 'bg-red-100 text-red-600', message: 'Stock alert triggered', detail: 'Grey Yarn (40s Count) fell below critical level: 85 kg remaining', time: '06:20 AM', actor: 'System' },
  { id: 'act-005', type: 'attendance', icon: <UserCheck size={14} />, color: 'bg-green-100 text-green-600', message: '14 workers checked in', detail: 'Shift A bulk check-in — Spinning Section', time: '06:05 AM', actor: 'System' },
  { id: 'act-006', type: 'production', icon: <ClipboardList size={14} />, color: 'bg-blue-100 text-blue-600', message: 'Production entry approved', detail: 'Anita Devi — 180 units — Machine M-02 — Approved by Owner', time: '05:55 AM', actor: 'Ramesh Kumar' },
  { id: 'act-007', type: 'photo', icon: <Camera size={14} />, color: 'bg-amber-100 text-amber-600', message: 'Photo proof uploaded', detail: 'Rajesh Yadav — Attendance check-in photo — Weaving Gate', time: '05:48 AM', actor: 'Rajesh Yadav' },
  { id: 'act-008', type: 'stock', icon: <Package size={14} />, color: 'bg-amber-100 text-amber-600', message: 'Stock updated', detail: 'Polyester Yarn (150D) — 50 kg consumed by production — Running low', time: '05:30 AM', actor: 'System' },
  { id: 'act-009', type: 'dispatch', icon: <Truck size={14} />, color: 'bg-purple-100 text-purple-600', message: 'Dispatch loaded', detail: 'Krishna Fabrics — 8 bales — Vehicle GJ-05-AB-1234 — Driver: Sunil Verma', time: '05:10 AM', actor: 'Vinod Kumar' },
  { id: 'act-010', type: 'attendance', icon: <CalendarCheck size={14} />, color: 'bg-green-100 text-green-600', message: 'Shift B check-out complete', detail: '74 of 85 workers checked out on time', time: '04:45 AM', actor: 'System' },
];

type FilterType = 'all' | 'attendance' | 'production' | 'dispatch' | 'stock' | 'alert';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Activity' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'production', label: 'Production' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'stock', label: 'Stock' },
  { id: 'alert', label: 'Alerts' },
];

export default function ActivityFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = activeFilter === 'all' ? activities : activities.filter((a) => a.type === activeFilter);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
          <p className="text-xs text-slate-400">Live factory floor events — last 4 hours</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Refresh activity"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={`act-filter-${f.id}`}
            onClick={() => setActiveFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === f.id
                ? 'bg-slate-900 text-white' :'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-0">
        {filtered.map((item, index) => (
          <div key={item.id} className="flex gap-3 py-3 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg transition-colors group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{item.message}</p>
                <span className="text-[11px] text-slate-400 shrink-0 font-mono tabular">{item.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">No {activeFilter} activity in the last 4 hours</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Showing {filtered.length} events</span>
        <button className="text-xs text-blue-700 font-medium hover:text-blue-800 transition-colors">
          View full audit log →
        </button>
      </div>
    </div>
  );
}