'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  Settings,
  Shield,
  FileText,
  LogOut,
  Building2,
  Server,
  Lock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.getAdminAuditLogs();
        setAuditLogs(res || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/home');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs">
        <h1 className="text-xl font-extrabold text-[#172322]">Central Platform Settings & Audit Logs</h1>
        <p className="text-xs text-[#687674] mt-0.5">
          Government platform configuration, cryptographic session credentials, and immutable audit logs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* System Information */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172322]">
            <Server className="w-4 h-4 text-[#176B68]" />
            <span>Platform Specification</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#DCE4E2]">
              <span className="text-[#687674]">System:</span>
              <span className="font-bold text-[#172322]">Namma City 2.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DCE4E2]">
              <span className="text-[#687674]">Municipal Tenant:</span>
              <span className="font-bold text-[#172322]">BBMP Bengaluru</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DCE4E2]">
              <span className="text-[#687674]">Architecture:</span>
              <span className="font-bold text-[#176B68]">Unified Civic Mesh</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#687674]">Authorization:</span>
              <span className="font-bold text-emerald-700">RBAC Enforced</span>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172322]">
            <Lock className="w-4 h-4 text-[#176B68]" />
            <span>Security & Governance</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#DCE4E2]">
              <span className="text-[#687674]">Authenticated Admin:</span>
              <span className="font-bold text-[#172322]">{user?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DCE4E2]">
              <span className="text-[#687674]">Admin Email:</span>
              <span className="font-bold text-[#172322]">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#687674]">Role Level:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#176B68]/10 text-[#176B68]">
                MASTER ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Session Action */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#172322] mb-1">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Console Session</span>
            </div>
            <p className="text-xs text-[#687674]">
              Terminate administrative privileges and clear authorization token cookies.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors"
          >
            Sign Out of Administration Console
          </button>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-[#DCE4E2] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172322] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#176B68]" />
              <span>Immutable System Audit Trail</span>
            </h2>
            <p className="text-[11px] text-[#687674]">
              Recorded administrative operations, assignment dispatches, and status mutations
            </p>
          </div>
          <span className="text-xs font-bold text-[#176B68] bg-[#176B68]/10 px-2.5 py-1 rounded-lg">
            {auditLogs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#DCE4E2] text-[#687674] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4E2]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#687674]">
                    Loading audit trail...
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#687674]">
                    No audit log records yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F9F8]">
                    <td className="py-3 px-4 text-[#687674]">
                      {new Date(log.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-black text-[#176B68]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#172322]">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#172322]">
                      {log.actor?.name || 'System'} ({log.actor?.role || 'SYSTEM'})
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#687674] max-w-xs truncate font-mono">
                      {log.metadata || '—'}
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
