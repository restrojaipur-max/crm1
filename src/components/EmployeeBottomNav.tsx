'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, ClipboardEdit, Truck, History, User } from 'lucide-react';

const tabs = [
  { id: 'attendance', label: 'Attendance', icon: <CalendarCheck size={20} />, href: '/employee-work-entry-home' },
  { id: 'work', label: 'Work Entry', icon: <ClipboardEdit size={20} />, href: '/employee-work-entry-home' },
  { id: 'dispatch', label: 'Dispatch', icon: <Truck size={20} />, href: '/employee-work-entry-home' },
  { id: 'history', label: 'History', icon: <History size={20} />, href: '/employee-work-entry-home' },
  { id: 'profile', label: 'Profile', icon: <User size={20} />, href: '/employee-work-entry-home' },
];

interface EmployeeBottomNavProps {
  activeTab?: string;
}

export default function EmployeeBottomNav({ activeTab = 'attendance' }: EmployeeBottomNavProps) {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-20 flex items-center">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={`tab-${tab.id}`}
            onClick={() => router.push(tab.href)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`${isActive ? 'text-blue-700' : ''}`}>{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && <span className="absolute bottom-0 w-10 h-0.5 bg-blue-700 rounded-t-full" />}
          </button>
        );
      })}
    </nav>
  );
}