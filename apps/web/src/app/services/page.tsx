'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  Search,
  ChevronRight,
  Zap,
  Droplets,
  Home,
  Megaphone,
  FileText,
  Briefcase,
  Bus,
  MapPin,
  Clock,
} from 'lucide-react';

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showSearchInput, setShowSearchInput] = useState(Boolean(initialSearch));
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Payments', value: 'payments' },
    { label: 'Civic', value: 'civic' },
    { label: 'Transport', value: 'transport' },
    { label: 'Certificates', value: 'certificates' },
    { label: 'Local Info', value: 'local-info' },
  ];

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const data = await api.getServices({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery || undefined,
        });
        setServices(data || []);
      } catch (e) {
        console.error('Failed to load services:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [activeCategory, searchQuery]);

  const getServiceDestination = (slug: string) => {
    switch (slug) {
      case 'electricity-bill':
        return '/payments?service=electricity';
      case 'water-bill':
        return '/payments?service=water';
      case 'property-tax':
        return '/payments?service=property-tax';
      case 'report-issue':
        return '/report';
      case 'birth-death-certificate':
        return '/certificates?type=birth';
      case 'trade-license':
        return '/certificates?type=trade';
      case 'transport-info':
        return '/transport';
      case 'nearby-offices':
        return '/nearby?category=municipal';
      default:
        return `/services/${slug}`;
    }
  };

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'electricity-bill':
        return <Zap className="w-5 h-5 text-white" />;
      case 'water-bill':
        return <Droplets className="w-5 h-5 text-white" />;
      case 'property-tax':
        return <Home className="w-5 h-5 text-white" />;
      case 'report-issue':
        return <Megaphone className="w-5 h-5 text-white" />;
      case 'birth-death-certificate':
        return <FileText className="w-5 h-5 text-white" />;
      case 'trade-license':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'transport-info':
        return <Bus className="w-5 h-5 text-white" />;
      case 'nearby-offices':
        return <MapPin className="w-5 h-5 text-white" />;
      default:
        return <Clock className="w-5 h-5 text-white" />;
    }
  };

  const getIconBackground = (slug: string) => {
    switch (slug) {
      case 'electricity-bill':
        return 'bg-[#F59E0B]';
      case 'water-bill':
        return 'bg-[#0284C7]';
      case 'property-tax':
        return 'bg-[#10B981]';
      case 'report-issue':
        return 'bg-[#EF4444]';
      case 'birth-death-certificate':
        return 'bg-[#64748B]';
      case 'trade-license':
        return 'bg-[#8B5CF6]';
      case 'transport-info':
        return 'bg-[#059669]';
      case 'nearby-offices':
        return 'bg-[#176B68]';
      default:
        return 'bg-civic-primary';
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/home')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">All Services</h1>

        <button
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="p-1 -mr-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Toggle search"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Expandable Search Input */}
      {showSearchInput && (
        <div className="px-4 pt-3 pb-1 bg-civic-bg">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-civic-text-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter services by name..."
              className="w-full h-9 pl-9 pr-3 bg-white border border-civic-border rounded-lg text-xs text-civic-text focus:outline-none focus:border-civic-primary"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Horizontal Category Filter Pills */}
      <div className="px-4 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((c) => {
          const isActive = activeCategory === c.value;
          return (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-civic-primary text-white shadow-xs'
                  : 'bg-white border border-[#E0E7E5] text-civic-text-muted hover:text-civic-text'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Services List Rows */}
      <div className="px-4 pb-6 flex-1 flex flex-col gap-2.5">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-civic-border animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-civic-text-muted text-xs">
            No services found matching your criteria.
          </div>
        ) : (
          services.map((svc) => (
            <Link
              key={svc.id}
              href={getServiceDestination(svc.slug)}
              className="bg-white border border-[#E4ECE9] rounded-xl p-3 flex items-center justify-between hover:border-civic-primary hover:shadow-civic transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${getIconBackground(
                    svc.slug
                  )}`}
                >
                  {getServiceIcon(svc.slug)}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-civic-text group-hover:text-civic-primary transition-colors">
                      {svc.name}
                    </h3>
                    {svc.badge && (
                      <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        {svc.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-civic-text-muted leading-tight mt-0.5 line-clamp-1">
                    {svc.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-civic-text-muted group-hover:text-civic-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          ))
        )}
      </div>
    </>
  );
}

export default function ServicesScreen() {
  return (
    <MobileShell showBottomNav={true}>
      <Suspense fallback={<div className="p-4 text-xs text-civic-text-muted">Loading services...</div>}>
        <ServicesContent />
      </Suspense>
    </MobileShell>
  );
}
