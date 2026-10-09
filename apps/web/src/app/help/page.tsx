'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { ChevronLeft, HelpCircle, Phone, Mail, ShieldCheck, ChevronDown, Send } from 'lucide-react';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [msg, setMsg] = useState('');

  const faqs = [
    {
      q: 'How do I track my reported civic issue?',
      a: 'Go to the Requests tab in the bottom bar. Tap any complaint card to view real-time department updates, field engineer notes, and assignment status.',
    },
    {
      q: 'Are utility bill payments official?',
      a: 'This demonstration release connects to our high-fidelity municipal billing sandbox simulator. Paid receipts are generated with cryptographic transaction IDs for test evaluation.',
    },
    {
      q: 'What should I do in an emergency?',
      a: 'For urgent emergencies, call 112 for Police/Fire/Ambulance, or 1912 for BESCOM electrical hazards.',
    },
    {
      q: 'How are complaints assigned to departments?',
      a: 'Grievances are automatically mapped by category and ward boundaries to BBMP Roads, BWSSB Water, BESCOM Electrical, or Solid Waste Management wings.',
    },
  ];

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

        <h1 className="text-base font-bold text-civic-text">Help & Support</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* Helplines Card */}
        <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-civic space-y-2.5">
          <h2 className="text-xs font-bold text-civic-text uppercase tracking-wider">
            Important City Helplines
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-civic-text-muted block">BBMP Control Room</span>
              <a href="tel:08022660000" className="font-bold text-civic-primary">
                080-22660000
              </a>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-civic-text-muted block">BESCOM Electricity</span>
              <a href="tel:1912" className="font-bold text-civic-primary">
                1912
              </a>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-civic-text-muted block">BWSSB Water</span>
              <a href="tel:1916" className="font-bold text-civic-primary">
                1916
              </a>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-civic-text-muted block">Police Emergency</span>
              <a href="tel:112" className="font-bold text-civic-primary">
                112
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-civic">
          <h2 className="text-xs font-bold text-civic-text uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border-b border-slate-100 last:border-none pb-2 pt-1"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-civic-text hover:text-civic-primary py-1"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-civic-text-muted transition-transform shrink-0 ml-1 ${
                      openFaq === i ? 'rotate-180 text-civic-primary' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-xs text-civic-text-muted mt-1 leading-relaxed pb-1">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-civic">
          <h2 className="text-xs font-bold text-civic-text mb-2">
            Contact Civic Helpdesk
          </h2>
          {feedbackSent ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium text-center">
              Thank you! Your feedback has been forwarded to the municipal grievance cell.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (msg.trim()) setFeedbackSent(true);
              }}
              className="space-y-2.5"
            >
              <textarea
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Describe your issue or technical difficulty..."
                className="w-full p-2.5 bg-slate-50 border border-civic-border rounded-xl text-xs text-civic-text focus:outline-none focus:border-civic-primary resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-civic-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-civic-primary-dark transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Query</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
