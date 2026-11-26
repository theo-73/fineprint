'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, Search, ArrowRight, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CaseData } from '../types';
import { cn, formatINR, formatDate } from '../lib/utils';

interface VaultTabProps {
  cases: CaseData[];
  onSelectCase: (c: CaseData) => void;
  onRefresh: () => void;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  cases,
  onSelectCase,
  onRefresh,
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
    <div className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl p-6 md:p-7 space-y-6 shadow-sm animate-enter">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DC]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#181716] flex items-center gap-2 tracking-tight">
              <Database className="w-5 h-5 text-[#C83625]" />
              <span>SQLite Local Case Vault</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9]">
              fineprint.db
            </span>
          </div>
          <p className="text-xs text-[#736E65] mt-0.5">
            Local persistent trust store for claim dockets, PDF notices, and audit event logs
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="btn-press text-xs bg-[#FAF9F7] hover:bg-[#F5F3EF] px-3.5 py-2 rounded-xl text-[#181716] border border-[#E5E2DC] flex items-center gap-2 self-start md:self-auto font-medium shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Vault</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736E65]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, order ID, seller, or claim ref..."
            className="w-full bg-[#FAF9F7] border border-[#D4D0C7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#181716] placeholder-[#A39E93] focus:outline-none focus:border-[#C83625] focus:ring-1 focus:ring-[#C83625] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#FAF9F7] p-1 rounded-xl border border-[#E5E2DC] text-xs self-start sm:self-auto">
          {(['ALL', 'READY', 'ABSTAINED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "btn-press px-3 py-1 rounded-lg text-[11px] font-medium transition-colors",
                statusFilter === status
                  ? "bg-[#C83625] text-white font-semibold shadow-sm"
                  : "text-[#736E65] hover:text-[#181716]"
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
              className="interactive-card p-4 rounded-xl bg-[#FAF9F7] hover:bg-[#FDF4F2] border border-[#E5E2DC] hover:border-[#C83625]/60 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group transition-all shadow-sm"
              role="button"
              tabIndex={0}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C83625] font-bold">{c.claim_ref}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
                      c.status === 'READY'
                        ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                        : "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]"
                    )}
                  >
                    {c.status}
                  </span>
                  <span className="text-[11px] text-[#736E65] font-mono">
                    Order: {c.order_id || 'N/A'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#181716] group-hover:text-[#C83625] transition-colors">
                  {c.product_name}
                </div>
                <div className="text-xs text-[#524E47]">
                  Route: <span className="font-mono text-[#181716] font-medium">{c.primary_route}</span> | Consideration:{" "}
                  <b className="text-[#C83625] font-semibold tabular-nums">{formatINR(c.amount_inr)}</b>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                <span className="text-xs text-[#736E65] font-mono tabular-nums">
                  {formatDate(c.created_at)}
                </span>

                {c.pdf_download_url && (
                  <a
                    href={c.pdf_download_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-press p-2 rounded-lg bg-[#FDF4F2] hover:bg-[#F8CFC9] text-[#C83625] border border-[#F8CFC9] text-xs flex items-center gap-1.5 transition-colors font-medium"
                    title="Download Notice PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}

                <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E5E2DC] flex items-center justify-center text-[#736E65] group-hover:text-white group-hover:bg-[#C83625] group-hover:border-[#C83625] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#736E65] text-xs space-y-2">
          <Database className="w-8 h-8 mx-auto text-[#A39E93]" />
          <p>No cases found matching your search or filter.</p>
        </div>
      )}
    </div>
  );
};
