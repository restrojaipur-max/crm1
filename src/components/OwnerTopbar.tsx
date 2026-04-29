'use client';
import React, { useState } from 'react';
import { Bell, Search, RefreshCw, Download, ChevronDown } from 'lucide-react';

interface OwnerTopbarProps {
  sidebarCollapsed: boolean;
  title: string;
  subtitle?: string;
}

export default function OwnerTopbar({ sidebarCollapsed, title, subtitle }: OwnerTopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-5 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {/* Date filter */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
          <span className="font-medium">Today</span>
          <ChevronDown size={14} />
        </div>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Refresh */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCw size={18} />
        </button>

        {/* Export */}
        <button className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
          <Download size={15} />
          <span>Export</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}