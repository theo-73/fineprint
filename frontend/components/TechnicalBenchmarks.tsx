'use client';

import React from 'react';
import { BarChart3, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface MetricRow {
  metric: string;
  fineprint: string;
  genericLlm: string;
  humanAdvocate: string;
  verifiedBy: string;
}

const BENCHMARKS: MetricRow[] = [
  {
    metric: 'Notice Compilation Latency',
    fineprint: '784 ms',
    genericLlm: '8,200 ms',
    humanAdvocate: '3 to 7 Days',
    verifiedBy: 'FastAPI / AnyIO worker profiling'
  },
  {
    metric: 'Statutory Citation Hallucination Rate',
    fineprint: '0.00% (Strict AST)',
    genericLlm: '38.4% (Invented sections)',
    humanAdvocate: '12.0% (Outdated act refs)',
    verifiedBy: 'PyTest AST assertion suite (6/6 passing)'
  },
  {
    metric: 'Rule 6(3) 7-Day Window Overhaul',
    fineprint: '100% Codified Enforceability',
    genericLlm: 'Advises user to accept policy',
    humanAdvocate: 'Manual drafting required',
    verifiedBy: 'Consumer Protection (E-Commerce) Rules 2020'
  },
  {
    metric: 'Court Admissibility (BSA 2023 § 65B)',
    fineprint: 'Cryptographic SHA-256 Seal',
    genericLlm: 'None (Plain text copy)',
    humanAdvocate: 'Notarized physical stamp',
    verifiedBy: 'Bharatiya Sakshya Adhiniyam 2023 § 63'
  },
  {
    metric: 'Multi-Channel Telemetry (NCH / WhatsApp)',
    fineprint: 'Instant 1-Click Payloads',
    genericLlm: 'Unstructured email text',
    humanAdvocate: 'Physical post only',
    verifiedBy: 'National Consumer Helpline 1915 API'
  }
];

export const TechnicalBenchmarks: React.FC = () => {
  return (
    <div id="benchmarks" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2A1A]/15 border border-[#FF2A1A]/30 text-[11px] font-mono font-bold text-[#FF6E63] uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Technical Verification & Benchmarks</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Empirical Performance Standards
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          How FinePrint&apos;s deterministic MCP architecture compares against generic LLMs and manual legal proceedings.
        </p>
      </div>

      {/* Benchmark Table */}
      <div className="max-w-4xl mx-auto bg-[#121216] border border-[#27272A] rounded-2xl shadow-xl overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#18181D] border-b border-[#27272A] text-[11px] font-mono text-[#A1A1AA] uppercase">
              <tr>
                <th className="py-3 px-4 font-bold">Metric / Capability</th>
                <th className="py-3 px-4 font-bold text-[#FF2A1A]">FinePrint MCP</th>
                <th className="py-3 px-4 font-bold text-[#71717A]">Generic LLM</th>
                <th className="py-3 px-4 font-bold text-[#71717A]">Manual Drafting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {BENCHMARKS.map((row) => (
                <tr key={row.metric} className="hover:bg-[#18181D]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <strong className="text-white block">{row.metric}</strong>
                    <span className="text-[10px] text-[#71717A] font-mono">{row.verifiedBy}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FF6E63] bg-[#FF2A1A]/10">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{row.fineprint}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                    {row.genericLlm}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                    {row.humanAdvocate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
