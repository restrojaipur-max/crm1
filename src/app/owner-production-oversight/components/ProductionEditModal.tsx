'use client';
import React, { useState } from 'react';
import { X, Pencil, Calendar, User, Package, Cpu } from 'lucide-react';
import type { ProductionRecord } from '../page';

interface Props {
  record: ProductionRecord;
  onSave: (updated: ProductionRecord) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: ProductionRecord['status'][] = ['Verified', 'Pending', 'Flagged'];
const SHIFT_OPTIONS: ProductionRecord['shift'][] = ['Morning', 'Evening', 'Night'];

export default function ProductionEditModal({ record, onSave, onClose }: Props) {
  const [producedQty, setProducedQty] = useState(String(record.producedQty));
  const [rejectedQty, setRejectedQty] = useState(String(record.rejectedQty));
  const [status, setStatus] = useState<ProductionRecord['status']>(record.status);
  const [shift, setShift] = useState<ProductionRecord['shift']>(record.shift);
  const [notes, setNotes] = useState(record.notes ?? '');

  const handleSave = () => {
    onSave({
      ...record,
      producedQty: Number(producedQty) || 0,
      rejectedQty: Number(rejectedQty) || 0,
      status,
      shift,
      notes: notes || undefined,
      verifiedBy: status === 'Verified' ? 'Ramesh Kumar (Owner)' : record.verifiedBy,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 rounded-t-2xl bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Pencil size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit Production Entry</h3>
              <p className="text-xs text-slate-400">{record.employeeName} · {record.employeeId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-slate-800">{record.date}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
              <Package size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Product</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{record.productName}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
              <Cpu size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Machine</p>
                <p className="text-sm font-semibold text-slate-800">{record.machineId}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
              <User size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Role</p>
                <p className="text-sm font-semibold text-slate-800">{record.role}</p>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">Produced Qty ({record.unit})</label>
              <input
                type="number"
                min={0}
                value={producedQty}
                onChange={(e) => setProducedQty(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text">Rejected Qty ({record.unit})</label>
              <input
                type="number"
                min={0}
                value={rejectedQty}
                onChange={(e) => setRejectedQty(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ProductionRecord['shift'])}
                className="input-field"
              >
                {SHIFT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductionRecord['status'])}
                className="input-field"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note about this edit…"
              rows={2}
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
