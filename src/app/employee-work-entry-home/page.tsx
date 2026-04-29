import React from 'react';
import EmployeeLayout from '@/components/EmployeeLayout';
import NoticesBanner from './components/NoticesBanner';
import CheckInCard from './components/CheckInCard';
import TodaySummaryCards from './components/TodaySummaryCards';
import QuickEntryButtons from './components/QuickEntryButtons';
import TodayHistory from './components/TodayHistory';

export default function EmployeeWorkEntryPage() {
  return (
    <EmployeeLayout activeTab="attendance">
      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <NoticesBanner />
        <CheckInCard />
        <TodaySummaryCards />
        <QuickEntryButtons />
        <TodayHistory />
      </div>
    </EmployeeLayout>
  );
}