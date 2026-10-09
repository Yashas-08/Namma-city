'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { ChevronLeft, Search, Crosshair, ArrowRight } from 'lucide-react';

// Dynamic import for Leaflet client-only map
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-civic-text-muted">
      Loading interactive map...
    </div>
  ),
});

export default function SelectLocationStep2() {
  const router = useRouter();

  const [address, setAddress] = useState('Koramangala 5th Block, Bengaluru - 560034');
  const [coordinates, setCoordinates] = useState({ lat: 12.9352, lng: 77.6245 });
  const [searchQuery, setSearchQuery] = useState('Koramangala 5th Block, Bengaluru');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Load draft data
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('namma_report_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.latitude && parsed.longitude) {
          setCoordinates({ lat: parsed.latitude, lng: parsed.longitude });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    try {
      const rev = await api.reverseGeocode(lat, lng);
      if (rev?.address) {
        setAddress(rev.address);
        setSearchQuery(rev.address);
      }
    } catch {
      // fallback
    }
  };

  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (val.length >= 2) {
      try {
        const results = await api.searchLocations(val);
        setSearchResults(results || []);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    setAddress(item.address);
    setSearchQuery(item.name);
    setCoordinates({ lat: item.lat, lng: item.lng });
    setShowSearchDropdown(false);
  };

  const handleNext = () => {
    try {
      const saved = sessionStorage.getItem('namma_report_draft');
      const draft = saved ? JSON.parse(saved) : {};
      draft.address = address;
      draft.latitude = coordinates.lat;
      draft.longitude = coordinates.lng;
      sessionStorage.setItem('namma_report_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }

    router.push('/report/review');
  };

  return (
    <MobileShell showBottomNav={false}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/report')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Select Location</h1>

        <div className="w-6" />
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Search Input Bar (Matching Screen 5) */}
        <div className="absolute top-3 left-3 right-3 z-30">
          <div className="relative flex items-center shadow-civic-elevated rounded-xl bg-white border border-civic-border">
            <Search className="w-4 h-4 text-civic-text-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
              placeholder="Search area, landmark..."
              className="w-full h-11 pl-9 pr-10 text-xs text-civic-text placeholder:text-civic-text-muted rounded-xl focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                // Use Koramangala / current location
                handleLocationSelect(12.9352, 77.6245);
              }}
              className="p-2 text-civic-primary hover:bg-civic-primary-light rounded-lg mr-1 transition-colors"
              aria-label="Target current location"
            >
              <Crosshair className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="mt-1 bg-white border border-civic-border rounded-xl shadow-civic-elevated max-h-48 overflow-y-auto z-50">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left px-3 py-2 text-xs border-b border-slate-100 last:border-none hover:bg-civic-primary-light/40 transition-colors"
                >
                  <strong className="block text-civic-text">{item.name}</strong>
                  <span className="block text-[11px] text-civic-text-muted line-clamp-1">
                    {item.address}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Leaflet Map */}
        <div className="flex-1 w-full relative">
          <LeafletMap
            center={[coordinates.lat, coordinates.lng]}
            zoom={16}
            selectable={true}
            selectedLocation={coordinates}
            onLocationSelect={handleLocationSelect}
            className="w-full h-full"
          />
        </div>

        {/* Selected Location Bottom Card (Matching Screen 5) */}
        <div className="p-4 bg-white border-t border-civic-border z-30 shadow-civic-elevated">
          <div className="flex items-center gap-3 mb-3.5">
            {/* Street / Location Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-civic-border">
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=80"
                alt="Location thumbnail"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-civic-text leading-tight line-clamp-2">
                {address}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(true);
                }}
                className="mt-1 text-[11px] font-semibold text-civic-primary hover:underline"
              >
                Change Location
              </button>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full h-12 bg-civic-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-civic-primary-dark transition-all active:scale-[0.99]"
          >
            <span>Next: Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
