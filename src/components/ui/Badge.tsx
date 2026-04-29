import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 border border-green-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
  purple: 'bg-purple-500',
};

export default function Badge({ variant, children, className = '', dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
}