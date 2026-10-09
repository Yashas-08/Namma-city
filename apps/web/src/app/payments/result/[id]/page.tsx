'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  Check,
  Zap,
  Printer,
  Download,
  Share2,
  FileCheck,
} from 'lucide-react';

export default function PaymentStatusScreen() {
  const router = useRouter();
  const params = useParams();
  const transactionId = (params?.id as string) || 'TXN789456123';

  const [txn, setTxn] = useState<any>({
    transactionId: 'TXN789456123',
    providerName: 'BESCOM',
    accountReference: '1234567890',
    amountFormatted: '₹ 1,240',
    paymentMethod: 'UPI (Google Pay)',
    createdAt: new Date('2026-09-12T10:42:00Z').toISOString(),
    receiptNumber: 'REC-2026-9841',
  });
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    async function fetchTxn() {
      try {
        const data = await api.getPaymentById(transactionId);
        if (data) setTxn(data);
      } catch {
        // fallback to seeded default
      }
    }
    fetchTxn();
  }, [transactionId]);

  const formattedDate = txn?.createdAt
    ? new Date(txn.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '12 Sep 2026, 10:42 AM';

  return (
    <MobileShell showBottomNav={false}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/payments')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Payment Status</h1>

        <div className="w-6" />
      </div>

      <div className="px-5 py-6 flex-1 flex flex-col items-center justify-center text-center">
        {/* Soft Green Circle Checkmark (Matching Screen 8) */}
        <div className="w-20 h-20 rounded-full bg-[#EAF5EF] border border-[#CDE5D8] flex items-center justify-center text-[#287A50] mb-4 shadow-sm">
          <Check className="w-10 h-10 stroke-[2.8]" />
        </div>

        {/* Headline & Subtitle */}
        <h2 className="text-xl font-extrabold text-civic-text tracking-tight mb-1">
          Payment Successful!
        </h2>
        <p className="text-xs text-civic-text-muted max-w-[260px] leading-relaxed mb-6">
          Your {txn.providerName?.toLowerCase() || 'electricity'} bill has been paid successfully.
        </p>

        {/* Receipt Details Card (Matching Screen 8) */}
        <div className="w-full bg-white border border-civic-border rounded-2xl p-4 shadow-civic text-left mb-6">
          {/* Card Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-civic-primary text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-civic-text">
                  {txn.providerName || 'BESCOM'}
                </h3>
                <p className="text-[10px] text-civic-text-muted mt-0.5">
                  {formattedDate}
                </p>
              </div>
            </div>

            <span className="text-base font-black text-civic-text">
              {txn.amountFormatted || '₹ 1,240'}
            </span>
          </div>

          {/* Key-Value Details */}
          <div className="pt-3 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-civic-text-muted">Consumer Number</span>
              <span className="font-bold text-civic-text">{txn.accountReference || '1234567890'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-civic-text-muted">Transaction ID</span>
              <span className="font-mono font-semibold text-civic-text text-[11px]">
                {txn.transactionId || 'TXN789456123'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-civic-text-muted">Payment Method</span>
              <span className="font-semibold text-civic-text">
                {txn.paymentMethod || 'UPI (Google Pay)'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Matching Screen 8) */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="w-full h-11 rounded-xl border border-civic-primary text-civic-primary font-bold text-xs hover:bg-civic-primary-light transition-colors"
          >
            View Receipt
          </button>

          <button
            onClick={() => router.push('/home')}
            className="w-full h-10 text-civic-text-muted font-semibold text-xs hover:text-civic-text transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-civic-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-civic-primary" />
                <h3 className="text-xs font-bold text-civic-text">
                  Government Utility Receipt
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                VERIFIED
              </span>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="text-center py-2 bg-slate-50 rounded-xl mb-3">
                <p className="text-[11px] text-civic-text-muted">Receipt Number</p>
                <p className="font-mono font-bold text-sm text-civic-primary">
                  {txn.receiptNumber || 'REC-2026-9841'}
                </p>
              </div>

              <div className="flex justify-between">
                <span className="text-civic-text-muted">Authority:</span>
                <span className="font-semibold">{txn.providerName} Utility</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Account Ref:</span>
                <span className="font-semibold">{txn.accountReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Amount Received:</span>
                <span className="font-bold">{txn.amountFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Date & Time:</span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Mode:</span>
                <span className="font-semibold">{txn.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 rounded-xl bg-civic-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2 rounded-xl border border-civic-border text-civic-text text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
