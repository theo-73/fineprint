'use client';

import React from 'react';
import { 
  Scale, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, ChevronLeft, ChevronRight, 
  Lock, Shield, Terminal, Activity, Sparkles, Layers 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TabType } from './Header';
import { BrandMark } from './BrandMark';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  caseCount: number;
}

interface NavItem {
  id: TabType;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  caseCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview & Showcase',
      badge: 'Live',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'cockpit',
      label: 'Dispute Cockpit',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'chat',
      label: 'Interactive Advocate',
      badge: 'Live',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'statutes',
      label: 'Statutes & Precedents',
      badge: 'CPA',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'intel',
      label: 'Platform Intel Radar',
      badge: '2026',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'benchmark',
      label: '30-Case Benchmark',
      badge: 'PyTest',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'vault',
      label: 'SQLite Vault',
      badge: caseCount > 0 ? String(caseCount) : undefined,
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between border-r border-[#27272A] bg-[#121216] transition-all duration-300 z-30 sticky top-0 h-screen select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
          <div className="flex items-center gap-3 overflow-hidden">
            <BrandMark size={36} />
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white">Fine<span className="text-[#FF2A1A]">Print</span></span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FF2A1A]/20 text-[#FF6E63] border border-[#FF2A1A]/30 font-bold">
                    CPA 2019
                  </span>
                </div>
                <div className="text-[10px] text-[#A1A1AA] font-mono truncate">
                  Autonomous Rights Agent
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#18181D] transition-colors shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative group",
                  isActive
                    ? "bg-[#FF2A1A] text-white shadow-lg shadow-[#FF2A1A]/30 font-bold"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#18181D]"
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Pulse Bar */}
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#FFFFFF]" />
                )}

                <span className={cn(
                  "shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-[#71717A] group-hover:text-white"
                )}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ml-2",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#18181D] text-[#A1A1AA] border border-[#27272A]"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry & Trust Boundary HUD */}
      <div className="p-3 border-t border-[#27272A]">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-[#18181D] border border-[#27272A] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#D4D4D8]">
                <span className="w-2 h-2 rounded-full bg-[#FF2A1A] animate-pulse" />
                <span className="font-semibold">MCP Trust Boundary</span>
              </span>
              <span className="text-white font-bold text-[10px] bg-[#121216] px-1.5 py-0.2 rounded border border-[#27272A]">
                Active
              </span>
            </div>
            
            <div className="text-[10px] text-[#A1A1AA] font-mono space-y-1 leading-tight">
              <div className="flex justify-between">
                <span>receipt-mcp</span>
                <span className="text-white">stdio / sandbox</span>
              </div>
              <div className="flex justify-between">
                <span>rules-mcp</span>
                <span className="text-white">Isolated AST</span>
              </div>
              <div className="flex justify-between">
                <span>fineprint-db</span>
                <span className="text-white">WAL Level</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="MCP Trust Boundary: Active">
            <span className="w-3 h-3 rounded-full bg-[#FF2A1A] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
