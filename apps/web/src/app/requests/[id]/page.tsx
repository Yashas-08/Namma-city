'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  ChevronLeft,
  MapPin,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-slate-100" />,
});

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const requestId = (params?.id as string) || '#REQ-2048';

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReopen, setSubmittingReopen] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const data = await api.getRequestById(requestId);
        setRequest(data);
      } catch (e) {
        console.error('Failed to load request:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [requestId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !request) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(request.id, commentText.trim());
      setRequest((prev: any) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setCommentText('');
      setShowCommentModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim() || !request) return;

    setSubmittingReopen(true);
    try {
      await api.reopenRequest(request.id, reopenReason.trim());
      // Refresh request
      const updated = await api.getRequestById(requestId);
      setRequest(updated);
      setReopenReason('');
      setShowReopenModal(false);
      alert('Grievance has been reopened for municipal review.');
    } catch (err: any) {
      alert(err.message || 'Failed to reopen request');
    } finally {
      setSubmittingReopen(false);
    }
  };

  const photoUrl =
    request?.attachments?.[0]?.fileUrl ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';

  const formattedDate = request?.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '5 Oct 2026';

  const formatTimelineDate = (dt: string) => {
    try {
      const d = new Date(dt);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dt;
    }
  };

  return (
    <MobileShell showBottomNav={false}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/requests')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Request Details</h1>

        <div className="w-6" />
      </div>

      {loading ? (
        <div className="p-4 space-y-4">
          <div className="h-10 bg-white rounded-xl animate-pulse" />
          <div className="h-44 bg-white rounded-2xl animate-pulse" />
          <div className="h-32 bg-white rounded-xl animate-pulse" />
        </div>
      ) : !request ? (
        <div className="py-20 text-center text-xs text-civic-text-muted">
          Request details could not be found.
        </div>
      ) : (
        <div className="px-4 py-3 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* Status & ID Banner (Matching Screen 10) */}
          <div className="flex items-center justify-between">
            {request.status === 'RESOLVED' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EF] text-[#287A50] border border-[#D0E7DA]">
                Resolved
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF5EC] text-[#A66A25] border border-[#F6E1C7]">
                In Progress
              </span>
            )}

            <div className="text-right">
              <span className="text-xs font-bold text-civic-text block">
                {request.publicRequestId}
              </span>
              <span className="text-[10px] text-civic-text-muted">
                Submitted on {formattedDate}
              </span>
            </div>
          </div>

          {/* Issue Title & Description */}
          <div>
            <h2 className="text-base font-bold text-civic-text mb-1">
              {request.title || 'Road maintenance'}
            </h2>
            <p className="text-xs text-civic-text leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Large Sharp Photograph (Matching Screen 10) */}
          <div className="w-full h-48 rounded-2xl overflow-hidden border border-civic-border shadow-civic bg-slate-100">
            <img
              src={photoUrl}
              alt={request.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Location Row with View on Map */}
          <div className="bg-white border border-civic-border rounded-xl p-3 flex items-center justify-between shadow-civic">
            <div className="flex items-start gap-2 max-w-[210px]">
              <MapPin className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
              <span className="text-xs text-civic-text font-medium leading-tight">
                {request.address}
              </span>
            </div>

            <button
              onClick={() => setShowMapModal(true)}
              className="px-2.5 py-1 text-xs font-semibold text-civic-primary border border-civic-border rounded-lg hover:bg-civic-primary-light transition-colors whitespace-nowrap"
            >
              View on Map
            </button>
          </div>

          {/* Updates Timeline (Matching Screen 10) */}
          <div className="bg-white border border-civic-border rounded-xl p-4 shadow-civic">
            <h3 className="text-xs font-bold text-civic-text mb-3">Updates</h3>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D0E7DA]">
              {request.statusHistory && request.statusHistory.length > 0 ? (
                request.statusHistory.map((item: any, idx: number) => {
                  const isLatest = idx === request.statusHistory.length - 1;
                  return (
                    <div key={item.id} className="relative">
                      {/* Check dot / Circle */}
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-civic-primary fill-civic-primary-light" />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-civic-text">
                          {item.newStatus === 'SUBMITTED'
                            ? 'Request submitted'
                            : item.newStatus === 'ASSIGNED'
                            ? 'Assigned to field team'
                            : item.newStatus === 'IN_PROGRESS'
                            ? 'Work in progress'
                            : item.newStatus === 'RESOLVED'
                            ? 'Grievance Resolved'
                            : item.newStatus}
                        </h4>
                        <span className="text-[10px] text-civic-text-muted block mt-0.5">
                          {formatTimelineDate(item.createdAt)}
                        </span>
                        {item.note && (
                          <p className="text-[11px] text-civic-text mt-1 leading-normal bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-civic-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-civic-text">Request submitted</h4>
                    <span className="text-[10px] text-civic-text-muted">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Citizen & Staff Comments Section */}
          {request.comments && request.comments.length > 0 && (
            <div className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic">
              <h3 className="text-xs font-bold text-civic-text mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-civic-primary" />
                <span>Comments & Notes ({request.comments.length})</span>
              </h3>
              <div className="space-y-2">
                {request.comments.map((c: any) => (
                  <div key={c.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-civic-text text-[11px]">
                        {c.author?.name || 'Citizen'}
                      </span>
                      <span className="text-[10px] text-civic-text-muted">
                        {formatTimelineDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-civic-text text-xs leading-normal">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sticky Bottom Action (Matching Screen 10) */}
      <div className="p-4 bg-white border-t border-civic-border flex gap-2">
        <button
          onClick={() => setShowCommentModal(true)}
          className="flex-1 h-11 rounded-xl border border-civic-primary text-civic-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-civic-primary-light transition-colors active:scale-[0.99]"
        >
          <MessageSquare className="w-4 h-4 stroke-[2]" />
          <span>Add a Comment</span>
        </button>

        {request?.status === 'RESOLVED' && (
          <button
            onClick={() => setShowReopenModal(true)}
            className="flex-1 h-11 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-600 transition-colors active:scale-[0.99]"
          >
            <Clock className="w-4 h-4 stroke-[2]" />
            <span>Reopen Issue</span>
          </button>
        )}
      </div>

      {/* View on Map Modal */}
      {showMapModal && request && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-civic-border flex flex-col h-[400px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-civic-text">Location Map</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1 text-civic-text-muted hover:text-civic-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 my-2 rounded-xl overflow-hidden border border-civic-border">
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
            <p className="text-[11px] text-civic-text font-medium truncate mb-2">
              {request.address}
            </p>
            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-2 bg-civic-primary text-white font-bold text-xs rounded-xl"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* Add Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-civic-border">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-civic-text">Add Public Comment</h3>
              <button
                onClick={() => setShowCommentModal(false)}
                className="p-1 text-civic-text-muted hover:text-civic-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddComment} className="pt-3">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your observation, landmark detail, or update..."
                className="w-full p-2.5 bg-slate-50 border border-civic-border rounded-xl text-xs text-civic-text focus:outline-none focus:border-civic-primary resize-none"
                autoFocus
              />

              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="flex-1 py-2 bg-civic-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentModal(false)}
                  className="px-3 py-2 border border-civic-border rounded-xl text-xs font-semibold text-civic-text"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reopen Grievance Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-civic-border">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-civic-text">Reopen Grievance</h3>
              <button
                onClick={() => setShowReopenModal(false)}
                className="p-1 text-civic-text-muted hover:text-civic-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReopen} className="pt-3">
              <p className="text-[11px] text-civic-text-muted mb-2">
                Please describe why this issue is not fully resolved or has recurred.
              </p>
              <textarea
                rows={3}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. Debris remains after asphalt work, pothole reopened after rain..."
                className="w-full p-2.5 bg-slate-50 border border-civic-border rounded-xl text-xs text-civic-text focus:outline-none focus:border-amber-500 resize-none"
                autoFocus
              />

              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={submittingReopen || !reopenReason.trim()}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submit Reopen Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-3 py-2 border border-civic-border rounded-xl text-xs font-semibold text-civic-text"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
