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

interface LandingViewProps {
  onNavigate: (tab: TabType) => void;
  user: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onNavigate, 
  user, 
  onLoginSuccess 
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
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] selection:bg-[#FF2A1A]/30 selection:text-white select-none">
      
      {/* 0. DYNAMIC TOP SCROLL PROGRESS BAR (Yātrā Inspired) */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF2A1A] via-[#FF6E63] to-[#FFFFFF] z-[100] origin-left pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_14px_rgba(255,42,26,0.8)]"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* 1. FLOATING PILL NAVBAR (Yātrā Inspired) */}
      <LandingNavbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLaunchCockpit={handleLaunchCockpit}
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
            2. HERO SECTION
        ======================================================== */}
        <section id="hero" className="relative pt-6 sm:pt-10 pb-4">
          
          {/* Subtle Ambient Red Glow */}
          <div
            aria-hidden="true"
            className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-[#FF2A1A]/15 via-[#FF3B30]/5 to-transparent rounded-full blur-3xl pointer-events-none"
          />

          {/* Floating Mono Annotations (APIx Inspired) */}
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
              
              {/* Supersonic Proximity Pill Badge */}
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141418] border border-[#27272A] text-[#FF6E63] text-xs font-semibold tracking-wide shadow-md shadow-[#FF2A1A]/10 hover:border-[#FF2A1A] transition-all">
                <span className="w-2 h-2 rounded-full bg-[#FF2A1A] animate-pulse" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider shimmer-text">
                  Autonomous Statutory Consumer Advocate
                </span>
                <span className="text-[10px] text-[#71717A] font-mono border-l border-[#27272A] pl-2 hidden sm:inline">
                  CPA 2019
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight leading-[1.02] text-white">
                Codified Law.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A1A] via-[#FF6E63] to-[#FFFFFF] drop-shadow-[0_0_25px_rgba(255,42,26,0.4)]">
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
                  className="btn-press px-6 py-3.5 rounded-2xl bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#FF2A1A]/35 hover:-translate-y-0.5 transition-all"
                >
                  <span>Launch Dispute Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="btn-press px-5 py-3.5 rounded-2xl bg-[#141418] hover:bg-[#1C1C22] text-white border border-[#27272A] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:border-[#FF2A1A]/60 transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#FF6E63]" />
                  <span>Demo Login</span>
                </button>

                <button
                  onClick={() => onNavigate('chat')}
                  className="btn-press px-4 py-3.5 rounded-2xl bg-[#141418] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-[#FF6E63] border border-[#27272A] font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Advocate</span>
                </button>
              </div>

              {/* Micro Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A1A1AA] font-medium pt-3 border-t border-[#27272A]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>100% CPA 2019 Ground-Truth</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Zero Hallucinations (PyTest 100%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Rule 4(5) 48h SLA Window</span>
                </span>
              </div>
            </div>

            {/* Right Hero Network Graphic (Animated SVG Constellation) */}
            <div className="lg:col-span-6 relative">
              <LandingHeroNetwork />
            </div>

          </div>
        </section>

        {/* ========================================================
            3. INFINITE TELEMETRY MARQUEE (APIx & Yātrā Inspired)
        ======================================================== */}
        <div className="relative py-3.5 bg-[#121216] border-y border-[#27272A] overflow-hidden select-none -mx-4 sm:-mx-6 lg:-mx-8 shadow-inner">
          <div className="stats-marquee flex items-center gap-8 whitespace-nowrap text-xs font-semibold text-[#A1A1AA] tracking-wide font-mono">
            <span>✦ ₹1.84 Crores Consideration Protected</span>
            <span className="text-[#FF2A1A]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
            <span>⚡ 800ms Notice Compilation Speed</span>
            <span className="text-[#10B981]">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
            <span>⏱️ Rule 4(5) 48-Hour Grievance SLA</span>
            <span className="text-[#FF2A1A]">🛡️ Appario, Flipkart, Croma, Reliance Deflections Dismantled</span>
            <span>✦ ₹1.84 Crores Consideration Protected</span>
            <span className="text-[#FF2A1A]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
            <span>⚡ 800ms Notice Compilation Speed</span>
            <span className="text-[#10B981]">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
          </div>
        </div>

        {/* ========================================================
            4. 4 INTERACTIVE BENTO DEMO CARDS (The Tactile Sandbox)
        ======================================================== */}
        <section>
          <LandingInteractiveDemos />
        </section>

        {/* ========================================================
            5. FIGMA/CANVA INTERACTIVE DEFENSE STUDIO (APIx Inspired)
        ======================================================== */}
        <section>
          <DefenseStudio />
        </section>

        {/* ========================================================
            6. INTERACTIVE 3D TERMINAL PLAYGROUND (APIx Inspired)
        ======================================================== */}
        <section>
          <LiveTerminalPlayground />
        </section>

        {/* ========================================================
            7. NARRATIVE CASE TIMELINE JOURNEY WITH SPOKEN AUDIO (Yātrā Inspired)
        ======================================================== */}
        <section>
          <CaseTimelineJourney />
        </section>

        {/* ========================================================
            8. WALL OF STATUTORY RESTITUTION (Yātrā Field Notes)
        ======================================================== */}
        <section>
          <FieldNotesMarquee />
        </section>

        {/* ========================================================
            9. TECHNICAL BENCHMARKS (APIx Inspired)
        ======================================================== */}
        <section>
          <TechnicalBenchmarks />
        </section>

        {/* ========================================================
            10. FREQUENTLY ASKED QUESTIONS (APIx Inspired)
        ======================================================== */}
        <section>
          <FaqAccordion />
        </section>

        {/* ========================================================
            11. BOTTOM LAUNCH CALL TO ACTION
        ======================================================== */}
        <section className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#18181D] via-[#121216] to-[#251014] border border-[#FF2A1A]/40 text-center space-y-5 shadow-2xl max-w-4xl mx-auto">
          <span className="w-14 h-14 rounded-2xl bg-[#FF2A1A] text-white mx-auto flex items-center justify-center shadow-xl shadow-[#FF2A1A]/40">
            <Scale className="w-7 h-7" />
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ready to Enforce Your Statutory Consumer Rights?
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
            Upload an e-commerce invoice PDF or select a curated receipt to compile your formal statutory notice in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleLaunchCockpit}
              className="btn-press px-6 py-3.5 rounded-xl bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#FF2A1A]/35 flex items-center gap-2"
            >
              <span>Open Dispute Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn-press px-5 py-3.5 rounded-xl bg-[#141418] hover:bg-[#202027] text-white border border-[#27272A] hover:border-[#FF2A1A]/60 font-semibold text-xs sm:text-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#FF6E63]" />
              <span>Demo Login</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
