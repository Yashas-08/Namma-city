'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { MapPin, Calendar, Plus, RefreshCw } from 'lucide-react';

export default function MyRequestsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'resolved'>('all');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      try {
        const data = await api.getRequests(activeTab);
        setRequests(data || []);
      } catch (e) {
        console.error('Failed to load requests:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [activeTab]);

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#287A50] border border-[#D0E7DA]">
          Resolved
        </span>
      );
    }
    if (status === 'IN_PROGRESS' || status === 'ASSIGNED' || status === 'SUBMITTED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF5EC] text-[#A66A25] border border-[#F6E1C7]">
          In Progress
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
        {status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Oct 5, 2026';
    }
  };

  return (
    <MobileShell showBottomNav={true}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <h1 className="text-base font-bold text-civic-text">My Requests</h1>
        <Link
          href="/report"
          className="text-xs font-bold text-civic-primary hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Filter Tabs (Matching Screen 9) */}
      <div className="px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-civic-primary text-white shadow-xs'
              : 'bg-white border border-[#E0E7E5] text-civic-text-muted hover:text-civic-text'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('in-progress')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'in-progress'
              ? 'bg-civic-primary text-white shadow-xs'
              : 'bg-white border border-[#E0E7E5] text-civic-text-muted hover:text-civic-text'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'resolved'
              ? 'bg-civic-primary text-white shadow-xs'
              : 'bg-white border border-[#E0E7E5] text-civic-text-muted hover:text-civic-text'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Requests List */}
      <div className="px-4 pb-6 flex-1 flex flex-col gap-3">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-civic-border animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-civic-text-muted text-xs flex flex-col items-center gap-2">
            <p>No civic requests found in this category.</p>
            <Link
              href="/report"
              className="mt-2 px-4 py-2 bg-civic-primary text-white rounded-xl font-bold text-xs"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          requests.map((req) => (
            <Link
              key={req.id}
              href={`/requests/${req.id}`}
              className="bg-white border border-[#E4ECE9] rounded-2xl p-3 flex gap-3.5 hover:border-civic-primary hover:shadow-civic transition-all active:scale-[0.99] group"
            >
              {/* Photo Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-civic-border shrink-0">
                <img
                  src={
                    req.photoUrl ||
                    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={req.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Request Info Content */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-civic-text-muted">
                    {req.publicRequestId}
                  </span>
                  {getStatusBadge(req.status)}
                </div>

                <h3 className="text-xs font-bold text-civic-text line-clamp-1 group-hover:text-civic-primary transition-colors">
                  {req.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-civic-text-muted pt-1">
                  <span className="truncate max-w-[120px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-civic-primary shrink-0" />
                    <span>{req.address?.split(',')[0] || 'Koramangala'}</span>
                  </span>

                  <span>{formatDate(req.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </MobileShell>
  );
}
