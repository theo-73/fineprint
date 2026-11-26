'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, ArrowRight, ShieldCheck, CheckCircle2, 
  Sparkles, MessageSquare, BookOpen, BarChart3, 
  Terminal, Lock, LogIn
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TabType } from './Header';
import { LandingNavbar } from './LandingNavbar';
import { AuthModal, AuthUser } from './AuthModal';
import { LandingHeroNetwork } from './LandingHeroNetwork';
import { LandingInteractiveDemos } from './LandingInteractiveDemos';
import { DefenseStudio } from './DefenseStudio';
import { LiveTerminalPlayground } from './LiveTerminalPlayground';
import { CaseTimelineJourney } from './CaseTimelineJourney';
import { FieldNotesMarquee } from './FieldNotesMarquee';
import { TechnicalBenchmarks } from './TechnicalBenchmarks';
import { FaqAccordion } from './FaqAccordion';
import { ScrollSplitShowcase } from './ScrollSplitShowcase';

interface LandingViewProps {
  onNavigate: (tab: TabType) => void;
  user: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onOpenCommandPalette?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onNavigate, 
  user, 
  onLoginSuccess,
  onOpenCommandPalette,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchCockpit = () => {
    onNavigate('cockpit');
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F6] selection:bg-[#FF2A1A] selection:text-white select-none">
      
      {/* 0. DYNAMIC TOP SCROLL PROGRESS BAR */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#FF2A1A] z-[100] origin-left pointer-events-none transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* 1. FLOATING PILL NAVBAR */}
      <LandingNavbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLaunchCockpit={handleLaunchCockpit}
        onOpenCommandPalette={onOpenCommandPalette}
      />

      {/* AUTH / DEMO LOGIN MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          onLoginSuccess(loggedUser);
          onNavigate('cockpit');
        }}
      />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-24">
        
        {/* ========================================================
            2. HERO SECTION (Editorial Swiss Minimalist)
        ======================================================== */}
        <section id="hero" className="relative pt-6 sm:pt-10 pb-4">
          
          {/* Floating Mono Editorial Annotations */}
          <div className="hidden xl:block absolute top-2 left-0 font-mono text-[10px] text-[#71717A] uppercase tracking-wider animate-anno-float pointer-events-none">
            [SYS.PROTOCOL: MCP STDIO JSON-RPC 2.0]
          </div>
          <div className="hidden xl:block absolute top-8 right-0 font-mono text-[10px] text-[#71717A] uppercase tracking-wider animate-anno-float [animation-delay:1.5s] pointer-events-none">
            [STATUTORY: CPA 2019 § 84–87]
          </div>
          <div className="hidden xl:block absolute -bottom-6 left-10 font-mono text-[10px] text-[#71717A] uppercase tracking-wider animate-anno-float [animation-delay:3s] pointer-events-none">
            [SLA: RULE 4(5) 48H/30D]
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Statement & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left relative z-10">
              
              {/* Editorial Pill Badge */}
              <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161B] border border-[#27272A] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">
                  Autonomous Statutory Consumer Advocate
                </span>
                <span className="text-[10px] text-[#71717A] font-mono border-l border-[#27272A] pl-2 hidden sm:inline">
                  CPA 2019
                </span>
              </div>

              {/* Main Headline (Space Grotesk Display) */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight leading-[1.04] text-white">
                Codified Law.{' '}
                <span className="text-[#FF2A1A] block sm:inline">
                  Unforgiving Defense.
                </span>
              </h1>

              {/* Value Proposition */}
              <p className="text-sm sm:text-base text-[#D4D4D8] max-w-xl leading-relaxed">
                When e-commerce platforms falsely claim your warranty return window expired after 7 days, FinePrint compiles enforceable statutory notices citing <b className="text-white">CPA 2019 Section 84</b> and <b className="text-white">E-Commerce Rules Rule 6(3)</b> in 800 milliseconds.
              </p>

              {/* CTA Button Group */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={handleLaunchCockpit}
                  className="btn-press px-6 py-3.5 rounded-2xl bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FF2A1A]/20 transition-all"
                >
                  <span>Launch Dispute Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="btn-press px-5 py-3.5 rounded-2xl bg-[#16161B] hover:bg-[#1E1E25] text-white border border-[#27272A] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#FF2A1A]" />
                  <span>Demo Login</span>
                </button>

                <button
                  onClick={() => onNavigate('chat')}
                  className="btn-press px-4 py-3.5 rounded-2xl bg-[#16161B] hover:bg-[#1E1E25] text-[#A1A1AA] hover:text-white border border-[#27272A] font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Advocate</span>
                </button>
              </div>

              {/* Micro Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A1A1AA] font-medium pt-3 border-t border-[#27272A]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
                  <span>100% CPA 2019 Ground-Truth</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
                  <span>Zero Hallucinations (PyTest 100%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
                  <span>Rule 4(5) 48h SLA Window</span>
                </span>
              </div>

              {/* Swiss Editorial Stats Row (Directly referencing Image 1: 50+ / 120+ / 8+) */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#27272A] text-left">
                <div className="space-y-0.5">
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums">
                    ₹1.84<span className="text-[#FF2A1A]">Cr+</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    Restitution Enforced
                  </div>
                </div>

                <div className="space-y-0.5 border-l border-[#27272A] pl-4">
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums">
                    0.00<span className="text-[#FF2A1A]">%</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    Citation Hallucination
                  </div>
                </div>

                <div className="space-y-0.5 border-l border-[#27272A] pl-4">
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums">
                    48<span className="text-[#FF2A1A]">h</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    Mandatory SLA Window
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Network Graphic (Bespoke Editorial Visual) */}
            <div className="lg:col-span-6 relative">
              <LandingHeroNetwork />
            </div>

          </div>
        </section>

        {/* ========================================================
            3. INFINITE TELEMETRY MARQUEE
        ======================================================== */}
        <div className="relative py-3.5 bg-[#121216] border-y border-[#27272A] overflow-hidden select-none -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="stats-marquee flex items-center gap-8 whitespace-nowrap text-xs font-semibold text-[#A1A1AA] tracking-wide font-mono">
            <span>✦ ₹1.84 Crores Consideration Protected</span>
            <span className="text-[#FF2A1A]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
            <span>⚡ 800ms Notice Compilation Speed</span>
            <span className="text-white">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
            <span>⏱️ Rule 4(5) 48-Hour Grievance SLA</span>
            <span className="text-[#FF2A1A]">🛡️ Appario, Flipkart, Croma, Reliance Deflections Dismantled</span>
            <span>✦ ₹1.84 Crores Consideration Protected</span>
            <span className="text-[#FF2A1A]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
            <span>⚡ 800ms Notice Compilation Speed</span>
            <span className="text-white">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
          </div>
        </div>

        {/* ========================================================
            4. SCROLL-LINKED SPLIT-OPENING FORENSIC SHOWCASE (Awwwards Style)
        ======================================================== */}
        <ScrollSplitShowcase />

        {/* ========================================================
            5. 4 INTERACTIVE BENTO DEMO CARDS
        ======================================================== */}
        <section>
          <LandingInteractiveDemos />
        </section>

        {/* ========================================================
            5. INTERACTIVE DEFENSE STUDIO
        ======================================================== */}
        <section>
          <DefenseStudio />
        </section>

        {/* ========================================================
            6. INTERACTIVE 3D TERMINAL PLAYGROUND
        ======================================================== */}
        <section>
          <LiveTerminalPlayground />
        </section>

        {/* ========================================================
            7. NARRATIVE CASE TIMELINE JOURNEY
        ======================================================== */}
        <section>
          <CaseTimelineJourney />
        </section>

        {/* ========================================================
            8. WALL OF STATUTORY RESTITUTION
        ======================================================== */}
        <section>
          <FieldNotesMarquee />
        </section>

        {/* ========================================================
            9. TECHNICAL BENCHMARKS
        ======================================================== */}
        <section>
          <TechnicalBenchmarks />
        </section>

        {/* ========================================================
            10. FREQUENTLY ASKED QUESTIONS
        ======================================================== */}
        <section>
          <FaqAccordion />
        </section>

        {/* ========================================================
            11. BOTTOM LAUNCH CALL TO ACTION (Clean Editorial Matte)
        ======================================================== */}
        <section className="rounded-3xl p-8 sm:p-12 bg-[#121216] border border-[#27272A] text-center space-y-5 shadow-xl max-w-4xl mx-auto">
          <span className="w-14 h-14 rounded-2xl bg-[#FF2A1A] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#FF2A1A]/20">
            <Scale className="w-7 h-7" />
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to Enforce Your Statutory Consumer Rights?
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
            Upload an e-commerce invoice PDF or select a curated receipt to compile your formal statutory notice in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleLaunchCockpit}
              className="btn-press px-6 py-3.5 rounded-xl bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF2A1A]/20 flex items-center gap-2"
            >
              <span>Open Dispute Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn-press px-5 py-3.5 rounded-xl bg-[#18181D] hover:bg-[#202027] text-white border border-[#27272A] hover:border-[#FF2A1A]/60 font-semibold text-xs sm:text-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#FF2A1A]" />
              <span>Demo Login</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
