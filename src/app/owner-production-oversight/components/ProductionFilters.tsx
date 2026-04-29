'use client';
import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ProductionFilterState } from '../page';

interface Props {
  filters: ProductionFilterState;
  onChange: (f: ProductionFilterState) => void;
  products: string[];
}

const SHIFT_OPTIONS = ['all', 'Morning', 'Evening', 'Night'];
const STATUS_OPTIONS = ['all', 'Verified', 'Pending', 'Flagged'];
const ROLE_OPTIONS = ['all', 'Operator', 'Supervisor', 'Helper'];

export default function ProductionFilters({ filters, onChange, products }: Props) {
  const set = (key: keyof ProductionFilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="metric-card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap">
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

        {/* Shift */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Shift</label>
          <select
            value={filters.shift}
            onChange={(e) => set('shift', e.target.value)}
            className="input-field !py-2 !text-sm w-32"
          >
            {SHIFT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Shifts' : s}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Status</label>
          <select
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
            className="input-field !py-2 !text-sm w-32"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Role</label>
          <select
            value={filters.role}
            onChange={(e) => set('role', e.target.value)}
            className="input-field !py-2 !text-sm w-32"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Product</label>
          <select
            value={filters.product}
            onChange={(e) => set('product', e.target.value)}
            className="input-field !py-2 !text-sm w-40"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="h-px lg:h-8 lg:w-px bg-slate-200 self-stretch" />

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="label-text !mb-0 text-[11px]">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Employee, product, machine…"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="input-field !py-2 !text-sm !pl-8"
            />
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end pb-0.5 ml-auto">
          <button
            onClick={() =>
              onChange({
                dateFrom: '2026-04-27',
                dateTo: '2026-04-29',
                shift: 'all',
                status: 'all',
                role: 'all',
                product: 'all',
                search: '',
              })
            }
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
