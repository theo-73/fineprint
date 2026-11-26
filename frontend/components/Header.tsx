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
    <header className="border-b border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        
        {/* Brand & Purpose */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#C83625] flex items-center justify-center shadow-md shadow-[#C83625]/20 border border-[#B32E1F]">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#181716] font-sans">FinePrint</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9]">
                CPA 2019 Certified
              </span>
            </div>
            <p className="text-[11px] text-[#736E65]">
              Statutory Consumer Advocate under CPA 2019 & E-Commerce Rules 2020
            </p>
          </div>
        </div>

        {/* Local Trust Boundary Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="font-medium text-[11px]">Local Trust Boundary: MCP stdio JSON-RPC</span>
        </div>

        {/* Tab Navigation with Emil Kowalski press physics */}
        <nav className="flex items-center gap-1 bg-[#EFECE7] p-1 rounded-xl border border-[#E5E2DC] shadow-inner w-full md:w-auto overflow-x-auto" aria-label="Main Navigation">
          <button
            onClick={() => onTabChange('cockpit')}
            className={cn(
              "btn-press flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap",
              activeTab === 'cockpit'
                ? "bg-[#C83625] text-white shadow-sm"
                : "text-[#736E65] hover:text-[#181716] hover:bg-[#E5E2DC]/70"
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
                ? "bg-[#C83625] text-white shadow-sm"
                : "text-[#736E65] hover:text-[#181716] hover:bg-[#E5E2DC]/70"
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
                ? "bg-[#C83625] text-white shadow-sm"
                : "text-[#736E65] hover:text-[#181716] hover:bg-[#E5E2DC]/70"
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
                ? "bg-[#C83625] text-white shadow-sm"
                : "text-[#736E65] hover:text-[#181716] hover:bg-[#E5E2DC]/70"
            )}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Vault</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums",
              activeTab === 'vault' ? "bg-[#B32E1F] text-white" : "bg-[#E5E2DC] text-[#3D3A35]"
            )}>
              {caseCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
