'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  History,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  FileText,
} from 'lucide-react';

export default function StaffHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStaffHistory();
        setHistory(res || []);
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#176B68]" />
          <h1 className="text-xl font-extrabold text-[#172322]">Work History & Completed Grievances</h1>
        </div>
        <p className="text-xs text-[#687674] mt-0.5">
          Audited log of complaints resolved by you with verified resolution notes and citizen feedback
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#687674]">Loading completed work history...</div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-10 h-10 text-[#687674] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172322]">No completed records yet</h3>
            <p className="text-xs text-[#687674]">Resolved grievances will appear here with verification notes.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE4E2]">
            {history.map((req) => (
              <div
                key={req.id}
                onClick={() => router.push(`/staff/requests/${req.id}`)}
                className="p-5 hover:bg-[#F7F9F8] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black text-[#176B68]">{req.publicRequestId}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2]">
                        {req.categoryName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Resolved
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#172322]">{req.title}</h3>
                    {req.resolutionNote && (
                      <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 mt-1.5">
                        Resolution: {req.resolutionNote}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-[#687674] mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#176B68]" />
                        <span>{req.address}</span>
                      </span>
                      {req.resolvedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#687674]" />
                          <span>Resolved on {new Date(req.resolvedAt).toLocaleDateString('en-GB')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/staff/requests/${req.id}`);
                  }}
                  className="px-3.5 py-1.5 border border-[#DCE4E2] text-[#172322] hover:bg-slate-50 text-xs font-semibold rounded-xl shrink-0"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
