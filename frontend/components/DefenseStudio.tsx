'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FileSearch, Scale, Calculator, Send, CheckCircle2, 
  Sparkles, AlertCircle, ShieldCheck, Clock, ArrowRight 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Stage {
  num: string;
  badge: string;
  title: string;
  desc: string;
  tags: string[];
}

const STAGES: Stage[] = [
  {
    num: '01',
    badge: 'Stage 01 · Forensic Ingestion',
    title: 'Multi-Format Invoice Scanner',
    desc: 'Sanitizes PDF font glyph tables, cleans Rupee symbol corruption (n-prefix), and captures wrapped product model rows from Amazon, Flipkart, Apple, and Croma.',
    tags: ['pdfplumber', 'Glyph Sanitizer', 'Regex Multi-Pass', 'Zero Fallback']
  },
  {
    num: '02',
    badge: 'Stage 02 · Statutory Decomposition',
    title: 'CPA 2019 AST Rules Engine',
    desc: 'Maps defect facts directly against CPA 2019 Sections 84–87. Overrides platform 7-day contractual return policies under E-Commerce Rules 2020 Rule 6(3).',
    tags: ['CPA 2019 § 84', 'Rule 6(3) Overhaul', 'Zero Hallucination', 'Strict AST']
  },
  {
    num: '03',
    badge: 'Stage 03 · Restitution Computation',
    title: 'Multilateral Damage Calculator',
    desc: 'Computes total claim consideration, compound statutory interest at 9% p.a., mental agony damages, and litigation expenses backed by NCDRC precedents.',
    tags: ['9% Statutory Int.', 'Mental Agony § 84', 'NCDRC Precedents', 'Tabular Nums']
  },
  {
    num: '04',
    badge: 'Stage 04 · Multi-Channel Dispatch',
    title: 'Notice Packet & SLA Telemetry',
    desc: 'Generates court-admissible PDF legal notice, prepares automated WhatsApp business text, and compiles structured filing payload for National Consumer Helpline 1915.',
    tags: ['NCH 1915', 'WhatsApp API', 'Sec 65B Certificate', 'Rule 4(5) 48h SLA']
  }
];

