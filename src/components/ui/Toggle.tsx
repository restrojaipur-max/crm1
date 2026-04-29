'use client';
import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          checked ? 'bg-blue-700' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </label>
  );
}