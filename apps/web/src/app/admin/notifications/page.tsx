'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Bell, CheckCircle2, Check } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res?.notifications || []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#176B68]" />
            <h1 className="text-xl font-extrabold text-[#172322]">Central Administrative Alerts</h1>
          </div>
          <p className="text-xs text-[#687674] mt-0.5">
            System notices, reassignment escalations, and grievance lifecycle events
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCE4E2] text-xs font-semibold text-[#176B68] hover:bg-slate-50 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#687674]">Loading administrative alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172322]">No unread alerts</h3>
            <p className="text-xs text-[#687674]">All municipal system alerts have been acknowledged.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE4E2]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:px-6 flex items-start gap-3.5 transition-colors ${
                  n.readAt ? 'bg-white' : 'bg-[#176B68]/5'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-[#172322]">{n.title}</h3>
                    <span className="text-[10px] text-[#687674]">
                      {new Date(n.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[#687674]">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