export const DefenseStudio: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance stepper every 6s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div id="studio" className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161B] border border-[#27272A] text-[11px] font-mono font-bold text-[#FF2A1A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Statutory Studio</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How FinePrint Dismantles Platform Deflections
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Step into our autonomous statutory pipeline and watch real-time legal engineering in action.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-5xl mx-auto select-none">
        
        {/* Left Workflow Stepper */}
        <div 
          className="lg:col-span-5 flex flex-col justify-between gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.num}
                onClick={() => setActiveStage(idx)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none text-left flex gap-3.5 items-start",
                  isActive
                    ? "bg-[#18181D] border-[#FF2A1A] shadow-lg shadow-black/60"
                    : "bg-[#121216] hover:bg-[#16161B] border-[#27272A]"
                )}
              >
                <span className={cn(
                  "font-mono text-xs font-bold px-2 py-0.5 rounded transition-colors shrink-0",
                  isActive
                    ? "bg-[#FF2A1A] text-white"
                    : "bg-[#1E1E24] text-[#A1A1AA]"
                )}>
                  {stage.num}
                </span>

                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#FF2A1A]">
                    {stage.badge}
                  </div>
                  <h3 className="font-display font-bold text-sm text-white leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                    {stage.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {stage.tags.map((t) => (
                      <span
                        key={t}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono",
                          isActive
                            ? "bg-[#251014] text-[#FF6E63] border border-[#FF2A1A]/30"
                            : "bg-[#16161B] text-[#71717A] border border-[#27272A]"
                        )}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Canvas Artboard */}
        <div 
          className="lg:col-span-7 bg-[#121216] border border-[#27272A] rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Dot Grid Background */}
          <div className="canvas-dot-grid absolute inset-0 pointer-events-none opacity-20" />

          {/* Canvas Chrome Header */}
          <div className="px-4 py-2.5 bg-[#16161B] border-b border-[#27272A] flex items-center justify-between text-xs relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A1A]" />
              <span className="ml-2 font-mono text-[10px] uppercase font-bold text-[#A1A1AA]">
                LIVE STUDIO CANVAS
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
              <span className="text-white font-bold">
                {STAGES[activeStage].badge.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Canvas Body (Dynamic Active View) */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center relative z-10 text-xs">
            
            {/* VIEW 0: Forensic Ingestion Feed */}
            {activeStage === 0 && (
              <div className="space-y-4 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                  <span className="font-bold text-white flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-[#FF2A1A]" />
                    <span>Carrier Invoice Feed Telemetry</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#18181D] border border-[#27272A] text-white font-bold text-[10px]">
                    4 PLATFORMS ACTIVE
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { platform: 'Amazon India', seller: 'Appario Retail Pvt Ltd', product: 'Sony WH-1000XM5 ANC', amount: '₹24,990.00', status: 'Parsed (Glyph Cleaned)' },
                    { platform: 'Flipkart', seller: 'SuperComNet Retail', product: 'Samsung 7kg Washing Machine', amount: '₹34,500.00', status: 'Parsed (GST Validated)' },
                    { platform: 'Apple Store', seller: 'Apple India Pvt Ltd', product: 'iPhone 15 Pro 256GB', amount: '₹1,34,900.00', status: 'Parsed (IMEI Mapped)' },
                    { platform: 'Croma', seller: 'Infiniti Retail Ltd', product: 'Whirlpool Refrigerator', amount: '₹28,490.00', status: 'Parsed (Serial Indexed)' }
                  ].map((row) => (
                    <div key={row.platform} className="p-2.5 rounded-xl bg-[#16161B] border border-[#27272A] flex items-center justify-between gap-3 text-[11px]">
                      <div className="min-w-0">
                        <strong className="text-white block">{row.product}</strong>
                        <span className="text-[#A1A1AA] text-[10px]">{row.seller} · {row.platform}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-white block">{row.amount}</span>
                        <span className="text-[10px] text-white font-semibold">{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#16161B] border border-[#27272A] flex items-center justify-around text-center">
                  <div>
                    <span className="font-extrabold text-[#FF2A1A] text-sm block">100%</span>
                    <span className="text-[10px] text-[#71717A] uppercase">Glyphs Cleaned</span>
                  </div>
                  <div className="w-px h-6 bg-[#27272A]" />
                  <div>
                    <span className="font-extrabold text-white text-sm block">0</span>
                    <span className="text-[10px] text-[#71717A] uppercase">Fallback Errors</span>
                  </div>
                  <div className="w-px h-6 bg-[#27272A]" />
                  <div>
                    <span className="font-extrabold text-white text-sm block">320ms</span>
                    <span className="text-[10px] text-[#71717A] uppercase">Avg Parse Time</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: Statutory Decomposition & CAD Schematic */}
            {activeStage === 1 && (
              <div className="space-y-3.5 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#FF2A1A]" />
                    <span>Statutory CAD Blueprint Cross-Section</span>
                  </span>
                  <span className="font-mono font-bold text-[#FF2A1A] text-xs">
                    CPA 2019 § 84 AST
                  </span>
                </div>

                {/* CAD Schematic Architectural Image Preview */}
                <div className="relative w-full aspect-[16/8] rounded-xl overflow-hidden border border-[#27272A] bg-[#09090B]">
                  <Image
                    src="/images/fineprint_schematic.jpg"
                    alt="FinePrint CAD Statutory Decomposition Schematic"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#121216]/90 border border-[#27272A] text-[9px] font-mono text-white font-bold">
                    CAD CROSS-SECTION ACTIVE
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#16161B] border border-[#27272A] space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#FF2A1A]" />
                    <span>Statutory Authority: NCDRC Landmark Ratio</span>
                  </div>
                  <p className="text-[11px] text-[#D4D4D8] leading-relaxed">
                    Under CPA 2019 Section 84, manufacturer cannot escape liability by pointing to a marketplace platform. Inherent defect guarantees persist through full express warranty.
                  </p>
                </div>
              </div>
            )}

            {/* VIEW 2: Restitution & Rules Engine Matrix */}
            {activeStage === 2 && (
              <div className="space-y-3.5 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#FF2A1A]" />
                    <span>Multilateral Restitution Computation</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-white bg-[#18181D] px-2 py-0.5 rounded-full border border-[#27272A]">
                    4/4 CHECKS PASS
                  </span>
                </div>

                {/* Stacked Damage Bar */}
                <div className="space-y-1.5 p-3 rounded-xl bg-[#16161B] border border-[#27272A]">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#A1A1AA]">Claim Recovery Consideration:</span>
                    <span className="text-white font-bold">₹44,990.00</span>
                  </div>
                  <div className="h-4 rounded-md bg-[#27272A] overflow-hidden flex">
                    <div style={{ width: '55.5%' }} className="bg-[#FF2A1A] h-full" title="Base Consideration: ₹24,990" />
                    <div style={{ width: '2.8%' }} className="bg-[#F59E0B] h-full" title="Statutory 9% Interest: ₹1,250" />
                    <div style={{ width: '33.3%' }} className="bg-[#3B82F6] h-full" title="Mental Agony Damages: ₹15,000" />
                    <div style={{ width: '8.4%' }} className="bg-[#E4E4E7] h-full" title="Litigation Expenses: ₹3,750" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1 text-[#A1A1AA]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-[#FF2A1A]" />
                      <span>Base: ₹24,990</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-[#F59E0B]" />
                      <span>9% Int.: ₹1,250</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-[#3B82F6]" />
                      <span>Damages: ₹15,000</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded bg-[#E4E4E7]" />
                      <span>Costs: ₹3,750</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { rule: 'CPA 2019 Section 84', desc: 'Product Manufacturer Inherent Defect Liability', status: 'PASS', score: '98%' },
                    { rule: 'E-Commerce Rules Rule 6(3)', desc: 'Overrides 7-day contractual platform return barrier', status: 'PASS', score: '100%' },
                  ].map((item) => (
                    <div key={item.rule} className="p-2.5 rounded-xl bg-[#16161B] border border-[#27272A] flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-white block">{item.rule}</strong>
                        <span className="text-[#A1A1AA] text-[10px]">{item.desc}</span>
                      </div>
                      <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-[#18181D] border border-[#27272A] text-[10px]">
                        {item.status} ({item.score})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: Multi-Channel Dispatch Telemetry */}
            {activeStage === 3 && (
              <div className="space-y-4 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#FF2A1A]" />
                    <span>Instant Multi-Channel Dispatch Payload</span>
                  </span>
                  <span className="text-[10px] text-[#FF2A1A] font-bold font-mono">
                    RULE 4(5) 48H SLA READY
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#16161B] border border-[#27272A] space-y-1 text-center">
                    <FileSearch className="w-5 h-5 mx-auto text-[#FF2A1A]" />
                    <strong className="block text-white text-xs">Court Notice PDF</strong>
                    <span className="text-[10px] text-[#A1A1AA] block">Section 65B certified legal format</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16161B] border border-[#27272A] space-y-1 text-center">
                    <Send className="w-5 h-5 mx-auto text-[#FF2A1A]" />
                    <strong className="block text-white text-xs">WhatsApp Concierge</strong>
                    <span className="text-[10px] text-[#A1A1AA] block">Pre-formatted legal escalation text</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16161B] border border-[#27272A] space-y-1 text-center">
                    <Scale className="w-5 h-5 mx-auto text-[#FF2A1A]" />
                    <strong className="block text-white text-xs">NCH 1915 Filing</strong>
                    <span className="text-[10px] text-[#A1A1AA] block">Direct e-Daakhil payload bundle</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#16161B] border border-[#27272A] flex items-center justify-between text-xs">
                  <span className="text-white font-bold">Formal Statutory Pre-Litigation Notice</span>
                  <span className="px-3 py-1 rounded-lg bg-[#FF2A1A] text-white font-bold text-[10px] shadow-md shadow-[#FF2A1A]/20">
                    Ready to Dispatch
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Canvas Footer */}
          <div className="px-4 py-2 bg-[#16161B] border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#71717A] relative z-10">
            <span>Deterministic Legal Engine: Zero Free-Form LLM Hallucinations</span>
            <span className="font-mono text-[#D4D4D8] font-semibold">CPA 2019 Verified</span>
          </div>

        </div>

      </div>
    </div>
  );
};
