'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VidhanaSoudhaIllustration } from '@/components/illustrations/VidhanaSoudhaIllustration';
import { StatusBar } from '@/components/layout/StatusBar';
import { ArrowRight } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [fadeState, setFadeState] = useState<'entering' | 'ready'>('entering');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeState('ready');
    }, 400);

    // Auto-advance to Home after visual reveal
    const autoNav = setTimeout(() => {
      router.push('/home');
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoNav);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#E5E9E8] flex flex-col items-center justify-start sm:py-6 text-civic-text font-sans">
      <main className="w-full sm:max-w-[400px] h-[100dvh] sm:h-[844px] bg-[#F7F9F8] sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-[#1E2928] flex flex-col justify-between overflow-hidden relative">
        {/* Status Bar */}
        <StatusBar />

        {/* Center Content */}
        <div
          onClick={() => router.push('/home')}
          className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 cursor-pointer ${
            fadeState === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Brand Heading & Tagline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#176B68] tracking-tight mb-2">
              Namma City
            </h1>
            <p className="text-xs font-medium text-civic-text-muted tracking-wide flex items-center justify-center gap-2">
              <span>Cleaner</span>
              <span className="text-civic-primary/60">•</span>
              <span>Safer</span>
              <span className="text-civic-primary/60">•</span>
              <span>Better Together</span>
            </p>
          </div>

          {/* Authentic Vidhana Soudha & Bengaluru City Civic Illustration */}
          <div className="w-full max-w-[340px] px-2 mb-10 transform hover:scale-[1.01] transition-transform">
            <VidhanaSoudhaIllustration className="w-full h-auto drop-shadow-sm rounded-2xl" />
          </div>

          {/* Quick Enter Action / Indicator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/home');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-civic-border text-civic-primary text-xs font-semibold shadow-sm hover:bg-civic-primary-light transition-all active:scale-95"
          >
            <span>Enter City Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom indicator */}
        <div className="w-full flex justify-center py-2 select-none">
          <div className="w-32 h-1 bg-civic-text/20 rounded-full" />
        </div>
      </main>
    </div>
  );
}
