'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Backend integration: GET /api/attendance/today/breakdown
const attendanceBreakdown = [
  { name: 'Present', value: 209, color: '#16a34a' },
  { name: 'Absent', value: 18, color: '#e2e8f0' },
  { name: 'Late Arrival', value: 8, color: '#f59e0b' },
  { name: 'On Leave', value: 5, color: '#93c5fd' },
];

const shiftData = [
  { shift: 'Shift A', present: 88, total: 98, pct: 90 },
  { shift: 'Shift B', present: 74, total: 85, pct: 87 },
  { shift: 'Shift C', present: 47, total: 57, pct: 82 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card-hover px-3 py-2.5 text-sm">
      <p className="font-semibold text-slate-900">{payload[0].name}</p>
      <p className="text-slate-500">{payload[0].value} workers</p>
    </div>
  );
};

export default function AttendanceDonut() {
  const total = attendanceBreakdown.reduce((s, d) => s + d.value, 0);
  const presentPct = Math.round((attendanceBreakdown[0].value / total) * 100);

  return (
    <div className="metric-card h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Attendance Breakdown</h3>
        <p className="text-xs text-slate-400 mt-0.5">Today — all shifts combined</p>
      </div>

      <div className="relative flex justify-center mb-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={attendanceBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {attendanceBreakdown.map((entry, index) => (
                <Cell key={`cell-att-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-900 tabular">{presentPct}%</span>
          <span className="text-xs text-slate-400">Present</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {attendanceBreakdown.map((item) => (
          <div key={`att-leg-${item.name}`} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 truncate">{item.name}</p>
              <p className="text-xs font-bold text-slate-700 tabular">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shift breakdown */}
      <div className="border-t border-slate-100 pt-3 space-y-2.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">By Shift</p>
        {shiftData.map((s) => (
          <div key={`shift-${s.shift}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600">{s.shift}</span>
              <span className="text-xs text-slate-500 tabular">{s.present}/{s.total}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}