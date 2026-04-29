'use client';
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type CheckStatus = 'not-checked-in' | 'checked-in' | 'checked-out';

export default function CheckInCard() {
  const [status, setStatus] = useState<CheckStatus>('checked-in');
  const [timeStr, setTimeStr] = useState('07:00 AM');
  const [isLoading, setIsLoading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(true);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setTimeStr(`${h12}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const handleCheckIn = async () => {
    setIsLoading(true);
    // Backend integration: POST /api/attendance/check-in with { employeeId, photo, location, timestamp }
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('checked-in');
    setIsLoading(false);
    toast.success('Checked in successfully! Have a great shift.');
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    // Backend integration: POST /api/attendance/check-out with { employeeId, photo, timestamp }
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('checked-out');
    setIsLoading(false);
    toast.success('Checked out. Good work today!');
  };

  return (
    <div className={`rounded-2xl border-2 p-5 ${
      status === 'checked-in' ?'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        : status === 'checked-out' ?'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200' :'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today&apos;s Attendance</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">Wednesday, 29 Apr 2026</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
          status === 'checked-in' ?'bg-green-100 text-green-700 border border-green-200'
            : status === 'checked-out' ?'bg-slate-200 text-slate-600' :'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${status === 'checked-in' ? 'bg-green-500 animate-pulse' : status === 'checked-out' ? 'bg-slate-400' : 'bg-blue-500'}`} />
          {status === 'checked-in' ? 'On Shift' : status === 'checked-out' ? 'Shift Done' : 'Not Started'}
        </div>
      </div>

      {/* Shift info */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Shift</p>
          <p className="text-sm font-bold text-slate-900">Shift A</p>
          <p className="text-[11px] text-slate-500">6 AM – 2 PM</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Section</p>
          <p className="text-sm font-bold text-slate-900">Weaving</p>
          <p className="text-[11px] text-slate-500">Floor 2</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Time</p>
          <p className="text-sm font-bold text-slate-900 tabular">{timeStr}</p>
          <p className="text-[11px] text-slate-500">Live</p>
        </div>
      </div>

      {/* Check-in time if checked in */}
      {status === 'checked-in' && (
        <div className="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-3 mb-4">
          <CheckCircle size={16} className="text-green-500 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-slate-500">Checked in at</p>
            <p className="text-sm font-bold text-slate-900 tabular">06:02 AM</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            <span className="text-xs text-slate-500 tabular">On time</span>
          </div>
        </div>
      )}

      {/* Photo requirement notice */}
      {status !== 'checked-out' && (
        <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 mb-4 ${
          photoUploaded ? 'bg-green-100/60 border border-green-200' : 'bg-amber-100/60 border border-amber-200'
        }`}>
          {photoUploaded ? (
            <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
          )}
          <p className={`text-xs font-medium ${photoUploaded ? 'text-green-700' : 'text-amber-700'}`}>
            {photoUploaded ? 'Photo uploaded — attendance verified' : 'Photo required — tap to upload before check-in'}
          </p>
          {!photoUploaded && (
            <button className="ml-auto shrink-0">
              <Camera size={16} className="text-amber-600" />
            </button>
          )}
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-5">
        <MapPin size={13} className="text-slate-400" />
        <span className="text-xs text-slate-500">Factory Gate — Weaving Section Entrance</span>
      </div>

      {/* Action button */}
      {status === 'not-checked-in' && (
        <button
          onClick={handleCheckIn}
          disabled={isLoading || !photoUploaded}
          className="w-full py-4 rounded-2xl bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 active:scale-95 transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? <Loader2 size={22} className="animate-spin" /> : <CheckCircle size={22} />}
          {isLoading ? 'Checking In...' : 'Check In Now'}
        </button>
      )}

      {status === 'checked-in' && (
        <button
          onClick={handleCheckOut}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-slate-700 text-white font-bold text-lg hover:bg-slate-800 active:scale-95 transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
        >
          {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Clock size={22} />}
          {isLoading ? 'Checking Out...' : 'Check Out'}
        </button>
      )}

      {status === 'checked-out' && (
        <div className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-base flex items-center justify-center gap-2 border border-slate-200">
          <CheckCircle size={20} className="text-green-500" />
          Shift complete — Checked out at 02:05 PM
        </div>
      )}
    </div>
  );
}