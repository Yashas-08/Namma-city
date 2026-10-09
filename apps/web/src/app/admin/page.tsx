'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="p-12 text-center text-xs text-[#687674]">
      Redirecting to Municipal Administration Dashboard...
    </div>
  );
}
