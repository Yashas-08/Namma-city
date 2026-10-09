'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'CITIZEN' | 'STAFF' | 'ADMIN';
  departmentId?: string;
  departmentName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  unreadCount: number;
  refreshSession: () => Promise<void>;
  switchRole: (role: 'CITIZEN' | 'STAFF' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  unreadCount: 0,
  refreshSession: async () => {},
  switchRole: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshSession = async () => {
    try {
      const data = await api.getSession();
      if (data?.authenticated && data.user) {
        setUser(data.user);
        setUnreadCount(data.user.unreadNotificationsCount || 0);
      } else {
        // Auto-switch to default demo citizen Yashas if no active session yet for seamless hackathon testing!
        try {
          const demoRes = await api.switchDemoRole('CITIZEN');
          setUser(demoRes.user);
        } catch {
          setUser(null);
        }
      }
    } catch {
      // Fallback demo user for offline or cold start
      setUser({
        id: 'citizen-demo',
        name: 'Yashas K',
        email: 'yashas@example.com',
        phone: '+91 98765 43210',
        avatarUrl: '/avatars/yashas.png',
        role: 'CITIZEN',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const switchRole = async (role: 'CITIZEN' | 'STAFF' | 'ADMIN') => {
    setLoading(true);
    try {
      const res = await api.switchDemoRole(role);
      if (res?.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.error('Error switching role:', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadCount,
        refreshSession,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
