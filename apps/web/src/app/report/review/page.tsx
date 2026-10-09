'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  GitFork,
  MapPin,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100" />,
});

export default function RequestPreviewStep3() {
  const router = useRouter();

  const [draft, setDraft] = useState<any>({
    categoryId: 'ROADS',
    categoryName: 'Roads & Footpaths',
    title: 'Road maintenance',
    description: 'Large pothole near the 5th cross making it difficult for vehicles to pass.',
    address: 'Koramangala 5th Block, Bengaluru - 560034',
    latitude: 12.9352,
    longitude: 77.6245,
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    ],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('namma_report_draft');
      if (saved) {
        setDraft(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const result = await api.createRequest({
        categoryId: draft.categoryId,
        categoryName: draft.categoryName,
        title: draft.title || 'Road maintenance',
        description: draft.description,
        address: draft.address,
        latitude: draft.latitude || 12.9352,
        longitude: draft.longitude || 77.6245,
        photos: draft.photos || [],
      });

      // Clear draft
      sessionStorage.removeItem('namma_report_draft');

      // Navigate to request details or requests tab
      if (result?.id) {
        router.push(`/requests/${result.id}`);
      } else {
        router.push('/requests');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Failed to submit grievance. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <MobileShell showBottomNav={false}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/report/location')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Request Preview</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* Category Card (Matching Screen 6) */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 flex items-center justify-between shadow-civic">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-civic-primary text-white flex items-center justify-center shrink-0">
              <GitFork className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-civic-text">
                {draft.categoryName || 'Roads & Footpaths'}
              </h3>
              <p className="text-[11px] text-civic-text-muted mt-0.5">
                {draft.title || 'Road maintenance'}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/report')}
            className="px-2.5 py-1 rounded-lg border border-civic-border text-civic-primary text-xs font-semibold hover:bg-civic-primary-light transition-colors"
          >
            Edit
          </button>
        </div>

        {/* Description Section */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic">
          <h4 className="text-xs font-bold text-civic-text mb-1.5">Description</h4>
          <p className="text-xs text-civic-text leading-relaxed">
            {draft.description}
          </p>
        </div>

        {/* Location Section with Map Preview */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-civic-text">Location</h4>
            <button
              onClick={() => router.push('/report/location')}
              className="px-2.5 py-1 rounded-lg border border-civic-border text-civic-primary text-xs font-semibold hover:bg-civic-primary-light transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Mini Map View */}
          <div className="w-full h-28 rounded-lg overflow-hidden border border-civic-border mb-2.5">
            <LeafletMap
              center={[draft.latitude || 12.9352, draft.longitude || 77.6245]}
              zoom={15}
              selectable={false}
              selectedLocation={{
                lat: draft.latitude || 12.9352,
                lng: draft.longitude || 77.6245,
              }}
              className="w-full h-full pointer-events-none"
            />
          </div>

          <div className="flex items-start gap-1.5 text-xs text-civic-text font-medium">
            <MapPin className="w-3.5 h-3.5 text-civic-primary shrink-0 mt-0.5" />
            <span>{draft.address}</span>
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic">
          <h4 className="text-xs font-bold text-civic-text mb-2">
            Photos ({draft.photos?.length || 0})
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {draft.photos?.map((photo: string, idx: number) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-xl overflow-hidden border border-civic-border shrink-0 shadow-xs"
              >
                <img
                  src={photo}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action: Submit Request */}
      <div className="p-4 bg-white border-t border-civic-border">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-12 bg-civic-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-civic-primary-dark transition-all disabled:opacity-70 active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Submit Request</span>
            </>
          )}
        </button>
      </div>
    </MobileShell>
  );
}
