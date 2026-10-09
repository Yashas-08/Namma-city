'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users2,
  UserCheck,
  Layers,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Complaints', href: '/admin/complaints', icon: ClipboardList },
    { name: 'Departments', href: '/admin/departments', icon: Building2 },
    { name: 'Staff Management', href: '/admin/staff', icon: Users2 },
    { name: 'Citizen Directory', href: '/admin/users', icon: UserCheck },
    { name: 'Civic Services', href: '/admin/services', icon: Layers },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings & Audit', href: '/admin/settings', icon: Settings },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-[#F7F9F8] text-[#172322] flex flex-col font-sans">
        {/* Top Demo Bar for Hackathon Reviewers */}
        <aside aria-label="Demo Bar" className="bg-white border-b border-[#DCE4E2] px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#176B68]">Namma City — Municipal Administration Console</span>
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
              onClick={async () => {
                await switchRole('STAFF');
                router.push('/staff/dashboard');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F9F8] text-[#687674] hover:text-[#172322] border border-[#DCE4E2]"
            >
              Staff Portal
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#176B68] text-white shadow-xs"
            >
              Admin Console
            </button>
          </div>
        </aside>

        {/* Admin Header */}
        <header className="bg-white border-b border-[#DCE4E2] sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#687674] hover:text-[#172322]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#176B68] text-white flex items-center justify-center font-black shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-[#176B68]">
                      Namma City
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#176B68]/10 text-[#176B68]">
                      BBMP HQ CONSOLE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#687674] font-medium">
                    Central Municipal Governance & Oversight
                  </p>
                </div>
              </div>
            </div>

            {/* Right User & Live System Indicator */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Municipal Services: Normal</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-[#172322]">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-[#687674]">{user?.email || 'admin@nammacity.gov.in'}</div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0] || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area with Navigation Sidebar */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
          {/* Desktop Left Sidebar */}
          <nav aria-label="Admin Sidebar" className="hidden lg:flex flex-col w-64 shrink-0 gap-1 bg-white p-3.5 rounded-2xl border border-[#DCE4E2] shadow-xs h-fit sticky top-24">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#687674] uppercase">
              Municipal Console
            </div>

            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
                <span>Sign Out Console</span>
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white p-3 rounded-2xl border border-[#DCE4E2] shadow-md mb-4 flex flex-col gap-1">
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

          {/* Center Main Screen */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
