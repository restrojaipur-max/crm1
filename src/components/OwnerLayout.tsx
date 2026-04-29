'use client';
import React, { useState } from 'react';
import OwnerSidebar from './OwnerSidebar';
import OwnerTopbar from './OwnerTopbar';

interface OwnerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function OwnerLayout({ children, title, subtitle }: OwnerLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <OwnerSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <OwnerTopbar sidebarCollapsed={collapsed} title={title} subtitle={subtitle} />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-60'}`}
      >
        <div className="p-6 xl:p-8 2xl:p-10 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}