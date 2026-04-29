'use client';
import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import EmployeeNotificationCenter from './EmployeeNotificationCenter';

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
        <EmployeeNotificationCenter />
      </div>
    </header>
  );
}