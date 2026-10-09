'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Flame,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';

export default function StaffWorkQueuePage() {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStaffWorkQueue();
        setQueue(res || []);
      } catch (e) {
        console.error('Failed to load work queue:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h1 className="text-xl font-extrabold text-[#172322]">Priority Work Queue</h1>
          </div>
          <p className="text-xs text-[#687674] mt-0.5">
            Active and urgent tasks sorted by SLA urgency and priority
          </p>
        </div>
        <div className="text-xs font-bold text-[#176B68] bg-[#176B68]/10 px-3 py-1.5 rounded-xl w-fit">
          {queue.length} Active Tasks In Queue
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#687674]">Loading prioritized queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172322]">Queue is clear</h3>
            <p className="text-xs text-[#687674]">All urgent work has been executed.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE4E2]">
            {queue.map((req, idx) => (
              <div
                key={req.id}
                onClick={() => router.push(`/staff/requests/${req.id}`)}
                className="p-5 hover:bg-[#F7F9F8] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#176B68]/10 text-[#176B68] flex items-center justify-center font-black text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black text-[#176B68]">{req.publicRequestId}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2]">
                        {req.categoryName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {req.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {req.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#172322]">{req.title}</h3>
                    <p className="text-xs text-[#687674] line-clamp-1 mt-0.5">{req.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-[#687674] mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#176B68]" />
                        <span>{req.address}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/staff/requests/${req.id}`);
                  }}
                  className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Execute</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
