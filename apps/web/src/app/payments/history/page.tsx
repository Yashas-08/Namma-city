'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { ChevronLeft, Zap, Droplets, Home, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const data = await api.getPaymentHistory();
        setHistory(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <MobileShell showBottomNav={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/profile')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Payment History</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-civic-border animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="py-20 text-center text-xs text-civic-text-muted">
            No previous payments found.
          </div>
        ) : (
          history.map((tx) => (
            <Link
              key={tx.id}
              href={`/payments/result/${tx.transactionId}`}
              className="bg-white border border-civic-border rounded-xl p-3.5 flex items-center justify-between hover:border-civic-primary shadow-civic transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-civic-primary text-white flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-civic-text">
                      {tx.providerName}
                    </h3>
                    <CheckCircle2 className="w-3 h-3 text-[#287A50]" />
                  </div>
                  <p className="text-[11px] text-civic-text-muted mt-0.5">
                    Ref: {tx.accountReference}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-civic-text block">
                  {tx.amountFormatted}
                </span>
                <span className="text-[10px] text-[#287A50] font-semibold">
                  Successful
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </MobileShell>
  );
}
