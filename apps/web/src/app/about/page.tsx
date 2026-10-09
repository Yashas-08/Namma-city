'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { ChevronLeft, Info, Shield, Layers, Award } from 'lucide-react';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <MobileShell showBottomNav={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/profile')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">About Namma City</h1>

        <div className="w-6" />
      </div>

      <div className="px-5 py-6 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar text-xs">
        <div className="text-center py-4 bg-white rounded-2xl border border-civic-border shadow-civic">
          <h2 className="text-xl font-black text-civic-primary mb-1">Namma City</h2>
          <p className="text-[11px] font-semibold text-civic-text-muted">
            Version 1.0.0 (Unified Municipal Release)
          </p>
          <p className="text-xs text-civic-text mt-2 font-medium px-4">
            One City. One Platform. Multiple Services.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-civic-border p-4 shadow-civic space-y-3">
          <h3 className="font-bold text-civic-text text-xs uppercase tracking-wider">
            Municipal Mission
          </h3>
          <p className="text-civic-text-muted leading-relaxed">
            Namma City unifies municipal grievances, utility bill settlements, certificate requests, and urban navigation into a single, reliable public portal for city residents.
          </p>
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-civic-primary" />
              <span>Civic Teal Design System (Restrained & Accessible)</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-civic-primary" />
              <span>Relational Database Integrity & Audit History</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Award className="w-4 h-4 text-civic-primary" />
              <span>Transparent Public Service Tracking</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 leading-relaxed text-[11px]">
          <strong>Hackathon Transparency Notice:</strong> External utility provider bill fetching and certificate issuance operate in verified sandbox demonstration mode with seeded realistic accounts.
        </div>
      </div>
    </MobileShell>
  );
}
