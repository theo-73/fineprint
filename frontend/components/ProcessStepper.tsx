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
    <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-4 md:p-5 shadow-xl" aria-label="Pipeline Architecture Stepper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#A1A1AA] mb-3 border-b border-[#27272A] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F4F4F6] tracking-wide text-xs">
            Deterministic 6-Stage Agent Pipeline
          </span>
          <span className="text-[10px] text-[#FF2A1A] font-mono bg-[#FF2A1A]/10 px-2 py-0.5 rounded border border-[#FF2A1A]/20">
            Architecture Pipeline
          </span>
        </div>
        <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center gap-1.5">
          <span>Transport:</span>
          <span className="text-white font-semibold">stdio / JSON-RPC</span>
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
                "p-3 rounded-xl border transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "bg-[#FF2A1A]/10 border-[#FF2A1A] shadow-lg shadow-[#FF2A1A]/10 ring-1 ring-[#FF2A1A]/40"
                  : isPast
                  ? "bg-[#18181D] border-[#27272A] text-[#F4F4F6]"
                  : "bg-[#18181D]/40 border-[#27272A]/50 text-[#71717A]"
              )}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF2A1A] shadow-[0_0_8px_#FF2A1A]" />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded transition-colors",
                    isActive
                      ? "bg-[#FF2A1A] text-white shadow-sm"
                      : isPast
                      ? "bg-[#27272A] text-[#F4F4F6]"
                      : "bg-[#202025] text-[#71717A]"
                  )}
                >
                  Step 0{step.num}
                </span>

                {isPast ? (
                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-[#FF2A1A] animate-ping flex-shrink-0" />
                ) : null}
              </div>

              <div className="font-bold text-xs text-[#F4F4F6] tracking-tight">{step.name}</div>
              <div className="text-[11px] text-[#A1A1AA] truncate mt-0.5">{step.label}</div>
              <div className="text-[10px] text-[#71717A] font-mono mt-1 flex items-center justify-between">
                <span>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
