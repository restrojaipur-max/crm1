'use client';
import React, { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, Clock, Camera, Pencil, ChevronUp, ChevronDown,
  Package, Eye
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { ProductionRecord } from '../page';

interface Props {
  records: ProductionRecord[];
  onEdit: (r: ProductionRecord) => void;
  onViewPhoto: (r: ProductionRecord) => void;
  onVerify: (id: string) => void;
}

type SortKey = 'employeeName' | 'date' | 'productName' | 'producedQty' | 'targetQty' | 'rejectedQty' | 'status';

const statusConfig: Record<ProductionRecord['status'], { icon: React.ReactNode; badge: 'success' | 'warning' | 'danger' }> = {
  Verified: { icon: <CheckCircle2 size={13} className="text-green-600" />, badge: 'success' },
  Pending: { icon: <Clock size={13} className="text-amber-500" />, badge: 'warning' },
  Flagged: { icon: <AlertTriangle size={13} className="text-red-500" />, badge: 'danger' },
};

const shiftColors: Record<ProductionRecord['shift'], string> = {
  Morning: 'bg-amber-50 text-amber-700 border-amber-100',
  Evening: 'bg-orange-50 text-orange-700 border-orange-100',
  Night: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

const roleColors: Record<ProductionRecord['role'], string> = {
  Operator: 'bg-violet-50 text-violet-700 border-violet-100',
  Supervisor: 'bg-blue-50 text-blue-700 border-blue-100',
  Helper: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function ProductionTable({ records, onEdit, onViewPhoto, onVerify }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...records].sort((a, b) => {
    let av: string | number = a[sortKey] as string | number;
    let bv: string | number = b[sortKey] as string | number;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-600" /> : <ChevronDown size={12} className="text-blue-600" />
    ) : (
      <ChevronUp size={12} className="text-slate-300" />
    );

  const thClass =
    'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-slate-700 transition-colors';

  return (
    <div className="metric-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Daily Production Records</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {records.length} entr{records.length !== 1 ? 'ies' : 'y'} matching filters
          </p>
        </div>
        <button className="btn-secondary !py-2 !text-xs">Export</button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Package size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No records found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className={thClass} onClick={() => handleSort('employeeName')}>
                  <span className="flex items-center gap-1">Employee <SortIcon col="employeeName" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('date')}>
                  <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('productName')}>
                  <span className="flex items-center gap-1">Product <SortIcon col="productName" /></span>
                </th>
                <th className={thClass}>Machine</th>
                <th className={thClass} onClick={() => handleSort('targetQty')}>
                  <span className="flex items-center gap-1">Target <SortIcon col="targetQty" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('producedQty')}>
                  <span className="flex items-center gap-1">Produced <SortIcon col="producedQty" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('rejectedQty')}>
                  <span className="flex items-center gap-1">Rejected <SortIcon col="rejectedQty" /></span>
                </th>
                <th className={thClass}>Efficiency</th>
                <th className={thClass} onClick={() => handleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
                </th>
                <th className={thClass}>Photo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((record) => {
                const eff =
                  record.targetQty > 0
                    ? Math.round((record.producedQty / record.targetQty) * 100)
                    : 0;
                const effColor =
                  eff >= 95
                    ? 'text-green-700'
                    : eff >= 80
                    ? 'text-amber-600' :'text-red-600';

                return (
                  <tr
                    key={record.id}
                    className={`group transition-colors hover:bg-slate-50/70 ${
                      record.status === 'Flagged' ? 'bg-red-50/20' : ''
                    }`}
                  >
                    {/* Employee */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {record.employeeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-tight">
                            {record.employeeName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {record.employeeId}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleColors[record.role]}`}
                            >
                              {record.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="text-sm text-slate-700 font-medium tabular-nums">
                          {new Date(record.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                        <span
                          className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${shiftColors[record.shift]}`}
                        >
                          {record.shift}
                        </span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {record.productName}
                      </p>
                    </td>

                    {/* Machine */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {record.machineId}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-500 tabular-nums">
                        {record.targetQty.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 ml-0.5">{record.unit}</span>
                      </span>
                    </td>

                    {/* Produced */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-slate-900 tabular-nums">
                        {record.producedQty.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 ml-0.5">{record.unit}</span>
                      </span>
                    </td>

                    {/* Rejected */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          record.rejectedQty > 10 ? 'text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {record.rejectedQty > 0 ? record.rejectedQty : '—'}
                      </span>
                    </td>

                    {/* Efficiency */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              eff >= 95
                                ? 'bg-green-500'
                                : eff >= 80
                                ? 'bg-amber-400' :'bg-red-400'
                            }`}
                            style={{ width: `${Math.min(eff, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold tabular-nums ${effColor}`}>
                          {eff}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {statusConfig[record.status].icon}
                        <Badge variant={statusConfig[record.status].badge}>
                          {record.status}
                        </Badge>
                      </div>
                    </td>

                    {/* Photo */}
                    <td className="px-4 py-3.5">
                      {record.hasPhoto ? (
                        <button
                          onClick={() => onViewPhoto(record)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Camera size={13} />
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {record.status === 'Pending' && (
                          <button
                            onClick={() => onVerify(record.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 px-2 py-1 rounded-lg transition-colors"
                            title="Verify entry"
                          >
                            <CheckCircle2 size={12} />
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => onViewPhoto(record)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onEdit(record)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit record"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {records.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {records.length} entr{records.length !== 1 ? 'ies' : 'y'}
          </p>
          <p className="text-xs text-slate-400">
            {records.filter((r) => r.status === 'Flagged').length} flagged ·{' '}
            {records.filter((r) => r.status === 'Pending').length} pending
          </p>
        </div>
      )}
    </div>
  );
}
