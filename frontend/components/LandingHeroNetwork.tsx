'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Lock, FileText, CheckCircle2, Scale, ArrowRight, Zap, Terminal } from 'lucide-react';

interface TelemetryPoint {
  id: string;
  step: string;
  title: string;
  detail: string;
  top: string;
  left: string;
  status: 'VERIFIED' | 'ACTIVE' | 'ISOLATED';
}

const TELEMETRY_PINS: TelemetryPoint[] = [
  {
    id: 'pin-1',
    step: '01',
    title: 'Forensic PDF Ingestion',
    detail: 'receipt-mcp stdio · Glyph cleaner · 100% Tax Invoice Sanitization',
    top: '35%',
    left: '22%',
    status: 'ISOLATED',
  },
  {
    id: 'pin-2',
    step: '02',
    title: 'AST Rules Engine',
    detail: 'rules-mcp · CPA 2019 § 84 Strict Liability · Rule 6(3) Overhaul',
    top: '20%',
    left: '48%',
    status: 'ACTIVE',
  },
  {
    id: 'pin-3',
    step: '03',
    title: '48H Statutory SLA Clock',
    detail: 'Rule 4(5) Grievance Officer SLA · 30-Day Mandatory Resolution',
    top: '32%',
    left: '74%',
    status: 'VERIFIED',
  },
  {
    id: 'pin-4',
    step: '04',
    title: 'Enforceable Legal Packet',
    detail: 'Court-admissible PDF notice · WhatsApp Business API · NCH 1915',
    top: '68%',
    left: '52%',
    status: 'VERIFIED',
  },
];

export const LandingHeroNetwork: React.FC = () => {
  const [activePin, setActivePin] = useState<TelemetryPoint>(TELEMETRY_PINS[1]);

  return (
    <div className="relative w-full rounded-3xl bg-[#121216] border border-[#27272A] shadow-2xl overflow-hidden select-none group">
      {/* Chrome Top Bar */}
      <div className="px-5 py-3.5 bg-[#16161B] border-b border-[#27272A] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A] border border-[#3F3F46]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A] border border-[#3F3F46]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A1A]" />
          </div>
          <span className="font-mono text-[11px] font-bold text-white tracking-wider uppercase ml-1">
            STATUTORY ARCHITECTURE SCHEMATIC
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#A1A1AA]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>stdio FastMCP Protocol</span>
        </div>
      </div>

      {/* Visual Canvas Area with Editorial Architectural Graphic */}
      <div className="relative w-full aspect-[16/9] min-h-[320px] sm:min-h-[380px] bg-[#09090B] overflow-hidden">
        {/* Swiss Editorial Consumer Rights Advocate Graphic */}
        <Image
          src="/images/fineprint_advocate.jpg"
          alt="FinePrint Consumer Rights Advocate Editorial Visual"
          fill
          priority
          className="object-cover object-center opacity-95 transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Minimal Grid Overlay (No Blurry Glows) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Crisp Interactive Telemetry Pins */}
        {TELEMETRY_PINS.map((pin) => {
          const isSelected = activePin.id === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              style={{ top: pin.top, left: pin.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin transition-transform duration-200 hover:scale-110 focus:outline-none"
              aria-label={`Inspect ${pin.title}`}
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="absolute w-8 h-8 rounded-full border border-[#FF2A1A] animate-ping opacity-75" />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all shadow-lg ${
                    isSelected
                      ? 'bg-[#FF2A1A] text-white ring-4 ring-[#FF2A1A]/30 scale-110'
                      : 'bg-[#121216] text-[#D4D4D8] border border-[#3F3F46] hover:border-[#FF2A1A] hover:text-white'
                  }`}
                >
                  {pin.step}
                </div>
              </div>
            </button>
          );
        })}

        {/* Active Pin Detailed Telemetry HUD Card */}
        <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-[#121216]/95 backdrop-blur-md border border-[#27272A] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-enter">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FF2A1A] text-white">
                STAGE {activePin.step}
              </span>
              <h4 className="font-display font-bold text-sm text-white">{activePin.title}</h4>
              <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-1.5 py-0.5 rounded font-semibold">
                {activePin.status}
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] font-mono">{activePin.detail}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-[#71717A] hidden md:inline">
              Deterministic AST
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A]" />
            <span className="font-mono text-[11px] font-bold text-[#F4F4F6]">
              Zero Hallucinations
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Legend Bar */}
      <div className="px-5 py-3 bg-[#121216] border-t border-[#27272A] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A1A1AA]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>receipt-mcp Ingestion</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
            <span>rules-mcp § 84 Anchor</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>48h SLA Clock</span>
          </span>
        </div>
        <div className="text-white font-bold tracking-wide">
          100% CPA 2019 Ground-Truth (PyTest Verified)
        </div>
      </div>
    </div>
  );
};
