'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSearch, Scale, Calculator, Send, CheckCircle2, 
  ExternalLink, Sparkles, AlertCircle, ShieldCheck, 
  Clock, ArrowRight 
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

  // Auto-advance stepper every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F7] border border-[#E5E2DC] text-[11px] font-mono font-bold text-[#C83625] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Figma/Canva Interactive Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181716] tracking-tight">
          How FinePrint Dismantles Platform Deflections
        </h2>
        <p className="text-xs sm:text-sm text-[#736E65]">
          Step into our autonomous statutory pipeline and watch real-time legal engineering in action.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-5xl mx-auto">
        
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
                    ? "bg-[#FFFFFF] border-[#C83625] shadow-md shadow-[#C83625]/10"
                    : "bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] border-[#E5E2DC] hover:border-[#D4D0C7]"
                )}
              >
                {/* Step Indicator & Animated Vertical Bar */}
                <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                  <span className={cn(
                    "font-mono text-xs font-extrabold tracking-tight",
                    isActive ? "text-[#C83625]" : "text-[#736E65]"
                  )}>
                    {stage.num}
                  </span>
                  <div className="w-[3px] h-10 bg-[#E5E2DC] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "w-full bg-[#C83625] rounded-full transition-all duration-300",
                        isActive ? "h-full" : "h-0"
                      )} 
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1 min-w-0 flex-1">
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-wider font-bold block",
                    isActive ? "text-[#C83625]" : "text-[#736E65]"
                  )}>
                    {stage.badge}
                  </span>
                  <h3 className="text-sm font-bold text-[#181716] tracking-tight truncate">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#524E47] leading-relaxed line-clamp-2">
                    {stage.desc}
                  </p>
                  
                  {/* Micro Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {stage.tags.map((t) => (
                      <span
                        key={t}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono",
                          isActive
                            ? "bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9]"
                            : "bg-[#FAF9F7] text-[#736E65] border border-[#E5E2DC]"
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

        {/* Right Canvas Artboard with Floating Figma Cursors */}
        <div 
          className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl shadow-xl shadow-[#181716]/5 flex flex-col overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Dot Grid Background */}
          <div className="canvas-dot-grid absolute inset-0 pointer-events-none opacity-40" />

          {/* Floating Figma Collaborator Cursors (APIx Inspired) */}
          <div className="absolute top-14 right-10 z-20 pointer-events-none animate-cursor-1 hidden sm:flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C83625" className="drop-shadow-sm">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
            <span className="px-2 py-0.5 rounded-md bg-[#C83625] text-white text-[10px] font-bold font-mono tracking-wide shadow-xs">
              CCPA · Consumer Court Bench
            </span>
          </div>

          <div className="absolute bottom-14 left-8 z-20 pointer-events-none animate-cursor-2 hidden sm:flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#4F46E5" className="drop-shadow-sm">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
            <span className="px-2 py-0.5 rounded-md bg-[#4F46E5] text-white text-[10px] font-bold font-mono tracking-wide shadow-xs">
              NCDRC · Precedent Bench
            </span>
          </div>

          <div className="absolute top-28 left-20 z-20 pointer-events-none animate-cursor-3 hidden sm:flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981" className="drop-shadow-sm">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
            <span className="px-2 py-0.5 rounded-md bg-[#10B981] text-white text-[10px] font-bold font-mono tracking-wide shadow-xs">
              Legal Metrology § 84 Defect Protocol
            </span>
          </div>

          {/* Canvas Chrome Header */}
          <div className="px-4 py-2.5 bg-[#FAF9F7] border-b border-[#E5E2DC] flex items-center justify-between text-xs relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="ml-2 font-mono text-[10px] uppercase font-bold text-[#524E47]">
                LIVE STUDIO CANVAS
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#C83625] font-bold">
                {STAGES[activeStage].badge.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Canvas Body (Dynamic Active View) */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center relative z-10 text-xs">
            
            {/* VIEW 0: Forensic Ingestion Feed */}
            {activeStage === 0 && (
              <div className="space-y-4 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DC]">
                  <span className="font-bold text-[#181716] flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-[#C83625]" />
                    <span>Carrier Invoice Feed Telemetry</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-bold text-[10px]">
                    4 PLATFORMS ACTIVE
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { platform: 'Amazon India', seller: 'Appario Retail Pvt Ltd', product: 'Sony WH-1000XM5 ANC', amount: '₹24,990.00', status: 'Parsed (Glyph Cleaned)' },
                    { platform: 'Flipkart', seller: 'SuperComNet Retail', product: 'Samsung 7kg Front-Load Washing Machine', amount: '₹34,500.00', status: 'Parsed (GST Validated)' },
                    { platform: 'Apple Store', seller: 'Apple India Pvt Ltd', product: 'iPhone 15 Pro 256GB', amount: '₹1,34,900.00', status: 'Parsed (IMEI Mapped)' },
                    { platform: 'Croma', seller: 'Infiniti Retail Ltd', product: 'Whirlpool Pro-Cool Refrigerator', amount: '₹28,490.00', status: 'Parsed (Serial Indexed)' }
                  ].map((row) => (
                    <div key={row.platform} className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] flex items-center justify-between gap-3 text-[11px]">
                      <div className="min-w-0">
                        <strong className="text-[#181716] block">{row.product}</strong>
                        <span className="text-[#736E65] text-[10px]">{row.seller} · {row.platform}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-[#181716] block">{row.amount}</span>
                        <span className="text-[10px] text-[#16A34A] font-semibold">{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] flex items-center justify-around text-center">
                  <div>
                    <span className="font-extrabold text-[#C83625] text-sm block">100%</span>
                    <span className="text-[10px] text-[#736E65] uppercase">Glyphs Cleaned</span>
                  </div>
                  <div className="w-px h-6 bg-[#E5E2DC]" />
                  <div>
                    <span className="font-extrabold text-[#16A34A] text-sm block">0</span>
                    <span className="text-[10px] text-[#736E65] uppercase">Fallback Hallucinations</span>
                  </div>
                  <div className="w-px h-6 bg-[#E5E2DC]" />
                  <div>
                    <span className="font-extrabold text-[#181716] text-sm block">320ms</span>
                    <span className="text-[10px] text-[#736E65] uppercase">Average Parse Time</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: Statutory Decomposition & Damage Stacked Bar */}
            {activeStage === 1 && (
              <div className="space-y-4 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DC]">
                  <span className="font-bold text-[#181716] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#C83625]" />
                    <span>Statutory Damage Stacked Bar</span>
                  </span>
                  <span className="font-mono font-bold text-[#C83625] text-sm">
                    Total: ₹44,990.00
                  </span>
                </div>

                {/* Stacked Damage Bar */}
                <div className="space-y-1.5">
                  <div className="h-5 rounded-lg bg-[#E5E2DC] overflow-hidden flex shadow-inner">
                    <div style={{ width: '55.5%' }} className="bg-[#C83625] h-full" title="Base Consideration: ₹24,990" />
                    <div style={{ width: '2.8%' }} className="bg-[#F59E0B] h-full" title="Statutory 9% Interest: ₹1,250" />
                    <div style={{ width: '33.3%' }} className="bg-[#4F46E5] h-full" title="Mental Agony Damages: ₹15,000" />
                    <div style={{ width: '8.4%' }} className="bg-[#10B981] h-full" title="Litigation Expenses: ₹3,750" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#C83625]" />
                      <span>Base: ₹24,990</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]" />
                      <span>9% Int.: ₹1,250</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#4F46E5]" />
                      <span>Damages: ₹15,000</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
                      <span>Costs: ₹3,750</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#166534] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Statutory Authority: NCDRC Landmark Ratio</span>
                  </div>
                  <p className="text-[11px] text-[#14532D] leading-relaxed">
                    Under CPA 2019 Section 84, manufacturer cannot escape liability by pointing to a marketplace platform. When replacement is delayed beyond 30 days, 9% interest is statutory.
                  </p>
                </div>
              </div>
            )}

            {/* VIEW 2: Rules Engine Evaluation Matrix */}
            {activeStage === 2 && (
              <div className="space-y-3.5 animate-enter">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DC]">
                  <span className="font-bold text-[#181716] flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#C83625]" />
                    <span>Deterministic Codified Rule Matrix</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                    4/4 CODIFIED CHECKS PASS
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { rule: 'CPA 2019 Section 84', desc: 'Product Manufacturer Liability for Manufacturing Defects', status: 'PASS', score: '98%' },
                    { rule: 'E-Commerce Rules Rule 6(3)', desc: 'Overrides 7-day contractual platform return barrier', status: 'PASS', score: '100%' },
                    { rule: 'E-Commerce Rules Rule 4(5)', desc: '48-hour mandatory Grievance Officer acknowledgement clock', status: 'ACTIVE', score: '48h SLA' },
                    { rule: 'BSA 2023 / Section 65B', desc: 'Cryptographic SHA-256 evidence certificate hashing', status: 'VERIFIED', score: 'SHA-256' }
                  ].map((item) => (
                    <div key={item.rule} className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-[#181716] block">{item.rule}</strong>
                        <span className="text-[#736E65] text-[10px]">{item.desc}</span>
                      </div>
                      <span className="font-mono font-bold text-[#16A34A] px-2 py-0.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[10px]">
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
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DC]">
                  <span className="font-bold text-[#181716] flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#C83625]" />
                    <span>Instant Multi-Channel Dispatch Payload</span>
                  </span>
                  <span className="text-[10px] text-[#C83625] font-bold font-mono">
                    RULE 4(5) 48H SLA READY
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] space-y-1 text-center">
                    <span className="text-xl">📄</span>
                    <strong className="block text-[#181716] text-xs">Court Notice PDF</strong>
                    <span className="text-[10px] text-[#736E65] block">Section 65B certified legal format</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] space-y-1 text-center">
                    <span className="text-xl">💬</span>
                    <strong className="block text-[#181716] text-xs">WhatsApp Concierge</strong>
                    <span className="text-[10px] text-[#736E65] block">Pre-formatted legal escalation text</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] space-y-1 text-center">
                    <span className="text-xl">🏛️</span>
                    <strong className="block text-[#181716] text-xs">NCH 1915 Filing</strong>
                    <span className="text-[10px] text-[#736E65] block">Direct e-Daakhil payload bundle</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FDF4F2] border border-[#F8CFC9] flex items-center justify-between text-xs">
                  <span className="text-[#C83625] font-bold">1-Click Test: Dispatch Formal Notice</span>
                  <span className="px-3 py-1 rounded-lg bg-[#C83625] text-white font-bold text-[10px] shadow-xs">
                    Ready to Ship
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Canvas Footer */}
          <div className="px-4 py-2 bg-[#FAF9F7] border-t border-[#E5E2DC] flex items-center justify-between text-[11px] text-[#736E65] relative z-10">
            <span>Deterministic Legal Engine: Zero Free-Form LLM Hallucinations</span>
            <span className="font-mono text-[#181716] font-semibold">CPA 2019 Verified</span>
          </div>

        </div>

      </div>
    </div>
  );
};
