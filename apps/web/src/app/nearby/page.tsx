'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Shield,
  HeartPulse,
  Bus,
  Mail,
  Navigation,
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-civic-text-muted">Loading map...</div>,
});

function NearbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'municipal', label: 'Municipal Offices' },
    { id: 'hospital', label: 'Hospitals' },
    { id: 'transport', label: 'Transport' },
    { id: 'police', label: 'Police Stations' },
  ];

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      try {
        const data = await api.getNearbyLocations(activeCategory);
        setLocations(data || []);
      } catch (e) {
        console.error('Failed to load nearby places:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [activeCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MUNICIPAL':
        return <Building2 className="w-5 h-5 text-civic-primary" />;
      case 'POLICE':
        return <Shield className="w-5 h-5 text-blue-700" />;
      case 'HOSPITAL':
        return <HeartPulse className="w-5 h-5 text-red-600" />;
      case 'TRANSPORT':
        return <Bus className="w-5 h-5 text-emerald-700" />;
      case 'POST_OFFICE':
        return <Mail className="w-5 h-5 text-amber-600" />;
      default:
        return <Building2 className="w-5 h-5 text-civic-primary" />;
    }
  };

  const mapMarkers = locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    category: loc.category,
    lat: loc.latitude,
    lng: loc.longitude,
    address: loc.address,
  }));

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

        <h1 className="text-base font-bold text-civic-text">Nearby Services</h1>

        <div className="w-6" />
      </div>

      {/* Category Filter Pills (Matching Screen 11) */}
      <div className="px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 bg-civic-bg">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Interactive Map Area (Top half of Screen 11) */}
      <div className="w-full h-56 relative border-b border-civic-border shrink-0">
        <LeafletMap
          center={[12.9352, 77.6245]}
          zoom={14}
          selectable={false}
          markers={mapMarkers}
          className="w-full h-full"
        />
      </div>

      {/* List of Nearby Public Services (Bottom half of Screen 11) */}
      <div className="px-4 py-3 flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-civic-border animate-pulse" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="py-12 text-center text-xs text-civic-text-muted">
            No civic locations found in this category.
          </div>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setSelectedPlace(loc)}
              className="bg-white border border-[#E4ECE9] rounded-xl p-3 flex items-center justify-between hover:border-civic-primary hover:shadow-civic transition-all cursor-pointer active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-civic-bg flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-civic-primary-light transition-colors">
                  {getCategoryIcon(loc.category)}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-civic-text group-hover:text-civic-primary transition-colors">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-civic-text-muted mt-0.5">
                    <span>{loc.distanceKm} km</span>
                    <span>•</span>
                    <span className="text-[#287A50] font-semibold">Open now</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-civic-text-muted group-hover:text-civic-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          ))
        )}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-civic-border">
            <h3 className="text-sm font-bold text-civic-text mb-1">
              {selectedPlace.name}
            </h3>
            <p className="text-xs text-civic-text-muted mb-4">
              {selectedPlace.address}
            </p>

            <div className="space-y-2 text-xs py-2 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Distance:</span>
                <span className="font-semibold">{selectedPlace.distanceKm} km (approx.)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-civic-text-muted">Timings:</span>
                <span className="font-semibold">{selectedPlace.openingHours || 'Mon-Sat 9AM-5PM'}</span>
              </div>
              {selectedPlace.phone && (
                <div className="flex justify-between">
                  <span className="text-civic-text-muted">Contact:</span>
                  <a href={`tel:${selectedPlace.phone}`} className="font-semibold text-civic-primary">
                    {selectedPlace.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-civic-primary text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
              <button
                onClick={() => setSelectedPlace(null)}
                className="px-4 py-2 rounded-xl border border-civic-border text-xs font-semibold text-civic-text"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function NearbyServicesScreen() {
  return (
    <MobileShell showBottomNav={true}>
      <Suspense fallback={<div className="p-4 text-xs text-civic-text-muted">Loading nearby map...</div>}>
        <NearbyContent />
      </Suspense>
    </MobileShell>
  );
}
