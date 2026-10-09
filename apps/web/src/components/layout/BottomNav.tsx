'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, FileText, User } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className = '' }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/home', icon: Home, match: ['/home', '/'] },
    { label: 'Services', href: '/services', icon: LayoutGrid, match: ['/services'] },
    { label: 'Requests', href: '/requests', icon: FileText, match: ['/requests'] },
    { label: 'Profile', href: '/profile', icon: User, match: ['/profile'] },
  ];

  return (
    <nav
      className={`h-[68px] bg-white border-t border-civic-border flex items-center justify-around px-4 select-none z-30 ${className}`}
      aria-label="Bottom Navigation"
    >
      {navItems.map((item) => {
        const isActive =
          item.match.some((m) => (m === '/' ? pathname === '/' || pathname === '/home' : pathname.startsWith(m)));
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-colors ${
              isActive ? 'text-civic-primary font-medium' : 'text-civic-text-muted hover:text-civic-text'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
