import React from 'react';
import { ClipboardList, Truck, CheckCircle, Clock } from 'lucide-react';

// Backend integration: GET /api/employee/today-summary?employeeId=EMP-042
const summary = {
  productionEntries: 2,
  productionUnits: 420,
  productionStatus: 'approved' as const,
  dispatchEntries: 1,
  dispatchStatus: 'pending' as const,
  hoursWorked: '3h 58m',
};

export default function TodaySummaryCards() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Production */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <ClipboardList size={15} className="text-blue-600" />
          </div>
          {summary.productionStatus === 'approved' ? (
            <CheckCircle size={13} className="text-green-500" />
          ) : (
            <Clock size={13} className="text-amber-500" />
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tabular">{summary.productionUnits}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wide">Units Today</p>
        <p className="text-[10px] text-slate-500 mt-1">{summary.productionEntries} entries</p>
      </div>

      {/* Dispatch */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Truck size={15} className="text-purple-600" />
          </div>
          <Clock size={13} className="text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-slate-900 tabular">{summary.dispatchEntries}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wide">Dispatches</p>
        <p className="text-[10px] text-amber-600 mt-1 font-medium">Pending review</p>
      </div>

      {/* Hours */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Clock size={15} className="text-green-600" />
          </div>
          <CheckCircle size={13} className="text-green-500" />
        </div>
        <p className="text-xl font-bold text-slate-900 tabular">{summary.hoursWorked}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wide">Hours Worked</p>
        <p className="text-[10px] text-green-600 mt-1 font-medium">On time</p>
      </div>
    </div>
  );
}