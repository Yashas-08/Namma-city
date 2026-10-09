'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  Zap,
  Droplets,
  Home,
  CreditCard,
  Edit2,
  Calendar,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';

function UtilityPaymentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || 'electricity';

  const [activeCategory, setActiveCategory] = useState(serviceParam);
  const [consumerNumber, setConsumerNumber] = useState('1234567890');
  const [isEditingConsumer, setIsEditingConsumer] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const [loadingBill, setLoadingBill] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  const categories = [
    { id: 'electricity', label: 'Electricity', provider: 'BESCOM' },
    { id: 'water', label: 'Water', provider: 'BWSSB' },
    { id: 'property-tax', label: 'Property Tax', provider: 'BBMP_TAX' },
    { id: 'more', label: 'More', provider: 'BESCOM' },
  ];

  // Fetch bill details
  useEffect(() => {
    async function fetchBill() {
      setLoadingBill(true);
      try {
        const cat = categories.find((c) => c.id === activeCategory);
        const providerCode = cat?.provider || 'BESCOM';
        const data = await api.lookupBill(providerCode, consumerNumber);
        setBillData(data);
      } catch (e) {
        console.error('Failed to lookup bill:', e);
      } finally {
        setLoadingBill(false);
      }
    }
    fetchBill();
  }, [activeCategory, consumerNumber]);

  const handlePayNow = async () => {
    if (!billData) return;
    setPaying(true);

    try {
      const txn = await api.payBill({
        billId: billData.id,
        providerCode: billData.providerCode,
        accountReference: billData.accountReference,
        paymentMethod: 'UPI (Google Pay)',
        amountMinor: billData.amountMinor,
        idempotencyKey: `idemp-${Date.now()}`,
      });

      // Navigate to Payment Status (Screen 8)
      router.push(`/payments/result/${txn.transactionId}`);
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
      setPaying(false);
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/home')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Utility Payments</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col gap-4">
        {/* Category Filter Pills (Matching Screen 7) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (cat.id === 'electricity') setConsumerNumber('1234567890');
                  else if (cat.id === 'water') setConsumerNumber('BWSSB-77291');
                  else if (cat.id === 'property-tax') setConsumerNumber('SAS-2026-9812');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-civic-primary text-white shadow-xs'
                    : 'bg-white border border-[#E0E7E5] text-civic-text-muted hover:text-civic-text'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Provider Header Card (Matching Screen 7) */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 flex items-center gap-3.5 shadow-civic">
          <div className="w-12 h-12 rounded-xl bg-civic-primary text-white flex items-center justify-center shrink-0">
            {activeCategory === 'water' ? (
              <Droplets className="w-6 h-6 stroke-[2]" />
            ) : activeCategory === 'property-tax' ? (
              <Home className="w-6 h-6 stroke-[2]" />
            ) : (
              <Zap className="w-6 h-6 stroke-[2]" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-civic-text leading-tight">
              {billData?.providerName || 'BESCOM'}
            </h3>
            <p className="text-xs text-civic-text-muted mt-0.5">
              {activeCategory === 'water'
                ? 'Water & Sewerage Bill Payment'
                : activeCategory === 'property-tax'
                ? 'Property Tax Assessment'
                : 'Electricity Bill Payment'}
            </p>
          </div>
        </div>

        {/* Consumer Number Input with Edit Pencil Icon */}
        <div className="bg-white border border-civic-border rounded-xl p-3.5 shadow-civic">
          <label className="block text-xs font-bold text-civic-text-muted mb-1.5">
            Consumer Number
          </label>
          <div className="flex items-center justify-between">
            {isEditingConsumer ? (
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                onBlur={() => setIsEditingConsumer(false)}
                autoFocus
                className="w-full text-sm font-bold text-civic-text border-b border-civic-primary focus:outline-none py-1"
              />
            ) : (
              <>
                <span className="text-sm font-bold text-civic-text tracking-wide">
                  {consumerNumber}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingConsumer(true)}
                  className="p-1.5 text-civic-text-muted hover:text-civic-primary transition-colors rounded-lg"
                  aria-label="Edit consumer number"
                >
                  <Edit2 className="w-4 h-4 stroke-[2]" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current Bill Amount Card (Matching Screen 7) */}
        <div className="bg-white border border-civic-border rounded-xl p-4 shadow-civic flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-civic-text-muted font-medium">
              Current Bill Amount
            </span>
            <button
              type="button"
              onClick={() => setShowBillModal(true)}
              className="text-xs font-bold text-civic-primary hover:underline px-2.5 py-1 rounded-md bg-civic-primary-light"
            >
              View Bill
            </button>
          </div>

          <div className="text-2xl font-extrabold text-civic-text tracking-tight">
            {loadingBill ? '...' : billData?.amountFormatted || '₹ 1,240'}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="text-civic-text-muted">
              <span>Due Date: </span>
              <span className="font-semibold text-civic-text">
                {billData?.dueDate
                  ? new Date(billData.dueDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '20 Oct 2026'}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FCEEED] text-[#C4473F] border border-[#F6D0CE]">
              Due in {billData?.dueInDays ?? 5} days
            </span>
          </div>
        </div>

        {/* Demo Indicator Note */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Demonstration utility sandbox provider connected. Payments are simulated and issue real verifiable municipal receipts.
          </span>
        </div>
      </div>

      {/* Primary CTA: Pay Now */}
      <div className="p-4 bg-white border-t border-civic-border">
        <button
          onClick={handlePayNow}
          disabled={paying || loadingBill}
          className="w-full h-12 bg-civic-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-civic-primary-dark transition-all disabled:opacity-60 active:scale-[0.99]"
        >
          {paying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Pay Now</span>
          )}
        </button>
      </div>

      {/* View Bill Details Modal */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-civic-border">
            <h3 className="text-sm font-bold text-civic-text mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-primary" />
              <span>Municipal Utility Bill Statement</span>
            </h3>
            <div className="text-xs space-y-2 text-civic-text py-2 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Customer Name:</span>
                <span className="font-semibold">{billData?.customerName || 'Yashas K'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Billing Period:</span>
                <span className="font-semibold">{billData?.billingPeriod || 'Sep 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Account Ref:</span>
                <span className="font-semibold">{billData?.accountReference || consumerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Total Payable:</span>
                <span className="font-bold text-civic-primary">{billData?.amountFormatted || '₹ 1,240'}</span>
              </div>
            </div>
            <button
              onClick={() => setShowBillModal(false)}
              className="mt-4 w-full py-2 bg-civic-bg text-civic-text font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function UtilityPaymentsScreen() {
  return (
    <MobileShell showBottomNav={true}>
      <Suspense fallback={<div className="p-4 text-xs text-civic-text-muted">Loading utility payments...</div>}>
        <UtilityPaymentsContent />
      </Suspense>
    </MobileShell>
  );
}
