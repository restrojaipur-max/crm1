'use client';
import React from 'react';
import { X, Camera, Calendar, User, Package, Cpu, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ProductionRecord } from '../page';

interface Props {
  record: ProductionRecord;
  onClose: () => void;
}

const shiftColors: Record<ProductionRecord['shift'], string> = {
  Morning: 'bg-amber-50 text-amber-700 border-amber-100',
  Evening: 'bg-orange-50 text-orange-700 border-orange-100',
  Night: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export default function PhotoProofViewer({ record, onClose }: Props) {
  const eff =
    record.targetQty > 0
      ? Math.round((record.producedQty / record.targetQty) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Camera size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Production Photo Proof</h3>
              <p className="text-xs text-slate-400">{record.employeeName} · {record.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Photo */}
        <div className="relative bg-slate-900 aspect-video flex items-center justify-center overflow-hidden">
          {record.hasPhoto && record.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={record.photoUrl}
              alt={`Production proof for ${record.productName} by ${record.employeeName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Camera size={40} className="opacity-30" />
              <p className="text-sm">No photo uploaded for this entry</p>
            </div>
          )}
          {/* Overlay badge */}
          {record.hasPhoto && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">
              Submitted {record.submittedAt}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {record.producedQty.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Produced ({record.unit})</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {record.targetQty.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Target ({record.unit})</p>
            </div>
            <div
              className={`rounded-xl p-3 text-center ${
                eff >= 95 ? 'bg-green-50' : eff >= 80 ? 'bg-amber-50' : 'bg-red-50'
              }`}
            >
              <p
                className={`text-lg font-bold tabular-nums ${
                  eff >= 95 ? 'text-green-700' : eff >= 80 ? 'text-amber-700' : 'text-red-700'
                }`}
              >
                {eff}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Efficiency</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Package size={13} className="text-slate-400 shrink-0" />
              <span className="font-medium">{record.productName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Cpu size={13} className="text-slate-400 shrink-0" />
              <span className="font-mono">{record.machineId}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <User size={13} className="text-slate-400 shrink-0" />
              <span>{record.role}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span className={`font-semibold px-1.5 py-0.5 rounded-full border text-[10px] ${shiftColors[record.shift]}`}>
                {record.shift} Shift
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={13} className="text-slate-400 shrink-0" />
              <span>Submitted at {record.submittedAt}</span>
            </div>
            {record.verifiedBy && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                <span className="truncate">By {record.verifiedBy}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-700 leading-relaxed">{record.notes}</p>
            </div>
          )}

          {/* Rejected */}
          {record.rejectedQty > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <span className="text-xs font-semibold text-red-700">Rejected Units</span>
              <span className="text-sm font-bold text-red-700 tabular-nums">
                {record.rejectedQty} {record.unit}
              </span>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="btn-secondary w-full justify-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
