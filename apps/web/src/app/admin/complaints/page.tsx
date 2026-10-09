'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PlayCircle,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Building2,
  UserCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export default function AdminComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  // Quick Assignment Modal
  const [assignModalComplaint, setAssignModalComplaint] = useState<any>(null);
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, depts, staff] = await Promise.all([
        api.getAdminComplaints({
          status: statusFilter,
          departmentId: deptFilter,
          priority: priorityFilter,
          search: searchTerm,
          page,
          limit: 25,
        }),
        api.getAdminDepartments(),
        api.getAdminStaff(),
      ]);

      setComplaints(res.complaints || []);
      setPagination(res.pagination || { total: 0, totalPages: 1 });
      setDepartments(depts || []);
      setStaffMembers(staff || []);
    } catch (e) {
      console.error('Failed to load complaints:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, deptFilter, priorityFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const openAssignModal = (complaint: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssignModalComplaint(complaint);
    setAssignDeptId(complaint.departmentId || (departments[0]?.id || ''));
    setAssignStaffId(complaint.assignedStaffId || '');
    setAssignNote('');
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint) return;

    setActionLoading(true);
    try {
      await api.assignAdminComplaint(assignModalComplaint.id, {
        departmentId: assignDeptId || undefined,
        assignedStaffId: assignStaffId || null,
        note: assignNote || undefined,
      });
      setAssignModalComplaint(null);
      await loadData();
      alert('Grievance assignment updated successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to update assignment');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">Municipal Grievance Registry</h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Central repository of all public civic grievances with administrative assignment controls
          </p>
        </div>
        <div className="text-xs font-bold text-[#176B68] bg-[#176B68]/10 px-3 py-1.5 rounded-xl w-fit">
          {pagination.total} Registered Grievances
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687674] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Complaint ID (e.g. #REQ-2048), title, citizen name, address..."
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

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#DCE4E2]">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Statuses</option>
              <option value="SUBMITTED">Submitted (New)</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#687674]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#F7F9F8] border border-[#DCE4E2] rounded-lg px-2 py-1 text-xs text-[#172322] font-medium focus:outline-none focus:border-[#176B68]"
            >
              <option value="all">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#DCE4E2] text-[#687674] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Category / Title</th>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4E2]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#687674]">
                    Loading registered complaints...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#687674]">
                    No grievances matching filter criteria.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => {
                  const isUrgent = c.priority === 'URGENT' || c.priority === 'HIGH';
                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/admin/complaints/${c.id}`)}
                      className="hover:bg-[#F7F9F8] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-black text-[#176B68]">
                        {c.publicRequestId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#172322] max-w-xs truncate">{c.title}</div>
                        <div className="text-[10px] text-[#687674]">{c.categoryName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#172322]">{c.citizen?.name || 'Citizen'}</div>
                        <div className="text-[10px] text-[#687674]">{c.citizen?.phone || 'No phone'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#172322] font-medium">
                        {c.department?.name || <span className="text-amber-700 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        {c.assignedStaff ? (
                          <div className="font-bold text-[#172322]">{c.assignedStaff.name}</div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isUrgent
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-[#F7F9F8] text-[#172322] border border-[#DCE4E2]'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : c.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => openAssignModal(c, e)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 font-bold text-[11px]"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => router.push(`/admin/complaints/${c.id}`)}
                            className="px-2.5 py-1 rounded-lg bg-[#176B68] text-white hover:bg-[#125452] font-bold text-[11px]"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-white border-t border-[#DCE4E2] flex items-center justify-between text-xs">
            <span className="text-[#687674]">
              Page {page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCE4E2] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE4E2] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Assignment Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <div>
                <h3 className="text-sm font-bold text-[#172322]">
                  Assign Complaint {assignModalComplaint.publicRequestId}
                </h3>
                <p className="text-[11px] text-[#687674]">{assignModalComplaint.title}</p>
              </div>
              <button
                onClick={() => setAssignModalComplaint(null)}
                className="text-[#687674] hover:text-[#172322]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#172322] block mb-1">Assigned Department</label>
                <select
                  value={assignDeptId}
                  onChange={(e) => setAssignDeptId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Assign Field Staff Officer</label>
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                >
                  <option value="">-- No specific staff (Unassigned) --</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.departmentName} • {s.assignedArea})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Administrative Note / Instruction</label>
                <textarea
                  rows={2}
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  placeholder="e.g. Inspect road crater immediately and coordinate hot-mix asphalt filling..."
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Save Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
