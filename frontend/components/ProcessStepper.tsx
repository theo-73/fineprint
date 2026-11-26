'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProcessStepperProps {
  currentStep: number;
}

const PIPELINE_STEPS = [
  { num: 1, name: 'INPUT', label: 'Intake & PDF', detail: 'User / Voice / File', tool: 'client' },
  { num: 2, name: 'FIND', label: 'receipt-mcp', detail: 'Strict JSON Facts', tool: 'stdio' },
  { num: 3, name: 'CLASSIFY', label: 'rules-mcp', detail: 'CPA 2019 / Rules', tool: 'stdio' },
  { num: 4, name: 'DRAFT', label: 'Fact Assembly', detail: 'Verified Grounds', tool: 'orchestrator' },
  { num: 5, name: 'VALIDATE', label: 'Code Validator', detail: 'Zero Hallucinations', tool: 'validator' },
  { num: 6, name: 'OUTPUT', label: 'Docket Review', detail: 'PDF / WA / NCH', tool: 'packet_builder' },
];

export const ProcessStepper: React.FC<ProcessStepperProps> = ({ currentStep }) => {
  return (
    <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-4 md:p-5 shadow-xl select-none" aria-label="Pipeline Architecture Stepper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#A1A1AA] mb-3 border-b border-[#27272A] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide text-xs">
            Deterministic 6-Stage Agent Pipeline
          </span>
          <span className="text-[10px] text-[#FF2A1A] font-mono bg-[#FF2A1A]/10 px-2 py-0.5 rounded border border-[#FF2A1A]/20 font-bold uppercase tracking-wider">
            Architecture Pipeline
          </span>
        </div>
        <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center gap-1.5">
          <span>Transport:</span>
          <span className="text-white font-semibold">stdio / JSON-RPC 2.0</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PIPELINE_STEPS.map((step) => {
          const isActive = currentStep === step.num;
          const isPast = currentStep > step.num;

          return (
            <div
              key={step.num}
              className={cn(
                "p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between",
                isActive
                  ? "bg-white text-black border-2 border-[#FF2A1A] shadow-xl shadow-[#FF2A1A]/15 scale-[1.02]"
                  : isPast
                  ? "bg-[#18181D] border-[#3F3F46] text-white"
                  : "bg-[#141418] border-[#27272A] text-[#71717A]"
              )}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF2A1A]" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono px-2 py-0.5 rounded tracking-wider uppercase transition-colors",
                    isActive
                      ? "bg-[#FF2A1A] text-white"
                      : isPast
                      ? "bg-[#27272A] text-white"
                      : "bg-[#202025] text-[#71717A]"
                  )}
                >
                  Step 0{step.num}
                </span>

                {isPast ? (
                  <div className="w-5 h-5 rounded-full bg-[#27272A] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white flex-shrink-0" />
                  </div>
                ) : isActive ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2A1A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2A1A]" />
                  </span>
                ) : null}
              </div>

              <div>
                <div className={cn(
                  "font-bold text-xs tracking-tight",
                  isActive ? "text-black font-display font-black" : "text-white"
                )}>
                  {step.name}
                </div>
                <div className={cn(
                  "text-[11px] truncate mt-0.5",
                  isActive ? "text-[#3F3F46] font-medium" : "text-[#A1A1AA]"
                )}>
                  {step.label}
                </div>
              </div>

              <div className={cn(
                "text-[10px] font-mono mt-2 pt-1.5 border-t flex items-center justify-between",
                isActive 
                  ? "border-black/10 text-[#71717A]" 
                  : "border-[#27272A] text-[#71717A]"
              )}>
                <span>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
