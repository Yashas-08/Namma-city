'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  User,
  HardHat,
  MapPin,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  ClipboardList,
  LogOut,
  Bell,
  ShieldCheck,
} from 'lucide-react';

export default function StaffProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStaffProfile();
        setProfile(res);
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/home');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <h1 className="text-xl font-extrabold text-[#172322]">Officer Personnel Profile</h1>
        <p className="text-xs text-[#687674] mt-0.5">
          Government municipal staff credentials and field zone assignment
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center text-xs text-[#687674]">
          Loading staff credentials...
        </div>
      ) : (
        <div className="space-y-5">
          {/* Identity Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#176B68] text-white flex items-center justify-center font-black text-2xl shadow-xs">
                {profile?.name?.[0] || 'R'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#172322]">{profile?.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#176B68]/10 text-[#176B68]">
                    VERIFIED STAFF
                  </span>
                </div>
                <p className="text-xs text-[#687674] mt-0.5">Staff ID: {profile?.id?.slice(0, 10).toUpperCase() || 'STF-BBMP-8821'}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#176B68]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{profile?.departmentName}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2">
              <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#DCE4E2] text-center flex-1 sm:w-28">
                <div className="text-lg font-black text-[#172322]">{profile?.stats?.totalAssigned || 0}</div>
                <div className="text-[10px] text-[#687674]">Total Assigned</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center flex-1 sm:w-28">
                <div className="text-lg font-black text-emerald-700">{profile?.stats?.totalResolved || 0}</div>
                <div className="text-[10px] text-emerald-800">Resolved</div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#687674] uppercase tracking-wider">
              Operational Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#DCE4E2]">
                <span className="text-[10px] font-semibold text-[#687674] block">Official Email</span>
                <span className="font-bold text-[#172322] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#176B68]" />
                  <span>{profile?.email}</span>
                </span>
              </div>

              <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#DCE4E2]">
                <span className="text-[10px] font-semibold text-[#687674] block">Official Mobile</span>
                <span className="font-bold text-[#172322] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#176B68]" />
                  <span>{profile?.phone || '+91 94480 12345'}</span>
                </span>
              </div>

              <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#DCE4E2]">
                <span className="text-[10px] font-semibold text-[#687674] block">Assigned Ward & Jurisdiction</span>
                <span className="font-bold text-[#172322] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#176B68]" />
                  <span>{profile?.assignedArea}</span>
                </span>
              </div>

              <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#DCE4E2]">
                <span className="text-[10px] font-semibold text-[#687674] block">Role & Permission Clearance</span>
                <span className="font-bold text-[#172322] flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#176B68]" />
                  <span>Municipal Field Staff (Tier 2)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Preferences & Sign Out */}
          <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs p-5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#172322]">Sign Out of Field Terminal</h4>
              <p className="text-[11px] text-[#687674]">Ends this operational session on this device</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
