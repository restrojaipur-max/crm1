'use client';
import React, { useState } from 'react';
import { X, Package, TrendingUp, TrendingDown, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import type { StockItem, StockAdjustment } from '../page';

interface Props {
  item: StockItem;
  onSave: (adjustment: StockAdjustment) => void;
  onClose: () => void;
}

const MOVEMENT_TYPES: { value: StockAdjustment['type']; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'IN', label: 'Stock In', icon: <TrendingUp size={15} />, color: 'border-green-300 bg-green-50 text-green-700' },
  { value: 'OUT', label: 'Stock Out', icon: <TrendingDown size={15} />, color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { value: 'ADJUST', label: 'Adjustment', icon: <ArrowLeftRight size={15} />, color: 'border-blue-300 bg-blue-50 text-blue-700' },
];

const REASON_PRESETS: Record<StockAdjustment['type'], string[]> = {
  IN: ['Purchase received', 'Return from production', 'Transfer from warehouse', 'Opening stock entry'],
  OUT: ['Issued to production', 'Dispatched to customer', 'Damaged / scrapped', 'Transfer to another unit'],
  ADJUST: ['Physical count correction', 'System reconciliation', 'Damage write-off', 'Expiry write-off', 'Other correction'],
};

export default function StockAdjustmentModal({ item, onSave, onClose }: Props) {
  const [type, setType] = useState<StockAdjustment['type']>('IN');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const qtyNum = Number(qty) || 0;
  const newStock =
    type === 'IN'
      ? item.currentStock + qtyNum
      : type === 'OUT'
      ? item.currentStock - qtyNum
      : item.currentStock + qtyNum; // ADJUST can be negative if user enters negative

  const finalReason = reason === 'Other correction' || reason === '' ? customReason : reason;

  const handleSave = () => {
    if (!qty || qtyNum === 0) { setError('Please enter a valid quantity.'); return; }
    if (type === 'OUT' && qtyNum > item.currentStock) { setError('Cannot remove more than current stock.'); return; }
    if (!finalReason.trim()) { setError('Please provide a reason for this adjustment.'); return; }
    setError('');
    onSave({ itemId: item.id, type, qty: qtyNum, reason: finalReason.trim(), adjustedBy: 'Ramesh Kumar (Owner)', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 rounded-t-2xl bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Package size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stock Adjustment</h3>
              <p className="text-xs text-slate-400">{item.itemName} · {item.sku}</p>
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
          {/* Current stock info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Current</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{item.currentStock.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">{item.unit}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Reorder</p>
              <p className="text-lg font-bold text-amber-600 tabular-nums mt-0.5">{item.reorderLevel.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400">{item.unit}</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${newStock < 0 ? 'bg-red-50' : newStock <= item.reorderLevel ? 'bg-amber-50' : 'bg-green-50'}`}>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">After</p>
              <p className={`text-lg font-bold tabular-nums mt-0.5 ${newStock < 0 ? 'text-red-600' : newStock <= item.reorderLevel ? 'text-amber-600' : 'text-green-700'}`}>
                {qty ? newStock.toLocaleString('en-IN') : '—'}
              </p>
              <p className="text-[10px] text-slate-400">{item.unit}</p>
            </div>
          </div>

          {/* Movement type */}
          <div>
            <label className="label-text">Movement Type</label>
            <div className="grid grid-cols-3 gap-2">
              {MOVEMENT_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => { setType(mt.value); setReason(''); setError(''); }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                    type === mt.value ? mt.color + ' border-current' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                  }`}
                >
                  {mt.icon}
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="label-text">
              Quantity ({item.unit})
              {type === 'ADJUST' && <span className="text-slate-400 font-normal ml-1">— use negative to reduce</span>}
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => { setQty(e.target.value); setError(''); }}
              placeholder={type === 'ADJUST' ? 'e.g. -10 or +50' : 'Enter quantity'}
              className="input-field"
            />
          </div>

          {/* Reason presets */}
          <div>
            <label className="label-text">Reason</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {REASON_PRESETS[type].map((r) => (
                <button
                  key={r}
                  onClick={() => { setReason(r); setError(''); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    reason === r
                      ? 'bg-blue-600 text-white border-blue-600' :'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={reason === 'Other correction' || reason === '' ? customReason : reason}
              onChange={(e) => {
                setReason('');
                setCustomReason(e.target.value);
                setError('');
              }}
              placeholder="Or type a custom reason…"
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertTriangle size={13} />
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center">
            Save Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
