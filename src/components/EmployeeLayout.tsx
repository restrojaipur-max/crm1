import React from 'react';
import EmployeeTopbar from './EmployeeTopbar';
import EmployeeBottomNav from './EmployeeBottomNav';

interface EmployeeLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function EmployeeLayout({ children, activeTab }: EmployeeLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <EmployeeTopbar />
      <main className="flex-1 pb-20 pt-16">
        {children}
      </main>
      <EmployeeBottomNav activeTab={activeTab} />
    </div>
  );
}