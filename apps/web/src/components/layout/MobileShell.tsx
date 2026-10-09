'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, UserCheck, User, ExternalLink } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function MobileShell({
  children,
  showBottomNav = true,
  className = '',
}: MobileShellProps) {
  const { user, switchRole } = useAuth();

  const router = useRouter();

  const handleRoleSwitch = async (role: 'CITIZEN' | 'STAFF' | 'ADMIN') => {
    await switchRole(role);
    if (role === 'CITIZEN') router.push('/home');
    else if (role === 'STAFF') router.push('/staff/dashboard');
    else if (role === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#E5E9E8] flex flex-col items-center justify-start sm:py-6 text-civic-text font-sans">
      {/* Top Demo Bar for Hackathon Reviewers (Desktop Only) */}
      <aside aria-label="Demo Bar" className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-3 py-1.5 bg-white/90 backdrop-blur border border-civic-border rounded-xl shadow-sm text-xs">
        <div className="flex items-center gap-1.5 font-medium text-civic-text">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-civic-text-muted">Preview:</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleRoleSwitch('CITIZEN')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              user?.role === 'CITIZEN'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-text-muted hover:text-civic-text'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => handleRoleSwitch('STAFF')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              user?.role === 'STAFF'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-text-muted hover:text-civic-text'
            }`}
          >
            Staff
          </button>
          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              user?.role === 'ADMIN'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-text-muted hover:text-civic-text'
            }`}
          >
            Admin
          </button>
        </div>
        <Link
          href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/staff/dashboard'}
          className="text-civic-primary font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
        >
          {user?.role === 'ADMIN' ? 'Console' : 'Staff Portal'}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </aside>

      {/* Mobile Device Frame */}
      <main className="w-full sm:max-w-[400px] h-[100dvh] sm:h-[844px] bg-civic-bg sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-[#1E2928] flex flex-col overflow-hidden relative">
        {/* Dynamic Island / Speaker notch on desktop frame */}
        <div className="hidden sm:flex justify-center pt-2">
          <div className="w-24 h-4 bg-[#1E2928] rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111918] mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#172322]" />
          </div>
        </div>

        {/* Top Status Bar */}
        <StatusBar />

        {/* Scrollable Screen Content */}
        <div className={`flex-1 overflow-y-auto no-scrollbar relative flex flex-col ${className}`}>
          {children}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}

        {/* Home Indicator line on bottom */}
        <div className="w-full flex justify-center py-1.5 bg-white select-none pointer-events-none">
          <div className="w-32 h-1 bg-civic-text/20 rounded-full" />
        </div>
      </main>
    </div>
  );
}
