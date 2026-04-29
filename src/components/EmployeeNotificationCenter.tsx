'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell, X, CheckCheck, Trash2, CalendarCheck, ClipboardList,
  Truck, Megaphone, Settings, ChevronRight, Sparkles, Filter,
  BellOff, RefreshCw
} from 'lucide-react';
import { createClient } from '../lib/supabase/client';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  category: string;
  is_read: boolean;
  is_broadcast: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

type CategoryFilter = 'all' | 'attendance' | 'production' | 'dispatch' | 'announcement' | 'system';

const CATEGORIES: { id: CategoryFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'all', label: 'All', icon: <Sparkles size={13} />, color: 'text-slate-600 bg-slate-100' },
  { id: 'attendance', label: 'Attendance', icon: <CalendarCheck size={13} />, color: 'text-blue-600 bg-blue-50' },
  { id: 'production', label: 'Production', icon: <ClipboardList size={13} />, color: 'text-violet-600 bg-violet-50' },
  { id: 'dispatch', label: 'Dispatch', icon: <Truck size={13} />, color: 'text-amber-600 bg-amber-50' },
  { id: 'announcement', label: 'Notices', icon: <Megaphone size={13} />, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'system', label: 'System', icon: <Settings size={13} />, color: 'text-slate-500 bg-slate-50' },
];

function getCategoryStyle(category: string): string {
  switch (category) {
    case 'attendance': return 'border-l-blue-500 bg-blue-50/30';
    case 'production': return 'border-l-violet-500 bg-violet-50/30';
    case 'dispatch': return 'border-l-amber-500 bg-amber-50/30';
    case 'announcement': return 'border-l-emerald-500 bg-emerald-50/30';
    default: return 'border-l-slate-300 bg-slate-50/30';
  }
}

function getCategoryIcon(category: string, type: string) {
  const isApproved = type.includes('approved');
  const isRejected = type.includes('rejected');
  const baseClass = isApproved ? 'text-emerald-600' : isRejected ? 'text-red-500' : 'text-slate-500';
  switch (category) {
    case 'attendance': return <CalendarCheck size={16} className={baseClass} />;
    case 'production': return <ClipboardList size={16} className={baseClass} />;
    case 'dispatch': return <Truck size={16} className={baseClass} />;
    case 'announcement': return <Megaphone size={16} className="text-emerald-600" />;
    default: return <Settings size={16} className="text-slate-400" />;
  }
}

function getStatusBadge(type: string): React.ReactNode | null {
  if (type.includes('approved')) return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">Approved</span>;
  if (type.includes('rejected')) return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wide">Rejected</span>;
  if (type === 'shift_reminder') return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">Reminder</span>;
  if (type === 'announcement') return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">Notice</span>;
  return null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function EmployeeNotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.category === activeFilter);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`recipient_id.eq.${user.id},is_broadcast.eq.true`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel('employee-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const newNotif = payload.new as Notification;
        setNotifications((prev) => [newNotif, ...prev]);
        setNewIds((prev) => new Set(prev).add(newNotif.id));
        setTimeout(() => setNewIds((prev) => { const s = new Set(prev); s.delete(newNotif.id); return s; }), 3000);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === payload.new.id ? { ...n, ...payload.new } : n))
        );
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', user.id)
      .eq('is_read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id: string) => {
    setAnimatingIds((prev) => new Set(prev).add(id));
    setTimeout(async () => {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setAnimatingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 300);
  };

  const unreadByCategory = (cat: CategoryFilter) => {
    if (cat === 'all') return unreadCount;
    return notifications.filter((n) => n.category === cat && !n.is_read).length;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className={unreadCount > 0 ? 'text-slate-700' : ''} />
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white sm:absolute sm:inset-auto sm:right-0 sm:top-11 sm:w-[380px] sm:max-h-[600px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Bell size={14} />
              </div>
              <div>
                <p className="font-semibold text-sm leading-none">Notifications</p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchNotifications}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <CheckCheck size={13} />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 overflow-x-auto border-b border-slate-100 bg-slate-50 shrink-0 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const count = unreadByCategory(cat.id);
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : `${cat.color} hover:opacity-80`
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                  {count > 0 && (
                    <span className={`ml-0.5 min-w-[14px] h-3.5 text-[9px] font-bold rounded-full flex items-center justify-center px-1 ${isActive ? 'bg-white text-slate-800' : 'bg-slate-800 text-white'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Loading notifications…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <BellOff size={24} className="opacity-40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">No notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeFilter === 'all' ? "You're all caught up!" : `No ${activeFilter} notifications`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && markRead(n.id)}
                    className={`group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-300 border-l-[3px] ${getCategoryStyle(n.category)} ${
                      animatingIds.has(n.id) ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                    } ${newIds.has(n.id) ? 'ring-1 ring-inset ring-amber-200' : ''}`}
                  >
                    {/* New badge */}
                    {newIds.has(n.id) && (
                      <span className="absolute top-2 left-2 text-[8px] font-bold text-amber-600 bg-amber-100 px-1 py-0.5 rounded uppercase tracking-wide">New</span>
                    )}

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.category === 'attendance' ? 'bg-blue-100' :
                      n.category === 'production' ? 'bg-violet-100' :
                      n.category === 'dispatch' ? 'bg-amber-100' :
                      n.category === 'announcement' ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      {getCategoryIcon(n.category, n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5 flex-wrap">
                        <p className={`text-sm leading-snug flex-1 ${!n.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
                          {n.title}
                        </p>
                        {getStatusBadge(n.type)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-400">{timeAgo(n.created_at)}</span>
                        {!n.is_read && (
                          <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-medium">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Unread
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                      {n.action_url && (
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors">
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
                {activeFilter !== 'all' ? ` in ${activeFilter}` : ''}
              </span>
              <button className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 font-medium transition-colors">
                <Filter size={11} />
                Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
