'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';

// Backend integration: GET /api/production/daily-trend?days=7
const productionData = [
  { day: '23 Apr', actual: 4120, target: 4200 },
  { day: '24 Apr', actual: 4380, target: 4200 },
  { day: '25 Apr', actual: 3960, target: 4200 },
  { day: '26 Apr', actual: 4500, target: 4200 },
  { day: '27 Apr', actual: 4050, target: 4200 },
  { day: '28 Apr', actual: 4210, target: 4200 },
  { day: '29 Apr', actual: 3840, target: 4200 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card-hover px-4 py-3 text-sm">
      <p className="font-semibold text-slate-900 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tp-${i}`} className="flex items-center justify-between gap-4">
          <span className="text-slate-500">{p.name === 'actual' ? 'Actual' : 'Target'}</span>
          <span className={`font-bold tabular ${p.name === 'actual' ? 'text-blue-700' : 'text-slate-400'}`}>
            {p.value.toLocaleString()} units
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ProductionChart() {
  const [view, setView] = useState<'7d' | '14d' | '30d'>('7d');

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Daily Production vs Target</h3>
          <p className="text-xs text-slate-400 mt-0.5">Units produced per day across all machines</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['7d', '14d', '30d'] as const).map((v) => (
            <button
              key={`view-${v}`}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === v ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-700" />
          <span className="text-xs text-slate-500">Actual Production</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-amber-400 border-dashed border-t-2 border-amber-400" />
          <span className="text-xs text-slate-500">Daily Target (4,200)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={productionData} barSize={28} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }} />
          <ReferenceLine y={4200} stroke="#f59e0b" strokeDasharray="5 3" strokeWidth={1.5} />
          <Bar dataKey="actual" name="actual" radius={[4, 4, 0, 0]}>
            {productionData.map((entry, index) => (
              <Cell
                key={`cell-prod-${index}`}
                fill={entry.actual >= entry.target ? '#1d4ed8' : '#93c5fd'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">Last updated: 07:00 AM</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">7-day avg: <span className="font-semibold text-slate-700">4,151</span></span>
          <span className="text-xs text-slate-500">Best day: <span className="font-semibold text-green-700">4,500</span></span>
        </div>
      </div>
    </div>
  );
}