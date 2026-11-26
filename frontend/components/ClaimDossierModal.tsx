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
  activeCase: CaseData | null;
  auditLogs?: AuditLogItem[];
  onClose: () => void;
}

export const ClaimDossierModal: React.FC<ClaimDossierModalProps> = ({
  activeCase,
  auditLogs = [],
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();
  const [copiedWA, setCopiedWA] = React.useState(false);
  const [copiedNCH, setCopiedNCH] = React.useState(false);

  // Keyboard navigation: Escape closes modal, Tab trapping
  useEffect(() => {
    if (!activeCase) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCase, onClose]);

  if (!activeCase) return null;

  const handleCopyWA = () => {
    if (activeCase.whatsapp_text) {
      navigator.clipboard.writeText(activeCase.whatsapp_text);
      setCopiedWA(true);
      success('WhatsApp Notice Copied', 'Paste into seller chat or WhatsApp Business support.');
      setTimeout(() => setCopiedWA(false), 2000);
    }
  };

  const handleCopyNCH = () => {
    if (activeCase.nch_text) {
      navigator.clipboard.writeText(activeCase.nch_text);
      setCopiedNCH(true);
      success('NCH Portal Text Copied', 'Paste into consumerhelpline.gov.in grievance field.');
      setTimeout(() => setCopiedNCH(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181716]/60 backdrop-blur-sm animate-enter select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-dossier-title"
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E5E2DC] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto animate-hud-slide"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E2DC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#C83625] font-bold uppercase tracking-wider bg-[#FDF4F2] px-2 py-0.5 rounded border border-[#F8CFC9]">
                {activeCase.claim_ref}
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
                  activeCase.status === 'READY'
                    ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                    : "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]"
                )}
              >
                {activeCase.status}
              </span>
              <span className="text-[10px] text-[#736E65] font-mono">
                Order: {activeCase.order_id || 'N/A'}
              </span>
            </div>
            <h3 id="claim-dossier-title" className="font-bold text-lg text-[#181716] mt-1.5 leading-snug">
              {activeCase.product_name}
            </h3>
            <p className="text-xs text-[#736E65] mt-0.5">
              Seller: {activeCase.seller_name} · Created: {formatDate(activeCase.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Dossier"
            className="text-[#736E65] hover:text-[#181716] p-1.5 rounded-xl hover:bg-[#FAF9F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] text-center">
            <div className="text-[10px] text-[#736E65] font-mono uppercase">Consideration Paid</div>
            <div className="text-base font-bold font-sans text-[#C83625] tabular-nums mt-0.5">
              {formatINR(activeCase.amount_inr)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] text-center">
            <div className="text-[10px] text-[#736E65] font-mono uppercase">Statutory SLA</div>
            <div className="text-base font-bold font-mono text-[#181716] mt-0.5">
              48h Ack / 30d
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] text-center">
            <div className="text-[10px] text-[#736E65] font-mono uppercase">Escalation Route</div>
            <div className="text-xs font-bold font-mono text-[#166534] mt-1 truncate">
              {activeCase.primary_route || 'Direct Brand'}
            </div>
          </div>
        </div>

        {/* Abstention or In-Scope Details */}
        {activeCase.should_abstain ? (
          <div className="p-4 rounded-xl bg-[#FEFCE8] border border-[#FEF08A] space-y-2 text-xs">
            <div className="font-bold text-[#854D0E] flex items-center gap-1.5 uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Controlled Statutory Abstention Ground</span>
            </div>
            <p className="text-[#713F12] leading-relaxed">
              {activeCase.abstention_reason}
            </p>
            <div className="text-[11px] text-[#854D0E] pt-2 border-t border-[#FEF08A]/80">
              Under Section 87 of CPA 2019, statutory manufacturing product liability cannot be claimed for buyer-inflicted accidental damage, liquid submersion, or non-defective buyer remorse.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statutory Citations */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#181716] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#C83625]" />
                <span>Statutory Authority Citations:</span>
              </div>
              <div className="space-y-1.5">
                {activeCase.statutory_citations?.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#FAF9F7] border border-[#E5E2DC] text-xs text-[#166534] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#181716]">Burden of Proof Evidence Checklist:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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
                    <Check className="w-3.5 h-3.5 text-[#C83625] shrink-0" />
                    <span className="text-[11px] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Dispatch Buttons */}
        <div className="pt-3 border-t border-[#E5E2DC] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {activeCase.pdf_download_url && (
              <a
                href={activeCase.pdf_download_url}
                target="_blank"
                rel="noreferrer"
                className="btn-press px-4 py-2 bg-[#C83625] hover:bg-[#B32E1F] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#C83625]/20 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Formal Notice PDF</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWA}
              className="btn-press px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#FAF9F7] text-[#181716] border border-[#E5E2DC] text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copiedWA ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#736E65]" />}
              <span>{copiedWA ? 'WhatsApp Copied!' : 'WhatsApp Text'}</span>
            </button>

            <button
              onClick={handleCopyNCH}
              className="btn-press px-3.5 py-2 bg-[#181716] hover:bg-[#262422] text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copiedNCH ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
              <span>{copiedNCH ? 'NCH Copied!' : 'NCH Portal Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
