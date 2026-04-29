'use client';
import React, { useState, useMemo } from 'react';
import OwnerLayout from '@/components/OwnerLayout';
import StockKPICards from './components/StockKPICards';
import StockFilters from './components/StockFilters';
import StockTable from './components/StockTable';
import StockAdjustmentModal from './components/StockAdjustmentModal';

export interface StockItem {
  id: string;
  sku: string;
  itemName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  lastUpdated: string;
  lastMovement?: {
    type: 'IN' | 'OUT' | 'ADJUST';
    qty: number;
    reason: string;
    date: string;
  };
}

export interface StockAdjustment {
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  qty: number;
  reason: string;
  adjustedBy: string;
  date: string;
}

export interface StockFilterState {
  dateFrom: string;
  dateTo: string;
  category: string;
  status: string;
  movement: string;
  search: string;
}

const MOCK_STOCK: StockItem[] = [
  { id: 'stk-001', sku: 'RM-STA-001', itemName: 'Steel Bracket A', category: 'Raw Material', currentStock: 1240, reorderLevel: 500, maxStock: 3000, unit: 'pcs', unitCost: 45, lastUpdated: '2026-04-29', lastMovement: { type: 'IN', qty: 200, reason: 'Purchase received', date: '2026-04-29' } },
  { id: 'stk-002', sku: 'RM-BSB-002', itemName: 'Bolt Set B', category: 'Raw Material', currentStock: 320, reorderLevel: 400, maxStock: 2000, unit: 'sets', unitCost: 120, lastUpdated: '2026-04-29', lastMovement: { type: 'OUT', qty: 80, reason: 'Issued to production', date: '2026-04-29' } },
  { id: 'stk-003', sku: 'RM-PFC-003', itemName: 'Pipe Fitting C', category: 'Raw Material', currentStock: 0, reorderLevel: 200, maxStock: 1500, unit: 'pcs', unitCost: 85, lastUpdated: '2026-04-28', lastMovement: { type: 'OUT', qty: 150, reason: 'Dispatched to customer', date: '2026-04-28' } },
  { id: 'stk-004', sku: 'FG-SBA-004', itemName: 'Steel Bracket Assembly', category: 'Finished Goods', currentStock: 560, reorderLevel: 100, maxStock: 1000, unit: 'units', unitCost: 280, lastUpdated: '2026-04-29', lastMovement: { type: 'IN', qty: 195, reason: 'Return from production', date: '2026-04-29' } },
  { id: 'stk-005', sku: 'PKG-BOX-005', itemName: 'Packaging Box (Large)', category: 'Packaging', currentStock: 85, reorderLevel: 100, maxStock: 500, unit: 'pcs', unitCost: 18, lastUpdated: '2026-04-28', lastMovement: { type: 'OUT', qty: 40, reason: 'Dispatched to customer', date: '2026-04-28' } },
  { id: 'stk-006', sku: 'CON-OIL-006', itemName: 'Machine Oil (5L)', category: 'Consumables', currentStock: 24, reorderLevel: 20, maxStock: 100, unit: 'cans', unitCost: 650, lastUpdated: '2026-04-27', lastMovement: { type: 'IN', qty: 10, reason: 'Purchase received', date: '2026-04-27' } },
  { id: 'stk-007', sku: 'RM-ALR-007', itemName: 'Aluminium Rod 6mm', category: 'Raw Material', currentStock: 2100, reorderLevel: 800, maxStock: 5000, unit: 'kg', unitCost: 210, lastUpdated: '2026-04-29', lastMovement: { type: 'ADJUST', qty: -50, reason: 'Physical count correction', date: '2026-04-29' } },
  { id: 'stk-008', sku: 'FG-PFA-008', itemName: 'Pipe Fitting Assembly', category: 'Finished Goods', currentStock: 180, reorderLevel: 50, maxStock: 400, unit: 'units', unitCost: 420, lastUpdated: '2026-04-28', lastMovement: { type: 'IN', qty: 298, reason: 'Return from production', date: '2026-04-28' } },
  { id: 'stk-009', sku: 'PKG-TPA-009', itemName: 'Tape & Packing Material', category: 'Packaging', currentStock: 12, reorderLevel: 30, maxStock: 200, unit: 'rolls', unitCost: 95, lastUpdated: '2026-04-27', lastMovement: { type: 'OUT', qty: 20, reason: 'Issued to dispatch', date: '2026-04-27' } },
  { id: 'stk-010', sku: 'CON-GLV-010', itemName: 'Safety Gloves (Pair)', category: 'Consumables', currentStock: 48, reorderLevel: 30, maxStock: 150, unit: 'pairs', unitCost: 75, lastUpdated: '2026-04-29', lastMovement: { type: 'IN', qty: 24, reason: 'Purchase received', date: '2026-04-29' } },
  { id: 'stk-011', sku: 'RM-CPS-011', itemName: 'Copper Sheet 1mm', category: 'Raw Material', currentStock: 380, reorderLevel: 150, maxStock: 1000, unit: 'sheets', unitCost: 340, lastUpdated: '2026-04-28', lastMovement: { type: 'OUT', qty: 60, reason: 'Issued to production', date: '2026-04-28' } },
  { id: 'stk-012', sku: 'FG-BSA-012', itemName: 'Bolt Set Assembly', category: 'Finished Goods', currentStock: 720, reorderLevel: 200, maxStock: 1500, unit: 'sets', unitCost: 195, lastUpdated: '2026-04-29', lastMovement: { type: 'IN', qty: 512, reason: 'Return from production', date: '2026-04-29' } },
];

