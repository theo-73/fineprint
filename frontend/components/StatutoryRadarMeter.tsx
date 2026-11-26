'use client';

import React, { useEffect, useState } from 'react';

interface StatutoryRadarMeterProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
}

export function getStatutoryScoreTone(score: number) {
  if (score >= 85) {
    return {
      label: 'Severe Statutory Liability',
      sublabel: 'Strict Product Liability (Sec 84 CPA 2019)',
      hex: '#C83625',
      badgeBg: 'bg-[#FDF4F2]',
      badgeText: 'text-[#C83625]',
      badgeBorder: 'border-[#F8CFC9]',
    };
  }
  if (score >= 60) {
    return {
      label: 'Actionable Statutory Breach',
      sublabel: 'E-Commerce Rules Rule 6(3) Mandate',
      hex: '#16A34A',
      badgeBg: 'bg-[#F0FDF4]',
      badgeText: 'text-[#166534]',
      badgeBorder: 'border-[#BBF7D0]',
    };
  }
  if (score >= 35) {
    return {
      label: 'Contractual Dispute',
      sublabel: 'Requires Formal 48h Escalation',
      hex: '#2563EB',
      badgeBg: 'bg-[#EFF6FF]',
      badgeText: 'text-[#1D4ED8]',
      badgeBorder: 'border-[#BFDBFE]',
    };
  }
  return {
    label: 'Statutory Abstention',
    sublabel: 'Out-of-Scope / Non-Manufacturing Ground',
    hex: '#D97706',
    badgeBg: 'bg-[#FEFCE8]',
    badgeText: 'text-[#854D0E]',
    badgeBorder: 'border-[#FEF08A]',
  };
}

export const StatutoryRadarMeter: React.FC<StatutoryRadarMeterProps> = ({
  score,
  size = 140,
  label = 'Statutory Legal Liability',
}) => {
  const tone = getStatutoryScoreTone(score);
  // Angle spans -90 to +90 degrees across the upper semicircle
  const targetAngle = -90 + (Math.max(0, Math.min(100, score)) / 100) * 180;
  const [angle, setAngle] = useState(-90);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAngle(targetAngle));
    return () => cancelAnimationFrame(raf);
  }, [targetAngle]);

  const hex = tone.hex;

  return (
    <div className="flex flex-col items-center select-none" style={{ width: size }}>
      <div
        className="relative"
        style={{ width: size, height: size * 0.58 }}
        role="img"
        aria-label={`${label}: ${score} out of 100, ${tone.label}`}
      >
        {/* Soft radial glow behind needle pivot */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse 70% 90% at 50% 110%, ${hex}20, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 120 70"
          width={size}
          height={size * 0.58}
          aria-hidden="true"
          focusable="false"
          className="relative overflow-visible"
        >
          {/* Base Track */}
          <path
            d="M 10 65 A 55 55 0 0 1 110 65"
            fill="none"
            stroke="#E5E2DC"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Segment 1: Abstention (0-30%) */}
          <path
            d="M 10 65 A 55 55 0 0 1 110 65"
            fill="none"
            stroke="#D97706"
            strokeWidth="9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="28 72"
            strokeDashoffset="0"
            opacity="0.85"
          />

          {/* Segment 2: Contractual (30-60%) */}
          <path
            d="M 10 65 A 55 55 0 0 1 110 65"
            fill="none"
            stroke="#2563EB"
            strokeWidth="9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="30 70"
            strokeDashoffset="-28"
            opacity="0.85"
          />

          {/* Segment 3: Statutory Actionable (60-85%) */}
          <path
            d="M 10 65 A 55 55 0 0 1 110 65"
            fill="none"
            stroke="#16A34A"
            strokeWidth="9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="25 75"
            strokeDashoffset="-58"
            opacity="0.85"
          />

          {/* Segment 4: Severe Vermilion Breach (85-100%) */}
          <path
            d="M 10 65 A 55 55 0 0 1 110 65"
            fill="none"
            stroke="#C83625"
            strokeWidth="9"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="17 83"
            strokeDashoffset="-83"
            opacity="0.95"
          />

          {/* Animated Dial Needle */}
          <line
            x1="60"
            y1="65"
            x2="60"
            y2="18"
            stroke={hex}
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${hex}88)`,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            transform={`rotate(${angle} 60 65)`}
          />
          <circle cx="60" cy="65" r="5.5" fill={hex} />
          <circle cx="60" cy="65" r="2.5" fill="#FFFFFF" />
        </svg>

        {/* Center Numerical Score */}
        <div className="absolute inset-x-0 bottom-0 text-center" style={{ marginBottom: -3 }}>
          <span 
            className="text-2xl font-black font-sans tracking-tight tabular-nums" 
            style={{ color: hex }}
          >
            {score}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#736E65] ml-0.5">/100</span>
        </div>
      </div>

      {/* Tone Badge */}
      <div className="mt-2 text-center space-y-0.5">
        <span
          className={`inline-block text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${tone.badgeBg} ${tone.badgeText} ${tone.badgeBorder}`}
        >
          {tone.label}
        </span>
        <div className="text-[10px] text-[#736E65] max-w-[140px] leading-tight">
          {tone.sublabel}
        </div>
      </div>
    </div>
  );
};
