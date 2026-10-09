import React from 'react';

export function VidhanaSoudhaIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="skyGrad" x1="200" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F7F6" />
          <stop stopColor="#E4EFEA" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="400" height="280" fill="url(#skyGrad)" rx="16" />

      {/* Clouds & subtle birds */}
      <path d="M70 45 C75 42 85 42 90 45 C95 48 90 54 85 55 L75 55 Z" fill="#FFFFFF" opacity="0.8" />
      <path d="M290 35 C295 32 305 32 310 35 C315 38 310 44 305 45 L295 45 Z" fill="#FFFFFF" opacity="0.8" />
      <path d="M120 30 Q124 25 128 30 Q132 25 136 30" stroke="#718B86" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M140 22 Q144 18 148 22 Q152 18 156 22" stroke="#718B86" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M260 26 Q264 22 268 26 Q272 22 276 26" stroke="#718B86" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Distant City Skyline Silhouettes */}
      <rect x="25" y="110" width="22" height="90" fill="#B9CECB" rx="2" />
      <rect x="35" y="85" width="28" height="115" fill="#A8C3C0" rx="2" />
      <rect x="70" y="105" width="20" height="95" fill="#B9CECB" rx="2" />
      <rect x="310" y="100" width="26" height="100" fill="#B9CECB" rx="2" />
      <rect x="340" y="80" width="30" height="120" fill="#A8C3C0" rx="2" />
      <rect x="375" y="115" width="20" height="85" fill="#B9CECB" rx="2" />

      {/* Windows in background buildings */}
      <rect x="40" y="95" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="50" y="95" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="40" y="110" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="50" y="110" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="348" y="92" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="358" y="92" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="348" y="106" width="5" height="6" fill="#F0F6F5" opacity="0.7" />
      <rect x="358" y="106" width="5" height="6" fill="#F0F6F5" opacity="0.7" />

      {/* Vidhana Soudha Central Civic Architecture */}
      {/* Central Spire & Ashoka Finial */}
      <path d="M198 62 L202 62 L200 48 Z" fill="#88693F" />
      <circle cx="200" cy="46" r="3" fill="#A6824E" />

      {/* Central Dome */}
      <path d="M180 92 C180 72 220 72 220 92 Z" fill="#A7937E" />
      <path d="M184 92 C184 76 216 76 216 92 Z" fill="#BCAB97" />
      <rect x="176" y="92" width="48" height="6" fill="#8E7B68" rx="1" />

      {/* Dome Drum & Pillars */}
      <rect x="180" y="98" width="40" height="24" fill="#C9BDB0" />
      <rect x="183" y="102" width="4" height="20" fill="#786655" rx="1" />
      <rect x="191" y="102" width="4" height="20" fill="#786655" rx="1" />
      <rect x="199" y="102" width="4" height="20" fill="#786655" rx="1" />
      <rect x="207" y="102" width="4" height="20" fill="#786655" rx="1" />
      <rect x="215" y="102" width="4" height="20" fill="#786655" rx="1" />

      {/* Upper Pediment */}
      <polygon points="160,122 240,122 200,114" fill="#A49381" />
      <rect x="156" y="122" width="88" height="8" fill="#B8A796" />

      {/* Main Classical Building Facade & Pillars */}
      <rect x="162" y="130" width="76" height="60" fill="#D9CFC5" />
      <rect x="166" y="134" width="5" height="56" fill="#A49381" />
      <rect x="176" y="134" width="5" height="56" fill="#A49381" />
      <rect x="186" y="134" width="5" height="56" fill="#A49381" />
      <rect x="196" y="134" width="5" height="56" fill="#A49381" />
      <rect x="206" y="134" width="5" height="56" fill="#A49381" />
      <rect x="216" y="134" width="5" height="56" fill="#A49381" />
      <rect x="226" y="134" width="5" height="56" fill="#A49381" />

      {/* Central Grand Entrance Arch */}
      <path d="M192 190 L192 158 Q200 150 208 158 L208 190 Z" fill="#58483B" />

      {/* Left Wing and Mini-Dome */}
      <rect x="115" y="140" width="45" height="50" fill="#C9BDB0" />
      <path d="M125 140 C125 128 145 128 145 140 Z" fill="#9E8D7B" />
      <rect x="120" y="146" width="6" height="34" fill="#8E7B68" />
      <rect x="132" y="146" width="6" height="34" fill="#8E7B68" />
      <rect x="144" y="146" width="6" height="34" fill="#8E7B68" />

      {/* Right Wing and Mini-Dome */}
      <rect x="240" y="140" width="45" height="50" fill="#C9BDB0" />
      <path d="M255 140 C255 128 275 128 275 140 Z" fill="#9E8D7B" />
      <rect x="246" y="146" width="6" height="34" fill="#8E7B68" />
      <rect x="258" y="146" width="6" height="34" fill="#8E7B68" />
      <rect x="270" y="146" width="6" height="34" fill="#8E7B68" />

      {/* Grand Steps */}
      <polygon points="140,195 260,195 275,205 125,205" fill="#B4A494" />
      <rect x="120" y="202" width="160" height="5" fill="#9A8877" />

      {/* Lush Green Trees (Garden City Identity) */}
      {/* Background Trees */}
      <circle cx="85" cy="165" r="28" fill="#2E7259" opacity="0.9" />
      <circle cx="108" cy="172" r="22" fill="#3B8B6E" />
      <circle cx="295" cy="172" r="24" fill="#2E7259" opacity="0.9" />
      <circle cx="320" cy="165" r="30" fill="#225A45" />

      {/* Foreground Trees & Park Greenery */}
      <circle cx="50" cy="180" r="32" fill="#1C5E47" />
      <circle cx="75" cy="188" r="26" fill="#277D5E" />
      <circle cx="335" cy="182" r="32" fill="#1C5E47" />
      <circle cx="365" cy="188" r="26" fill="#277D5E" />

      {/* Tree Trunks */}
      <rect x="48" y="195" width="5" height="25" fill="#4A3B2C" rx="2" />
      <rect x="73" y="198" width="4" height="20" fill="#4A3B2C" rx="2" />
      <rect x="333" y="196" width="5" height="22" fill="#4A3B2C" rx="2" />

      {/* Modern Street Lamps */}
      <path d="M60 215 L60 165 Q60 158 68 158" stroke="#176B68" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="69" cy="161" r="3" fill="#F59E0B" />
      <path d="M115 215 L115 175 Q115 170 122 170" stroke="#176B68" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="123" cy="172" r="2.5" fill="#F59E0B" />

      {/* Roadway & Clean City Pavements */}
      <path d="M0 215 L400 215 L400 280 L0 280 Z" fill="#9CA8A5" />
      {/* Sidewalk border */}
      <rect x="0" y="213" width="400" height="4" fill="#D2DBD9" />
      {/* Road asphalt */}
      <rect x="0" y="222" width="400" height="58" fill="#586765" />
      {/* White Road Markings */}
      <rect x="20" y="248" width="45" height="4" fill="#FFFFFF" rx="2" />
      <rect x="100" y="248" width="45" height="4" fill="#FFFFFF" rx="2" />
      <rect x="180" y="248" width="45" height="4" fill="#FFFFFF" rx="2" />
      <rect x="260" y="248" width="45" height="4" fill="#FFFFFF" rx="2" />
      <rect x="340" y="248" width="45" height="4" fill="#FFFFFF" rx="2" />

      {/* BMTC Public City Bus (Bengaluru iconic teal/green public transit) */}
      <g transform="translate(255, 206)">
        {/* Bus Body */}
        <rect x="0" y="0" width="110" height="38" rx="6" fill="#176B68" />
        {/* Bus Roof Light Strip */}
        <rect x="5" y="2" width="100" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8" />
        {/* Front windshield */}
        <path d="M8 8 L30 8 L30 22 L5 22 Q4 15 8 8 Z" fill="#DCEAE7" />
        {/* Passenger Windows */}
        <rect x="34" y="8" width="18" height="14" rx="2" fill="#DCEAE7" />
        <rect x="56" y="8" width="18" height="14" rx="2" fill="#DCEAE7" />
        <rect x="78" y="8" width="18" height="14" rx="2" fill="#DCEAE7" />
        {/* Headlight */}
        <rect x="2" y="25" width="4" height="5" rx="1" fill="#FDE047" />
        {/* Bus Route display */}
        <rect x="10" y="4" width="22" height="4" rx="1" fill="#1E293B" />
        {/* Wheels */}
        <circle cx="24" cy="38" r="8" fill="#1F2937" />
        <circle cx="24" cy="38" r="4" fill="#9CA3AF" />
        <circle cx="86" cy="38" r="8" fill="#1F2937" />
        <circle cx="86" cy="38" r="4" fill="#9CA3AF" />
      </g>

      {/* Citizen silhouettes walking on sidewalk */}
      <circle cx="170" cy="204" r="3" fill="#172322" />
      <path d="M170 207 L170 216 L168 221 M170 216 L172 221" stroke="#172322" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="180" cy="205" r="3" fill="#172322" />
      <path d="M180 208 L180 216 L178 221 M180 216 L182 221" stroke="#172322" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
