import React from 'react';
import OwnerLayout from '@/components/OwnerLayout';
import KPIBentoGrid from './components/KPIBentoGrid';
import ChartsRow from './components/ChartsRow';
import LowStockAlerts from './components/LowStockAlerts';
import PendingApprovals from './components/PendingApprovals';
import ActivityFeed from './components/ActivityFeed';

export default function OwnerDashboardPage() {
  return (
    <OwnerLayout
      title="Owner Dashboard"
      subtitle="Wednesday, 29 April 2026 — Shift A in progress"
    >
      <div className="space-y-6">
        <KPIBentoGrid />
        <ChartsRow />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <LowStockAlerts />
          </div>
          <div>
            <PendingApprovals />
          </div>
        </div>
        <ActivityFeed />
      </div>
    </OwnerLayout>
  );
}