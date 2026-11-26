'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, Clock, CheckCircle2, 
  XCircle, Sliders, Zap, Sparkles, Scale, FileText 
} from 'lucide-react';
import { cn, formatINR } from '../lib/utils';

export const LandingInteractiveDemos: React.FC = () => {
  // Demo 1: The 7-Day Window Myth Buster Slider
  const [disputeDay, setDisputeDay] = useState<number>(35);
  const [productPrice, setProductPrice] = useState<number>(24990);

  // Demo 2: Dark Pattern Dismantler
  const [dismantleMode, setDismantleMode] = useState<'bot' | 'statute'>('statute');

  // Demo 3: Forensic Invoice Scanner
  const [invoiceLens, setInvoiceLens] = useState<'raw' | 'sanitized'>('sanitized');

  // Demo 4: SLA Window Speedometer
  const [slaHoursElapsed, setSlaHoursElapsed] = useState<number>(18);

  return (
    <div id="sandbox" className="space-y-6">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2 select-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF2A1A] font-bold px-3 py-1 rounded-full bg-[#16161B] border border-[#27272A]">
          Interactive Statutory Sandbox
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
          4 Deceptions Dismantled in Real Time
        </h2>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          Drag, toggle, and inspect how FinePrint overrides deceptive e-commerce return barriers using codified consumer law.
        </p>
      </div>

      {/* 4 Bento Showcase Cards Grid (Dark Obsidian & Neon Red) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
        
        {/* CARD 1: The 7-Day Window Myth Buster */}
        <div className="rounded-3xl p-6 bg-[#121216] border border-[#27272A] shadow-xl shadow-black/40 hover:-translate-y-1 hover:border-[#FF2A1A]/60 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#18181D] text-white border border-[#27272A] text-xs font-bold font-mono">
                7-DAY WINDOW MYTH BUSTER
              </span>
              <span className="text-[11px] font-mono text-[#A1A1AA]">
                Day <b className="text-white font-bold text-sm tabular-nums">{disputeDay}</b> of Ownership
              </span>
            </div>

            <h3 className="font-display font-bold text-base text-white mb-1 tracking-tight">
              When Does Platform Protection Expire vs Codified Law?
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-5 leading-relaxed">
              Drag the timeline slider to see how marketplaces falsely claim your return rights expired while Section 84 guarantees full statutory liability.
            </p>

            {/* Range Slider */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-mono text-[#71717A]">
                <span>Day 1 (Unboxing)</span>
                <span className="text-[#FF6E63]">Day 7 (Policy Barrier)</span>
                <span>Day 90 (Warranty)</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={disputeDay}
                onChange={(e) => setDisputeDay(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#FF2A1A]"
              />
            </div>

            {/* Side-by-Side Outcome Contrast */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#16161B] border border-[#27272A] text-[#A1A1AA] transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-[#71717A]">
                  Platform Adhesion Clause:
                </span>
                {disputeDay > 7 ? (
                  <div>
                    <div className="font-bold text-xs text-[#E4E4E7] flex items-center gap-1 font-mono">
                      <XCircle className="w-3.5 h-3.5 shrink-0 text-[#FF6E63]" />
                      <span>7-Day Window Expired</span>
                    </div>
                    <div className="text-[11px] text-[#71717A] mt-1 leading-tight">
                      &quot;Contractual return policy closed. Ticket resolved.&quot;
                    </div>
                    <div className="text-[10px] font-mono text-[#FF6E63] mt-2 uppercase font-semibold">
                      Void Ab Initio (CPA §84)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span>Standard Window Open</span>
                    </div>
                    <div className="text-[11px] text-[#A1A1AA] mt-1">
                      Within initial 7-day platform replacement buffer.
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#18181D] border-l-2 border-l-[#FF2A1A] border-y border-r border-[#27272A] text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-[#FF6E63]">
                  CPA 2019 Section 84 Mandate:
                </span>
                <div className="font-bold text-xs text-white flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
                  <span>Strict Liability Active</span>
                </div>
                <div className="text-[11px] text-[#D4D4D8] mt-1 leading-tight">
                  Inherent defects protected throughout full express warranty.
                </div>
                <div className="text-[11px] font-mono text-white mt-2 font-bold tabular-nums">
                  Protected Consideration: {formatINR(productPrice)}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>Statutory Precedent: NCDRC (2022)</span>
            <span className="text-white font-bold">100% Legally Binding</span>
          </div>
        </div>

        {/* CARD 2: Chatbot Deflection Dismantler */}
        <div className="rounded-3xl p-6 bg-[#121216] border border-[#27272A] shadow-xl shadow-black/40 hover:-translate-y-1 hover:border-[#FF2A1A]/60 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#18181D] text-white border border-[#27272A] text-xs font-bold font-mono">
                CHATBOT DISMANTLER
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#18181D] border border-[#27272A] text-[10px] font-mono">
                <button
                  onClick={() => setDismantleMode('bot')}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full transition-all",
                    dismantleMode === 'bot' ? "bg-[#27272A] text-white font-bold" : "text-[#71717A]"
                  )}
                >
                  Standard Bot Script
                </button>
                <button
                  onClick={() => setDismantleMode('statute')}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full transition-all",
                    dismantleMode === 'statute' ? "bg-[#FF2A1A] text-white font-bold" : "text-[#71717A]"
                  )}
                >
                  Rule 6(3) Defense
                </button>
              </div>
            </div>

            <h3 className="font-display font-bold text-base text-white mb-1 tracking-tight">
              Customer Support Script vs Codified Mandate
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Watch how automated deflection scripts crumble when countered with statutory citation references.
            </p>

            {/* Chat simulation */}
            <div className="p-3.5 rounded-2xl bg-[#18181D] border border-[#27272A] space-y-2.5 mb-4 text-xs">
              <div className="flex justify-end">
                <div className="bg-[#27272A] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] text-[11px]">
                  &quot;My headphones right earcup died on day 35. Please arrange replacement or refund.&quot;
                </div>
              </div>

              {dismantleMode === 'bot' ? (
                <div className="flex justify-start">
                  <div className="bg-[#141418] border border-[#27272A] text-[#A1A1AA] p-2.5 rounded-2xl rounded-tl-none max-w-[85%] text-[11px] space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#71717A] uppercase block">
                      [AUTOMATED BOT DEFLECTION]:
                    </span>
                    <p>
                      &quot;We deeply regret the inconvenience! As per our marketplace policy, returns must be initiated within 7 days of delivery. We are unable to assist.&quot;
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="bg-[#16161B] border-l-2 border-l-[#FF2A1A] border-y border-r border-[#27272A] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[88%] text-[11px] space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF6E63] uppercase block">
                      ● FINEPRINT STATUTORY COUNTER-NOTICE:
                    </span>
                    <p className="font-mono text-[#F4F4F6]">
                      &quot;Under Rule 6(3) of Consumer Protection (E-Commerce) Rules 2020, marketplace sellers are statutorily prohibited from refusing returns for inherent defects based on contractual windows. Ticket registered under Rule 4(5) (48h SLA).&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>Result: Escalated to Grievance Officer</span>
            <span className="text-white font-bold">Bot Loop Overridden</span>
          </div>
        </div>

        {/* CARD 3: Forensic Invoice Scanner */}
        <div className="rounded-3xl p-6 bg-[#121216] border border-[#27272A] shadow-xl shadow-black/40 hover:-translate-y-1 hover:border-[#FF2A1A]/60 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#18181D] text-white border border-[#27272A] text-xs font-bold font-mono">
                FORENSIC INVOICE SCANNER
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#18181D] border border-[#27272A] text-[10px] font-mono">
                <button
                  onClick={() => setInvoiceLens('raw')}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full transition-all",
                    invoiceLens === 'raw' ? "bg-[#27272A] text-white font-bold" : "text-[#71717A]"
                  )}
                >
                  Raw PDF Artifacts
                </button>
                <button
                  onClick={() => setInvoiceLens('sanitized')}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full transition-all",
                    invoiceLens === 'sanitized' ? "bg-[#FF2A1A] text-white font-bold" : "text-[#71717A]"
                  )}
                >
                  receipt-mcp Sanitized
                </button>
              </div>
            </div>

            <h3 className="font-display font-bold text-base text-white mb-1 tracking-tight">
              Noisy Font Glyphs vs Isolated Schema
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Standard PDF parsers crash when Rupee symbols encode as `n` or text wraps across lines. FinePrint cleans glyphs deterministically.
            </p>

            {/* OCR preview box */}
            {invoiceLens === 'raw' ? (
              <div className="p-3.5 rounded-2xl bg-[#141418] border border-[#27272A] font-mono text-[11px] text-[#A1A1AA] space-y-1.5 mb-4">
                <span className="text-[9px] text-[#71717A] uppercase font-bold block">
                  CORRUPTED RAW GLYPH STREAM:
                </span>
                <p className="line-through decoration-[#FF6E63] text-[#71717A]">
                  Total Amount Paid (Inclusive of 18% GST) n24,990.00
                </p>
                <p className="text-[#FF6E63] text-[10px]">
                  ⚠️ Standard regex fails: `₹` parsed as ascii `n`, amount falls back to ₹4,999 error.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#18181D] border-l-2 border-l-[#FF2A1A] border-y border-r border-[#27272A] font-mono text-[11px] text-white space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#FF6E63] uppercase font-bold tracking-wider">
                    RECEIPT-MCP MULTI-PASS OUTPUT:
                  </span>
                  <span className="text-white font-bold tabular-nums">₹24,990.00 (Parsed)</span>
                </div>
                <div className="text-[10px] text-[#D4D4D8] space-y-0.5">
                  <p>Product: Sony WH-1000XM5 Wireless Headphones</p>
                  <p>GSTIN Validated: 29AABCA1234F1Z5 (Clean)</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>Accuracy: 100% on Amazon &amp; Croma</span>
            <span className="text-white font-bold">Zero Fallback Hallucinations</span>
          </div>
        </div>

        {/* CARD 4: Statutory SLA Clock */}
        <div className="rounded-3xl p-6 bg-[#121216] border border-[#27272A] shadow-xl shadow-black/40 hover:-translate-y-1 hover:border-[#FF2A1A]/60 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#18181D] text-white border border-[#27272A] text-xs font-bold font-mono">
                STATUTORY SLA CLOCK
              </span>
              <span className="text-[11px] font-mono text-[#A1A1AA]">
                <b className="text-white font-bold text-sm tabular-nums">{slaHoursElapsed}h</b> of 48h Window
              </span>
            </div>

            <h3 className="font-display font-bold text-base text-white mb-1 tracking-tight">
              Rule 4(5) Mandatory 48-Hour Acknowledgment Clock
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Drag hours elapsed to see how FinePrint turns platform delay into an immediate pre-litigation ground for NCH 1915 escalation.
            </p>

            {/* Slider */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-mono text-[#71717A]">
                <span>0h (Sent)</span>
                <span className="text-[#A1A1AA]">24h (Warning)</span>
                <span className="text-[#FF6E63]">48h (Legal Breach)</span>
              </div>
              <input
                type="range"
                min="0"
                max="72"
                value={slaHoursElapsed}
                onChange={(e) => setSlaHoursElapsed(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#FF2A1A]"
              />
            </div>

            {/* SLA Stage Status */}
            <div className={cn(
              "p-3.5 rounded-2xl border text-xs font-mono transition-all mb-4",
              slaHoursElapsed > 48
                ? "bg-[#18181D] border-l-2 border-l-[#FF2A1A] border-y border-r border-[#27272A] text-white"
                : slaHoursElapsed > 24
                ? "bg-[#16161B] border border-[#3F3F46] text-[#E4E4E7]"
                : "bg-[#141418] border border-[#27272A] text-[#D4D4D8]"
            )}>
              {slaHoursElapsed > 48 ? (
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
                    <span>STATUTORY BREACH CONFIRMED (Day 3+)</span>
                  </div>
                  <p className="text-[11px] mt-1 text-[#D4D4D8]">
                    Failure to acknowledge within 48h violates Rule 4(5). Auto-generates NCH 1915 docket petition with compounding daily damages.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <Clock className="w-4 h-4 shrink-0 text-[#FF6E63]" />
                    <span>SLA ACTIVE BUFFER ({48 - slaHoursElapsed}h Remaining)</span>
                  </div>
                  <p className="text-[11px] mt-1 text-[#A1A1AA]">
                    Grievance Officer legally required to respond with formal ticket ID before 48h expires.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>Enforced Under E-Com Rules 2020</span>
            <span className="text-white font-bold">Mandatory Timer Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
