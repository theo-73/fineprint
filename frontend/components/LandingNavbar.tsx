'use client';

import React from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-5 py-2 rounded-full backdrop-blur-xl bg-[#0E0E12]/90 border border-[#27272A] shadow-xl shadow-black/70 max-w-[92vw] w-fit mx-auto transition-all duration-200 select-none"
    >
      {/* Brand Logo & Name (Swiss Minimalist) */}
      <a href="#hero" className="flex items-center gap-2 group shrink-0">
        <BrandMark size={26} />
        <span className="font-display font-extrabold text-sm tracking-tight text-white group-hover:text-[#FF6E63] transition-colors">
          FINEPRINT
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A] shrink-0" />
      </a>

      {/* Navigation Anchors (Clean, Compact, Within Bounds) */}
      <div className="hidden md:flex items-center gap-4 lg:gap-5 text-[11px] font-mono font-medium tracking-wide text-[#A1A1AA]">
        <a href="#sandbox" className="hover:text-white transition-colors">
          SANDBOX
        </a>
        <a href="#forensic" className="hover:text-white transition-colors">
          FORENSIC
        </a>
        <a href="#studio" className="hover:text-white transition-colors">
          STUDIO
        </a>
        <a href="#journey" className="hover:text-white transition-colors">
          JOURNEY
        </a>
        <a href="#benchmarks" className="hover:text-white transition-colors">
          BENCHMARKS
        </a>
        <a href="#faq" className="hover:text-white transition-colors">
          FAQ
        </a>
      </div>

      {/* Right Action Controls (Compact & Uncut) */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchCockpit}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181D] border border-[#27272A] hover:border-[#FF2A1A] text-xs font-semibold text-white transition-all shadow-xs"
              title="Return to Cockpit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
              <span className="hidden sm:inline font-mono text-[11px] truncate max-w-[80px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[#FF6E63] text-xs">→</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all font-mono tracking-wider uppercase"
            >
              <span>Cockpit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="btn-press hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A]/60 text-white text-xs font-medium transition-all cursor-pointer font-mono"
            >
              <LogIn className="w-3 h-3 text-[#FF6E63]" />
              <span>Login</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all font-mono tracking-wider uppercase"
            >
              <span>Cockpit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
