'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  Settings,
  Edit2,
  FileText,
  CreditCard,
  Award,
  MapPin,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Check,
} from 'lucide-react';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Yashas K');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [saving, setSaving] = useState(false);

  const menuItems = [
    { label: 'My Requests', href: '/requests', icon: FileText },
    { label: 'Payment History', href: '/payments/history', icon: CreditCard },
    { label: 'My Certificates', href: '/certificates', icon: Award },
    { label: 'Saved Locations', href: '/nearby', icon: MapPin },
    { label: 'Notification Settings', href: '/notifications', icon: Bell },
    { label: 'Help & Support', href: '/help', icon: HelpCircle },
    { label: 'About Us', href: '/about', icon: Info },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({ name, phone });
      setIsEditing(false);
    } catch (e) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <MobileShell showBottomNav={true}>
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <h1 className="text-base font-bold text-civic-text">Profile</h1>

        <Link
          href="/admin"
          className="p-1 -mr-1 text-civic-text-muted hover:text-civic-primary transition-colors"
          title="Staff & Admin Portal"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </Link>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* User Info Card (Matching Screen 12) */}
        <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-civic">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Teal Avatar Circle */}
              <div className="w-14 h-14 rounded-full bg-civic-primary text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'Y'}
              </div>

              <div>
                <h2 className="text-sm font-bold text-civic-text leading-tight">
                  {user?.name || 'Yashas K'}
                </h2>
                <p className="text-xs text-civic-text-muted mt-0.5">
                  {user?.phone || '+91 98765 43210'}
                </p>
                <p className="text-[11px] text-civic-text-muted leading-tight">
                  {user?.email || 'yashas@example.com'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 rounded-lg border border-civic-border text-civic-primary text-xs font-semibold hover:bg-civic-primary-light transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Quick Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-civic-text-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs border border-civic-border rounded-lg bg-slate-50 focus:outline-none focus:border-civic-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-civic-text-muted mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs border border-civic-border rounded-lg bg-slate-50 focus:outline-none focus:border-civic-primary"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 py-1.5 bg-civic-primary text-white text-xs font-bold rounded-lg"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}

          {/* Role badge */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-civic-text-muted">Account Access:</span>
            <span className="font-bold text-civic-primary px-2 py-0.5 rounded bg-civic-primary-light">
              {user?.role || 'CITIZEN'}
            </span>
          </div>
        </div>

        {/* Menu Navigation List (Matching Screen 12) */}
        <div className="bg-white border border-civic-border rounded-2xl overflow-hidden shadow-civic">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors group ${
                  idx !== 0 ? 'border-t border-[#EAEFEF]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-civic-primary stroke-[2]" />
                  <span className="text-xs font-medium text-civic-text group-hover:text-civic-primary transition-colors">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-civic-text-muted group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>

        {/* Logout Button (Matching Screen 12) */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-[#FCEEED] border border-[#F6D0CE] text-[#C4473F] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#F9E2E1] transition-colors active:scale-[0.99] mt-1 shadow-xs"
        >
          <LogOut className="w-4 h-4 stroke-[2.2]" />
          <span>Logout</span>
        </button>
      </div>
    </MobileShell>
  );
}
