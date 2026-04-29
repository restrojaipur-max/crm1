'use client';
import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { StockFilterState } from '../page';

interface Props {
  filters: StockFilterState;
  onChange: (f: StockFilterState) => void;
  categories: string[];
}

const STATUS_OPTIONS = ['all', 'Healthy', 'Low Stock', 'Out of Stock'];
const MOVEMENT_OPTIONS = ['all', 'IN', 'OUT', 'ADJUST'];

export default function StockFilters({ filters, onChange, categories }: Props) {
  const set = (key: keyof StockFilterState, value: string) =>
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

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Category</label>
          <select
            value={filters.category}
            onChange={(e) => set('category', e.target.value)}
            className="input-field !py-2 !text-sm w-36"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Stock Status</label>
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

        {/* Movement Type */}
        <div className="flex flex-col gap-1">
          <label className="label-text !mb-0 text-[11px]">Movement</label>
          <select
            value={filters.movement}
            onChange={(e) => set('movement', e.target.value)}
            className="input-field !py-2 !text-sm w-32"
          >
            {MOVEMENT_OPTIONS.map((m) => (
              <option key={m} value={m}>{m === 'all' ? 'All Types' : m}</option>
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
              placeholder="Item name, SKU, category…"
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
                category: 'all',
                status: 'all',
                movement: 'all',
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
