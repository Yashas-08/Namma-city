'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { ChevronLeft, Search, Bus, Clock, MapPin } from 'lucide-react';

export default function TransportScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      setLoading(true);
      try {
        const data = await api.getTransitRoutes(query);
        setRoutes(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    const t = setTimeout(fetchRoutes, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <MobileShell showBottomNav={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/services')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Transport & Transit</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-civic-text-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BMTC route #, metro line, or stop..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-civic-border rounded-xl text-xs text-civic-text focus:outline-none focus:border-civic-primary"
          />
        </div>

        {/* Routes List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-civic-border animate-pulse" />
              ))}
            </div>
          ) : routes.length === 0 ? (
            <div className="py-16 text-center text-xs text-civic-text-muted">
              No transit routes found matching your query.
            </div>
          ) : (
            routes.map((r, i) => (
              <div
                key={i}
                className="bg-white border border-civic-border rounded-2xl p-3.5 shadow-civic space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs">
                      {r.routeNumber}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {r.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {r.frequency}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="font-bold text-civic-text flex items-center gap-1.5">
                    <span>{r.from}</span>
                    <span className="text-civic-primary">➔</span>
                    <span>{r.to}</span>
                  </div>
                  <p className="text-[11px] text-civic-text-muted mt-0.5">
                    Via: {r.via}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-civic-primary" />
                    <span>First: {r.firstBus}</span>
                  </span>
                  <span>Last: {r.lastBus}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileShell>
  );
}
