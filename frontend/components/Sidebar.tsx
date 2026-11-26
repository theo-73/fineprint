'use client';

import React from 'react';
import { 
  Scale, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, ChevronLeft, ChevronRight, 
  Lock, Shield, Terminal, Activity, Sparkles 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TabType } from './Header';

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
      icon: <Scale className="w-4 h-4" />,
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
        "hidden md:flex flex-col justify-between border-r border-[#E5E2DC] bg-[#FFFFFF] transition-all duration-300 z-30 sticky top-0 h-screen select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E2DC]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#C83625] flex items-center justify-center shrink-0 shadow-md shadow-[#C83625]/20 border border-[#B32E1F]">
              <Scale className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-[#181716]">FinePrint</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9] font-bold">
                    CPA 2019
                  </span>
                </div>
                <div className="text-[10px] text-[#736E65] font-mono truncate">
                  Autonomous Rights Agent
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="text-[#736E65] hover:text-[#181716] p-1.5 rounded-lg hover:bg-[#FAF9F7] transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items with Emil Kowalski press mechanics */}
        <nav className="p-3 space-y-1.5" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group text-left",
                  active
                    ? "bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9] font-bold shadow-xs"
                    : "text-[#524E47] hover:text-[#181716] hover:bg-[#FAF9F7] border border-transparent"
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Left accent bar on active */}
                {active && (
                  <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-[#C83625] animate-pulse" />
                )}
                <span
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-[#C83625]" : "text-[#736E65]"
                  )}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ml-1.5",
                          active
                            ? "bg-[#C83625] text-white"
                            : "bg-[#FAF9F7] text-[#736E65] border border-[#E5E2DC]"
                        )}
                      >
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

      {/* Trust Boundary Telemetry Card */}
      <div className="p-3 border-t border-[#E5E2DC] space-y-2">
        {!collapsed ? (
          <div className="p-3 rounded-2xl bg-[#FAF9F7] border border-[#E5E2DC] text-[11px] space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-[#166534]">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                </span>
                <span>MCP Trust Boundary</span>
              </span>
              <span className="text-[10px] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                Active
              </span>
            </div>

            <div className="space-y-1 text-[10px] font-mono text-[#736E65]">
              <div className="flex items-center justify-between">
                <span>receipt-mcp</span>
                <span className="text-[#181716] font-semibold">stdio / sandbox</span>
              </div>
              <div className="flex items-center justify-between">
                <span>rules-mcp</span>
                <span className="text-[#181716] font-semibold">isolated AST</span>
              </div>
              <div className="flex items-center justify-between">
                <span>fineprint.db</span>
                <span className="text-[#181716] font-semibold">WAL local</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="MCP Trust Boundary: Active stdio JSON-RPC">
            <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A]">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
