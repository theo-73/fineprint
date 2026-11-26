'use client';

import React from 'react';

interface BrandMarkProps {
  size?: number;
  compact?: boolean;
  className?: string;
  glow?: boolean;
}

/**
 * Universal BrandMark emblem for FinePrint.
 * Architectural skyscraper monolith intersected with codified statutory scale conduits
 * in deep obsidian and electric neon red.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 40,
  compact = true,
  className = '',
  glow = true,
}) => {
  const mark = (
    <div
      className={`relative flex items-center justify-center shrink-0 group transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Neon Red Glow */}
      {glow && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-[#FF2A1A]/25 blur-md pointer-events-none group-hover:bg-[#FF2A1A]/40 transition-all duration-300"
        />
      )}

      {/* SVG Emblem Canvas */}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_2px_12px_rgba(255,42,26,0.5)] transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Punchy Neon Red Gradient */}
          <linearGradient id="fpNeonRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA49E" />
            <stop offset="35%" stopColor="#FF3B30" />
            <stop offset="70%" stopColor="#FF2A1A" />
            <stop offset="100%" stopColor="#BA160B" />
          </linearGradient>

          {/* Deep Obsidian Architectural Monolith Gradient */}
          <linearGradient id="fpObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="50%" stopColor="#141418" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          {/* Radial Core Glow */}
          <radialGradient id="fpCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6E63" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF2A1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Hexagonal Shield Frame */}
        <path
          d="M32 4 L56 16 V38 L32 58 L8 38 V16 Z"
          fill="url(#fpObsidian)"
          stroke="url(#fpNeonRed)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Inner Geometric Grid Layer */}
        <path
          d="M32 4 V58 M8 16 L56 38 M8 38 L56 16"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Central Architectural Skyscraper Tower (Punchy Neon Red) */}
        <path
          d="M26 22 H38 V50 H26 Z"
          fill="url(#fpNeonRed)"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />

        {/* Architectural Spire Apex */}
        <path
          d="M32 12 L38 22 H26 Z"
          fill="#FFA49E"
        />

        {/* Codified Balance Scale Conduits (Left & Right Arms) */}
        <path
          d="M17 26 H47"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Left Scale Pan & Cord */}
        <path
          d="M20 26 L15 36 M15 36 H25"
          stroke="#FFC8C4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="36" r="2.2" fill="#FF2A1A" />

        {/* Right Scale Pan & Cord */}
        <path
          d="M44 26 L49 36 M39 36 H49"
          stroke="#FFC8C4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="44" cy="36" r="2.2" fill="#FF2A1A" />

        {/* Central Fulcrum / Statutory Beacon */}
        <circle cx="32" cy="26" r="3.2" fill="#FFFFFF" />
        <circle cx="32" cy="26" r="6" stroke="#FF2A1A" strokeWidth="1" strokeDasharray="1 2" />

        {/* Constellation Network Nodes */}
        <circle cx="14" cy="14" r="1.5" fill="#FF3B30" />
        <circle cx="50" cy="14" r="1.5" fill="#FF3B30" />
        <circle cx="32" cy="54" r="2" fill="#FFA49E" />
      </svg>
    </div>
  );

  if (compact) return mark;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {mark}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-[#FFFFFF]">
            Fine<span className="text-[#FF2A1A]">Print</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A] animate-pulse" />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#A1A1AA] uppercase">
          Autonomous Consumer Advocate
        </span>
      </div>
    </div>
  );
};
