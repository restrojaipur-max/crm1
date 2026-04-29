import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Bell } from 'lucide-react';

export default function EmployeeTopbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <AppLogo size={28} />
        <span className="font-bold text-slate-900 text-base">FactoryOps</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right mr-1">
          <p className="text-xs font-semibold text-slate-900">Suresh Patel</p>
          <p className="text-[10px] text-slate-400">Weaving — Shift A</p>
        </div>
        <div className="relative">
          <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}