'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { TopHeader } from '@/components/layout/TopHeader';
import { ParkBannerIllustration } from '@/components/illustrations/ParkBannerIllustration';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  CreditCard,
  Megaphone,
  Droplets,
  Home,
  FileText,
  Bus,
  Compass,
  Info,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Yashas';

  const quickServices = [
    { label: 'Pay Bills', href: '/payments', icon: CreditCard },
    { label: 'Report Issue', href: '/report', icon: Megaphone },
    { label: 'Water Supply', href: '/payments?service=water', icon: Droplets },
    { label: 'Property Tax', href: '/payments?service=property-tax', icon: Home },
    { label: 'Certificates', href: '/certificates', icon: FileText },
    { label: 'Transport', href: '/transport', icon: Bus },
    { label: 'Nearby Services', href: '/nearby', icon: Compass },
    { label: 'City Information', href: '/services', icon: Info },
    { label: 'More Services', href: '/services', icon: LayoutGrid },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/services');
    }
  };

  return (
    <MobileShell showBottomNav={true}>
      <TopHeader />

      <div className="px-4 pb-6 flex flex-col gap-5">
        {/* Contextual Greeting */}
        <div className="pt-2">
          <p className="text-sm text-civic-text-muted font-normal">Good morning,</p>
          <h2 className="text-2xl font-bold text-civic-text tracking-tight">
            {firstName}
          </h2>
          <p className="text-xs text-civic-text-muted mt-0.5">
            Let's build a better city together.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-civic-text-muted absolute left-3.5 pointer-events-none stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, complaints, etc."
              className="w-full h-11 pl-10 pr-4 bg-white border border-civic-border rounded-xl text-xs text-civic-text placeholder:text-civic-text-muted focus:outline-none focus:border-civic-primary transition-colors shadow-civic"
            />
          </div>
        </form>

        {/* Quick-Services 3x3 Grid */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {quickServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.label}
                  href={svc.href}
                  className="bg-white border border-[#E4ECE9] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-civic hover:border-civic-primary hover:shadow-civic-elevated transition-all active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-civic-bg flex items-center justify-center text-civic-primary group-hover:bg-civic-primary-light transition-colors mb-2">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[11px] font-semibold text-civic-text leading-tight group-hover:text-civic-primary transition-colors">
                    {svc.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Civic Informational Banner */}
        <section>
          <Link
            href="/report"
            className="block w-full bg-[#E3EFEA] rounded-2xl p-4 border border-[#CADBD4] shadow-civic hover:bg-[#DCECE6] transition-colors relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div className="max-w-[200px] z-10">
                <h3 className="text-sm font-bold text-[#125452] leading-tight mb-1">
                  Clean City
                  <br />
                  Happy Citizens
                </h3>
                <p className="text-[11px] text-[#41635D] leading-relaxed">
                  Report, track and help improve your city.
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-civic-primary group-hover:translate-x-0.5 transition-transform">
                  <span>Report now</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Park trees illustration */}
              <div className="absolute right-2 -bottom-1">
                <ParkBannerIllustration className="w-28 h-24" />
              </div>
            </div>
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}
