'use client';
import React, { useState } from 'react';
import { ClipboardEdit, Truck, Camera, Plus, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ActiveForm = 'production' | 'dispatch' | null;

interface ProductionFormData {
  machine: string;
  product: string;
  units: string;
  remarks: string;
}

interface DispatchFormData {
  customer: string;
  items: string;
  vehicle: string;
  driver: string;
}

// Employee role — dispatch only if assigned
const employeeRole = { canDispatch: true };

export default function QuickEntryButtons() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prodForm = useForm<ProductionFormData>();
  const dispForm = useForm<DispatchFormData>();

  const handleProductionSubmit = async (data: ProductionFormData) => {
    setIsSubmitting(true);
    // Backend integration: POST /api/production/entry with { employeeId, machineId, productId, units, photo, timestamp }
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setActiveForm(null);
    prodForm.reset();
    toast.success(`Production entry submitted — ${data.units} units on ${data.machine}`);
  };

  const handleDispatchSubmit = async (data: DispatchFormData) => {
    setIsSubmitting(true);
    // Backend integration: POST /api/dispatch/entry with { employeeId, customerId, items, vehicleNo, driverName, photo, timestamp }
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setActiveForm(null);
    dispForm.reset();
    toast.success(`Dispatch entry submitted — awaiting owner approval`);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quick Entry</p>

      {/* Buttons row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveForm(activeForm === 'production' ? null : 'production')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 ${
            activeForm === 'production' ?'bg-blue-700 text-white shadow-lg' :'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          <ClipboardEdit size={20} />
          Add Production
        </button>

        <button
          onClick={() => {
            if (!employeeRole.canDispatch) {
              toast.error('Dispatch entry is only available for dispatch-assigned workers');
              return;
            }
            setActiveForm(activeForm === 'dispatch' ? null : 'dispatch');
          }}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 ${
            !employeeRole.canDispatch
              ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
              : activeForm === 'dispatch' ?'bg-purple-700 text-white shadow-lg' :'bg-white text-purple-700 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300'
          }`}
        >
          <Truck size={20} />
          Add Dispatch
        </button>
      </div>

      {/* Photo upload */}
      <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white text-amber-700 border-2 border-amber-200 font-semibold text-sm hover:bg-amber-50 active:scale-95 transition-all duration-200">
        <Camera size={18} />
        Upload Photo Proof
      </button>

      {/* Production form */}
      {activeForm === 'production' && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-card-hover p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <ClipboardEdit size={16} className="text-blue-600" />
              New Production Entry
            </h4>
            <button onClick={() => setActiveForm(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={prodForm.handleSubmit(handleProductionSubmit)} className="space-y-3.5">
            <div>
              <label htmlFor="machine" className="label-text text-xs">Machine / Loom Number</label>
              <select
                id="machine"
                className="input-field text-sm"
                {...prodForm.register('machine', { required: 'Select a machine' })}
              >
                <option value="">Select machine...</option>
                <option value="M-01 (Loom #1)">M-01 (Loom #1)</option>
                <option value="M-02 (Loom #2)">M-02 (Loom #2)</option>
                <option value="M-07 (Loom #7)">M-07 (Loom #7)</option>
                <option value="M-12 (Loom #12)">M-12 (Loom #12)</option>
                <option value="Spinning-03">Spinning-03</option>
              </select>
              {prodForm.formState.errors.machine && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {prodForm.formState.errors.machine.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product" className="label-text text-xs">Product Type</label>
              <select
                id="product"
                className="input-field text-sm"
                {...prodForm.register('product', { required: 'Select a product' })}
              >
                <option value="">Select product...</option>
                <option value="Grey Fabric (40s)">Grey Fabric (40s)</option>
                <option value="Polyester Blend (150D)">Polyester Blend (150D)</option>
                <option value="Cotton Yarn (2/40s)">Cotton Yarn (2/40s)</option>
                <option value="Dyed Fabric">Dyed Fabric</option>
              </select>
              {prodForm.formState.errors.product && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {prodForm.formState.errors.product.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="units" className="label-text text-xs">Units Produced</label>
              <p className="text-[11px] text-slate-400 mb-1.5">Count of fabric meters / yarn kg / pieces completed</p>
              <input
                id="units"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 240"
                className="input-field text-sm"
                {...prodForm.register('units', {
                  required: 'Enter units produced',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 9999, message: 'Seems too high — double check' },
                })}
              />
              {prodForm.formState.errors.units && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {prodForm.formState.errors.units.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="remarks" className="label-text text-xs">Remarks (optional)</label>
              <textarea
                id="remarks"
                rows={2}
                placeholder="Any issues, downtime, or notes..."
                className="input-field text-sm resize-none"
                {...prodForm.register('remarks')}
              />
            </div>

            {/* Photo required */}
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <Camera size={15} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Photo proof required — tap to upload</p>
              <button type="button" className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1">
                <Plus size={11} /> Upload
              </button>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 flex-1 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm hover:bg-blue-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dispatch form */}
      {activeForm === 'dispatch' && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-card-hover p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Truck size={16} className="text-purple-600" />
              New Dispatch Entry
            </h4>
            <button onClick={() => setActiveForm(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={dispForm.handleSubmit(handleDispatchSubmit)} className="space-y-3.5">
            <div>
              <label htmlFor="customer" className="label-text text-xs">Customer / Party Name</label>
              <select
                id="customer"
                className="input-field text-sm"
                {...dispForm.register('customer', { required: 'Select a customer' })}
              >
                <option value="">Select customer...</option>
                <option value="Sharma Garments, Surat">Sharma Garments, Surat</option>
                <option value="Krishna Fabrics, Ahmedabad">Krishna Fabrics, Ahmedabad</option>
                <option value="Patel Textiles, Vadodara">Patel Textiles, Vadodara</option>
                <option value="Mehta Exports, Mumbai">Mehta Exports, Mumbai</option>
              </select>
              {dispForm.formState.errors.customer && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {dispForm.formState.errors.customer.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="items" className="label-text text-xs">Items / Quantity</label>
              <p className="text-[11px] text-slate-400 mb-1.5">e.g. 12 bales grey fabric, 40s count</p>
              <input
                id="items"
                type="text"
                placeholder="e.g. 12 bales Grey Fabric (40s)"
                className="input-field text-sm"
                {...dispForm.register('items', { required: 'Describe items being dispatched' })}
              />
              {dispForm.formState.errors.items && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {dispForm.formState.errors.items.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="vehicle" className="label-text text-xs">Vehicle Number</label>
              <input
                id="vehicle"
                type="text"
                placeholder="e.g. GJ-05-AB-1234"
                className="input-field text-sm"
                {...dispForm.register('vehicle', { required: 'Enter vehicle number' })}
              />
              {dispForm.formState.errors.vehicle && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {dispForm.formState.errors.vehicle.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="driver" className="label-text text-xs">Driver Name</label>
              <input
                id="driver"
                type="text"
                placeholder="e.g. Ramu Singh"
                className="input-field text-sm"
                {...dispForm.register('driver', { required: 'Enter driver name' })}
              />
              {dispForm.formState.errors.driver && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {dispForm.formState.errors.driver.message}
                </p>
              )}
            </div>

            {/* Photo required */}
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <Camera size={15} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Loading photo required — tap to upload</p>
              <button type="button" className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1">
                <Plus size={11} /> Upload
              </button>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-purple-700 text-white font-bold text-sm hover:bg-purple-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {isSubmitting ? 'Submitting...' : 'Submit Dispatch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}