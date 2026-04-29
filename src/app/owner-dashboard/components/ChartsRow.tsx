import React from 'react';
import ProductionChart from './ProductionChart';
import AttendanceDonut from './AttendanceDonut';

export default function ChartsRow() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <ProductionChart />
      </div>
      <div>
        <AttendanceDonut />
      </div>
    </div>
  );
}