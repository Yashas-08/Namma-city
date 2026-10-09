'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function TopHeader() {
  const { user, unreadCount } = useAuth();
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const cities = ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'];

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'Y';

  return (
    <header className="px-4 py-2 flex items-center justify-between bg-civic-bg relative z-20">
      {/* Location Selector */}
      <div className="relative">
        <button
          onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
          className="flex items-center gap-1.5 text-sm font-semibold text-civic-text hover:text-civic-primary transition-colors py-1 focus:outline-none"
        >
          <MapPin className="w-4 h-4 text-civic-primary stroke-[2]" />
          <span>{selectedCity}</span>
          <ChevronDown className="w-3.5 h-3.5 text-civic-text-muted" />
        </button>

        {cityDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-civic-border rounded-lg shadow-civic-elevated py-1 w-36 z-50">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setCityDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-civic-primary-light transition-colors ${
                  selectedCity === city ? 'font-semibold text-civic-primary' : 'text-civic-text'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Profile Avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="relative p-1.5 text-civic-text hover:text-civic-primary transition-colors rounded-full focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-civic-error rounded-full ring-2 ring-white" />
          )}
        </Link>

        <Link
          href="/profile"
          className="w-8 h-8 rounded-full bg-civic-primary text-white flex items-center justify-center font-bold text-xs shadow-sm hover:bg-civic-primary-dark transition-colors"
          aria-label="User Profile"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
