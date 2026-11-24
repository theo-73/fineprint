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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-7 space-y-6 shadow-sm animate-enter">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
              <Database className="w-5 h-5 text-blue-400" />
              <span>SQLite Local Case Vault</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              fineprint.db
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Local persistent trust store for claim dockets, PDF notices, and audit event logs
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="btn-press text-xs bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl text-slate-200 border border-slate-700/80 flex items-center gap-2 self-start md:self-auto font-medium shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Vault</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, order ID, seller, or claim ref..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-850 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          {(['ALL', 'READY', 'ABSTAINED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "btn-press px-3 py-1 rounded-lg text-[11px] font-medium transition-colors",
                statusFilter === status
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
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
              className="interactive-card p-4 rounded-xl bg-slate-850 hover:bg-slate-800/80 border border-slate-700/80 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              role="button"
              tabIndex={0}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400 font-bold">{c.claim_ref}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
                      c.status === 'READY'
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    )}
                  >
                    {c.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Order: {c.order_id || 'N/A'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {c.product_name}
                </div>
                <div className="text-xs text-slate-400">
                  Route: <span className="font-mono text-slate-300">{c.primary_route}</span> | Consideration:{" "}
                  <b className="text-emerald-400 font-semibold tabular-nums">{formatINR(c.amount_inr)}</b>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {formatDate(c.created_at)}
                </span>

                {c.pdf_download_url && (
                  <a
                    href={c.pdf_download_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-press p-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1.5 transition-colors"
                    title="Download Notice PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}

                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-xs space-y-2">
          <Database className="w-8 h-8 mx-auto text-slate-600" />
          <p>No cases found matching your search or filter.</p>
        </div>
      )}
    </div>
  );
};
