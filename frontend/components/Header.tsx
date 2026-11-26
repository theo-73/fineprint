'use client';

import React from 'react';
import { 
  Scale, Layers, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, Search, Menu, ChevronRight, Sparkles 
} from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'overview' | 'cockpit' | 'chat' | 'statutes' | 'intel' | 'benchmark' | 'vault';

interface HeaderProps {
  activeTab: TabType;
  onTabChange?: (tab: TabType) => void;
  caseCount: number;
  onOpenCommandPalette?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TAB_METADATA: Record<TabType, { label: string; icon: React.ReactNode; subtitle: string }> = {
  overview: {
    label: 'Overview & Showcase',
    icon: <Sparkles className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'System Architecture, Constellation & Interactive Sandbox',
  },
  cockpit: {
    label: 'Dispute Cockpit',
    icon: <Layers className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'Purchase Intake & Statutory Liability Compilation',
  },
  chat: {
    label: 'Interactive Advocate',
    icon: <MessageSquare className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'Conversational Statutory Rights Ingestion',
  },
  statutes: {
    label: 'Statutes & Precedents',
    icon: <BookOpen className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'Codified CPA 2019 Sections & Judicial Authorities',
  },
  intel: {
    label: 'Platform Intel Radar',
    icon: <BarChart3 className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'Marketplace Compliance & Dark Pattern Countermeasures',
  },
  benchmark: {
    label: '30-Case Benchmark',
    icon: <Cpu className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'PyTest Verified Evaluation Suite (20 In-Scope / 10 Abstentions)',
  },
  vault: {
    label: 'SQLite Vault',
    icon: <Database className="w-4 h-4 text-[#C83625]" />,
    subtitle: 'Persistent Case Store & JSON-RPC Audit Logs',
  },
};

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  caseCount,
  onOpenCommandPalette,
  onToggleMobileMenu,
}) => {
  const current = TAB_METADATA[activeTab];

  return (
    <header className="border-b border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Active Section Breadcrumb */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-[#736E65] hover:text-[#181716] hover:bg-[#FAF9F7] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Section Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC] flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-medium text-[#736E65] hidden sm:inline">FinePrint</span>
                <ChevronRight className="w-3 h-3 text-[#A39E93] hidden sm:inline" />
                <h1 className="text-sm font-bold tracking-tight text-[#181716] font-sans">
                  {current.label}
                </h1>
                {activeTab === 'vault' && caseCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#FAF9F7] text-[#C83625] border border-[#F8CFC9] font-bold tabular-nums">
                    {caseCount} Cases
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#736E65] leading-none mt-0.5 line-clamp-1">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Search / Command Palette Shortcut Trigger (Ctrl + K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="btn-press flex items-center gap-3 px-3 py-2 rounded-xl bg-[#FAF9F7] hover:bg-[#F5F3EF] border border-[#D4D0C7] text-xs text-[#736E65] hover:text-[#181716] transition-all max-w-xs w-full sm:w-72 shadow-2xs"
            aria-label="Open Command Palette"
          >
            <Search className="w-3.5 h-3.5 text-[#C83625] shrink-0" />
            <span className="truncate text-left flex-1">Search statutes, cases, tools...</span>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono font-bold bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E5E2DC] text-[#736E65]">
              Ctrl+K
            </kbd>
          </button>
        )}

      </div>
    </header>
  );
};
