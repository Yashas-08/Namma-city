'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { api } from '@/lib/api';
import { ChevronLeft, Bell, CheckCheck, AlertCircle, CreditCard, Clock } from 'lucide-react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifs() {
      setLoading(true);
      try {
        const data = await api.getNotifications();
        setNotifications(data?.notifications || []);
      } catch (e) {
        console.error('Failed to load notifications:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const getNotifIcon = (type: string) => {
    if (type === 'PAYMENT') return <CreditCard className="w-4 h-4 text-emerald-600" />;
    if (type === 'CIVIC_ALERT') return <AlertCircle className="w-4 h-4 text-amber-600" />;
    return <Clock className="w-4 h-4 text-civic-primary" />;
  };

  return (
    <MobileShell showBottomNav={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/home')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Notifications</h1>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-civic-primary hover:underline flex items-center gap-1"
          title="Mark all as read"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Read All</span>
        </button>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-civic-border animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center text-xs text-civic-text-muted flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-slate-300" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                !n.readAt
                  ? 'bg-white border-civic-primary/30 shadow-civic'
                  : 'bg-slate-50 border-civic-border opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-xs font-bold text-civic-text">{n.title}</h3>
                    {!n.readAt && (
                      <span className="w-2 h-2 rounded-full bg-civic-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-civic-text-muted leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1.5">
                    {new Date(n.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileShell>
  );
}
