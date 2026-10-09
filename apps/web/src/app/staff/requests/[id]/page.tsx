'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileCheck,
  Upload,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  User,
  Phone,
  Building2,
  X,
  Send,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-slate-100 rounded-xl" />,
});

export default function StaffRequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Form states
  const [progressNote, setProgressNote] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = async () => {
    try {
      const res = await api.getStaffRequest(requestId);
      setRequest(res);
    } catch (e) {
      console.error('Failed to load request:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  // Action Handlers
  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await api.acceptStaffRequest(request.id);
      await fetchRequest();
      alert('Assignment acknowledged. You can now start on-ground work.');
    } catch (e: any) {
      alert(e.message || 'Failed to accept assignment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartWork = async () => {
    setActionLoading(true);
    try {
      await api.startStaffRequest(request.id);
      await fetchRequest();
      alert('Status changed to IN PROGRESS. Citizen and Admin notified.');
    } catch (e: any) {
      alert(e.message || 'Failed to start work');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote.trim()) return;

    setActionLoading(true);
    try {
      await api.addStaffProgress(request.id, progressNote.trim());
      setProgressNote('');
      setShowProgressModal(false);
      await fetchRequest();
      alert('Operational progress update posted.');
    } catch (e: any) {
      alert(e.message || 'Failed to post progress update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return;

    setActionLoading(true);
    try {
      await api.resolveStaffRequest(request.id, {
        resolutionNote: resolutionNote.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
      });
      setResolutionNote('');
      setEvidenceUrl('');
      setShowResolveModal(false);
      await fetchRequest();
      alert('Grievance marked as RESOLVED! Notification sent to Citizen.');
    } catch (e: any) {
      alert(e.message || 'Failed to mark resolved');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReassignRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignReason.trim()) return;

    setActionLoading(true);
    try {
      await api.requestStaffReassignment(request.id, reassignReason.trim());
      setReassignReason('');
      setShowReassignModal(false);
      await fetchRequest();
      alert('Reassignment request submitted for municipal administrator review.');
    } catch (e: any) {
      alert(e.message || 'Failed to request reassignment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center text-xs text-[#687674]">
        Loading complaint details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center">
        <h2 className="text-base font-bold text-[#172322]">Complaint Not Found</h2>
        <button
          onClick={() => router.push('/staff/assigned')}
          className="mt-3 px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl"
        >
          Return to Assigned List
        </button>
      </div>
    );
  }

  const isPending = request.status === 'ASSIGNED' && !request.acceptedAt;
  const canStart = request.status === 'ASSIGNED';
  const isInProgress = request.status === 'IN_PROGRESS';
  const isResolved = request.status === 'RESOLVED';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/staff/assigned')}
            className="p-1.5 rounded-xl border border-[#DCE4E2] text-[#687674] hover:text-[#172322] hover:bg-[#F7F9F8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-[#176B68]">{request.publicRequestId}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isResolved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isInProgress
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {request.status}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F9F8] border border-[#DCE4E2]">
                Priority: {request.priority}
              </span>
            </div>
            <p className="text-xs text-[#687674] mt-0.5">
              Category: <span className="font-semibold text-[#172322]">{request.categoryName}</span> • Submitted{' '}
              {new Date(request.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Real Working Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {isPending && (
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept Assignment</span>
            </button>
          )}

          {canStart && (
            <button
              onClick={handleStartWork}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Start Work</span>
            </button>
          )}

          {isInProgress && (
            <>
              <button
                onClick={() => setShowProgressModal(true)}
                className="px-3.5 py-2 bg-white border border-[#DCE4E2] text-[#172322] text-xs font-bold rounded-xl hover:bg-[#F7F9F8] transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#176B68]" />
                <span>Add Update</span>
              </button>
              <button
                onClick={() => setShowResolveModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            </>
          )}

          {!isResolved && (
            <button
              onClick={() => setShowReassignModal(true)}
              className="px-3 py-2 bg-white border border-[#DCE4E2] text-[#687674] hover:text-rose-600 text-xs font-semibold rounded-xl transition-colors"
            >
              Request Reassignment
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Description, Photos, Resolution Note, Citizen Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-[#172322]">{request.title}</h2>
              <p className="text-xs text-[#172322] leading-relaxed mt-2 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>

            {/* Uploaded Photographs */}
            <div>
              <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider mb-2">
                Citizen Attachments & Photos
              </h3>
              {request.attachments && request.attachments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {request.attachments.map((att: any, idx: number) => (
                    <div
                      key={att.id || idx}
                      className="aspect-video rounded-xl overflow-hidden border border-[#DCE4E2] bg-slate-100"
                    >
                      <img
                        src={att.fileUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#687674] italic">No photos uploaded by citizen.</p>
              )}
            </div>

            {/* Resolution Evidence (If resolved) */}
            {request.resolutionNote && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span>Verified Resolution Report</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{request.resolutionNote}</p>
                {request.resolutionEvidence && (
                  <div className="w-36 h-24 rounded-lg overflow-hidden border border-emerald-200 mt-2">
                    <img
                      src={request.resolutionEvidence}
                      alt="Resolution Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Card with Map Preview */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172322]">
                <MapPin className="w-4 h-4 text-[#176B68]" />
                <span>Incident Location</span>
              </div>
              <button
                onClick={() => setShowMapModal(true)}
                className="text-xs font-bold text-[#176B68] hover:underline"
              >
                Expand Full Map
              </button>
            </div>

            <p className="text-xs text-[#172322] font-semibold">{request.address}</p>

            <div className="h-48 rounded-xl overflow-hidden border border-[#DCE4E2]">
              <LeafletMap
                center={[request.latitude || 12.9352, request.longitude || 77.6245]}
                zoom={15}
                selectable={false}
                selectedLocation={{
                  lat: request.latitude || 12.9352,
                  lng: request.longitude || 77.6245,
                }}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Comments & Discussion Log */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#172322] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#176B68]" />
              <span>Field Activity Notes & Comments ({request.comments?.length || 0})</span>
            </h3>

            {request.comments && request.comments.length > 0 ? (
              <div className="space-y-2.5">
                {request.comments.map((c: any) => (
                  <div key={c.id} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#DCE4E2] text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#172322]">
                        {c.author?.name} ({c.author?.role})
                      </span>
                      <span className="text-[10px] text-[#687674]">
                        {new Date(c.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[#172322] leading-relaxed">{c.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#687674]">No comments posted yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Citizen Contact, Assignment Details, Full Status History */}
        <div className="space-y-6">
          {/* Citizen Details Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">Citizen Information</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#172322]">
                <User className="w-4 h-4 text-[#176B68]" />
                <span>{request.citizen?.name || 'Citizen'}</span>
              </div>
              {request.citizen?.phone && (
                <div className="flex items-center gap-2 text-[#687674]">
                  <Phone className="w-4 h-4 text-[#687674]" />
                  <span>{request.citizen.phone}</span>
                </div>
              )}
              {request.citizen?.email && (
                <div className="text-[11px] text-[#687674]">
                  Email: {request.citizen.email}
                </div>
              )}
            </div>
          </div>

          {/* Department & Operational Assignment */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">Assignment Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#172322]">
                <Building2 className="w-4 h-4 text-[#176B68]" />
                <span className="font-semibold">{request.department?.name || 'Municipal Infrastructure'}</span>
              </div>
              <div className="text-[11px] text-[#687674]">
                Assigned Officer: <span className="font-bold text-[#172322]">{request.assignedStaff?.name || 'Unassigned'}</span>
              </div>
              {request.assignedAt && (
                <div className="text-[11px] text-[#687674]">
                  Assigned Date: {new Date(request.assignedAt).toLocaleDateString('en-GB')}
                </div>
              )}
              {request.acceptedAt && (
                <div className="text-[11px] text-emerald-700 font-medium">
                  Accepted: {new Date(request.acceptedAt).toLocaleDateString('en-GB')}
                </div>
              )}
            </div>
          </div>

          {/* Auditable Status History Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">Audit Trail & History</h3>

            <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE4E2]">
              {request.statusHistory?.map((h: any) => (
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
                    • {h.changedBy?.name || 'System'}
                  </div>
                  {h.note && <p className="text-[11px] text-[#172322] mt-1 bg-[#F7F9F8] p-2 rounded-lg">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Add Operational Progress Update</h3>
              <button onClick={() => setShowProgressModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProgress} className="pt-4 space-y-3">
              <p className="text-xs text-[#687674]">
                This note will be recorded in the audit trail and sent to the citizen as a notification.
              </p>
              <textarea
                rows={3}
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="e.g. Asphalt compaction in progress, hot-mix truck arrived on site..."
                className="w-full p-3 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading || !progressNote.trim()}
                  className="flex-1 py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Post Field Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Resolved Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Verify & Mark Grievance Resolved</h3>
              <button onClick={() => setShowResolveModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResolve} className="pt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#172322] block mb-1">
                  Resolution Note (Mandatory)
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe resolution work performed (e.g. Pothole filled and sealed with dense bituminous macadam; road cleared for traffic)..."
                  className="w-full p-3 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-emerald-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#172322] block mb-1">
                  Evidence Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... (or after-repair inspection photo)"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading || !resolutionNote.trim()}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Confirm Resolution
                </button>
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Request Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Request Reassignment</h3>
              <button onClick={() => setShowReassignModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReassignRequest} className="pt-4 space-y-3">
              <p className="text-xs text-[#687674]">
                If this grievance falls outside your department jurisdiction or assigned ward, provide the reason for administrative review.
              </p>
              <textarea
                rows={3}
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="e.g. Issue involves underground water pipe rupture belonging to BWSSB, outside BBMP road jurisdiction..."
                className="w-full p-3 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading || !reassignReason.trim()}
                  className="flex-1 py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowReassignModal(false)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[#DCE4E2] h-[480px] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Grievance Geo-Location</h3>
              <button onClick={() => setShowMapModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 my-3 rounded-xl overflow-hidden border border-[#DCE4E2]">
              <LeafletMap
                center={[request.latitude || 12.9352, request.longitude || 77.6245]}
                zoom={16}
                selectable={false}
                selectedLocation={{
                  lat: request.latitude || 12.9352,
                  lng: request.longitude || 77.6245,
                }}
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-[#172322] font-medium truncate mb-2">{request.address}</p>
            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl"
            >
              Close Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
