import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  let backendHealth = null;
  const apiBase = process.env.API_URL
    ? `${process.env.API_URL.replace(/\/$/, '')}/api/v1`
    : (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api/v1');

  try {
    const res = await fetch(`${apiBase}/health`, {
      cache: 'no-store',
    });
    if (res.ok) {
      backendHealth = await res.json();
    }
  } catch (err: any) {
    backendHealth = { error: err.message || 'Backend unreachable' };
  }

  return NextResponse.json({
    status: 'healthy',
    web: {
      status: 'online',
      version: '1.0.0',
    },
    backend: backendHealth,
    supabase: {
      configured: supabaseConfigured,
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      authMode: 'active',
    },
    timestamp: new Date().toISOString(),
  });
}
