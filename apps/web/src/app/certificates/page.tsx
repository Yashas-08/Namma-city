'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  ChevronLeft,
  FileText,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

function CertificatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'birth';
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'my-applications'>('catalog');
  const [services, setServices] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [applicantName, setApplicantName] = useState(user?.name || 'Yashas K');
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const svcs = await api.getCertificateServices();
        setServices(svcs || []);
        const apps = await api.getUserCertificates();
        setMyApplications(apps || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setSubmitting(true);
    try {
      const res = await api.applyCertificate({
        certificateType: selectedService.title,
        applicantName,
      });
      setApplicationSuccess(res?.data);
      setMyApplications((prev) => [res?.data, ...prev]);
    } catch (e) {
      alert('Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/services')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Civic Certificates</h1>

        <div className="w-6" />
      </div>

      {/* Tabs */}
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-slate-100 bg-white">
        <button
          onClick={() => {
            setActiveTab('catalog');
            setApplicationSuccess(null);
            setSelectedService(null);
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'catalog'
              ? 'bg-civic-primary text-white'
              : 'text-civic-text-muted hover:text-civic-text'
          }`}
        >
          Apply for Certificates
        </button>
        <button
          onClick={() => setActiveTab('my-applications')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'my-applications'
              ? 'bg-civic-primary text-white'
              : 'text-civic-text-muted hover:text-civic-text'
          }`}
        >
          My Applications ({myApplications.length})
        </button>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {activeTab === 'catalog' ? (
          <>
            {applicationSuccess ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-civic">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-civic-text mb-1">
                  Application Received!
                </h3>
                <p className="text-xs text-civic-text-muted mb-3">
                  Demonstration application submitted for verification.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono font-bold text-civic-primary mb-4">
                  {applicationSuccess.applicationNumber}
                </div>
                <button
                  onClick={() => {
                    setApplicationSuccess(null);
                    setSelectedService(null);
                    setActiveTab('my-applications');
                  }}
                  className="w-full py-2.5 bg-civic-primary text-white font-bold text-xs rounded-xl"
                >
                  Track Application
                </button>
              </div>
            ) : selectedService ? (
              /* Application Form */
              <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-civic">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="text-xs font-bold text-civic-text">
                    Apply: {selectedService.title}
                  </h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-xs text-civic-text-muted hover:text-civic-primary"
                  >
                    Change
                  </button>
                </div>

                <form onSubmit={handleApply} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-civic-text-muted mb-1">
                      Applicant Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-civic-border rounded-xl focus:outline-none focus:border-civic-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-civic-text-muted mb-1">
                      Municipal Processing Ward
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Ward 151, Koramangala, Bengaluru"
                      className="w-full h-10 px-3 text-xs bg-slate-100 text-slate-500 border border-civic-border rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-civic-text-muted">Statutory Fee:</span>
                      <span className="font-bold">{selectedService.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-civic-text-muted">Expected SLA:</span>
                      <span className="font-semibold">{selectedService.processingDays}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-civic-primary text-white font-bold text-xs rounded-xl mt-3 flex items-center justify-center gap-2 hover:bg-civic-primary-dark transition-colors"
                  >
                    <span>{submitting ? 'Submitting...' : 'Submit Demonstration Application'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Catalog List */
              <>
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Demonstration vital records portal. Clearly labeled test issuance workflow without legally binding claims.
                  </span>
                </div>

                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic hover:border-civic-primary cursor-pointer transition-all active:scale-[0.99] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-civic-primary text-white flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-civic-text group-hover:text-civic-primary transition-colors">
                            {svc.title}
                          </h3>
                          <p className="text-[11px] text-civic-text-muted mt-0.5">
                            {svc.description}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                            Fee: {svc.fee} • SLA: {svc.processingDays}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-civic-text-muted group-hover:text-civic-primary group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          /* My Applications */
          <>
            {myApplications.length === 0 ? (
              <div className="py-20 text-center text-xs text-civic-text-muted">
                No certificate applications yet.
              </div>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-civic-primary">
                      {app.applicationNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-civic-text">{app.certificateType}</h4>
                  <p className="text-[11px] text-civic-text-muted mt-0.5">
                    Applicant: {app.applicantName} • Applied: {app.appliedDate}
                  </p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function CertificatesScreen() {
  return (
    <MobileShell showBottomNav={false}>
      <Suspense fallback={<div className="p-4 text-xs text-civic-text-muted">Loading certificates...</div>}>
        <CertificatesContent />
      </Suspense>
    </MobileShell>
  );
}
