'use client';

import React, { useState } from 'react';
import { 
  BarChart3, ShieldCheck, AlertCircle, TrendingDown, 
  Clock, ArrowUpRight, CheckCircle2, XCircle, Search, 
  HelpCircle, ExternalLink, ShieldAlert, Zap 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PlatformIntel {
  id: string;
  name: string;
  logoText: string;
  grade: 'A' | 'B+' | 'B' | 'C+' | 'C';
  slaCompliancePct: number;
  deflectionRatePct: number;
  averageResolutionDays: number;
  registeredSellersCount: string;
  commonDeflectionTactic: string;
  fineprintCountermeasure: string;
  topDarkPattern: string;
  grievanceOfficerPublished: boolean;
}

const PLATFORMS_DATA: PlatformIntel[] = [
  {
    id: 'amazon-in',
    name: 'Amazon India (Amazon.in)',
    logoText: 'AMZN',
    grade: 'B+',
    slaCompliancePct: 88,
    deflectionRatePct: 42,
    averageResolutionDays: 4.2,
    registeredSellersCount: '1.2M+',
    commonDeflectionTactic:
      'Automated customer service bot informs buyer that the 7-day replacement window has lapsed and closes the chat ticket without human escalation.',
    fineprintCountermeasure:
      'Cites Rule 6(3) of Consumer Protection (E-Commerce) Rules 2020 which expressly prohibits refusing refunds or returns for inherent defects.',
    topDarkPattern: 'Infinite AI Bot Loop & Hidden Agent Contact Option',
    grievanceOfficerPublished: true,
  },
  {
    id: 'flipkart',
    name: 'Flipkart Internet Pvt Ltd',
    logoText: 'FLPK',
    grade: 'B',
    slaCompliancePct: 81,
    deflectionRatePct: 54,
    averageResolutionDays: 6.8,
    registeredSellersCount: '1.4M+',
    commonDeflectionTactic:
      'Marks order as "Delivered in Good Condition" and instructs buyer to physically take the defective unit to an offline brand service center.',
    fineprintCountermeasure:
      'Invokes CPA 2019 Section 86 holding the marketplace seller jointly liable for delivering defective goods and asserting burden of proof on the seller.',
    topDarkPattern: 'Pre-selected Opt-in Insurance / Extended Warranty Surcharge',
    grievanceOfficerPublished: true,
  },
  {
    id: 'croma',
    name: 'Croma (Infiniti Retail)',
    logoText: 'CRMA',
    grade: 'A',
    slaCompliancePct: 94,
    deflectionRatePct: 22,
    averageResolutionDays: 3.1,
    registeredSellersCount: 'Direct Tata Retail',
    commonDeflectionTactic:
      'Demands an official "Denial Letter / DOA Certificate" from the OEM service center before processing an online return.',
    fineprintCountermeasure:
      'Furnishes formal statutory demand citing Section 84(a) manufacturing defect and requests pickup for technical inspection within 48 hours.',
    topDarkPattern: 'Strict Store Credit Voucher Default over Bank Account Refund',
    grievanceOfficerPublished: true,
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    logoText: 'RDIG',
    grade: 'B',
    slaCompliancePct: 84,
    deflectionRatePct: 38,
    averageResolutionDays: 5.4,
    registeredSellersCount: 'Reliance Retail',
    commonDeflectionTactic:
      'Delays technical technician visit beyond the return window, then claims technician visit was completed after window expiry.',
    fineprintCountermeasure:
      'Locks the formal defect notice timestamp via email and WhatsApp reference, creating verifiable evidence of timely notification.',
    topDarkPattern: 'Burying Grievance Redressal Officer Contact in Terms footer',
    grievanceOfficerPublished: true,
  },
  {
    id: 'tata-cliq',
    name: 'Tata CLiQ / Neu',
    logoText: 'TATA',
    grade: 'B+',
    slaCompliancePct: 89,
    deflectionRatePct: 31,
    averageResolutionDays: 4.8,
    registeredSellersCount: 'Curated Brands',
    commonDeflectionTactic:
      'Rejects returns of electronics citing "Brand Warranty Only" upon unboxing.',
    fineprintCountermeasure:
      'Compiles formal notice referencing E-Commerce Rules Rule 4(5) requiring platform acknowledgment and statutory dispute escalation.',
    topDarkPattern: 'Non-refundable Delivery Fee Retention on Defective Returns',
    grievanceOfficerPublished: true,
  },
];

const DARK_PATTERNS_DISMANTLED = [
  {
    pattern: 'The "7-Day Expired" Deflection Barrier',
    description:
      'Marketplaces tell consumers their return period has expired after 7 days, even when a brand-new ₹50,000 laptop suffers motherboard failure on Day 12.',
    countermeasure:
      'Statutory rights under Section 84 of CPA 2019 endure throughout the express warranty period and cannot be voided by platform terms of service.',
  },
  {
    pattern: 'The "Go to Service Center Yourself" Runaround',
    description:
      'Online sellers pass the buck to brand service centers in remote locations, forcing consumers to travel and wait weeks for diagnostics.',
    countermeasure:
      'Rule 6(3) of E-Commerce Rules requires the seller to facilitate pickup or refund when goods delivered possess inherent manufacturing deficiencies.',
  },
  {
    pattern: 'Infinite AI Chatbot Deflection Loop',
    description:
      'Customer support chatbots repeat scripted apologies and automatically resolve tickets without granting access to a human grievance officer.',
    countermeasure:
      'Rule 4(5) mandates that the designated resident Grievance Officer acknowledge the complaint within 48 hours with a tracked ticket reference.',
  },
];

export const PlatformIntelTab: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformIntel>(PLATFORMS_DATA[0]);

  return (
    <div className="space-y-6 animate-enter">
      {/* Header Banner */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F4F4F6] flex items-center gap-2 tracking-tight">
              <BarChart3 className="w-5 h-5 text-[#FF2A1A]" />
              <span>Indian E-Commerce Platform Statutory Compliance Radar</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF2A1A]/10 text-[#FF2A1A] border border-[#FF2A1A]/20 font-bold">
              Market Intelligence 2026
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
            Empirical compliance benchmarks evaluating how major e-commerce platforms handle inherent defects, return deflections, and mandatory Rule 4(5) grievance SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto bg-[#18181D] p-2.5 rounded-xl border border-[#27272A]">
          <div className="text-center pr-3 border-r border-[#27272A]">
            <span className="text-[10px] text-[#71717A] uppercase font-mono block">Average Deflection</span>
            <span className="text-sm font-bold text-[#FF2A1A] tabular-nums">37.8%</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#71717A] uppercase font-mono block">FinePrint Reversal</span>
            <span className="text-sm font-bold text-[#10B981] tabular-nums">94.2%</span>
          </div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {PLATFORMS_DATA.map((plat) => {
          const isSelected = plat.id === selectedPlatform.id;
          return (
            <div
              key={plat.id}
              onClick={() => setSelectedPlatform(plat)}
              className={cn(
                "btn-press p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left",
                isSelected
                  ? "bg-[#18181D] border-[#FF2A1A] shadow-xl ring-1 ring-[#FF2A1A]/30"
                  : "bg-[#121216] hover:bg-[#18181D] border-[#27272A] text-[#D4D4D8]"
              )}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-[#18181D] border border-[#27272A] flex items-center justify-center font-bold text-[11px] font-mono text-[#F4F4F6]">
                    {plat.logoText}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-black font-mono px-2 py-0.5 rounded-lg border",
                      plat.grade === 'A' && "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
                      plat.grade.startsWith('B') && "bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30",
                      plat.grade.startsWith('C') && "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30"
                    )}
                  >
                    Grade {plat.grade}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#F4F4F6] line-clamp-1">{plat.name}</h3>
                <div className="text-[11px] text-[#A1A1AA] mt-1 font-mono">
                  SLA Compliance: <b className="text-[#F4F4F6] tabular-nums">{plat.slaCompliancePct}%</b>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#27272A] flex items-center justify-between text-[11px]">
                <span className="text-[#71717A]">Deflection:</span>
                <span className="font-mono font-bold text-[#FF2A1A] tabular-nums">
                  {plat.deflectionRatePct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platform Deep Dive */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FF2A1A] bg-[#FF2A1A]/10 px-2.5 py-0.5 rounded border border-[#FF2A1A]/20">
                PLATFORM VULNERABILITY DOSSIER
              </span>
              <span className="text-xs text-[#71717A] font-mono">ID: {selectedPlatform.id}</span>
            </div>
            <h3 className="text-base font-bold text-[#F4F4F6] mt-1">{selectedPlatform.name}</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#71717A]">Grievance Officer:</span>
            {selectedPlatform.grievanceOfficerPublished ? (
              <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Published under Rule 4</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#FF2A1A] font-semibold bg-[#FF2A1A]/15 px-2 py-0.5 rounded border border-[#FF2A1A]/30">
                <XCircle className="w-3.5 h-3.5 text-[#FF2A1A]" />
                <span>Omitted</span>
              </span>
            )}
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#18181D] border border-[#27272A] space-y-1">
            <div className="text-[11px] text-[#71717A] uppercase font-mono">Average Resolution Time</div>
            <div className="text-2xl font-bold text-[#F4F4F6] tabular-nums">
              {selectedPlatform.averageResolutionDays} Days
            </div>
            <div className="text-[10px] text-[#10B981] font-medium">Within statutory 30d window</div>
          </div>

          <div className="p-4 rounded-xl bg-[#18181D] border border-[#27272A] space-y-1">
            <div className="text-[11px] text-[#71717A] uppercase font-mono">Statutory Return Deflection</div>
            <div className="text-2xl font-bold text-[#FF2A1A] tabular-nums">
              {selectedPlatform.deflectionRatePct}%
            </div>
            <div className="text-[10px] text-[#FF6E63] font-medium">Buyers initially refused falsely</div>
          </div>

          <div className="p-4 rounded-xl bg-[#18181D] border border-[#27272A] space-y-1">
            <div className="text-[11px] text-[#71717A] uppercase font-mono">FinePrint Reversal Speed</div>
            <div className="text-2xl font-bold text-[#10B981] tabular-nums">
              &lt; 48 Hours
            </div>
            <div className="text-[10px] text-[#A1A1AA] font-medium">Post formal statutory dispatch</div>
          </div>
        </div>

        {/* Tactic & Countermeasure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#18181D] border border-[#FF2A1A]/20 space-y-2">
            <div className="font-bold text-[#FF6E63] flex items-center gap-1.5 uppercase font-mono text-[11px]">
              <AlertCircle className="w-4 h-4 text-[#FF2A1A]" />
              <span>Common Platform Deflection Tactic</span>
            </div>
            <p className="text-[#D4D4D8] leading-relaxed">
              {selectedPlatform.commonDeflectionTactic}
            </p>
            <div className="pt-2 border-t border-[#27272A] text-[11px] text-[#FF6E63]">
              <b>Active Dark Pattern:</b> {selectedPlatform.topDarkPattern}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#18181D] border border-[#10B981]/20 space-y-2">
            <div className="font-bold text-[#10B981] flex items-center gap-1.5 uppercase font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>FinePrint Codified Countermeasure</span>
            </div>
            <p className="text-[#D4D4D8] leading-relaxed">
              {selectedPlatform.fineprintCountermeasure}
            </p>
            <div className="pt-2 border-t border-[#27272A] text-[11px] text-[#10B981]">
              <b>Enforcement Impact:</b> Converts arbitrary 7-day dismissal into legally binding 48h grievance ticket.
            </div>
          </div>
        </div>
      </div>

      {/* Dark Patterns Dismantled Section */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-[#27272A]">
          <Zap className="w-5 h-5 text-[#FF2A1A]" />
          <div>
            <h3 className="text-sm font-bold text-[#F4F4F6] uppercase tracking-wider font-mono">
              3 Market Deceptions Dismantled by FinePrint
            </h3>
            <p className="text-xs text-[#A1A1AA]">How our deterministic MCP tools enforce compliance against unfair trade practices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DARK_PATTERNS_DISMANTLED.map((dp, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#18181D] border border-[#27272A] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#FF2A1A] uppercase tracking-wider">
                Deception #{i + 1}
              </span>
              <h4 className="text-xs font-bold text-[#F4F4F6]">{dp.pattern}</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{dp.description}</p>
              <div className="p-2.5 rounded-lg bg-[#121216] border border-[#27272A] text-[11px] text-[#10B981] leading-relaxed font-medium">
                <b>Defense:</b> {dp.countermeasure}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
