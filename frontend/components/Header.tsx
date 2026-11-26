'use client';

import React from 'react';
import { 
  Scale, Lock, Cpu, Database, MessageSquare, 
  Layers, BookOpen, BarChart3, Search, Menu 
} from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'cockpit' | 'chat' | 'statutes' | 'intel' | 'benchmark' | 'vault';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  caseCount: number;
  onOpenCommandPalette?: () => void;
  onToggleMobileMenu?: () => void;
}

const TAB_METADATA: Record<TabType, { label: string; icon: React.ReactNode; subtitle: string }> = {
  cockpit: {
    label: 'Dispute Cockpit',
    icon: <Layers className="w-3.5 h-3.5" />,
    subtitle: 'Intake & Statutory Compilation',
  },
  chat: {
    label: 'Interactive Advocate',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    subtitle: 'Conversational Statutory Ingestion',
  },
  statutes: {
    label: 'Statutes & Precedents',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    subtitle: 'CPA 2019 Codified Rules',
  },
  intel: {
    label: 'Platform Intel Radar',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    subtitle: 'Market Deflection Benchmarks',
  },
  benchmark: {
    label: '30-Case Benchmark',
    icon: <Cpu className="w-3.5 h-3.5" />,
    subtitle: 'PyTest Verification Suite',
  },
  vault: {
    label: 'SQLite Vault',
    icon: <Database className="w-3.5 h-3.5" />,
    subtitle: 'Persistent Case Store',
  },
};

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  caseCount,
  onOpenCommandPalette,
  onToggleMobileMenu,
}) => {
  return (
    <header className="border-b border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand / Breadcrumbs */}
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

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C83625] flex items-center justify-center shadow-md shadow-[#C83625]/20 border border-[#B32E1F] shrink-0">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[#181716] font-sans">FinePrint</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9]">
                  CPA 2019 Certified
                </span>
              </div>
              <p className="text-[11px] text-[#736E65] hidden lg:block leading-none mt-0.5">
                Statutory Consumer Rights Advocate · Codified under CPA 2019 & E-Commerce Rules
              </p>
            </div>
          </div>
        </div>

        {/* Center: Command Palette Trigger Button (Ctrl + K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="btn-press hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#FAF9F7] hover:bg-[#F5F3EF] border border-[#D4D0C7] text-xs text-[#736E65] hover:text-[#181716] transition-all max-w-xs w-full shadow-2xs"
            aria-label="Open Command Palette"
          >
            <Search className="w-3.5 h-3.5 text-[#C83625]" />
            <span className="truncate">Search statutes, cases, tools...</span>
            <kbd className="ml-auto text-[10px] font-mono font-bold bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E5E2DC] text-[#736E65]">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Right: Local Trust Boundary Status Indicator & Tabs on Mobile */}
        <div className="flex items-center gap-2.5">
          {/* Trust Boundary Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span className="font-medium text-[11px] font-mono">stdio JSON-RPC Active</span>
          </div>

          {/* Quick Tab Select for Compact / Mobile */}
          <div className="flex items-center gap-1 bg-[#EFECE7] p-1 rounded-xl border border-[#E5E2DC] shadow-inner overflow-x-auto max-w-full">
            {(Object.keys(TAB_METADATA) as TabType[]).map((tabKey) => {
              const meta = TAB_METADATA[tabKey];
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => onTabChange(tabKey)}
                  className={cn(
                    "btn-press px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all",
                    isActive
                      ? "bg-[#C83625] text-white shadow-xs font-semibold"
                      : "text-[#736E65] hover:text-[#181716] hover:bg-[#E5E2DC]/70"
                  )}
                  title={meta.subtitle}
                >
                  {meta.icon}
                  <span className="hidden md:inline">{meta.label}</span>
                  {tabKey === 'vault' && caseCount > 0 && (
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.2 rounded-full font-mono tabular-nums",
                      isActive ? "bg-[#B32E1F] text-white" : "bg-[#E5E2DC] text-[#3D3A35]"
                    )}>
                      {caseCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};
