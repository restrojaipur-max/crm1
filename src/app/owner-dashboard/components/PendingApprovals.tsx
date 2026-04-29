'use client';
import React, { useState } from 'react';
import { Check, X, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';

// Backend integration: GET /api/approvals/pending
const pendingApprovals = [
  { id: 'appr-001', type: 'Attendance Correction', employee: 'Mohan Lal', detail: 'Check-out time correction: 6:00 PM → 8:30 PM', submittedAt: '06:15 AM', urgency: 'high' as const, hasPhoto: true },
  { id: 'appr-002', type: 'Production Entry', employee: 'Geeta Sharma', detail: 'Added 240 units for Machine M-07 (Loom #7)', submittedAt: '06:42 AM', urgency: 'medium' as const, hasPhoto: true },
  { id: 'appr-003', type: 'Attendance Correction', employee: 'Rajesh Yadav', detail: 'Late check-in: 9:15 AM (was marked absent)', submittedAt: '05:50 AM', urgency: 'high' as const, hasPhoto: false },
  { id: 'appr-004', type: 'Dispatch Entry', employee: 'Vinod Kumar', detail: 'Dispatch to Sharma Garments — 12 bales, ₹1.2L', submittedAt: '07:00 AM', urgency: 'medium' as const, hasPhoto: true },
  { id: 'appr-005', type: 'Production Entry', employee: 'Anita Devi', detail: 'Machine downtime logged: M-03, 2.5 hrs', submittedAt: '05:30 AM', urgency: 'low' as const, hasPhoto: false },
  { id: 'appr-006', type: 'Attendance Correction', employee: 'Suresh Babu', detail: 'Missing check-in entry for 28 Apr', submittedAt: '04:00 AM', urgency: 'high' as const, hasPhoto: true },
];

const urgencyConfig = {
  high: { badge: 'danger' as const, label: 'Urgent' },
  medium: { badge: 'warning' as const, label: 'Medium' },
  low: { badge: 'neutral' as const, label: 'Low' },
};

export default function PendingApprovals() {
  const [items, setItems] = useState(pendingApprovals);

  const handleApprove = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success('Correction approved and logged');
  };

  const handleReject = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.error('Correction rejected — employee notified');
  };

  return (
    <div className="metric-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Pending Approvals</h3>
          <p className="text-xs text-slate-400">Corrections & entries awaiting review</p>
        </div>
        {items.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <Check size={22} className="text-green-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No pending approvals right now</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 transition-all ${
                item.urgency === 'high' ? 'border-red-100 bg-red-50/50' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-700">{item.type}</span>
                    <Badge variant={urgencyConfig[item.urgency].badge}>
                      {urgencyConfig[item.urgency].label}
                    </Badge>
                    {item.hasPhoto && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-semibold">📷 Photo</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{item.employee}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock size={11} />
                  <span>{item.submittedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toast.info(`Viewing details for ${item.employee}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    aria-label="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Reject correction"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    aria-label="Approve correction"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              setItems([]);
              toast.success(`${items.length} approvals processed`);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors border border-green-100"
          >
            <Check size={14} />
            Approve All ({items.length})
          </button>
        </div>
      )}
    </div>
  );
}