'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Volume2, Copy, Check, Clock, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';

interface CaseStep {
  step: string;
  time: string;
  badge: string;
  title: string;
  description: string;
  counterPhrase: string;
  audioSpeech: string;
  artifactLabel: string;
  stat1: { label: string; value: string; color: string };
  stat2: { label: string; value: string; color: string };
  stat3: { label: string; value: string; color: string };
}

const CASE_STEPS: CaseStep[] = [
  {
    step: '01',
    time: 'Day 28 · 09:15 AM',
    badge: 'Hardware Failure',
    title: 'The Manufacturing Defect Emerges',
    description: 'Twenty-eight days after unboxing, the right audio driver of your ₹24,990 Sony WH-1000XM5 headphones completely dies with high-pitched feedback. The defect is physical and unprovoked.',
    counterPhrase: 'Notice is served under CPA 2019 Section 84: Manufacturing defects within implied warranty are the strict statutory liability of the manufacturer and seller.',
    audioSpeech: 'Notice is served under Consumer Protection Act 2019 Section 84. Manufacturing defects are the strict statutory liability of the manufacturer and seller.',
    artifactLabel: 'PHYSICAL FAILURE AUDIT',
    stat1: { label: 'DEFECT TYPE', value: 'ANC Driver Failure', color: 'text-[#F87171]' },
    stat2: { label: 'ELAPSED', value: '28 Days Since Delivery', color: 'text-white' },
    stat3: { label: 'CONSIDERATION', value: '₹24,990.00 Paid', color: 'text-[#FF2A1A]' }
  },
  {
    step: '02',
    time: 'Day 28 · 10:30 AM',
    badge: 'Automated Platform Deflection',
    title: 'Customer Care Rejection: "7-Day Return Policy Expired"',
    description: 'You open the e-commerce app support chat. The automated bot rejects the return request instantly: "Return policy expired after 7 days. Please take the unit to an authorized service center 45 km away."',
    counterPhrase: 'As per Rule 6(3) of Consumer Protection (E-Commerce) Rules 2020, contractual 7-day return policies are void against latent manufacturing defects.',
    audioSpeech: 'As per Rule 6 sub-rule 3 of Consumer Protection E-Commerce Rules 2020, contractual 7-day return policies are void against latent manufacturing defects.',
    artifactLabel: 'PLATFORM DEFLECTION INTERCEPTED',
    stat1: { label: 'BOT CLAIM', value: '7-Day Window Expired', color: 'text-[#F87171]' },
    stat2: { label: 'SERVICE CENTER', value: '45 km Away', color: 'text-[#A1A1AA]' },
    stat3: { label: 'CONTRACT CLAUSE', value: 'Void Ab Initio', color: 'text-[#34D399]' }
  },
  {
    step: '03',
    time: 'Day 28 · 11:15 AM',
    badge: 'Statutory Notice Strike',
    title: 'FinePrint Compiles Enforceable Statutory Notice',
    description: 'FinePrint ingests the invoice PDF, identifies Appario Retail Pvt Ltd and Sony India, and drafts a formal statutory notice packet with 9% compound interest and a strict 48-hour SLA citing Rule 4(5).',
    counterPhrase: 'Formal Demand: Immediate replacement or ₹24,990 refund with ₹10,000 mental agony damages within 48 hours, failing which NCDRC proceedings commence.',
    audioSpeech: 'Formal Demand: Immediate replacement or 24,990 rupee refund with 10,000 rupee damages within 48 hours, failing which NCDRC proceedings commence.',
    artifactLabel: 'ENFORCEABLE STATUTORY DOCKET',
    stat1: { label: 'STATUTORY SECTION', value: 'CPA 2019 § 84', color: 'text-[#FF2A1A]' },
    stat2: { label: 'SLA WINDOW', value: 'Rule 4(5) 48 Hours', color: 'text-[#34D399]' },
    stat3: { label: 'TOTAL CLAIM', value: '₹44,990 Restitution', color: 'text-white' }
  },
  {
    step: '04',
    time: 'Day 30 · 03:45 PM',
    badge: 'Full Restitution',
    title: 'Senior Grievance Officer Authorizes Full Refund',
    description: 'Confronted with codified statutory liability rather than emotional messages, the senior escalation desk waives the 7-day policy, schedules doorstep reverse pickup, and processes the full ₹24,990 refund.',
    counterPhrase: 'Case Resolved: Reverse pickup completed, full consideration ₹24,990 credited to original payment method.',
    audioSpeech: 'Case Resolved. Reverse pickup completed, full consideration 24,990 rupees credited to original payment method.',
    artifactLabel: 'RESTITUTION EXECUTED',
    stat1: { label: 'RESOLUTION', value: 'Full Refund Credited', color: 'text-[#34D399]' },
    stat2: { label: 'TAT', value: '54 Hours Total', color: 'text-white' },
    stat3: { label: 'SAVED', value: '₹24,990 Preserved', color: 'text-[#34D399]' }
  }
];

