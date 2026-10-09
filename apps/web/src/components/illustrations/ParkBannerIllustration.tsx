import React from 'react';

export function ParkBannerIllustration({ className = 'w-24 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Trees */}
      <circle cx="85" cy="45" r="22" fill="#2E7259" opacity="0.6" />
      <circle cx="55" cy="50" r="18" fill="#3B8B6E" opacity="0.5" />
      <circle cx="100" cy="52" r="16" fill="#1C5E47" opacity="0.5" />

      {/* Foreground Lush Park Trees */}
      <circle cx="70" cy="55" r="24" fill="#176B68" />
      <circle cx="40" cy="62" r="16" fill="#287A50" />
      <circle cx="95" cy="64" r="18" fill="#1F5A57" />

      {/* Trunks */}
      <rect x="68" y="70" width="4" height="18" fill="#4B382A" rx="1.5" />
      <rect x="38" y="72" width="3.5" height="16" fill="#4B382A" rx="1.5" />
      <rect x="93" y="74" width="3.5" height="14" fill="#4B382A" rx="1.5" />

      {/* Grass base */}
      <ellipse cx="65" cy="85" rx="50" ry="5" fill="#A8D5C8" opacity="0.7" />
    </svg>
  );
}