export default function OwnerStockOversightPage() {
  const [items, setItems] = useState<StockItem[]>(MOCK_STOCK);
  const [filters, setFilters] = useState<StockFilterState>({
    dateFrom: '2026-04-27',
    dateTo: '2026-04-29',
    category: 'all',
    status: 'all',
    movement: 'all',
    search: '',
  });
  const [adjustTarget, setAdjustTarget] = useState<StockItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (item.lastUpdated < filters.dateFrom || item.lastUpdated > filters.dateTo) return false;
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.status !== 'all') {
        const isOut = item.currentStock === 0;
        const isLow = !isOut && item.currentStock <= item.reorderLevel;
        const isHealthy = !isOut && !isLow;
        if (filters.status === 'Out of Stock' && !isOut) return false;
        if (filters.status === 'Low Stock' && !isLow) return false;
        if (filters.status === 'Healthy' && !isHealthy) return false;
      }
      if (filters.movement !== 'all' && item.lastMovement?.type !== filters.movement) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !item.itemName.toLowerCase().includes(q) &&
          !item.sku.toLowerCase().includes(q) &&
          !item.category.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [items, filters]);

  const handleAdjustSave = (adjustment: StockAdjustment) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== adjustment.itemId) return item;
        const newStock =
          adjustment.type === 'IN'
            ? item.currentStock + adjustment.qty
            : adjustment.type === 'OUT'
            ? item.currentStock - adjustment.qty
            : item.currentStock + adjustment.qty;
        return {
          ...item,
          currentStock: Math.max(0, newStock),
          lastUpdated: adjustment.date,
          lastMovement: {
            type: adjustment.type,
            qty: adjustment.qty,
            reason: adjustment.reason,
            date: adjustment.date,
          },
        };
      })
    );
    setAdjustTarget(null);
  };

  const categories = Array.from(new Set(MOCK_STOCK.map((i) => i.category)));

  return (
    <OwnerLayout
      title="Stock Oversight"
      subtitle="Monitor inventory levels, track stock movements, and adjust quantities with reason tracking"
    >
      <div className="space-y-5">
        <StockKPICards items={filtered} />
        <StockFilters filters={filters} onChange={setFilters} categories={categories} />
        <StockTable items={filtered} onAdjust={(item) => setAdjustTarget(item)} />
      </div>

      {adjustTarget && (
        <StockAdjustmentModal
          item={adjustTarget}
          onSave={handleAdjustSave}
          onClose={() => setAdjustTarget(null)}
        />
      )}
    </OwnerLayout>
  );
}
