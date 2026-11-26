'use client';

import React, { useRef, useState } from 'react';
import { 
  Inbox, UploadCloud, RefreshCw, CheckCircle2, ShieldCheck, 
  FileText, ArrowRight, AlertCircle, ShoppingBag 
} from 'lucide-react';
import { ExtractedOrder, MockReceipt } from '../types';
import { cn, formatINR } from '../lib/utils';

interface IntakeCardProps {
  mockReceipts: MockReceipt[];
  selectedReceipt: ExtractedOrder | null;
  uploadedFileName: string | null;
  problemDescription: string;
  complainantName: string;
  loading: boolean;
  uploading: boolean;
  onSelectReceipt: (receipt: MockReceipt) => void;
  onFileUpload: (file: File) => void;
  onProblemDescriptionChange: (val: string) => void;
  onComplainantNameChange: (val: string) => void;
  onEvaluate: () => void;
}

export const IntakeCard: React.FC<IntakeCardProps> = ({
  mockReceipts,
  selectedReceipt,
  uploadedFileName,
  problemDescription,
  complainantName,
  loading,
  uploading,
  onSelectReceipt,
  onFileUpload,
  onProblemDescriptionChange,
  onComplainantNameChange,
  onEvaluate,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF2A1A]/10 flex items-center justify-center text-[#FF2A1A] border border-[#FF2A1A]/20">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F4F4F6] tracking-tight">Purchase Intake</h2>
            <p className="text-[11px] text-[#A1A1AA]">Validated via receipt-mcp isolation</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
          Untrusted Inputs Sanitized
        </span>
      </div>

      {/* PDF Dropzone */}
      <div className="space-y-1.5">
        <label htmlFor="pdf-upload-input" className="text-xs text-[#D4D4D8] font-medium block">
          Upload E-Commerce Tax Invoice (PDF):
        </label>
        <input
          id="pdf-upload-input"
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload(e.target.files[0]);
            }
          }}
        />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 select-none",
            isDragOver
              ? "border-[#FF2A1A] bg-[#FF2A1A]/10 ring-2 ring-[#FF2A1A]/20"
              : "border-[#27272A] bg-[#18181D] hover:border-[#FF2A1A]/60 hover:bg-[#FF2A1A]/5"
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF tax invoice"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF2A1A]/10 flex items-center justify-center text-[#FF2A1A] border border-[#FF2A1A]/20">
              {uploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F4F4F6]">
                {uploading ? 'Extracting structured facts via receipt-mcp...' : 'Drop tax invoice PDF here or click to browse'}
              </span>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Supports official invoices from Amazon.in, Flipkart, Croma & Reliance Digital
              </p>
            </div>
          </div>
        </div>

        {uploadedFileName && (
          <div className="p-2.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
              <span className="truncate">Active Invoice: <b>{uploadedFileName}</b></span>
            </div>
            <span className="text-[10px] font-mono bg-[#10B981]/20 px-1.5 py-0.5 rounded text-[#10B981] flex-shrink-0">
              Parsed
            </span>
          </div>
        )}
      </div>

      {/* Curated Indian Receipts */}
      <div className="space-y-2">
        <label className="text-xs text-[#D4D4D8] font-medium block">
          Or Select Curated Purchase Proofs (receipt-mcp):
        </label>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {mockReceipts.map((r) => {
            const isSelected = Boolean(
              selectedReceipt && selectedReceipt.order_id && (
                r.body.includes(selectedReceipt.order_id) || r.subject.includes(selectedReceipt.order_id)
              )
            );

            return (
              <div
                key={r.id}
                onClick={() => onSelectReceipt(r)}
                className={cn(
                  "btn-press p-2.5 rounded-xl border text-xs cursor-pointer transition-all",
                  isSelected
                    ? "bg-[#FF2A1A]/10 border-[#FF2A1A] ring-1 ring-[#FF2A1A]"
                    : "bg-[#18181D] hover:bg-[#202027] border-[#27272A] text-[#D4D4D8]"
                )}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between font-semibold text-[#F4F4F6] mb-0.5">
                  <span className="truncate text-[#FF2A1A] font-mono text-[11px] font-bold">{r.sender}</span>
                  <span className="text-[10px] text-[#71717A] font-mono">{r.date}</span>
                </div>
                <div className="text-[#A1A1AA] font-medium text-[11px] truncate">{r.subject}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Facts Card */}
      {selectedReceipt && (
        <div className="p-3.5 rounded-xl bg-[#18181D] border border-[#27272A] space-y-2 text-xs animate-enter">
          <div className="flex items-center justify-between font-semibold text-[#FF2A1A]">
            <span className="flex items-center gap-1.5 text-xs">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Verified Fact Schema</span>
            </span>
            <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
              receipt-mcp Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#D4D4D8] pt-1 border-t border-[#27272A]">
            <div>
              <span className="text-[#71717A] block">Order ID:</span>
              <span className="font-mono text-[#F4F4F6] font-semibold">{selectedReceipt.order_id}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Amount Paid:</span>
              <span className="font-semibold text-[#FF2A1A] tabular-nums text-xs">
                {formatINR(selectedReceipt.amount_inr)}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[#71717A] block">Product:</span>
              <span className="text-[#F4F4F6] font-medium">{selectedReceipt.product_name}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Seller:</span>
              <span className="text-[#D4D4D8]">{selectedReceipt.seller_name}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Platform:</span>
              <span className="text-[#D4D4D8]">{selectedReceipt.marketplace || 'Direct'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Complainant Name */}
      <div className="space-y-1">
        <label htmlFor="complainant-name-input" className="text-xs text-[#D4D4D8] font-medium block">
          Complainant Name (Purchaser):
        </label>
        <input
          id="complainant-name-input"
          type="text"
          value={complainantName}
          onChange={(e) => onComplainantNameChange(e.target.value)}
          placeholder="Full Legal Name"
          className="w-full bg-[#18181D] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A] focus:ring-1 focus:ring-[#FF2A1A] transition-colors"
        />
      </div>

      {/* Issue Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-[#D4D4D8] font-medium">
          <label htmlFor="defect-description-input">Defect Description & Chronology:</label>
          <span className="text-[10px] text-[#71717A] tabular-nums font-mono">
            {problemDescription.length} chars
          </span>
        </div>
        <textarea
          id="defect-description-input"
          rows={3}
          value={problemDescription}
          onChange={(e) => onProblemDescriptionChange(e.target.value)}
          placeholder="Describe how the defect manifested, timeline of usage, and customer service response..."
          className="w-full bg-[#18181D] border border-[#27272A] rounded-xl p-3 text-xs text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A] focus:ring-1 focus:ring-[#FF2A1A] resize-none transition-colors"
        />
      </div>

      {/* Action Button */}
      <button
        disabled={loading || !problemDescription.trim()}
        onClick={onEvaluate}
        className="btn-press w-full py-3 px-4 rounded-xl bg-[#FF2A1A] hover:bg-[#E02416] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF2A1A]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Classifying via rules-mcp (stdio)...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Evaluate Statutory Consumer Rights</span>
          </>
        )}
      </button>
    </div>
  );
};
