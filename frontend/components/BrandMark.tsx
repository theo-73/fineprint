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
 * in crisp Swiss black, white, and crimson red.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 40,
  compact = true,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 group transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* SVG Emblem Canvas (Clean vector lines, no blurry glow) */}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep Obsidian Architectural Monolith */}
          <linearGradient id="fpObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E1E24" />
            <stop offset="50%" stopColor="#141418" />
            <stop offset="100%" stopColor="#0C0C0E" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield Frame */}
        <path
          d="M32 4 L56 16 V38 L32 58 L8 38 V16 Z"
          fill="url(#fpObsidian)"
          stroke="#27272A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Architectural 1px Grid Lines */}
        <path
          d="M32 4 V58 M8 16 L56 38 M8 38 L56 16"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Central Architectural Monolith Tower (Crisp Crimson Red) */}
        <path
          d="M26 22 H38 V50 H26 Z"
          fill="#FF2A1A"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Architectural Spire Apex */}
        <path
          d="M32 12 L38 22 H26 Z"
          fill="#FFFFFF"
        />

        {/* Codified Balance Scale Conduits (Left & Right Arms) */}
        <path
          d="M16 28 H26 M38 28 H48"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Hanging Statutory Balance Scale Pans */}
        <path
          d="M16 28 V36 M48 28 V36"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.2"
        />
        <circle cx="16" cy="38" r="3.5" fill="#FF2A1A" />
        <circle cx="48" cy="38" r="3.5" fill="#FF2A1A" />

        {/* Core Laser Node */}
        <circle cx="32" cy="36" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
