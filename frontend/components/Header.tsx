'use client';

import React from 'react';
import { Scale, Lock, Cpu, Database, MessageSquare, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'cockpit' | 'chat' | 'benchmark' | 'vault';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  caseCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, caseCount }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        
        {/* Brand & Purpose */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/15 border border-blue-400/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">FinePrint</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Track 1: MCP Agent
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Team Onyx
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Statutory Consumer Advocate under CPA 2019 & E-Commerce Rules 2020
            </p>
          </div>
        </div>

        {/* Local Trust Boundary Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-[11px]">Local Trust Boundary: MCP stdio JSON-RPC</span>
        </div>

        {/* Tab Navigation with Emil Kowalski press physics */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner w-full md:w-auto overflow-x-auto" aria-label="Main Navigation">
          <button
            onClick={() => onTabChange('cockpit')}
            className={cn(
              "btn-press flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap",
              activeTab === 'cockpit'
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cockpit</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={cn(
              "btn-press flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap",
              activeTab === 'chat'
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Advocate</span>
          </button>

          <button
            onClick={() => onTabChange('benchmark')}
            className={cn(
              "btn-press flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap",
              activeTab === 'benchmark'
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>30-Case Benchmark</span>
          </button>

          <button
            onClick={() => onTabChange('vault')}
            className={cn(
              "btn-press flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap",
              activeTab === 'vault'
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono tabular-nums">
              {caseCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
