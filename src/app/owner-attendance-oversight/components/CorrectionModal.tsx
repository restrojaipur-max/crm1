'use client';
import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Clock, User, Calendar, Pencil } from 'lucide-react';
import type { AttendanceRecord } from '../page';

interface ApproveProps {
  record: AttendanceRecord;
  mode: 'approve';
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  onSave?: never;
}

interface EditProps {
  record: AttendanceRecord;
  mode: 'edit';
  onSave: (updated: AttendanceRecord) => void;
  onClose: () => void;
  onApprove?: never;
  onReject?: never;
}

type Props = ApproveProps | EditProps;

const STATUS_OPTIONS: AttendanceRecord['status'][] = ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'];

export default function CorrectionModal(props: Props) {
  const { record, mode, onClose } = props;

  const [editedCheckIn, setEditedCheckIn] = useState(record.checkIn === '—' ? '' : record.checkIn);
  const [editedCheckOut, setEditedCheckOut] = useState(record.checkOut === '—' ? '' : record.checkOut);
  const [editedStatus, setEditedStatus] = useState<AttendanceRecord['status']>(record.status);
  const [editNote, setEditNote] = useState('');

  const handleSave = () => {
    if (props.mode === 'edit' && props.onSave) {
      props.onSave({
        ...record,
        checkIn: editedCheckIn || '—',
        checkOut: editedCheckOut || '—',
        status: editedStatus,
        hoursWorked: calcHours(editedCheckIn, editedCheckOut),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-100 rounded-t-2xl ${mode === 'approve' ? 'bg-orange-50/60' : 'bg-slate-50/60'}`}>
          <div className="flex items-center gap-2.5">
            {mode === 'approve' ? (
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle size={16} className="text-orange-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Pencil size={16} className="text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'approve' ? 'Review Correction Request' : 'Edit Attendance Record'}
              </h3>
              <p className="text-xs text-slate-400">{record.employeeName} · {record.employeeId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Record info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-slate-800">{record.date}</p>
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

          {/* Correction note (approve mode) */}
          {mode === 'approve' && record.correctionNote && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1">Correction Request</p>
              <p className="text-sm text-slate-700 leading-relaxed">{record.correctionNote}</p>
              {record.correctionRequestedBy && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                  <Clock size={11} />
                  <span>Submitted by {record.correctionRequestedBy} at {record.correctionRequestedAt}</span>
                </div>
              )}
            </div>
          )}

          {/* Current values */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {mode === 'edit' ? 'Edit Values' : 'Current Record'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text">Check In</label>
                {mode === 'edit' ? (
                  <input
                    type="time"
                    value={editedCheckIn}
                    onChange={(e) => setEditedCheckIn(e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <div className="input-field bg-slate-50 text-slate-700 font-mono">{record.checkIn}</div>
                )}
              </div>
              <div>
                <label className="label-text">Check Out</label>
                {mode === 'edit' ? (
                  <input
                    type="time"
                    value={editedCheckOut}
                    onChange={(e) => setEditedCheckOut(e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <div className="input-field bg-slate-50 text-slate-700 font-mono">{record.checkOut}</div>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label-text">Status</label>
            {mode === 'edit' ? (
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value as AttendanceRecord['status'])}
                className="input-field"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <div className="input-field bg-slate-50 text-slate-700">{record.status}</div>
            )}
          </div>

          {/* Edit note */}
          {mode === 'edit' && (
            <div>
              <label className="label-text">Edit Note (optional)</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Reason for manual edit…"
                rows={2}
                className="input-field resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2.5 px-5 pb-5">
          {mode === 'approve' ? (
            <>
              <button
                onClick={() => props.onReject?.()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <XCircle size={15} />
                Reject
              </button>
              <button
                onClick={() => props.onApprove?.()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 size={15} />
                Approve
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function calcHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const [ih, im] = checkIn.split(':').map(Number);
  const [oh, om] = checkOut.split(':').map(Number);
  const diff = (oh * 60 + om) - (ih * 60 + im);
  return diff > 0 ? Math.round((diff / 60) * 100) / 100 : 0;
}
