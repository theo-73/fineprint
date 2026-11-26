'use client';

import React from 'react';
import { Sparkles, ArrowRight, User, LogIn, Lock, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { BrandMark } from './BrandMark';
import { AuthUser } from './AuthModal';

interface LandingNavbarProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLaunchCockpit: () => void;
  onOpenCommandPalette?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  user,
  onOpenAuth,
  onLaunchCockpit,
  onOpenCommandPalette,
}) => {
  return (
    <nav
      id="landing-navbar"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-2.5 rounded-full backdrop-blur-xl bg-[#0E0E12]/90 border border-[#27272A] shadow-2xl shadow-black/80 max-w-[94vw] w-max transition-all duration-300 select-none"
    >
      {/* Brand Logo & Name (Swiss Minimalist) */}
      <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
        <BrandMark size={30} />
        <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[#FF6E63] transition-colors">
          FINEPRINT
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A] shrink-0" />
      </a>

      {/* Navigation Anchors (Minimal Words, Great Presentation) */}
      <div className="hidden lg:flex items-center gap-5 text-[11px] font-mono font-bold tracking-widest uppercase text-[#A1A1AA]">
        <a href="#sandbox" className="hover:text-white transition-colors">
          SANDBOX
        </a>
        <a href="#forensic" className="text-[#FF6E63] hover:text-white transition-colors flex items-center gap-1">
          <span>FORENSIC</span>
          <span className="text-[9px] bg-[#FF2A1A]/20 px-1 py-0.2 rounded text-[#FF6E63]">NEW</span>
        </a>
        <a href="#studio" className="hover:text-white transition-colors">
          STUDIO
        </a>
        <a href="#terminal" className="hover:text-white transition-colors">
          TERMINAL
        </a>
        <a href="#journey" className="hover:text-white transition-colors">
          JOURNEY
        </a>
        <a href="#restitution" className="hover:text-white transition-colors">
          RESTITUTION
        </a>
        <a href="#benchmarks" className="hover:text-white transition-colors">
          BENCHMARKS
        </a>
        <a href="#faq" className="hover:text-white transition-colors">
          FAQ
        </a>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="btn-press hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A]/40 text-xs font-mono text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
            title="Open Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#FF2A1A]" />
            <kbd className="text-[10px] bg-[#27272A] text-[#D4D4D8] px-1.5 py-0.2 rounded font-mono">⌘K</kbd>
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchCockpit}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181D] border border-[#27272A] hover:border-[#FF2A1A] text-xs font-semibold text-white transition-all shadow-sm"
              title="Return to Cockpit"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
              <span className="hidden sm:inline font-mono text-[11px] truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[#FF6E63] text-xs">→</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all font-mono tracking-wider uppercase"
            >
              <span>Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="btn-press hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A]/60 text-white text-xs font-semibold transition-all cursor-pointer font-mono"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF6E63]" />
              <span>Login</span>
            </button>
            <button
              onClick={onLaunchCockpit}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs shadow-md shadow-[#FF2A1A]/30 transition-all font-mono tracking-wider uppercase"
            >
              <span>Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
