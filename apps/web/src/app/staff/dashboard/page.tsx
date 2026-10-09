'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getStaffDashboard();
      setData(res);
    } catch (e) {
      console.error('Failed to load staff dashboard:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const stats = data?.stats || {
    totalAssigned: 0,
    pendingCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    overdueCount: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Greeting & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">
            Operations Console — {data?.staffInfo?.name || 'Officer Ramesh'}
          </h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Department: <span className="font-semibold text-[#176B68]">{data?.staffInfo?.departmentName}</span> • Area:{' '}
            <span className="font-semibold">{data?.staffInfo?.assignedArea}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F9F8] border border-[#DCE4E2] text-xs font-semibold text-[#687674] hover:text-[#172322] hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#176B68]' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => router.push('/staff/work-queue')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#125452] shadow-xs transition-colors"
          >
            <span>Open Work Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real Computed KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Active Assigned */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#687674] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Assigned</span>
            <ClipboardList className="w-4 h-4 text-[#176B68]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#172322]">{loading ? '...' : stats.totalAssigned}</div>
            <p className="text-[10px] text-[#687674] mt-0.5">Assigned to you or dept</p>
          </div>
        </div>

        {/* Pending Acceptance */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Accept</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#172322]">{loading ? '...' : stats.pendingCount}</div>
            <p className="text-[10px] text-amber-700 mt-0.5">Requires acknowledgment</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <PlayCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#172322]">{loading ? '...' : stats.inProgressCount}</div>
            <p className="text-[10px] text-blue-700 mt-0.5">Active field resolution</p>
          </div>
        </div>

        {/* Completed / Resolved */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#172322]">{loading ? '...' : stats.resolvedCount}</div>
            <p className="text-[10px] text-emerald-700 mt-0.5">Successfully verified</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overdue (&gt;48h)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">{loading ? '...' : stats.overdueCount}</div>
            <p className="text-[10px] text-rose-700 mt-0.5">Exceeds standard SLA</p>
          </div>
        </div>
      </div>

      {/* Recent Assigned Issues List */}
      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-[#DCE4E2]">
          <div>
            <h2 className="text-sm font-bold text-[#172322]">Priority Field Assignments</h2>
            <p className="text-[11px] text-[#687674]">Recent grievances requiring investigation or resolution</p>
          </div>
          <button
            onClick={() => router.push('/staff/assigned')}
            className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1"
          >
            <span>View All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#687674]">Loading assignments from municipal database...</div>
        ) : !data?.recentRequests || data.recentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#172322]">No pending assignments</p>
            <p className="text-xs text-[#687674]">All grievances in your queue are resolved.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE4E2]">
            {data.recentRequests.map((req: any) => {
              const isUrgent = req.priority === 'URGENT' || req.priority === 'HIGH';
              return (
                <div
                  key={req.id}
                  onClick={() => router.push(`/staff/requests/${req.id}`)}
                  className="p-4 sm:px-6 hover:bg-[#F7F9F8] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    {req.attachments?.[0]?.fileUrl ? (
                      <img
                        src={req.attachments[0].fileUrl}
                        alt="Issue"
                        className="w-14 h-14 rounded-xl object-cover border border-[#DCE4E2] shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-[#687674] border border-[#DCE4E2] shrink-0">
                        <AlertCircle className="w-5 h-5 text-[#176B68]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-black text-[#176B68]">{req.publicRequestId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2] text-[#172322]">
                          {req.categoryName}
                        </span>
                        {isUrgent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {req.priority}
                          </span>
                        )}
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

                      <h3 className="text-xs font-bold text-[#172322] line-clamp-1">{req.title}</h3>

                      <div className="flex items-center gap-4 text-[11px] text-[#687674] mt-1">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-[#176B68] shrink-0" />
                          <span className="truncate">{req.address}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-[#687674]" />
                          <span>{new Date(req.createdAt).toLocaleDateString('en-GB')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/staff/requests/${req.id}`);
                      }}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white border border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 text-xs font-bold transition-colors"
                    >
                      Process Issue
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
