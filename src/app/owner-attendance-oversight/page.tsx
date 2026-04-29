'use client';
import React, { useState, useMemo } from 'react';
import OwnerLayout from '@/components/OwnerLayout';
import AttendanceFilters from './components/AttendanceFilters';
import AttendanceTable from './components/AttendanceTable';
import AttendanceSummaryCards from './components/AttendanceSummaryCards';
import CorrectionModal from './components/CorrectionModal';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: 'Operator' | 'Supervisor' | 'Dispatch' | 'Helper';
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  hoursWorked: number;
  hasPhoto: boolean;
  correctionPending: boolean;
  correctionNote?: string;
  correctionRequestedBy?: string;
  correctionRequestedAt?: string;
  approvedBy?: string;
}

const MOCK_RECORDS: AttendanceRecord[] = [
  { id: 'att-001', employeeId: 'EMP-001', employeeName: 'Mohan Lal', role: 'Operator', date: '2026-04-29', checkIn: '08:02', checkOut: '17:45', status: 'Present', hoursWorked: 9.7, hasPhoto: true, correctionPending: false },
  { id: 'att-002', employeeId: 'EMP-002', employeeName: 'Geeta Sharma', role: 'Supervisor', date: '2026-04-29', checkIn: '07:55', checkOut: '18:10', status: 'Present', hoursWorked: 10.25, hasPhoto: true, correctionPending: false },
  { id: 'att-003', employeeId: 'EMP-003', employeeName: 'Rajesh Yadav', role: 'Operator', date: '2026-04-29', checkIn: '09:15', checkOut: '17:30', status: 'Late', hoursWorked: 8.25, hasPhoto: false, correctionPending: true, correctionNote: 'Late check-in: was marked absent, requesting correction', correctionRequestedBy: 'Rajesh Yadav', correctionRequestedAt: '05:50 AM' },
  { id: 'att-004', employeeId: 'EMP-004', employeeName: 'Vinod Kumar', role: 'Dispatch', date: '2026-04-29', checkIn: '08:00', checkOut: '—', status: 'Present', hoursWorked: 0, hasPhoto: true, correctionPending: false },
  { id: 'att-005', employeeId: 'EMP-005', employeeName: 'Anita Devi', role: 'Helper', date: '2026-04-29', checkIn: '—', checkOut: '—', status: 'Absent', hoursWorked: 0, hasPhoto: false, correctionPending: false },
  { id: 'att-006', employeeId: 'EMP-006', employeeName: 'Suresh Babu', role: 'Operator', date: '2026-04-29', checkIn: '—', checkOut: '—', status: 'Absent', hoursWorked: 0, hasPhoto: false, correctionPending: true, correctionNote: 'Missing check-in entry for 28 Apr — was present on site', correctionRequestedBy: 'Suresh Babu', correctionRequestedAt: '04:00 AM' },
  { id: 'att-007', employeeId: 'EMP-007', employeeName: 'Priya Verma', role: 'Supervisor', date: '2026-04-29', checkIn: '08:10', checkOut: '13:00', status: 'Half Day', hoursWorked: 4.83, hasPhoto: true, correctionPending: false },
  { id: 'att-008', employeeId: 'EMP-008', employeeName: 'Ravi Shankar', role: 'Operator', date: '2026-04-29', checkIn: '—', checkOut: '—', status: 'On Leave', hoursWorked: 0, hasPhoto: false, correctionPending: false },
  { id: 'att-009', employeeId: 'EMP-009', employeeName: 'Kavita Singh', role: 'Helper', date: '2026-04-28', checkIn: '08:05', checkOut: '17:55', status: 'Present', hoursWorked: 9.83, hasPhoto: true, correctionPending: false },
  { id: 'att-010', employeeId: 'EMP-010', employeeName: 'Deepak Tiwari', role: 'Dispatch', date: '2026-04-28', checkIn: '07:50', checkOut: '18:20', status: 'Present', hoursWorked: 10.5, hasPhoto: true, correctionPending: false },
  { id: 'att-011', employeeId: 'EMP-011', employeeName: 'Sunita Rao', role: 'Operator', date: '2026-04-28', checkIn: '08:30', checkOut: '17:30', status: 'Late', hoursWorked: 9.0, hasPhoto: false, correctionPending: false },
  { id: 'att-012', employeeId: 'EMP-012', employeeName: 'Arun Mishra', role: 'Helper', date: '2026-04-28', checkIn: '—', checkOut: '—', status: 'Absent', hoursWorked: 0, hasPhoto: false, correctionPending: true, correctionNote: 'Check-out time correction: 6:00 PM → 8:30 PM', correctionRequestedBy: 'Arun Mishra', correctionRequestedAt: '06:15 AM' },
];

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
  role: string;
  search: string;
  showPendingOnly: boolean;
}

export default function OwnerAttendanceOversightPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_RECORDS);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '2026-04-28',
    dateTo: '2026-04-29',
    status: 'all',
    role: 'all',
    search: '',
    showPendingOnly: false,
  });
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceRecord | null>(null);
  const [editTarget, setEditTarget] = useState<AttendanceRecord | null>(null);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (r.date < filters.dateFrom || r.date > filters.dateTo) return false;
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.role !== 'all' && r.role !== filters.role) return false;
      if (filters.showPendingOnly && !r.correctionPending) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.employeeName.toLowerCase().includes(q) && !r.employeeId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, filters]);

  const handleApproveCorrection = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, correctionPending: false, approvedBy: 'Ramesh Kumar (Owner)', status: 'Present' }
          : r
      )
    );
    setCorrectionTarget(null);
  };

  const handleRejectCorrection = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, correctionPending: false, correctionNote: undefined } : r
      )
    );
    setCorrectionTarget(null);
  };

  const handleEditSave = (updated: AttendanceRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditTarget(null);
  };

  const pendingCount = records.filter((r) => r.correctionPending).length;

  return (
    <OwnerLayout
      title="Attendance Oversight"
      subtitle="Review, edit, and approve attendance records across all employees"
    >
      <div className="space-y-5">
        <AttendanceSummaryCards records={filtered} pendingCount={pendingCount} />
        <AttendanceFilters filters={filters} onChange={setFilters} pendingCount={pendingCount} />
        <AttendanceTable
          records={filtered}
          onViewCorrection={(r) => setCorrectionTarget(r)}
          onEdit={(r) => setEditTarget(r)}
        />
      </div>

      {/* Correction Approval Modal */}
      {correctionTarget && (
        <CorrectionModal
          record={correctionTarget}
          mode="approve"
          onApprove={() => handleApproveCorrection(correctionTarget.id)}
          onReject={() => handleRejectCorrection(correctionTarget.id)}
          onClose={() => setCorrectionTarget(null)}
        />
      )}

      {/* Edit Record Modal */}
      {editTarget && (
        <CorrectionModal
          record={editTarget}
          mode="edit"
          onSave={handleEditSave}
          onClose={() => setEditTarget(null)}
        />
      )}
    </OwnerLayout>
  );
}
