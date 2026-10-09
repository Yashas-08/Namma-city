'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  UserCheck,
  Search,
  Mail,
  Phone,
  Calendar,
  ClipboardList,
  CreditCard,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers(search);
      setUsers(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">Registered Citizen Directory</h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Verified resident profiles, grievance submission metrics, and digital municipal interactions
          </p>
        </div>
        <div className="text-xs font-bold text-[#176B68] bg-[#176B68]/10 px-3 py-1.5 rounded-xl w-fit">
          {users.length} Registered Residents
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687674] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or mobile number..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#DCE4E2] text-[#687674] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Citizen Name</th>
                <th className="py-3.5 px-5">Email Address</th>
                <th className="py-3.5 px-5">Mobile</th>
                <th className="py-3.5 px-5">Registration Date</th>
                <th className="py-3.5 px-5">Grievances Filed</th>
                <th className="py-3.5 px-5">Tax / Utility Payments</th>
                <th className="py-3.5 px-5">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4E2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#687674]">
                    Loading resident directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#687674]">
                    No citizens found matching search query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#172322] flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#176B68]/15 text-[#176B68] flex items-center justify-center font-bold text-xs">
                          {u.name[0]}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#172322]">{u.email}</td>
                    <td className="py-3.5 px-5 text-[#687674]">{u.phone || '—'}</td>
                    <td className="py-3.5 px-5 text-[#687674]">
                      {new Date(u.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#176B68]">
                      {u.totalRequests} requests
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#172322]">
                      {u.totalPayments} paid
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {u.userStatus || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
