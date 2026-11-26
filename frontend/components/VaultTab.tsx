'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, Search, ArrowRight, Download, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { CaseData } from '../types';
import { cn, formatINR, formatDate } from '../lib/utils';

interface VaultTabProps {
  cases: CaseData[];
  onSelectCase: (c: CaseData) => void;
  onRefresh?: () => void;
  onOpenDossier?: (c: CaseData) => void;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  cases,
  onSelectCase,
  onRefresh,
  onOpenDossier,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'READY' | 'ABSTAINED'>('ALL');

  const filtered = cases.filter((c) => {
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      c.claim_ref.toLowerCase().includes(query) ||
      c.product_name.toLowerCase().includes(query) ||
      c.order_id.toLowerCase().includes(query) ||
      c.seller_name.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 md:p-7 space-y-6 shadow-xl animate-enter">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2 tracking-tight">
              <Database className="w-5 h-5 text-[#FF2A1A]" />
              <span>SQLite Local Case Vault</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF2A1A]/10 text-[#FF2A1A] border border-[#FF2A1A]/20">
              fineprint.db
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Local persistent trust store for claim dockets, PDF notices, and audit event logs
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn-press text-xs bg-[#18181D] hover:bg-[#202027] px-3.5 py-2 rounded-xl text-[#F4F4F6] border border-[#27272A] flex items-center gap-2 self-start md:self-auto font-medium shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Vault</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, order ID, seller, or claim ref..."
            className="w-full bg-[#18181D] border border-[#27272A] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A] focus:ring-1 focus:ring-[#FF2A1A] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#18181D] p-1 rounded-xl border border-[#27272A] text-xs self-start sm:self-auto">
          {(['ALL', 'READY', 'ABSTAINED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "btn-press px-3 py-1 rounded-lg text-[11px] font-medium transition-colors",
                statusFilter === status
                  ? "bg-[#FF2A1A] text-white font-semibold shadow-md shadow-[#FF2A1A]/20"
                  : "text-[#A1A1AA] hover:text-white"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Case Cards List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="interactive-card p-4 rounded-xl bg-white text-black hover:bg-[#FAFAFA] border border-black/15 hover:border-[#FF2A1A] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group transition-all shadow-md font-sans"
              role="button"
              tabIndex={0}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#FF2A1A] font-bold">{c.claim_ref}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase",
                      c.status === 'READY'
                        ? "bg-black text-white"
                        : "bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30"
                    )}
                  >
                    {c.status}
                  </span>
                  <span className="text-[11px] text-[#52525B] font-mono">
                    Order: {c.order_id || 'N/A'}
                  </span>
                </div>
                <div className="text-sm font-bold text-black group-hover:text-[#FF2A1A] transition-colors">
                  {c.product_name}
                </div>
                <div className="text-xs text-[#52525B]">
                  Route: <span className="font-mono text-black font-semibold">{c.primary_route}</span> | Consideration:{" "}
                  <b className="text-[#FF2A1A] font-extrabold tabular-nums">{formatINR(c.amount_inr)}</b>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                <span className="text-xs text-[#71717A] font-mono tabular-nums">
                  {formatDate(c.created_at)}
                </span>

                {onOpenDossier && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDossier(c);
                    }}
                    className="btn-press p-2 rounded-lg bg-[#FF2A1A]/10 hover:bg-[#FF2A1A]/20 text-[#FF6E63] border border-[#FF2A1A]/25 text-xs flex items-center gap-1.5 transition-colors font-medium"
                    title="Open Case Dossier"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dossier</span>
                  </button>
                )}

                {c.pdf_download_url && (
                  <a
                    href={c.pdf_download_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-press p-2 rounded-lg bg-[#121216] hover:bg-[#202027] text-[#FF2A1A] border border-[#27272A] text-xs flex items-center gap-1.5 transition-colors font-medium"
                    title="Download Notice PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}

                <div className="w-8 h-8 rounded-lg bg-[#121216] border border-[#27272A] flex items-center justify-center text-[#71717A] group-hover:text-white group-hover:bg-[#FF2A1A] group-hover:border-[#FF2A1A] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#71717A] text-xs space-y-2">
          <Database className="w-8 h-8 mx-auto text-[#3F3F46]" />
          <p>No cases found matching your search or filter.</p>
        </div>
      )}
    </div>
  );
};
