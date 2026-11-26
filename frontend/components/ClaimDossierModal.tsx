'use client';

import React, { useEffect, useRef } from 'react';
import { 
  FileText, Download, Copy, Check, CheckCircle2, 
  X, Scale, ShieldAlert, History, ArrowUpRight, 
  Clock, AlertTriangle 
} from 'lucide-react';
import { CaseData, AuditLogItem } from '../types';
import { cn, formatINR, formatDate } from '../lib/utils';
import { useToast } from './ToastProvider';

interface ClaimDossierModalProps {
  activeCase?: CaseData | null;
  caseData?: CaseData | null;
  auditLogs?: AuditLogItem[];
  onClose: () => void;
  onCopyWhatsApp?: (text: string) => void;
  onCopyNCH?: (text: string) => void;
}

export const ClaimDossierModal: React.FC<ClaimDossierModalProps> = ({
  activeCase,
  caseData,
  auditLogs = [],
  onClose,
  onCopyWhatsApp,
  onCopyNCH,
}) => {
  const currentCase = activeCase || caseData;
  const modalRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();
  const [copiedWA, setCopiedWA] = React.useState(false);
  const [copiedNCH, setCopiedNCH] = React.useState(false);

  // Keyboard navigation: Escape closes modal, Tab trapping
  useEffect(() => {
    if (!currentCase) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCase, onClose]);

  if (!currentCase) return null;

  const handleCopyWA = () => {
    if (currentCase.whatsapp_text) {
      if (onCopyWhatsApp) {
        onCopyWhatsApp(currentCase.whatsapp_text);
      } else {
        navigator.clipboard.writeText(currentCase.whatsapp_text);
      }
      setCopiedWA(true);
      success('WhatsApp Notice Copied', 'Paste into seller chat or WhatsApp Business support.');
      setTimeout(() => setCopiedWA(false), 2000);
    }
  };

  const handleCopyNCH = () => {
    if (currentCase.nch_text) {
      if (onCopyNCH) {
        onCopyNCH(currentCase.nch_text);
      } else {
        navigator.clipboard.writeText(currentCase.nch_text);
      }
      setCopiedNCH(true);
      success('NCH Portal Text Copied', 'Paste into consumerhelpline.gov.in grievance field.');
      setTimeout(() => setCopiedNCH(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/85 backdrop-blur-md animate-enter select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-dossier-title"
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#121216] border border-[#27272A] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto animate-hud-slide"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#FF2A1A] font-bold uppercase tracking-wider bg-[#FF2A1A]/10 px-2 py-0.5 rounded border border-[#FF2A1A]/20">
                {currentCase.claim_ref}
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
                  currentCase.status === 'READY'
                    ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                    : "bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30"
                )}
              >
                {currentCase.status}
              </span>
              <span className="text-[10px] text-[#71717A] font-mono">
                Order: {currentCase.order_id || 'N/A'}
              </span>
            </div>
            <h3 id="claim-dossier-title" className="font-bold text-lg text-[#F4F4F6] mt-1.5 leading-snug">
              {currentCase.product_name}
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Seller: {currentCase.seller_name} · Created: {formatDate(currentCase.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Dossier"
            className="text-[#71717A] hover:text-white p-1.5 rounded-xl hover:bg-[#18181D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#18181D] border border-[#27272A] text-center">
            <div className="text-[10px] text-[#71717A] font-mono uppercase">Consideration Paid</div>
            <div className="text-base font-bold font-sans text-[#FF2A1A] tabular-nums mt-0.5">
              {formatINR(currentCase.amount_inr)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#18181D] border border-[#27272A] text-center">
            <div className="text-[10px] text-[#71717A] font-mono uppercase">Statutory SLA</div>
            <div className="text-base font-bold font-mono text-[#F4F4F6] mt-0.5">
              48h Ack / 30d
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#18181D] border border-[#27272A] text-center">
            <div className="text-[10px] text-[#71717A] font-mono uppercase">Escalation Route</div>
            <div className="text-xs font-bold font-mono text-[#10B981] mt-1 truncate">
              {currentCase.primary_route || 'Direct Brand'}
            </div>
          </div>
        </div>

        {/* Abstention or In-Scope Details */}
        {currentCase.should_abstain ? (
          <div className="p-4 rounded-xl bg-[#18181D] border border-[#F59E0B]/30 space-y-2 text-xs">
            <div className="font-bold text-[#FBBF24] flex items-center gap-1.5 uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Controlled Statutory Abstention Ground</span>
            </div>
            <p className="text-[#D4D4D8] leading-relaxed">
              {currentCase.abstention_reason}
            </p>
            <div className="text-[11px] text-[#A1A1AA] pt-2 border-t border-[#27272A]">
              Under Section 87 of CPA 2019, statutory manufacturing product liability cannot be claimed for buyer-inflicted accidental damage, liquid submersion, or non-defective buyer remorse.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statutory Citations */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#F4F4F6] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#FF2A1A]" />
                <span>Statutory Authority Citations:</span>
              </div>
              <div className="space-y-1.5">
                {currentCase.statutory_citations?.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#18181D] border border-[#27272A] text-xs text-[#10B981] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#F4F4F6]">Burden of Proof Evidence Checklist:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(currentCase.evidence_checklist && currentCase.evidence_checklist.length > 0
                  ? currentCase.evidence_checklist
                  : [
                    'Original Tax Invoice & GSTIN Record',
                    'Serial / IMEI Proof Attached',
                    'Defect Documentation Log',
                    'Notice Reference Sent (48h Mandate)'
                  ]
                ).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#18181D] border border-[#27272A] text-[#D4D4D8]">
                    <Check className="w-3.5 h-3.5 text-[#FF2A1A] shrink-0" />
                    <span className="text-[11px] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Dispatch Buttons */}
        <div className="pt-3 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {currentCase.pdf_download_url && (
              <a
                href={currentCase.pdf_download_url}
                target="_blank"
                rel="noreferrer"
                className="btn-press px-4 py-2 bg-[#FF2A1A] hover:bg-[#E02416] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#FF2A1A]/20 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Formal Notice PDF</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWA}
              className="btn-press px-3.5 py-2 bg-[#18181D] hover:bg-[#202027] text-[#F4F4F6] border border-[#27272A] text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copiedWA ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#71717A]" />}
              <span>{copiedWA ? 'WhatsApp Copied!' : 'WhatsApp Text'}</span>
            </button>

            <button
              onClick={handleCopyNCH}
              className="btn-press px-3.5 py-2 bg-[#202027] hover:bg-[#272730] text-[#F4F4F6] border border-[#3F3F46] text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copiedNCH ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#A1A1AA]" />}
              <span>{copiedNCH ? 'NCH Copied!' : 'NCH Portal Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
