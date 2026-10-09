'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Layers,
  Power,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const res = await api.getAdminServices();
      setServices(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleToggleEnable = async (svc: any) => {
    try {
      await api.updateAdminService(svc.id, { enabled: !svc.enabled });
      await loadServices();
    } catch (e: any) {
      alert(e.message || 'Failed to update service status');
    }
  };

  const handleModeChange = async (svc: any, mode: string) => {
    try {
      await api.updateAdminService(svc.id, { integrationMode: mode });
      await loadServices();
    } catch (e: any) {
      alert(e.message || 'Failed to change integration mode');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">Unified Civic Services Catalog</h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Configure citizen-facing portal modules, live gateway endpoints, and sandbox simulators
          </p>
        </div>
        <div className="text-xs font-bold text-[#176B68] bg-[#176B68]/10 px-3 py-1.5 rounded-xl w-fit">
          {services.length} Configured Services
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center text-xs text-[#687674]">
            Loading civic service catalog...
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                svc.enabled ? 'border-[#DCE4E2]' : 'border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#687674] uppercase tracking-wider">
                    {svc.category?.name || 'General'}
                  </span>
                  <button
                    onClick={() => handleToggleEnable(svc)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      svc.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{svc.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#172322]">{svc.name}</h3>
                <p className="text-xs text-[#687674] mt-1 line-clamp-2">{svc.description}</p>
              </div>

              <div className="pt-3 border-t border-[#DCE4E2] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#687674]">Integration Mode:</span>
                  <select
                    value={svc.integrationMode}
                    onChange={(e) => handleModeChange(svc, e.target.value)}
                    className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-0.5 text-[11px] font-bold text-[#176B68] focus:outline-none"
                  >
                    <option value="DEMO">DEMO (Simulator)</option>
                    <option value="SANDBOX">SANDBOX (Staging)</option>
                    <option value="LIVE">LIVE (Gateway)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#687674]">
                  <span>Slug:</span>
                  <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-[#172322]">
                    /{svc.slug}
                  </code>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
