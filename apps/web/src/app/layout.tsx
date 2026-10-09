import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Namma City — One City. One Platform. Multiple Services.',
  description:
    'Namma City centralizes everyday urban and municipal services: bill payments, civic grievance reporting, request tracking, and nearby public amenities.',
  keywords: ['Namma City', 'Bengaluru', 'Civic Services', 'BBMP', 'BESCOM', 'BWSSB', 'Municipal'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Namma City',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#176B68',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#ECEFEF] text-civic-text antialiased selection:bg-civic-primary/20 selection:text-civic-primary">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
