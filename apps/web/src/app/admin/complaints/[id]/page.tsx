'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FileCheck,
  RotateCcw,
  XCircle,
  Shield,
  Layers,
  Send,
  X,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-slate-100 rounded-xl" />,
});

export default function AdminComplaintDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params?.id as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Assignment states
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('MEDIUM');
  const [assignmentNote, setAssignmentNote] = useState('');

  // Modals
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaint = async () => {
    try {
      const [data, depts, staff] = await Promise.all([
        api.getAdminComplaint(complaintId),
        api.getAdminDepartments(),
        api.getAdminStaff(),
      ]);

      setComplaint(data);
      setDepartments(depts || []);
      setStaffList(staff || []);
      setSelectedDeptId(data.departmentId || '');
      setSelectedStaffId(data.assignedStaffId || '');
      setSelectedPriority(data.priority || 'MEDIUM');
    } catch (e) {
      console.error('Failed to load complaint:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  // Handle Save Assignment
  const handleSaveAssignment = async () => {
    setActionLoading(true);
    try {
      await api.assignAdminComplaint(complaint.id, {
        departmentId: selectedDeptId || undefined,
        assignedStaffId: selectedStaffId || null,
        note: assignmentNote || undefined,
      });
      setAssignmentNote('');
      await fetchComplaint();
      alert('Assignment changes persisted and notified.');
    } catch (e: any) {
      alert(e.message || 'Failed to update assignment');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Priority Change
  const handlePriorityChange = async (newPriority: string) => {
    setSelectedPriority(newPriority);
    try {
      await api.updateAdminPriority(complaint.id, newPriority);
      await fetchComplaint();
    } catch (e: any) {
      alert(e.message || 'Failed to update priority');
    }
  };

  // Handle Reopen
  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;

    setActionLoading(true);
    try {
      await api.reopenAdminComplaint(complaint.id, reopenReason.trim());
      setReopenReason('');
      setShowReopenModal(false);
      await fetchComplaint();
      alert('Complaint reopened for field action.');
    } catch (e: any) {
      alert(e.message || 'Failed to reopen complaint');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    setActionLoading(true);
    try {
      await api.rejectAdminComplaint(complaint.id, rejectReason.trim());
      setRejectReason('');
      setShowRejectModal(false);
      await fetchComplaint();
      alert('Complaint rejected and citizen notified.');
    } catch (e: any) {
      alert(e.message || 'Failed to reject complaint');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center text-xs text-[#687674]">
        Loading complaint dossier from central repository...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center">
        <h2 className="text-base font-bold text-[#172322]">Complaint Dossier Not Found</h2>
        <button
          onClick={() => router.push('/admin/complaints')}
          className="mt-3 px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const isResolved = complaint.status === 'RESOLVED';
  const isRejected = complaint.status === 'REJECTED';

  return (
    <div className="space-y-6">
      {/* Top Banner with Breadcrumb & ID */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/complaints')}
            className="p-1.5 rounded-xl border border-[#DCE4E2] text-[#687674] hover:text-[#172322] hover:bg-[#F7F9F8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-black text-[#176B68]">{complaint.publicRequestId}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isResolved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isRejected
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : complaint.status === 'IN_PROGRESS'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {complaint.status}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2]">
                {complaint.categoryName}
              </span>
            </div>
            <p className="text-xs text-[#687674] mt-0.5">
              Submitted by <span className="font-semibold text-[#172322]">{complaint.citizen?.name}</span> on{' '}
              {new Date(complaint.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Status Transition Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isResolved && (
            <button
              onClick={() => setShowReopenModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Grievance</span>
            </button>
          )}

          {!isResolved && !isRejected && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Grievance</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Assignment Panel + History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details, Photos, Evidence, Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reassignment Alert Banner if requested by staff */}
          {complaint.reassignmentReason && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  Field Staff Requested Department Reassignment
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Reason: &quot;{complaint.reassignmentReason}&quot;
                </p>
                <p className="text-[10px] text-amber-700 mt-1">
                  Use the Administrative Assignment panel on the right to reallocate this complaint.
                </p>
              </div>
            </div>
          )}

          {/* Description & Evidence */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-[#172322]">{complaint.title}</h2>
              <p className="text-xs text-[#172322] leading-relaxed mt-2 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider mb-2">
                Citizen Attached Photographs
              </h3>
              {complaint.attachments && complaint.attachments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {complaint.attachments.map((att: any, idx: number) => (
                    <div
                      key={att.id || idx}
                      className="aspect-video rounded-xl overflow-hidden border border-[#DCE4E2] bg-slate-100"
                    >
                      <img src={att.fileUrl} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#687674] italic">No photos uploaded.</p>
              )}
            </div>

            {/* Resolution Report */}
            {complaint.resolutionNote && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span>On-Ground Resolution Report by Staff</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{complaint.resolutionNote}</p>
                {complaint.resolutionEvidence && (
                  <div className="w-40 h-28 rounded-lg overflow-hidden border border-emerald-200 mt-2">
                    <img
                      src={complaint.resolutionEvidence}
                      alt="Resolution Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Map */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172322]">
              <MapPin className="w-4 h-4 text-[#176B68]" />
              <span>Geographic Location</span>
            </div>
            <p className="text-xs text-[#172322] font-semibold">{complaint.address}</p>
            <div className="h-56 rounded-xl overflow-hidden border border-[#DCE4E2]">
              <LeafletMap
                center={[complaint.latitude || 12.9352, complaint.longitude || 77.6245]}
                zoom={16}
                selectable={false}
                selectedLocation={{
                  lat: complaint.latitude || 12.9352,
                  lng: complaint.longitude || 77.6245,
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Administrative Controls & Assignment */}
        <div className="space-y-6">
          {/* Assignment Control Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#172322] flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-[#176B68]" />
              <span>Administrative Assignment</span>
            </h3>

            {/* Department Selector */}
            <div>
              <label className="text-[11px] font-bold text-[#172322] block mb-1">
                Allocated Department
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Officer Selector */}
            <div>
              <label className="text-[11px] font-bold text-[#172322] block mb-1">
                Designated Field Officer
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
              >
                <option value="">-- No specific staff (Department Queue) --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.departmentName} • {s.assignedArea})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-[11px] font-bold text-[#172322] block mb-1">
                Grievance Priority
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => handlePriorityChange(pri)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                      selectedPriority === pri
                        ? pri === 'URGENT'
                          ? 'bg-rose-600 text-white'
                          : pri === 'HIGH'
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#176B68] text-white'
                        : 'bg-[#F7F9F8] border border-[#DCE4E2] text-[#687674] hover:text-[#172322]'
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Note */}
            <div>
              <label className="text-[11px] font-bold text-[#172322] block mb-1">
                Instruction to Field Team
              </label>
              <textarea
                rows={2}
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="Operational direction or urgency directive..."
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68] resize-none"
              />
            </div>

            <button
              onClick={handleSaveAssignment}
              disabled={actionLoading}
              className="w-full py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl hover:bg-[#125452] shadow-xs transition-colors disabled:opacity-60"
            >
              Update & Notify Field Officer
            </button>
          </div>

          {/* Citizen Dossier Info */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">Citizen Registry Record</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#172322]">
                <User className="w-4 h-4 text-[#176B68]" />
                <span>{complaint.citizen?.name}</span>
              </div>
              {complaint.citizen?.phone && (
                <div className="flex items-center gap-2 text-[#687674]">
                  <Phone className="w-4 h-4 text-[#687674]" />
                  <span>{complaint.citizen.phone}</span>
                </div>
              )}
              {complaint.citizen?.email && (
                <div className="flex items-center gap-2 text-[#687674]">
                  <Mail className="w-4 h-4 text-[#687674]" />
                  <span>{complaint.citizen.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Complete Auditable History */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">Audit Log & Timeline</h3>

            <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE4E2]">
              {complaint.statusHistory?.map((h: any) => (
                <div key={h.id} className="relative text-xs">
                  <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#176B68]" />
                  <div className="font-bold text-[#172322]">{h.newStatus}</div>
                  <div className="text-[10px] text-[#687674]">
                    {new Date(h.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {h.changedBy?.name} ({h.changedBy?.role})
                  </div>
                  {h.note && <p className="text-[11px] text-[#172322] mt-1 bg-[#F7F9F8] p-2 rounded-lg">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Reopen Grievance for Field Action</h3>
              <button onClick={() => setShowReopenModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReopen} className="pt-4 space-y-3">
              <p className="text-xs text-[#687674]">
                State the operational basis for reopening this grievance. Status will transition to IN_PROGRESS.
              </p>
              <textarea
                rows={3}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. Field inspection found recurring subsidence; contractor instructed to re-lay asphalt..."
                className="w-full p-3 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading || !reopenReason.trim()}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Confirm Reopen
                </button>
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Reject Invalid Grievance</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReject} className="pt-4 space-y-3">
              <p className="text-xs text-[#687674]">
                Mandatory reason explaining why this submission cannot be redressed (e.g. Private property, duplicate, out of jurisdiction).
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Duplicate grievance of #REQ-2048 already in active execution..."
                className="w-full p-3 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-rose-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
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
