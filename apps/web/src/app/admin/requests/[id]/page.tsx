'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminRequestDetailRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/admin/complaints/${id}`);
    }
  }, [id, router]);

  return (
    <div className="p-12 text-center text-xs text-[#687674]">
      Redirecting to complaint details...
    </div>
  );
}
