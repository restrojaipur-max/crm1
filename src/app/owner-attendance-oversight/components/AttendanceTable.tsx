'use client';
import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, CalendarOff, Minus, Camera, AlertCircle, Pencil, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { AttendanceRecord } from '../page';

interface Props {
  records: AttendanceRecord[];
  onViewCorrection: (r: AttendanceRecord) => void;
  onEdit: (r: AttendanceRecord) => void;
}

type SortKey = 'employeeName' | 'date' | 'checkIn' | 'hoursWorked' | 'status';

const statusConfig: Record<AttendanceRecord['status'], { icon: React.ReactNode; badge: 'success' | 'danger' | 'warning' | 'neutral' | 'info' }> = {
  Present: { icon: <CheckCircle2 size={13} className="text-green-600" />, badge: 'success' },
  Absent: { icon: <XCircle size={13} className="text-red-500" />, badge: 'danger' },
  Late: { icon: <Clock size={13} className="text-amber-500" />, badge: 'warning' },
  'Half Day': { icon: <Minus size={13} className="text-blue-500" />, badge: 'info' },
  'On Leave': { icon: <CalendarOff size={13} className="text-slate-400" />, badge: 'neutral' },
};

const roleColors: Record<AttendanceRecord['role'], string> = {
  Operator: 'bg-violet-50 text-violet-700 border-violet-100',
  Supervisor: 'bg-blue-50 text-blue-700 border-blue-100',
  Dispatch: 'bg-teal-50 text-teal-700 border-teal-100',
  Helper: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function AttendanceTable({ records, onViewCorrection, onEdit }: Props) {
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

  const thClass = 'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-slate-700 transition-colors';

  return (
    <div className="metric-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Attendance Records</h3>
          <p className="text-xs text-slate-400 mt-0.5">{records.length} record{records.length !== 1 ? 's' : ''} matching filters</p>
        </div>
        <button className="btn-secondary !py-2 !text-xs">
          Export
        </button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <CalendarOff size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No records found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className={thClass} onClick={() => handleSort('employeeName')}>
                  <span className="flex items-center gap-1">Employee <SortIcon col="employeeName" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('date')}>
                  <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('checkIn')}>
                  <span className="flex items-center gap-1">Check In <SortIcon col="checkIn" /></span>
                </th>
                <th className={thClass}>Check Out</th>
                <th className={thClass} onClick={() => handleSort('hoursWorked')}>
                  <span className="flex items-center gap-1">Hours <SortIcon col="hoursWorked" /></span>
                </th>
                <th className={thClass} onClick={() => handleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
                </th>
                <th className={thClass}>Photo</th>
                <th className={thClass}>Correction</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((record) => (
                <tr
                  key={record.id}
                  className={`group transition-colors hover:bg-slate-50/70 ${record.correctionPending ? 'bg-orange-50/30' : ''}`}
                >
                  {/* Employee */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {record.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{record.employeeName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">{record.employeeId}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${roleColors[record.role]}`}>
                            {record.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-slate-700 font-medium tabular-nums">
                      {new Date(record.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>

                  {/* Check In */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-mono font-medium ${record.checkIn === '—' ? 'text-slate-300' : 'text-slate-800'}`}>
                      {record.checkIn}
                    </span>
                  </td>

                  {/* Check Out */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-mono font-medium ${record.checkOut === '—' ? 'text-slate-300' : 'text-slate-800'}`}>
                      {record.checkOut}
                    </span>
                  </td>

                  {/* Hours */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold tabular-nums ${record.hoursWorked >= 8 ? 'text-green-700' : record.hoursWorked > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {statusConfig[record.status].icon}
                      <Badge variant={statusConfig[record.status].badge}>{record.status}</Badge>
                    </div>
                  </td>

                  {/* Photo */}
                  <td className="px-4 py-3.5">
                    {record.hasPhoto ? (
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        <Camera size={13} />
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>

                  {/* Correction */}
                  <td className="px-4 py-3.5">
                    {record.correctionPending ? (
                      <button
                        onClick={() => onViewCorrection(record)}
                        className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg border border-orange-100 transition-colors"
                      >
                        <AlertCircle size={12} />
                        Review
                      </button>
                    ) : record.approvedBy ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 size={12} />
                        Approved
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewCorrection(record)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {records.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {records.length} record{records.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-slate-400">
            {records.filter((r) => r.correctionPending).length} pending correction{records.filter((r) => r.correctionPending).length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
