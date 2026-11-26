'use client';

import React from 'react';
import { Sparkles, ArrowRight, User, LogIn, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { BrandMark } from './BrandMark';
import { AuthUser } from './AuthModal';

interface LandingNavbarProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLaunchCockpit: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  user,
  onOpenAuth,
  onLaunchCockpit,
}) => {
  return (
    <nav
      id="landing-navbar"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-2.5 rounded-full backdrop-blur-xl bg-[#0E0E12]/85 border border-[#27272A] shadow-2xl shadow-black/60 max-w-[94vw] w-max transition-all duration-300"
    >
      {/* Brand Logo & Name */}
      <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
        <BrandMark size={32} />
        <span className="font-sans font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[#FF6E63] transition-colors">
          Fine<span className="text-[#FF2A1A]">Print</span>
        </span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF2A1A] animate-pulse" />
      </a>

      {/* Navigation Anchors (Smooth Scrolling) */}
      <div className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wide text-[#A1A1AA]">
        <a href="#sandbox" className="hover:text-white transition-colors">
          The Sandbox
        </a>
        <a href="#studio" className="hover:text-white transition-colors">
          Defense Studio
        </a>
        <a href="#terminal" className="hover:text-white transition-colors">
          Terminal Probe
        </a>
        <a href="#journey" className="hover:text-white transition-colors">
          Case Journey
        </a>
        <a href="#restitution" className="hover:text-white transition-colors">
          Restitution
        </a>
        <a href="#benchmarks" className="hover:text-white transition-colors">
          Benchmarks
        </a>
        <a href="#faq" className="hover:text-white transition-colors">
          FAQ
        </a>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchCockpit}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181D] border border-[#27272A] hover:border-[#FF2A1A] text-xs font-semibold text-white transition-all shadow-sm"
              title="Return to Cockpit"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="hidden sm:inline font-mono text-[11px] truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[#FF6E63] text-xs">→</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all"
            >
              <span>Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="btn-press hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A]/60 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF6E63]" />
              <span>Demo Login</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all"
            >
              <span>Launch Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
