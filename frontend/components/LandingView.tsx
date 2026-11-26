'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, ArrowRight, ShieldCheck, CheckCircle2, 
  XCircle, Zap, FileText, ChevronDown, Lock, 
  Sparkles, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, Terminal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TabType } from './Header';
import { LandingHeroNetwork } from './LandingHeroNetwork';
import { LandingInteractiveDemos } from './LandingInteractiveDemos';
import { LiveTerminalPlayground } from './LiveTerminalPlayground';
import { DefenseStudio } from './DefenseStudio';
import { CaseTimelineJourney } from './CaseTimelineJourney';
import { FieldNotesMarquee } from './FieldNotesMarquee';
import { TechnicalBenchmarks } from './TechnicalBenchmarks';
import { FaqAccordion } from './FaqAccordion';

interface LandingViewProps {
  onNavigate: (tab: TabType) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <div className="space-y-20 animate-enter select-none pb-16 relative">
      {/* ========================================================
          0. DYNAMIC TOP SCROLL PROGRESS BAR (Yātrā Inspired)
      ======================================================== */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C83625] via-[#F35944] to-[#B32E1F] z-[100] origin-left pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_10px_rgba(200,54,37,0.5)]"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* ========================================================
          1. HERO SECTION WITH ARCHITECTURAL HAIRLINE GUIDES & ANNOTATIONS
      ======================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-4">
        
        {/* Floating Mono Annotations (APIx Inspired) */}
        <div className="hidden xl:block absolute top-4 left-0 font-mono text-[10px] text-[#A39E93] uppercase tracking-wider animate-anno-float pointer-events-none">
          [SYS.PROTOCOL: MCP STDIO JSON-RPC 2.0]
        </div>
        <div className="hidden xl:block absolute top-12 right-0 font-mono text-[10px] text-[#A39E93] uppercase tracking-wider animate-anno-float [animation-delay:1.5s] pointer-events-none">
          [STATUTORY: CPA 2019 § 84–87]
        </div>
        <div className="hidden xl:block absolute bottom-2 left-6 font-mono text-[10px] text-[#A39E93] uppercase tracking-wider animate-anno-float [animation-delay:3s] pointer-events-none">
          [SLA: RULE 4(5) 48H/30D]
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Hero Statement & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            
            {/* Supersonic Proximity Pill Badge (APIx Inspired) */}
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E2DC] text-[#C83625] text-xs font-semibold tracking-wide shadow-sm hover:border-[#C83625] transition-all group">
              <span className="w-2 h-2 rounded-full bg-[#C83625] animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider shimmer-text">
                Autonomous Statutory Consumer Advocate
              </span>
              <span className="text-[10px] text-[#A39E93] font-mono border-l border-[#E5E2DC] pl-2 hidden sm:inline">
                CPA 2019
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.04] text-[#181716]">
              Codified Law.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83625] via-[#F35944] to-[#B32E1F]">
                Unforgiving Defense.
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-sm sm:text-base text-[#524E47] max-w-xl leading-relaxed">
              When e-commerce platforms falsely claim your warranty return window expired after 7 days, FinePrint compiles enforceable statutory notices citing <b>CPA 2019 Section 84</b> and <b>E-Commerce Rules Rule 6(3)</b> in 800 milliseconds.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('cockpit')}
                className="btn-press px-6 py-3.5 rounded-2xl bg-[#C83625] hover:bg-[#B32E1F] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#C83625]/25 hover:-translate-y-0.5 transition-all"
              >
                <span>Launch Dispute Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="btn-press px-5 py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF9F7] text-[#181716] border border-[#E5E2DC] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:border-[#C83625]/40 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#C83625]" />
                <span>Talk to AI Advocate</span>
              </button>

              <button
                onClick={() => onNavigate('statutes')}
                className="btn-press px-4 py-3.5 rounded-2xl bg-[#FAF9F7] hover:bg-[#FDF4F2] text-[#736E65] hover:text-[#C83625] border border-[#E5E2DC] font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Codified Rules</span>
              </button>
            </div>

            {/* Micro Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#736E65] font-medium pt-3 border-t border-[#E5E2DC]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>100% CPA 2019 Ground-Truth</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Zero Hallucinations (PyTest Verified)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
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
          2. INFINITE TELEMETRY MARQUEE (Yātrā & APIx Inspired)
      ======================================================== */}
      <div className="relative py-3.5 bg-[#FAF9F7] border-y border-[#E5E2DC] overflow-hidden select-none -mx-4 md:-mx-8">
        <div className="stats-marquee flex items-center gap-8 whitespace-nowrap text-xs font-semibold text-[#524E47] tracking-wide font-mono">
          <span>✦ ₹1.84 Crores Consideration Protected</span>
          <span className="text-[#C83625]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
          <span>⚡ 800ms Notice Compilation Speed</span>
          <span className="text-[#16A34A]">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
          <span>⏱️ Rule 4(5) 48-Hour Grievance SLA</span>
          <span className="text-[#C83625]">🛡️ Appario, Flipkart, Croma, Reliance Deflections Dismantled</span>
          <span>✦ ₹1.84 Crores Consideration Protected</span>
          <span className="text-[#C83625]">⚖️ 100% CPA 2019 Section 84 Ground-Truth</span>
          <span>⚡ 800ms Notice Compilation Speed</span>
          <span className="text-[#16A34A]">✓ 0% Cited Citations Hallucinated (PyTest Verified)</span>
        </div>
      </div>

      {/* ========================================================
          3. 4 INTERACTIVE BENTO DEMO CARDS (The Tactile Sandbox)
      ======================================================== */}
      <section>
        <LandingInteractiveDemos />
      </section>

      {/* ========================================================
          4. FIGMA/CANVA INTERACTIVE DEFENSE STUDIO (APIx Inspired)
      ======================================================== */}
      <section>
        <DefenseStudio />
      </section>

      {/* ========================================================
          5. INTERACTIVE 3D TERMINAL PLAYGROUND (APIx Inspired)
      ======================================================== */}
      <section>
        <LiveTerminalPlayground />
      </section>

      {/* ========================================================
          6. NARRATIVE CASE TIMELINE JOURNEY WITH SPOKEN AUDIO (Yātrā Inspired)
      ======================================================== */}
      <section>
        <CaseTimelineJourney />
      </section>

      {/* ========================================================
          7. THE OLD WAY VS THE FINEPRINT WAY (Comparison Matrix)
      ======================================================== */}
      <section className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C83625] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF4F2] border border-[#F8CFC9]">
            The Structural Advantage
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181716]">
            The Corporate Trap vs The FinePrint Way
          </h3>
          <p className="text-xs text-[#736E65]">
            Why manual customer care complaints fail and how deterministic statutory engineering wins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Old Way */}
          <div className="p-5 rounded-2xl bg-[#FFF1F2]/50 border border-[#FECDD3] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#FECDD3]">
              <span className="font-bold text-[#9F1239] uppercase font-mono text-[11px] flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-[#E11D48]" />
                <span>The Manual Complaint Trap</span>
              </span>
              <span className="text-[10px] text-[#E11D48] font-bold">14–30 Days Lost</span>
            </div>

            <ul className="space-y-2.5 text-[#881337] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] font-bold">✕</span>
                <span><b>7-Day Platform Barrier:</b> Automated bots reject return tickets on Day 8 with scripted apologies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] font-bold">✕</span>
                <span><b>Service Center Runaround:</b> Consumers forced to physically visit remote service centers and wait weeks for diagnostics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] font-bold">✕</span>
                <span><b>&quot;No Spare Parts&quot; Refusal:</b> Service centers refuse repair citing supply chain delays without replacement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] font-bold">✕</span>
                <span><b>Unanchored Complaints:</b> Consumers submit emotional, vague emails that customer service easily deflects.</span>
              </li>
            </ul>
          </div>

          {/* FinePrint Way */}
          <div className="p-5 rounded-2xl bg-[#F0FDF4]/50 border border-[#BBF7D0] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#BBF7D0]">
              <span className="font-bold text-[#166534] uppercase font-mono text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>The FinePrint Statutory Standard</span>
              </span>
              <span className="text-[10px] text-[#16A34A] font-bold">&lt; 800ms Compilation</span>
            </div>

            <ul className="space-y-2.5 text-[#14532D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><b>Deterministic Rule 6(3) Overhaul:</b> Codified citation proves contractual 7-day policy is legally void against manufacturing defects.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><b>Mandatory 48-Hour SLA:</b> Cites Rule 4(5) requiring the designated Grievance Officer to acknowledge within 48h.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><b>Zero-Hallucination Guardrails:</b> Strict AST classifier ensures zero fabricated case citations or false claims.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><b>Multi-Channel Dispatch:</b> Generates court-ready PDF Notice, WhatsApp business copy, and NCH 1915 filing text simultaneously.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. WALL OF STATUTORY RESTITUTION (Yātrā Inspired)
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
      <section className="rounded-3xl p-8 bg-gradient-to-br from-[#FFFFFF] via-[#FAF9F7] to-[#FDF4F2] border border-[#F8CFC9] text-center space-y-4 shadow-md max-w-4xl mx-auto">
        <span className="w-12 h-12 rounded-2xl bg-[#C83625] text-white mx-auto flex items-center justify-center shadow-md shadow-[#C83625]/20">
          <Scale className="w-6 h-6" />
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181716]">
          Ready to Enforce Your Statutory Consumer Rights?
        </h3>
        <p className="text-xs text-[#736E65] max-w-md mx-auto leading-relaxed">
          Upload an e-commerce invoice PDF or select a curated receipt to compile your formal statutory notice in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('cockpit')}
            className="btn-press px-6 py-3 rounded-xl bg-[#C83625] hover:bg-[#B32E1F] text-white font-bold text-xs shadow-md shadow-[#C83625]/20 flex items-center gap-2"
          >
            <span>Open Dispute Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('benchmark')}
            className="btn-press px-5 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F7] text-[#181716] border border-[#E5E2DC] font-semibold text-xs flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-[#C83625]" />
            <span>View Architecture Radar</span>
          </button>
        </div>
      </section>

    </div>
  );
};