export const CaseTimelineJourney: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAutoLooping, setIsAutoLooping] = useState(true);

  const activeStep = CASE_STEPS[activeStepIndex];

  // Auto-advance loop every 6 seconds unless paused
  useEffect(() => {
    if (!isAutoLooping) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % CASE_STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoLooping]);

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="journey" className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2A1A]/15 border border-[#FF2A1A]/30 text-[11px] font-mono font-bold text-[#FF6E63] uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Case Lifecycle Narrative</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          A Real Consumer Dispute: From Glitch to Restitution
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          See how an ordinary buyer reclaimed ₹24,990 from Appario Retail when Sony and the platform tried to hide behind a 7-day policy.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div 
        className="max-w-4xl mx-auto bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 select-none"
        onMouseEnter={() => setIsAutoLooping(false)}
        onMouseLeave={() => setIsAutoLooping(true)}
      >
        {/* Step Indicator Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-[#27272A] pb-4">
          {CASE_STEPS.map((s, idx) => {
            const isCurrent = activeStepIndex === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  "p-2.5 rounded-xl text-left transition-all border",
                  isCurrent
                    ? "bg-[#18181D] border-[#FF2A1A] shadow-md shadow-[#FF2A1A]/20"
                    : "bg-[#121216] border-[#27272A] hover:border-[#3F3F46]"
                )}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={cn(
                    "font-bold",
                    isCurrent ? "text-[#FF2A1A]" : "text-[#71717A]"
                  )}>
                    STAGE {s.step}
                  </span>
                  <span className="text-[#52525B] text-[9px]">{s.time.split('·')[0].trim()}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {s.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Narrative Text */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#18181D] border border-[#27272A] text-[10px] font-mono text-[#A1A1AA]">
                {activeStep.time}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF2A1A]/20 border border-[#FF2A1A]/35 text-[#FF6E63] text-[10px] font-bold uppercase font-mono">
                {activeStep.badge}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeStep.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              {activeStep.description}
            </p>

            {/* Spoken Statutory Defense Box */}
            <div className="p-3.5 rounded-2xl bg-[#18181D] border border-[#27272A] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6E63] font-bold block">
                Statutory Defense Citation:
              </span>
              <p className="text-xs text-white italic leading-relaxed">
                &ldquo;{activeStep.counterPhrase}&rdquo;
              </p>

              {/* Spoken Audio & Copy Controls */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#27272A]">
                <button
                  onClick={() => handleSpeak(activeStep.audioSpeech)}
                  className="btn-press flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-semibold text-xs shadow-md shadow-[#FF2A1A]/30"
                >
                  <SoundWaveVisualizer isPlaying={isPlayingAudio} />
                  <span>{isPlayingAudio ? "Speaking Defense..." : "Play Spoken Defense"}</span>
                </button>
                <button
                  onClick={() => handleCopyPhrase(activeStep.counterPhrase)}
                  className="btn-press px-3 py-1.5 rounded-lg border border-[#27272A] bg-[#18181D] hover:bg-[#202027] text-xs text-[#D4D4D8] font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Artifact Telemetry Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#18181D] border border-[#27272A] space-y-3.5 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-bold block pb-1 border-b border-[#27272A]">
              {activeStep.artifactLabel}
            </span>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-[#121216] border border-[#27272A]">
                <span className="text-[9px] uppercase font-mono text-[#71717A] block">
                  {activeStep.stat1.label}
                </span>
                <strong className={cn("text-xs font-bold block", activeStep.stat1.color)}>
                  {activeStep.stat1.value}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121216] border border-[#27272A]">
                <span className="text-[9px] uppercase font-mono text-[#71717A] block">
                  {activeStep.stat2.label}
                </span>
                <strong className={cn("text-xs font-bold block", activeStep.stat2.color)}>
                  {activeStep.stat2.value}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121216] border border-[#27272A]">
                <span className="text-[9px] uppercase font-mono text-[#71717A] block">
                  {activeStep.stat3.label}
                </span>
                <strong className={cn("text-xs font-bold block", activeStep.stat3.color)}>
                  {activeStep.stat3.value}
                </strong>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-[#10B981] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ground-Truth Verification Passed</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
