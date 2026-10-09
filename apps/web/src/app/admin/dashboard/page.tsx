'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ClipboardList,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  UserX,
  TrendingUp,
  Building2,
  ArrowRight,
  RefreshCw,
  FolderOpen,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (e) {
      console.error('Failed to load admin dashboard:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const metrics = data?.metrics || {
    totalComplaints: 0,
    submittedComplaints: 0,
    assignedComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    unassignedComplaints: 0,
    overdueComplaints: 0,
    resolutionRate: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#172322]">
            Bruhat Bengaluru Mahanagara Palike (BBMP)
          </h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Central Grievance Redressal & Operations Management Console
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#DCE4E2] text-xs font-semibold text-[#687674] hover:text-[#172322] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#176B68]' : ''}`} />
            <span>Sync Live DB</span>
          </button>
          <button
            onClick={() => router.push('/admin/complaints')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#125452] shadow-xs transition-colors"
          >
            <span>Manage All Complaints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#687674]">Total Grievances</div>
          <div className="text-2xl font-black text-[#172322] mt-1">{loading ? '...' : metrics.totalComplaints}</div>
          <div className="text-[10px] text-[#687674] mt-0.5">System Wide</div>
        </div>

        {/* Newly Submitted */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">New Submitted</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{loading ? '...' : metrics.submittedComplaints}</div>
          <div className="text-[10px] text-amber-800 mt-0.5">Awaiting triage</div>
        </div>

        {/* Assigned */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#176B68]">Assigned</div>
          <div className="text-2xl font-black text-[#176B68] mt-1">{loading ? '...' : metrics.assignedComplaints}</div>
          <div className="text-[10px] text-[#687674] mt-0.5">Field staff allocated</div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">In Progress</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{loading ? '...' : metrics.inProgressComplaints}</div>
          <div className="text-[10px] text-blue-800 mt-0.5">Ground resolution</div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Resolved</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{loading ? '...' : metrics.resolvedComplaints}</div>
          <div className="text-[10px] text-emerald-800 mt-0.5">{metrics.resolutionRate}% closure rate</div>
        </div>

        {/* Unassigned */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Unassigned</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{loading ? '...' : metrics.unassignedComplaints}</div>
          <div className="text-[10px] text-purple-800 mt-0.5">No staff officer</div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs col-span-2 md:col-span-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Overdue (&gt;48h)</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{loading ? '...' : metrics.overdueComplaints}</div>
          <div className="text-[10px] text-rose-800 mt-0.5">Escalated SLA</div>
        </div>
      </div>

      {/* Two Column Grid: Department Workload & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workload Summary */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172322] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#176B68]" />
                <span>Department Operational Workload</span>
              </h2>
              <p className="text-[11px] text-[#687674]">Staff allocation and pending requests</p>
            </div>
            <button
              onClick={() => router.push('/admin/departments')}
              className="text-xs font-bold text-[#176B68] hover:underline"
            >
              Manage Departments
            </button>
          </div>

          <div className="divide-y divide-[#DCE4E2]">
            {data?.departmentWorkload?.map((dept: any) => (
              <div key={dept.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#172322]">{dept.name}</span>
                  <div className="text-[10px] text-[#687674]">{dept.staffCount} field personnel assigned</div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#176B68]">{dept.requestsCount}</span>
                  <span className="text-[10px] text-[#687674] block">grievances</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172322] flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-[#176B68]" />
                <span>Complaints by Civic Category</span>
              </h2>
              <p className="text-[11px] text-[#687674]">Public grievance distribution across city domains</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.categoryDistribution?.map((cat: any) => {
              const total = metrics.totalComplaints || 1;
              const pct = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#172322]">{cat.name}</span>
                    <span className="text-[#687674] font-medium">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F7F9F8] rounded-full overflow-hidden border border-[#DCE4E2]">
                    <div
                      className="h-full bg-[#176B68] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Grievances Requiring Action */}
      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-[#DCE4E2]">
          <div>
            <h2 className="text-sm font-bold text-[#172322]">Recent Civic Grievances</h2>
            <p className="text-[11px] text-[#687674]">Real-time citizen submissions requiring municipal review</p>
          </div>
          <button
            onClick={() => router.push('/admin/complaints')}
            className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#DCE4E2]">
          {data?.recentComplaints?.map((req: any) => (
            <div
              key={req.id}
              onClick={() => router.push(`/admin/complaints/${req.id}`)}
              className="p-4 sm:px-6 hover:bg-[#F7F9F8] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-[#176B68]">{req.publicRequestId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2]">
                    {req.categoryName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <div className="font-bold text-[#172322]">{req.title}</div>
                <div className="flex items-center gap-3 text-[11px] text-[#687674]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#176B68]" />
                    <span>{req.address}</span>
                  </span>
                  <span>Citizen: {req.citizen?.name}</span>
                  <span>Assigned: {req.assignedStaff?.name || 'Unassigned'}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/complaints/${req.id}`);
                }}
                className="px-3.5 py-1.5 bg-white border border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 rounded-xl font-bold text-xs"
              >
                Inspect & Assign
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
