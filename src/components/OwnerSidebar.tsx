'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, ClipboardList, Package, Truck, BarChart3, Settings, Shield, ChevronLeft, ChevronRight, Bell, Factory, UserCog, CalendarCheck,  } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/owner-dashboard', group: 'main' },
  { id: 'nav-master', label: 'Master Setup', icon: <Factory size={18} />, href: '/owner-dashboard', group: 'main' },
  { id: 'nav-users', label: 'User Management', icon: <UserCog size={18} />, href: '/owner-dashboard', badge: 2, group: 'main' },
  { id: 'nav-attendance', label: 'Attendance', icon: <CalendarCheck size={18} />, href: '/owner-attendance-oversight', badge: 5, group: 'operations' },
  { id: 'nav-production', label: 'Production', icon: <ClipboardList size={18} />, href: '/owner-production-oversight', badge: 3, group: 'operations' },
  { id: 'nav-stock', label: 'Stock', icon: <Package size={18} />, href: '/owner-stock-oversight', badge: 4, group: 'operations' },
  { id: 'nav-dispatch', label: 'Dispatch', icon: <Truck size={18} />, href: '/owner-dashboard', group: 'operations' },
  { id: 'nav-reports', label: 'Reports', icon: <BarChart3 size={18} />, href: '/owner-dashboard', group: 'insights' },
  { id: 'nav-audit', label: 'Audit Log', icon: <Shield size={18} />, href: '/owner-dashboard', group: 'insights' },
  { id: 'nav-settings', label: 'Settings', icon: <Settings size={18} />, href: '/owner-dashboard', group: 'system' },
];

const groups = [
  { id: 'main', label: 'Core' },
  { id: 'operations', label: 'Operations' },
  { id: 'insights', label: 'Insights' },
  { id: 'system', label: 'System' },
];

interface OwnerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function OwnerSidebar({ collapsed, onToggle }: OwnerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col z-30 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-slate-100 px-3 ${collapsed ? 'justify-center' : 'gap-2 px-4'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-bold text-slate-900 text-base tracking-tight truncate">FactoryOps</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group.id);
          return (
            <div key={`group-${group.id}`}>
              {!collapsed && (
                <p className="section-header mb-1">{group.label}</p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => router.push(item.href)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'} ${collapsed ? 'justify-center px-0' : ''}`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {collapsed && item.badge && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-slate-100 p-2 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">RK</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Ramesh Kumar</p>
              <p className="text-xs text-slate-400 truncate">Owner</p>
            </div>
            <Bell size={15} className="ml-auto text-slate-400 shrink-0" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors text-xs font-medium"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}