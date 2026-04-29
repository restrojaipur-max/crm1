'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Copy, Check, Factory, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type Role = 'owner' | 'employee';

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

// Backend integration: POST /api/auth/login with { email, password, role }
const mockCredentials: Record<Role, { email: string; password: string; label: string }> = {
  owner: { email: 'ramesh.kumar@factoryops.in', password: 'Owner@2026', label: 'Factory Owner' },
  employee: { email: 'suresh.patel@factoryops.in', password: 'Worker@2026', label: 'Floor Worker' },
};

const roleRoutes: Record<Role, string> = {
  owner: '/owner-dashboard',
  employee: '/employee-work-entry-home',
};

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { remember: false } });

  const handleCopy = async (field: 'email' | 'password', value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const autofill = (r: Role) => {
    setValue('email', mockCredentials[r].email);
    setValue('password', mockCredentials[r].password);
    setRole(r);
    setAuthError('');
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAuthError('');
    // Backend integration: replace with real API call
    await new Promise((res) => setTimeout(res, 1200));
    const cred = mockCredentials[role];
    if (data.email === cred.email && data.password === cred.password) {
      toast.success(`Welcome back! Redirecting to ${role === 'owner' ? 'Owner Dashboard' : 'Work Entry'}...`);
      setTimeout(() => router.push(roleRoutes[role]), 600);
    } else {
      setAuthError('Invalid credentials — use the demo accounts below to sign in');
      setIsLoading(false);
    }
  };

  const cred = mockCredentials[role];

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute top-40 left-40 w-40 h-40 rounded-full border border-white" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full border-2 border-white" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={44} />
            <span className="text-white font-bold text-2xl tracking-tight">FactoryOps</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your factory,<br />
            <span className="text-amber-400">fully in control.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md">
            Track attendance, production, stock, and dispatch — all in one place. From the factory floor to the owner&apos;s desk.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Workers Tracked', value: '240+' },
            { label: 'Daily Entries', value: '1,800+' },
            { label: 'Factories', value: '12' },
          ].map((stat) => (
            <div key={`stat-${stat.label}`} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-2xl font-bold text-white tabular">{stat.value}</p>
              <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div className="relative z-10 mt-6 space-y-2">
          {[
            'Real-time attendance with photo proof',
            'Production vs target tracking',
            'Stock alerts before they block output',
            'Dispatch confirmation with delivery photos',
          ].map((feat) => (
            <div key={`feat-${feat.slice(0, 20)}`} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <p className="text-blue-100 text-sm">{feat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={36} />
            <span className="font-bold text-slate-900 text-xl">FactoryOps</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Select your role and enter your credentials</p>
          </div>

          {/* Role tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
            {(['owner', 'employee'] as Role[]).map((r) => (
              <button
                key={`role-tab-${r}`}
                type="button"
                onClick={() => { setRole(r); setAuthError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === r
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r === 'owner' ? <Shield size={15} /> : <Factory size={15} />}
                {r === 'owner' ? 'Owner' : 'Employee'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label-text">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={role === 'owner' ? 'owner@yourfactory.in' : 'worker@yourfactory.in'}
                className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  {...register('remember')}
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-700 font-medium hover:text-blue-800 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Auth error */}
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3 text-base"
              style={{ minHeight: '48px' }}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /><span>Signing in...</span></>
              ) : (
                <><span>Sign in as {role === 'owner' ? 'Owner' : 'Employee'}</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Demo Accounts — Click to autofill</p>
            </div>
            <div className="p-4 space-y-3">
              {(['owner', 'employee'] as Role[]).map((r) => {
                const c = mockCredentials[r];
                return (
                  <div
                    key={`cred-${r}`}
                    className={`rounded-lg border p-3 transition-all cursor-pointer ${
                      role === r ? 'border-blue-200 bg-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                    onClick={() => autofill(r)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {r === 'owner' ? <Shield size={13} className="text-blue-600" /> : <Factory size={13} className="text-slate-500" />}
                        <span className="text-xs font-bold text-slate-700">{c.label}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${r === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-medium w-14 shrink-0">Email</span>
                        <span className="text-[11px] text-slate-700 font-mono flex-1 truncate">{c.email}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCopy('email', c.email); }}
                          className="text-slate-300 hover:text-slate-600 transition-colors shrink-0"
                          aria-label="Copy email"
                        >
                          {copiedField === 'email' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-medium w-14 shrink-0">Password</span>
                        <span className="text-[11px] text-slate-700 font-mono flex-1">{c.password}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCopy('password', c.password); }}
                          className="text-slate-300 hover:text-slate-600 transition-colors shrink-0"
                          aria-label="Copy password"
                        >
                          {copiedField === 'password' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to FactoryOps{' '}
            <button className="text-blue-600 hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-blue-600 hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}