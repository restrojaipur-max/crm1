'use client';
import React, { useState, useMemo } from 'react';
import OwnerLayout from '@/components/OwnerLayout';
import ProductionFilters from './components/ProductionFilters';
import ProductionTable from './components/ProductionTable';
import ProductionKPICards from './components/ProductionKPICards';
import ProductionEditModal from './components/ProductionEditModal';
import PhotoProofViewer from './components/PhotoProofViewer';

export interface ProductionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: 'Operator' | 'Supervisor' | 'Helper';
  date: string;
  shift: 'Morning' | 'Evening' | 'Night';
  productName: string;
  targetQty: number;
  producedQty: number;
  rejectedQty: number;
  unit: string;
  machineId: string;
  hasPhoto: boolean;
  photoUrl?: string;
  notes?: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  submittedAt: string;
  verifiedBy?: string;
}

const MOCK_RECORDS: ProductionRecord[] = [
{ id: 'prod-001', employeeId: 'EMP-001', employeeName: 'Mohan Lal', role: 'Operator', date: '2026-04-29', shift: 'Morning', productName: 'Steel Bracket A', targetQty: 200, producedQty: 195, rejectedQty: 3, unit: 'pcs', machineId: 'MC-01', hasPhoto: true, photoUrl: "https://images.unsplash.com/photo-1645601474956-7a78d29467f0", notes: 'Minor tool wear noted', status: 'Verified', submittedAt: '05:45 PM', verifiedBy: 'Geeta Sharma' },
{ id: 'prod-002', employeeId: 'EMP-002', employeeName: 'Geeta Sharma', role: 'Supervisor', date: '2026-04-29', shift: 'Morning', productName: 'Bolt Set B', targetQty: 500, producedQty: 512, rejectedQty: 8, unit: 'sets', machineId: 'MC-02', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80', status: 'Verified', submittedAt: '05:50 PM', verifiedBy: 'Geeta Sharma' },
{ id: 'prod-003', employeeId: 'EMP-003', employeeName: 'Rajesh Yadav', role: 'Operator', date: '2026-04-29', shift: 'Morning', productName: 'Steel Bracket A', targetQty: 200, producedQty: 140, rejectedQty: 12, unit: 'pcs', machineId: 'MC-03', hasPhoto: false, notes: 'Machine downtime 2 hrs', status: 'Flagged', submittedAt: '05:55 PM' },
{ id: 'prod-004', employeeId: 'EMP-004', employeeName: 'Sunita Rao', role: 'Operator', date: '2026-04-29', shift: 'Evening', productName: 'Pipe Fitting C', targetQty: 300, producedQty: 298, rejectedQty: 2, unit: 'pcs', machineId: 'MC-01', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', status: 'Pending', submittedAt: '11:30 PM' },
{ id: 'prod-005', employeeId: 'EMP-005', employeeName: 'Arun Mishra', role: 'Helper', date: '2026-04-29', shift: 'Morning', productName: 'Bolt Set B', targetQty: 500, producedQty: 480, rejectedQty: 20, unit: 'sets', machineId: 'MC-04', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', status: 'Pending', submittedAt: '06:10 PM' },
{ id: 'prod-006', employeeId: 'EMP-006', employeeName: 'Deepak Tiwari', role: 'Operator', date: '2026-04-28', shift: 'Morning', productName: 'Pipe Fitting C', targetQty: 300, producedQty: 305, rejectedQty: 5, unit: 'pcs', machineId: 'MC-02', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80', status: 'Verified', submittedAt: '05:40 PM', verifiedBy: 'Ramesh Kumar' },
{ id: 'prod-007', employeeId: 'EMP-007', employeeName: 'Priya Verma', role: 'Supervisor', date: '2026-04-28', shift: 'Evening', productName: 'Steel Bracket A', targetQty: 200, producedQty: 188, rejectedQty: 6, unit: 'pcs', machineId: 'MC-03', hasPhoto: false, notes: 'Shift handover delay', status: 'Verified', submittedAt: '11:55 PM', verifiedBy: 'Ramesh Kumar' },
{ id: 'prod-008', employeeId: 'EMP-008', employeeName: 'Vinod Kumar', role: 'Operator', date: '2026-04-28', shift: 'Night', productName: 'Bolt Set B', targetQty: 500, producedQty: 210, rejectedQty: 15, unit: 'sets', machineId: 'MC-01', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', notes: 'Night shift short staffed', status: 'Flagged', submittedAt: '06:05 AM' },
{ id: 'prod-009', employeeId: 'EMP-009', employeeName: 'Kavita Singh', role: 'Helper', date: '2026-04-28', shift: 'Morning', productName: 'Pipe Fitting C', targetQty: 300, producedQty: 300, rejectedQty: 0, unit: 'pcs', machineId: 'MC-04', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', status: 'Verified', submittedAt: '05:35 PM', verifiedBy: 'Geeta Sharma' },
{ id: 'prod-010', employeeId: 'EMP-010', employeeName: 'Ravi Shankar', role: 'Operator', date: '2026-04-27', shift: 'Morning', productName: 'Steel Bracket A', targetQty: 200, producedQty: 202, rejectedQty: 1, unit: 'pcs', machineId: 'MC-02', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80', status: 'Verified', submittedAt: '05:50 PM', verifiedBy: 'Geeta Sharma' }];


export interface ProductionFilterState {
  dateFrom: string;
  dateTo: string;
  shift: string;
  status: string;
  role: string;
  product: string;
  search: string;
}

export default function OwnerProductionOversightPage() {
  const [records, setRecords] = useState<ProductionRecord[]>(MOCK_RECORDS);
  const [filters, setFilters] = useState<ProductionFilterState>({
    dateFrom: '2026-04-27',
    dateTo: '2026-04-29',
    shift: 'all',
    status: 'all',
    role: 'all',
    product: 'all',
    search: ''
  });
  const [editTarget, setEditTarget] = useState<ProductionRecord | null>(null);
  const [photoTarget, setPhotoTarget] = useState<ProductionRecord | null>(null);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (r.date < filters.dateFrom || r.date > filters.dateTo) return false;
      if (filters.shift !== 'all' && r.shift !== filters.shift) return false;
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.role !== 'all' && r.role !== filters.role) return false;
      if (filters.product !== 'all' && r.productName !== filters.product) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
        !r.employeeName.toLowerCase().includes(q) &&
        !r.employeeId.toLowerCase().includes(q) &&
        !r.productName.toLowerCase().includes(q) &&
        !r.machineId.toLowerCase().includes(q))
        return false;
      }
      return true;
    });
  }, [records, filters]);

  const handleEditSave = (updated: ProductionRecord) => {
    setRecords((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setEditTarget(null);
  };

  const handleVerify = (id: string) => {
    setRecords((prev) =>
    prev.map((r) =>
    r.id === id ? { ...r, status: 'Verified', verifiedBy: 'Ramesh Kumar (Owner)' } : r
    )
    );
  };

  const uniqueProducts = Array.from(new Set(MOCK_RECORDS.map((r) => r.productName)));

  return (
    <OwnerLayout
      title="Production Oversight"
      subtitle="Monitor daily production records, verify entries, and review photo proof">

      <div className="space-y-5">
        <ProductionKPICards records={filtered} />
        <ProductionFilters
          filters={filters}
          onChange={setFilters}
          products={uniqueProducts} />

        <ProductionTable
          records={filtered}
          onEdit={(r) => setEditTarget(r)}
          onViewPhoto={(r) => setPhotoTarget(r)}
          onVerify={handleVerify} />

      </div>

      {editTarget &&
      <ProductionEditModal
        record={editTarget}
        onSave={handleEditSave}
        onClose={() => setEditTarget(null)} />

      }

      {photoTarget &&
      <PhotoProofViewer
        record={photoTarget}
        onClose={() => setPhotoTarget(null)} />

      }
    </OwnerLayout>);

}