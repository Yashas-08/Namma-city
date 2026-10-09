'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: ('CITIZEN' | 'STAFF' | 'ADMIN')[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, loading, switchRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-civic-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-civic-primary/20 border-t-civic-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-civic-text-muted">Verifying authorization credentials...</p>
      </div>
    );
  }

  const isAuthorized = user && allowedRoles.includes(user.role);

  if (!isAuthorized) {
    const defaultDashboard =
      user?.role === 'ADMIN'
        ? '/admin/dashboard'
        : user?.role === 'STAFF'
        ? '/staff/dashboard'
        : '/home';

    return (
      <div className="min-h-screen bg-civic-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-civic-text mb-2">Access Denied (HTTP 403)</h1>
        <p className="text-sm text-civic-text-muted max-w-md mb-6 leading-relaxed">
          You are currently signed in as <span className="font-semibold text-civic-text">{user?.role || 'Guest'}</span> ({user?.name || 'Unknown'}). This portal is restricted to authorized {allowedRoles.join(' or ')} personnel only.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={defaultDashboard}
            className="w-full sm:w-auto px-5 py-2.5 bg-civic-primary text-white rounded-xl font-semibold text-sm hover:bg-civic-primary-dark transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Return to Your Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          {allowedRoles.length > 0 && (
            <button
              onClick={() => switchRole(allowedRoles[0])}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-civic-border text-civic-text rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
            >
              Switch Role to {allowedRoles[0]} (Demo)
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
