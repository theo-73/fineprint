'use client';

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
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
    <section className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl p-4 md:p-5 shadow-sm" aria-label="Pipeline Architecture Stepper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#736E65] mb-3 border-b border-[#E5E2DC] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#181716] tracking-wide text-xs">
            Deterministic 6-Stage Agent Pipeline
          </span>
          <span className="text-[10px] text-[#C83625] font-mono bg-[#FDF4F2] px-2 py-0.5 rounded border border-[#F8CFC9]">
            Architecture Pipeline
          </span>
        </div>
        <div className="text-[11px] text-[#736E65] font-mono flex items-center gap-1.5">
          <span>Transport:</span>
          <span className="text-[#16A34A] font-semibold">stdio / JSON-RPC</span>
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
                  ? "bg-[#FDF4F2] border-[#C83625] shadow-sm ring-1 ring-[#C83625]/30"
                  : isPast
                  ? "bg-[#FAF9F7] border-[#E5E2DC] text-[#181716]"
                  : "bg-[#FAF9F7]/40 border-[#E5E2DC]/60 text-[#A39E93]"
              )}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C83625]" />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded transition-colors",
                    isActive
                      ? "bg-[#C83625] text-white shadow-sm"
                      : isPast
                      ? "bg-[#E5E2DC] text-[#262422]"
                      : "bg-[#EFECE7] text-[#A39E93]"
                  )}
                >
                  Step 0{step.num}
                </span>

                {isPast ? (
                  <Check className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-[#C83625] animate-ping flex-shrink-0" />
                ) : null}
              </div>

              <div className="font-bold text-xs text-[#181716] tracking-tight">{step.name}</div>
              <div className="text-[11px] text-[#524E47] truncate mt-0.5">{step.label}</div>
              <div className="text-[10px] text-[#736E65] font-mono mt-1 flex items-center justify-between">
                <span>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
