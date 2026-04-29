'use client';
import React, { useState } from 'react';
import {
  Users, TrendingUp, Truck, Package,
  ClipboardCheck, UserX, ArrowUp, ArrowDown, AlertTriangle,
} from 'lucide-react';

// Backend integration: GET /api/dashboard/kpi?date=today
const kpiData = {
  attendanceRate: { value: 87, total: 240, present: 209, unit: '%', trend: +3.2, trendDir: 'up' as const },
  productionToday: { value: 3840, target: 4200, unit: 'units', trend: -8.6, trendDir: 'down' as const },
  dispatchesToday: { value: 14, value2: '₹8.4L', unit: 'dispatches', trend: +2, trendDir: 'up' as const },
  lowStockAlerts: { value: 7, critical: 2, unit: 'items', trend: 0, trendDir: 'neutral' as const },
  pendingApprovals: { value: 12, urgent: 4, unit: 'pending', trend: +4, trendDir: 'up' as const },
  absentToday: { value: 31, expected: 240, unit: 'absent', trend: -5, trendDir: 'down' as const },
};

export default function KPIBentoGrid() {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  return (
    // Grid plan: 6 cards → grid-cols-3 on xl, 2 on md, 1 on mobile
    // Row 1: Attendance (hero, spans 1 col but taller) + Production + Dispatches
    // Row 2: Low Stock (warning) + Pending Approvals (warning) + Absent
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">

      {/* HERO: Attendance Rate */}
      <div
        className={`metric-card md:col-span-2 xl:col-span-1 bg-gradient-to-br from-blue-700 to-blue-800 text-white border-0 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'attendance' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'attendance' ? null : 'attendance')}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-1">Today&apos;s Attendance</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold tabular">{kpiData.attendanceRate.value}%</span>
              <span className="text-blue-200 text-base mb-1.5">{kpiData.attendanceRate.present}/{kpiData.attendanceRate.total}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Users size={22} className="text-white" />
          </div>
        </div>

        {/* Attendance bar */}
        <div className="mb-3">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${kpiData.attendanceRate.value}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm">
            <ArrowUp size={14} className="text-green-300" />
            <span className="text-green-300 font-semibold">+{kpiData.attendanceRate.trend}%</span>
            <span className="text-blue-200 text-xs">vs yesterday</span>
          </div>
          <span className="text-xs text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">Shift A Active</span>
        </div>
      </div>

      {/* Production Today */}
      <div className={`metric-card cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'production' ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'production' ? null : 'production')}>
        <div className="flex items-start justify-between mb-3">
          <p className="card-label">Production Today</p>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <TrendingUp size={17} className="text-amber-600" />
          </div>
        </div>
        <div className="mb-1">
          <span className="metric-value text-4xl">{kpiData.productionToday.value.toLocaleString()}</span>
          <span className="text-slate-400 text-sm ml-1.5">units</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Target: <span className="font-semibold text-slate-600">{kpiData.productionToday.target.toLocaleString()}</span></p>

        {/* Progress vs target */}
        <div className="mb-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.round((kpiData.productionToday.value / kpiData.productionToday.target) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400">
              {Math.round((kpiData.productionToday.value / kpiData.productionToday.target) * 100)}% of target
            </span>
            <span className="text-[10px] text-red-500 font-medium">
              -{(kpiData.productionToday.target - kpiData.productionToday.value).toLocaleString()} units short
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <ArrowDown size={13} className="text-red-500" />
          <span className="text-red-500 font-semibold">{kpiData.productionToday.trend}%</span>
          <span className="text-slate-400 text-xs">vs yesterday</span>
        </div>
      </div>

      {/* Dispatches Today */}
      <div className={`metric-card cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'dispatch' ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'dispatch' ? null : 'dispatch')}>
        <div className="flex items-start justify-between mb-3">
          <p className="card-label">Dispatches Today</p>
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <Truck size={17} className="text-green-600" />
          </div>
        </div>
        <div className="mb-1">
          <span className="metric-value text-4xl">{kpiData.dispatchesToday.value}</span>
          <span className="text-slate-400 text-sm ml-1.5">dispatches</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Total value: <span className="font-bold text-green-700">{kpiData.dispatchesToday.value2}</span></p>
        <div className="flex items-center gap-1.5 text-sm">
          <ArrowUp size={13} className="text-green-500" />
          <span className="text-green-500 font-semibold">+{kpiData.dispatchesToday.trend}</span>
          <span className="text-slate-400 text-xs">vs yesterday</span>
        </div>
      </div>

      {/* Low Stock Alerts — WARNING */}
      <div className={`metric-card border-amber-200 bg-amber-50/60 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'stock' ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'stock' ? null : 'stock')}>
        <div className="flex items-start justify-between mb-3">
          <p className="card-label text-amber-700">Low Stock Alerts</p>
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
            <Package size={17} className="text-amber-600" />
          </div>
        </div>
        <div className="mb-1">
          <span className="text-4xl font-bold text-amber-700 tabular">{kpiData.lowStockAlerts.value}</span>
          <span className="text-amber-500 text-sm ml-1.5">items low</span>
        </div>
        <p className="text-xs text-amber-600 mb-3">
          <span className="font-bold text-red-600">{kpiData.lowStockAlerts.critical} critical</span> — below reorder level
        </p>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={13} className="text-amber-600" />
          <span className="text-amber-700 text-xs font-medium">Action required today</span>
        </div>
      </div>

      {/* Pending Approvals — WARNING */}
      <div className={`metric-card border-red-200 bg-red-50/50 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'approvals' ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'approvals' ? null : 'approvals')}>
        <div className="flex items-start justify-between mb-3">
          <p className="card-label text-red-600">Pending Approvals</p>
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
            <ClipboardCheck size={17} className="text-red-600" />
          </div>
        </div>
        <div className="mb-1">
          <span className="text-4xl font-bold text-red-600 tabular">{kpiData.pendingApprovals.value}</span>
          <span className="text-red-400 text-sm ml-1.5">pending</span>
        </div>
        <p className="text-xs text-red-500 mb-3">
          <span className="font-bold">{kpiData.pendingApprovals.urgent} urgent</span> — corrections older than 2hrs
        </p>
        <div className="flex items-center gap-1.5">
          <ArrowUp size={13} className="text-red-500" />
          <span className="text-red-600 text-xs font-medium">+{kpiData.pendingApprovals.trend} since morning</span>
        </div>
      </div>

      {/* Absent Today */}
      <div className={`metric-card cursor-pointer transition-all duration-200 hover:shadow-card-hover ${highlighted === 'absent' ? 'ring-2 ring-slate-400 ring-offset-2' : ''}`}
        onClick={() => setHighlighted(highlighted === 'absent' ? null : 'absent')}>
        <div className="flex items-start justify-between mb-3">
          <p className="card-label">Absent Today</p>
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <UserX size={17} className="text-slate-500" />
          </div>
        </div>
        <div className="mb-1">
          <span className="metric-value text-4xl">{kpiData.absentToday.value}</span>
          <span className="text-slate-400 text-sm ml-1.5">workers</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Out of <span className="font-semibold text-slate-600">{kpiData.absentToday.expected}</span> expected</p>
        <div className="flex items-center gap-1.5 text-sm">
          <ArrowDown size={13} className="text-green-500" />
          <span className="text-green-500 font-semibold">{Math.abs(kpiData.absentToday.trend)} fewer</span>
          <span className="text-slate-400 text-xs">vs yesterday</span>
        </div>
      </div>
    </div>
  );
}