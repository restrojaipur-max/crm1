'use client';
import React, { useState } from 'react';
import { Bell, X, ChevronRight } from 'lucide-react';

const notices = [
  { id: 'notice-001', text: 'Shift B timing changed: 2:00 PM → 1:30 PM from 1 May 2026', type: 'info' as const },
  { id: 'notice-002', text: 'All workers must upload check-in photo from tomorrow. Face must be visible.', type: 'warning' as const },
];

export default function NoticesBanner() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  const visible = notices.filter((n) => !dismissed.includes(n.id));
  if (visible.length === 0) return null;

  const notice = visible[current % visible.length];

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
      notice.type === 'warning' ?'bg-amber-50 border-amber-200' :'bg-blue-50 border-blue-200'
    }`}>
      <Bell size={16} className={`shrink-0 mt-0.5 ${notice.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold mb-0.5 ${notice.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>
          Notice from Management
        </p>
        <p className={`text-sm leading-relaxed ${notice.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
          {notice.text}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {visible.length > 1 && (
          <button
            onClick={() => setCurrent((c) => (c + 1) % visible.length)}
            className={`p-1 rounded-md transition-colors ${notice.type === 'warning' ? 'text-amber-500 hover:bg-amber-100' : 'text-blue-500 hover:bg-blue-100'}`}
            aria-label="Next notice"
          >
            <ChevronRight size={14} />
          </button>
        )}
        <button
          onClick={() => setDismissed((d) => [...d, notice.id])}
          className={`p-1 rounded-md transition-colors ${notice.type === 'warning' ? 'text-amber-400 hover:bg-amber-100' : 'text-blue-400 hover:bg-blue-100'}`}
          aria-label="Dismiss notice"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}