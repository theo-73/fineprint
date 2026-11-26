'use client';

import React from 'react';
import { 
  Scale, Layers, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, Search, Menu, ChevronRight, Sparkles, 
  ArrowLeft, User 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AuthUser } from './AuthModal';

export type TabType = 'overview' | 'cockpit' | 'chat' | 'statutes' | 'intel' | 'benchmark' | 'vault';

interface HeaderProps {
  activeTab: TabType;
  onTabChange?: (tab: TabType) => void;
  caseCount: number;
  user?: AuthUser | null;
  onOpenCommandPalette?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TAB_METADATA: Record<TabType, { label: string; icon: React.ReactNode; subtitle: string }> = {
  overview: {
    label: 'Overview & Showcase',
    icon: <Sparkles className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'System Architecture, Constellation & Interactive Sandbox',
  },
  cockpit: {
    label: 'Dispute Cockpit',
    icon: <Layers className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'Purchase Intake & Statutory Liability Compilation',
  },
  chat: {
    label: 'Interactive Advocate',
    icon: <MessageSquare className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'Conversational Statutory Rights Ingestion',
  },
  statutes: {
    label: 'Statutes & Precedents',
    icon: <BookOpen className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'Codified CPA 2019 Sections & Judicial Authorities',
  },
  intel: {
    label: 'Platform Intel Radar',
    icon: <BarChart3 className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'Marketplace Compliance & Dark Pattern Countermeasures',
  },
  benchmark: {
    label: '30-Case Benchmark',
    icon: <Cpu className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'PyTest Verified Evaluation Suite (20 In-Scope / 10 Abstentions)',
  },
  vault: {
    label: 'SQLite Vault',
    icon: <Database className="w-4 h-4 text-[#FF2A1A]" />,
    subtitle: 'Persistent Case Store & JSON-RPC Audit Logs',
  },
};

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange,
  caseCount,
  user,
  onOpenCommandPalette,
  onToggleMobileMenu,
}) => {
  const current = TAB_METADATA[activeTab];

  return (
    <header className="border-b border-[#27272A] bg-[#121216]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3 transition-colors select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Active Section Breadcrumb */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#18181D] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Back to Showcase Button */}
          {onTabChange && (
            <button
              onClick={() => onTabChange('overview')}
              className="btn-press hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A]/50 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-all shadow-xs"
              title="Return to Public Landing Showcase"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6E63]" />
              <span>Showcase</span>
            </button>
          )}

          {/* Section Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#18181D] border border-[#27272A] flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-medium text-[#71717A] hidden sm:inline">FinePrint</span>
                <ChevronRight className="w-3 h-3 text-[#52525B] hidden sm:inline" />
                <h1 className="text-sm font-bold tracking-tight text-white font-sans">
                  {current.label}
                </h1>
                {activeTab === 'vault' && caseCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#18181D] text-[#FF6E63] border border-[#FF2A1A]/30 font-bold tabular-nums">
                    {caseCount} Cases
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A1A1AA] leading-none mt-0.5 line-clamp-1">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Search Trigger & User Profile Pill */}
        <div className="flex items-center gap-3">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="btn-press flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#27272A] bg-[#18181D] hover:bg-[#202027] text-xs text-[#A1A1AA] hover:text-white hover:border-[#FF2A1A]/40 transition-all shadow-xs group"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#FF2A1A] transition-colors" />
              <span className="hidden md:inline font-sans">Search statutes, cases...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] text-[#71717A] bg-[#121216] px-1.5 py-0.5 rounded border border-[#27272A]">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* User Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181D] border border-[#27272A] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-[11px] text-white font-bold hidden sm:inline">
              {user ? user.name.split(' ')[0] : 'Demo Counsel'}
            </span>
            <span className="text-[9px] font-mono bg-[#FF2A1A]/20 text-[#FF6E63] px-1.5 py-0.2 rounded border border-[#FF2A1A]/30">
              {user ? user.role.split(' ')[0] : 'CPA 2019'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
