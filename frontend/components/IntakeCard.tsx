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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Purchase Intake</h2>
            <p className="text-[11px] text-slate-400">Validated via receipt-mcp isolation</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Untrusted Inputs Sanitized
        </span>
      </div>

      {/* PDF Dropzone */}
      <div className="space-y-1.5">
        <label htmlFor="pdf-upload-input" className="text-xs text-slate-300 font-medium block">
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
              ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
              : "border-slate-700/80 bg-slate-850/60 hover:border-slate-600 hover:bg-slate-800/70"
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF tax invoice"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              {uploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200">
                {uploading ? 'Extracting structured facts via receipt-mcp...' : 'Drop tax invoice PDF here or click to browse'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports official invoices from Amazon.in, Flipkart, Croma & Reliance Digital
              </p>
            </div>
          </div>
        </div>

        {uploadedFileName && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Active Invoice: <b>{uploadedFileName}</b></span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 flex-shrink-0">
              Parsed
            </span>
          </div>
        )}
      </div>

      {/* Curated Indian Receipts */}
      <div className="space-y-2">
        <label className="text-xs text-slate-300 font-medium block">
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
                    ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/30"
                    : "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300"
                )}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between font-semibold text-slate-200 mb-0.5">
                  <span className="truncate text-blue-400 font-mono text-[11px]">{r.sender}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{r.date}</span>
                </div>
                <div className="text-slate-300 font-medium text-[11px] truncate">{r.subject}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Facts Card */}
      {selectedReceipt && (
        <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-700/80 space-y-2 text-xs animate-enter">
          <div className="flex items-center justify-between font-semibold text-blue-400">
            <span className="flex items-center gap-1.5 text-xs">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Verified Fact Schema</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              receipt-mcp Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block">Order ID:</span>
              <span className="font-mono text-slate-200">{selectedReceipt.order_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Amount Paid:</span>
              <span className="font-semibold text-emerald-400 tabular-nums">
                {formatINR(selectedReceipt.amount_inr)}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">Product:</span>
              <span className="text-white font-medium">{selectedReceipt.product_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Seller:</span>
              <span className="text-slate-200">{selectedReceipt.seller_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Platform:</span>
              <span className="text-slate-200">{selectedReceipt.marketplace || 'Direct'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Complainant Name */}
      <div className="space-y-1">
        <label htmlFor="complainant-name-input" className="text-xs text-slate-300 font-medium block">
          Complainant Name (Purchaser):
        </label>
        <input
          id="complainant-name-input"
          type="text"
          value={complainantName}
          onChange={(e) => onComplainantNameChange(e.target.value)}
          placeholder="Full Legal Name"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Issue Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <label htmlFor="defect-description-input">Defect Description & Chronology:</label>
          <span className="text-[10px] text-slate-500 tabular-nums font-mono">
            {problemDescription.length} chars
          </span>
        </div>
        <textarea
          id="defect-description-input"
          rows={3}
          value={problemDescription}
          onChange={(e) => onProblemDescriptionChange(e.target.value)}
          placeholder="Describe how the defect manifested, timeline of usage, and customer service response..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-colors"
        />
      </div>

      {/* Action Button */}
      <button
        disabled={loading || !problemDescription.trim()}
        onClick={onEvaluate}
        className="btn-press w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
