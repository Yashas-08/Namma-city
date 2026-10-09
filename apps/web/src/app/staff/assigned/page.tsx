'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  PlayCircle,
  User,
} from 'lucide-react';

export default function StaffAssignedPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const res = await api.getStaffAssigned({
        status: statusFilter,
        priority: priorityFilter,
        date: dateFilter,
        search: searchTerm,
      });
      setRequests(res || []);
    } catch (e) {
      console.error('Failed to load assigned requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, [statusFilter, priorityFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAssigned();
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <h1 className="text-xl font-extrabold text-[#172322]">Assigned Complaints Queue</h1>
        <p className="text-xs text-[#687674] mt-0.5">
          Civic complaints assigned to your department and verified for on-ground execution
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687674] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Complaint ID (e.g. #REQ-2048), address, or category..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#DCE4E2]">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Assigned</option>
              <option value="ASSIGNED">Pending Accept</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
            </select>
          </div>

          <div className="ml-auto text-xs font-semibold text-[#687674]">
            Showing <span className="text-[#172322]">{requests.length}</span> complaints
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#687674]">Loading assigned complaints...</div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172322]">No matching complaints found</h3>
            <p className="text-xs text-[#687674] max-w-sm mx-auto mt-1">
              There are no assigned grievances matching your active filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE4E2]">
            {requests.map((req) => {
              const isUrgent = req.priority === 'URGENT' || req.priority === 'HIGH';
              return (
                <div
                  key={req.id}
                  onClick={() => router.push(`/staff/requests/${req.id}`)}
                  className="p-5 hover:bg-[#F7F9F8] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {req.attachments?.[0]?.fileUrl ? (
                      <img
                        src={req.attachments[0].fileUrl}
                        alt="Issue"
                        className="w-16 h-16 rounded-xl object-cover border border-[#DCE4E2] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#687674] border border-[#DCE4E2] shrink-0">
                        <AlertCircle className="w-6 h-6 text-[#176B68]" />
                      </div>
                    )}

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
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

                      <h3 className="text-sm font-bold text-[#172322]">{req.title}</h3>
                      <p className="text-xs text-[#687674] line-clamp-1">{req.description}</p>

                      <div className="flex items-center gap-4 text-[11px] text-[#687674] pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#176B68] shrink-0" />
                          <span>{req.address}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#687674]" />
                          <span>{new Date(req.createdAt).toLocaleDateString('en-GB')}</span>
                        </span>
                        {req.citizen?.name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#687674]" />
                            <span>Citizen: {req.citizen.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/staff/requests/${req.id}`);
                      }}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#176B68] text-white hover:bg-[#125452] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
