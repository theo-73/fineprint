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
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm" aria-label="Pipeline Architecture Stepper">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400 mb-3 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wide text-xs">
            Deterministic 6-Stage Agent Pipeline
          </span>
          <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Slide 5 Architecture
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
          <span>Transport:</span>
          <span className="text-emerald-400">stdio / JSON-RPC</span>
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
                  ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40"
                  : isPast
                  ? "bg-slate-850/80 border-slate-700/80 text-slate-300"
                  : "bg-slate-900/40 border-slate-800/60 text-slate-500"
              )}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500" />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded transition-colors",
                    isActive
                      ? "bg-blue-500 text-white shadow-sm"
                      : isPast
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  Step 0{step.num}
                </span>

                {isPast ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping flex-shrink-0" />
                ) : null}
              </div>

              <div className="font-bold text-xs text-slate-200 tracking-tight">{step.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{step.label}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                <span>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
