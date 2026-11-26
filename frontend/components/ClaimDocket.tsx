'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, Copy, Check, CheckCircle2, AlertTriangle, 
  History, ChevronUp, ChevronDown, Scale, ShieldAlert, ArrowUpRight 
} from 'lucide-react';
import { CaseData, AuditLogItem } from '../types';
import { cn, formatINR } from '../lib/utils';

interface ClaimDocketProps {
  activeCase: CaseData | null;
  auditLogs: AuditLogItem[];
  showAuditTrail: boolean;
  copiedWA: boolean;
  copiedNCH: boolean;
  onToggleAuditTrail: () => void;
  onCopyWA: (text: string) => void;
  onCopyNCH: (text: string) => void;
}

export const ClaimDocket: React.FC<ClaimDocketProps> = ({
  activeCase,
  auditLogs,
  showAuditTrail,
  copiedWA,
  copiedNCH,
  onToggleAuditTrail,
  onCopyWA,
  onCopyNCH,
}) => {
  if (!activeCase) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl p-12 text-center space-y-3.5 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF9F7] mx-auto flex items-center justify-center text-[#736E65] border border-[#E5E2DC] shadow-inner">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#181716]">No Claim Docket Selected</h3>
          <p className="text-xs text-[#736E65] max-w-sm mx-auto leading-relaxed">
            Upload an invoice PDF or select a verified receipt on the left to evaluate statutory consumer rights under CPA 2019 and compile a formal claim notice.
          </p>
        </div>
      </div>
    );
  }

  // Abstention Result Card
  if (activeCase.should_abstain) {
    return (
      <div className="bg-[#FFFFFF] border border-[#FEF08A] rounded-2xl p-6 md:p-7 space-y-5 shadow-sm animate-enter">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#FEFCE8] border border-[#FEF08A] flex items-center justify-center text-[#854D0E] flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEFCE8] text-[#854D0E] font-bold border border-[#FEF08A]">
                Statutory Abstention (Controlled Exit)
              </span>
            </div>
            <h3 className="text-base font-bold text-[#181716] mt-1.5">Claim Out of Scope for Statutory Product Liability</h3>
            <p className="text-xs text-[#854D0E] mt-0.5">
              FinePrint enforces strict zero-hallucination guardrails and does not invent false consumer rights.
            </p>
          </div>
        </div>

        <div className="bg-[#FAF9F7] border border-[#E5E2DC] rounded-xl p-4 space-y-2 text-xs">
          <div className="font-semibold text-[#181716]">Legal Ground for Abstention:</div>
          <p className="text-[#262422] leading-relaxed">{activeCase.abstention_reason}</p>
          <div className="pt-2.5 border-t border-[#E5E2DC] text-[11px] text-[#736E65] leading-relaxed">
            Under Section 84 & 87 of CPA 2019, statutory manufacturing product liability cannot be claimed for buyer-inflicted accidental drops, liquid spills, or non-defective change of mind after contractual return windows expire.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#524E47] bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E5E2DC]">
          <span>Recommended Pre-Litigation Remedy:</span>
          <span className="text-[#C83625] font-semibold flex items-center gap-1">
            <span>National Consumer Helpline (NCH 1915 / consumerhelpline.gov.in)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Audit Trail Button */}
        <div className="pt-2 border-t border-[#E5E2DC]">
          <button
            onClick={onToggleAuditTrail}
            className="btn-press text-xs text-[#524E47] hover:text-[#181716] flex items-center gap-1.5 font-medium"
          >
            <History className="w-3.5 h-3.5 text-[#C83625]" />
            <span>{showAuditTrail ? 'Hide Pipeline Audit Trail' : `Inspect Pipeline Audit Trail (${auditLogs.length} Events)`}</span>
            {showAuditTrail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAuditTrail && auditLogs.length > 0 && (
            <div className="mt-3 bg-[#FAF9F7] border border-[#E5E2DC] rounded-xl p-3.5 space-y-2.5 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-mono font-semibold text-[#736E65] uppercase tracking-wider">
                SQLite Audit Log Events (Trust Boundary Trace)
              </div>
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs border-b border-[#E5E2DC] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#C83625]">{log.step_name}</span>
                    <span className="text-[#736E65] tabular-nums">{log.timestamp.slice(11, 19)}</span>
                  </div>
                  <div className="text-[#262422] text-[11px] mt-0.5">{log.event}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Verified In-Scope Claim Docket
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl p-6 md:p-7 space-y-6 shadow-sm animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E5E2DC]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
              READY FOR ESCALATION
            </span>
            <span className="text-xs text-[#736E65] font-mono">{activeCase.claim_ref}</span>
          </div>
          <h3 className="text-lg font-bold text-[#181716] tracking-tight">{activeCase.product_name}</h3>
          <p className="text-xs text-[#524E47] mt-0.5">
            {activeCase.seller_name} | Consideration Paid: <b className="text-[#C83625] font-semibold tabular-nums">{formatINR(activeCase.amount_inr)}</b>
          </p>
        </div>
        <div className="text-left sm:text-right bg-[#FAF9F7] p-2.5 rounded-xl border border-[#E5E2DC] flex-shrink-0">
          <div className="text-[10px] uppercase font-mono text-[#736E65] tracking-wider">Statutory SLA Window</div>
          <div className="text-xs font-bold text-[#C83625] font-mono tabular-nums mt-0.5">
            Rule 4(5): 48h Ack / 30d Redress
          </div>
        </div>
      </div>

      {/* Sourced Statutory Route Card */}
      <div className="bg-gradient-to-br from-[#FDF4F2] via-[#FAF9F7] to-[#FFFFFF] border border-[#F8CFC9] rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#C83625] uppercase tracking-wider font-mono">
            Primary Escalation Route
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#C83625] text-white font-mono font-medium shadow-sm">
            {activeCase.primary_route}
          </span>
        </div>

        <div className="text-xs text-[#262422] space-y-1.5 pt-1">
          <div className="font-semibold text-[#181716]">Sourced Statutory Authority:</div>
          {activeCase.statutory_citations.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-[#166534] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#16A34A]" />
              <span>{c}</span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-[#262422] bg-[#FFFFFF] p-3 rounded-lg border border-[#E5E2DC] leading-relaxed">
          <b>Statutory Remedy Guarantee:</b> Under Rule 6(3) of E-Commerce Rules 2020 & Section 84 of CPA 2019, sellers and platform entities cannot refuse returns or refunds for inherent defects by asserting an expired 7-day contractual platform window.
        </div>
      </div>

      {/* Dynamic Evidence Checklist (Bound to rules-mcp) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#181716]">
            Burden of Proof — Evidence Checklist (rules-mcp):
          </span>
          <span className="text-[10px] text-[#736E65] font-mono">Required for NCH / Court Filing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {(activeCase.evidence_checklist && activeCase.evidence_checklist.length > 0
            ? activeCase.evidence_checklist
            : [
              'Original Tax Invoice & GSTIN Record',
              'Serial / IMEI Proof Attached',
              'Defect Documentation Log',
              'Notice Reference Sent (48h Mandate)'
            ]
          ).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] text-[#262422]">
              <Check className="w-3.5 h-3.5 text-[#C83625] flex-shrink-0" />
              <span className="text-[11px] font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail Accordion */}
      <div className="border border-[#E5E2DC] rounded-xl p-3.5 bg-[#FAF9F7]">
        <button
          onClick={onToggleAuditTrail}
          aria-expanded={showAuditTrail}
          aria-controls="audit-trail-panel"
          className="btn-press w-full flex items-center justify-between text-xs font-medium text-[#262422] hover:text-[#181716]"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C83625]" />
            <span>Local Trust Boundary Audit Log ({auditLogs.length} Events)</span>
          </div>
          {showAuditTrail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAuditTrail && (
          <div id="audit-trail-panel" className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="text-xs bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E5E2DC]">
                <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                  <span className="font-bold text-[#C83625]">{log.step_name}</span>
                  <span className="text-[#736E65] tabular-nums">{log.timestamp.slice(11, 19)}</span>
                </div>
                <div className="text-[#262422] text-[11px]">{log.event}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: PDF, WhatsApp, NCH */}
      <div className="pt-4 border-t border-[#E5E2DC] space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download PDF Notice */}
          <a
            href={`/api/cases/${activeCase.id}/download-pdf`}
            target="_blank"
            rel="noreferrer"
            className="btn-press flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-[#C83625] hover:bg-[#B32E1F] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#C83625]/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Formal Notice PDF</span>
          </a>

          {/* Copy WhatsApp Text */}
          <button
            onClick={() => onCopyWA(activeCase.whatsapp_text || '')}
            className="btn-press py-2.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F7] text-[#181716] border border-[#E5E2DC] font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {copiedWA ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#736E65]" />}
            <span>{copiedWA ? 'WhatsApp Copied!' : 'Copy WhatsApp Text'}</span>
          </button>

          {/* Copy NCH Text */}
          <button
            onClick={() => onCopyNCH(activeCase.nch_text || '')}
            className="btn-press py-2.5 px-4 rounded-xl bg-[#181716] hover:bg-[#262422] text-white border border-[#181716] font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {copiedNCH ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-white/70" />}
            <span>{copiedNCH ? 'NCH Copied!' : 'Copy NCH Portal Text'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#736E65] pt-1 font-sans">
          <span>Deterministic Code Validator: Verified facts and zero cited statutory hallucinations.</span>
          <span>Human-in-the-Loop: Review all terms before dispatch.</span>
        </div>
      </div>
    </div>
  );
};
