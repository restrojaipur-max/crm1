'use client';
import React from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import type { FilterState } from '../page';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  pendingCount: number;
}

const STATUS_OPTIONS = ['all', 'Present', 'Absent', 'Late', 'Half Day', 'On Leave'];
const ROLE_OPTIONS = ['all', 'Operator', 'Supervisor', 'Dispatch', 'Helper'];

export default function AttendanceFilters({ filters, onChange, pendingCount }: Props) {
  const set = (key: keyof FilterState, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="metric-card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Date range */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="label-text !mb-0 text-[11px]">From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => set('dateFrom', e.target.value)}
              className="input-field !py-2 !text-sm w-36"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label-text !mb-0 text-[11px]">To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => set('dateTo', e.target.value)}
              className="input-field !py-2 !text-sm w-36"
            />
          </div>
        </div>

        <div className="h-px lg:h-8 lg:w-px bg-slate-200 self-stretch" />

        {/* Status filter */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Status</label>
          <select
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
            className="input-field !py-2 !text-sm w-36"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>

        {/* Role filter */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Role</label>
          <select
            value={filters.role}
            onChange={(e) => set('role', e.target.value)}
            className="input-field !py-2 !text-sm w-36"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>
            ))}
          </select>
        </div>

        <div className="h-px lg:h-8 lg:w-px bg-slate-200 self-stretch" />

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="label-text !mb-0 text-[11px]">Search Employee</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Name or ID…"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="input-field !py-2 !text-sm !pl-8"
            />
          </div>
        </div>

        {/* Pending toggle */}
        <div className="flex items-end pb-0.5">
          <button
            onClick={() => set('showPendingOnly', !filters.showPendingOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${
              filters.showPendingOnly
                ? 'bg-orange-50 border-orange-200 text-orange-700' :'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertCircle size={14} />
            Pending
            {pendingCount > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filters.showPendingOnly ? 'bg-orange-200 text-orange-800' : 'bg-red-500 text-white'}`}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Clear filters */}
        <div className="flex items-end pb-0.5 ml-auto">
          <button
            onClick={() => onChange({ dateFrom: '2026-04-28', dateTo: '2026-04-29', status: 'all', role: 'all', search: '', showPendingOnly: false })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-transparent"
          >
            <Filter size={13} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
