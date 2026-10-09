'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  LayoutDashboard,
  ClipboardList,
  Flame,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  HardHat,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Issues', href: '/staff/assigned', icon: ClipboardList },
    { name: 'Work Queue', href: '/staff/work-queue', icon: Flame },
    { name: 'Work History', href: '/staff/history', icon: History },
    { name: 'Notifications', href: '/staff/notifications', icon: Bell },
    { name: 'Profile', href: '/staff/profile', icon: User },
  ];

  return (
    <RoleGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="min-h-screen bg-[#F7F9F8] text-[#172322] flex flex-col font-sans">
        {/* Top Demo Bar for Hackathon Reviewers */}
        <aside aria-label="Demo Bar" className="bg-white border-b border-[#DCE4E2] px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#176B68]">Namma City — Staff Operations Portal</span>
            <span className="text-[#687674] hidden md:inline">| Demo Role Switcher:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={async () => {
                await switchRole('CITIZEN');
                router.push('/home');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F9F8] text-[#687674] hover:text-[#172322] border border-[#DCE4E2]"
            >
              Citizen View
            </button>
            <button
              onClick={() => router.push('/staff/dashboard')}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#176B68] text-white shadow-xs"
            >
              Staff Portal
            </button>
            <button
              onClick={async () => {
                await switchRole('ADMIN');
                router.push('/admin/dashboard');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F9F8] text-[#687674] hover:text-[#172322] border border-[#DCE4E2]"
            >
              Admin Console
            </button>
          </div>
        </aside>

        {/* Staff Portal Main Header */}
        <header className="bg-white border-b border-[#DCE4E2] sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#687674] hover:text-[#172322]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#176B68] text-white flex items-center justify-center font-black shadow-xs">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-[#176B68]">
                      Namma City
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#176B68]/10 text-[#176B68]">
                      FIELD STAFF
                    </span>
                  </div>
                  <p className="text-[11px] text-[#687674] font-medium">
                    {user?.departmentName || 'BBMP Road Infrastructure'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right User & Area Status */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#DCE4E2] text-xs font-medium text-[#687674]">
                <MapPin className="w-3.5 h-3.5 text-[#176B68]" />
                <span>Ward 151, Koramangala</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-[#172322]">{user?.name || 'Officer Ramesh'}</div>
                  <div className="text-[10px] text-[#687674]">{user?.email || 'ramesh@bbmp.gov.in'}</div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0] || 'R'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body Container with Sidebar and Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          {/* Desktop Responsive Sidebar */}
          <nav aria-label="Staff Sidebar" className="hidden md:flex flex-col w-60 shrink-0 gap-1 bg-white p-3 rounded-2xl border border-[#DCE4E2] shadow-xs h-fit sticky top-24">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#687674] uppercase">
              Operations Menu
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/staff/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#176B68] text-white shadow-xs'
                      : 'text-[#687674] hover:text-[#172322] hover:bg-[#F7F9F8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#DCE4E2]">
              <button
                onClick={async () => {
                  await logout();
                  router.push('/home');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white p-3 rounded-2xl border border-[#DCE4E2] shadow-md mb-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(item.href);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-[#176B68] text-white' : 'text-[#687674]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
