'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Scale, MessageSquare, BookOpen, BarChart3, 
  Cpu, Database, ArrowRight, X, PhoneCall, ShieldCheck, 
  FileText, CornerDownLeft, Sparkles 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TabType } from './Header';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onSelectSampleCase?: (index: number) => void;
  onSelectSampleInvoice?: (index: number) => void;
  onTriggerAction?: (actionId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Sample Purchase Invoices' | 'Statutory Quick Actions';
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectSampleCase,
  onSelectSampleInvoice,
  onTriggerAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectSample = (idx: number) => {
    if (onSelectSampleInvoice) {
      onSelectSampleInvoice(idx);
    } else if (onSelectSampleCase) {
      onSelectSampleCase(idx);
    }
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      title: 'Overview & Interactive Showcase',
      category: 'Navigation',
      subtitle: 'System architecture, constellation & interactive bento sandbox',
      icon: <Sparkles className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('overview'),
    },
    {
      id: 'nav-cockpit',
      title: 'Dispute Cockpit & Intake',
      category: 'Navigation',
      subtitle: 'Upload PDF invoice or inspect structured facts',
      icon: <Scale className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('cockpit'),
    },
    {
      id: 'nav-chat',
      title: 'Interactive Statutory Advocate',
      category: 'Navigation',
      subtitle: 'Conversational consumer defense assistant',
      icon: <MessageSquare className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('chat'),
    },
    {
      id: 'nav-statutes',
      title: 'Codified Statutes & Precedents',
      category: 'Navigation',
      subtitle: 'CPA 2019 Sections, E-Commerce Rules & NCDRC cases',
      icon: <BookOpen className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('statutes'),
    },
    {
      id: 'nav-intel',
      title: 'E-Commerce Platform Intel Radar',
      category: 'Navigation',
      subtitle: 'Market compliance scoreboard & dark pattern radar',
      icon: <BarChart3 className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('intel'),
    },
    {
      id: 'nav-benchmark',
      title: '30-Case Verification Benchmark',
      category: 'Navigation',
      subtitle: 'Run 20 in-scope & 10 abstention verification cases',
      icon: <Cpu className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('benchmark'),
    },
    {
      id: 'nav-vault',
      title: 'SQLite Case Vault (fineprint.db)',
      category: 'Navigation',
      subtitle: 'Browse persistent claim dockets and audit traces',
      icon: <Database className="w-4 h-4 text-[#C83625]" />,
      action: () => onNavigate('vault'),
    },
    // Sample Invoices
    {
      id: 'sample-sony',
      title: 'Load Sony WH-1000XM5 Inherent Hardware Failure',
      category: 'Sample Purchase Invoices',
      subtitle: 'Amazon.in · Appario Retail · ₹24,990 · Hardware ANC defect after 35 days',
      icon: <FileText className="w-4 h-4 text-[#10B981]" />,
      action: () => {
        onNavigate('cockpit');
        selectSample(0);
      },
    },
    {
      id: 'sample-samsung',
      title: 'Load Samsung S24 Ultra Dead On Arrival (DOA)',
      category: 'Sample Purchase Invoices',
      subtitle: 'Croma.com · Infiniti Retail · ₹1,29,999 · Screen green tint out of box',
      icon: <FileText className="w-4 h-4 text-[#10B981]" />,
      action: () => {
        onNavigate('cockpit');
        selectSample(1);
      },
    },
    {
      id: 'sample-macbook',
      title: 'Load Apple MacBook Air M3 Motherboard Refusal',
      category: 'Sample Purchase Invoices',
      subtitle: 'Reliance Digital · ₹1,34,900 · Service center denied parts within warranty',
      icon: <FileText className="w-4 h-4 text-[#10B981]" />,
      action: () => {
        onNavigate('cockpit');
        selectSample(2);
      },
    },
    // Statutory Quick Actions
    {
      id: 'action-nch',
      title: 'National Consumer Helpline (NCH 1915)',
      category: 'Statutory Quick Actions',
      subtitle: 'Official toll-free grievance portal: consumerhelpline.gov.in',
      icon: <PhoneCall className="w-4 h-4 text-[#2563EB]" />,
      action: () => {
        if (onTriggerAction) onTriggerAction('nch');
      },
    },
    {
      id: 'action-sla',
      title: 'Inspect Rule 4(5) SLA Timers',
      category: 'Statutory Quick Actions',
      subtitle: '48h acknowledgment mandate & 30-day resolution timeline',
      icon: <ShieldCheck className="w-4 h-4 text-[#C83625]" />,
      action: () => {
        if (onTriggerAction) onTriggerAction('sla');
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent, or toggle
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex]);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#09090B]/80 backdrop-blur-md animate-enter select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-xl bg-[#121216] border border-[#27272A] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[80vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#27272A] flex items-center gap-3 bg-[#18181D]">
          <Search className="w-5 h-5 text-[#FF2A1A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, statute, order ID, or section..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#71717A] focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#A1A1AA] bg-[#121216] border border-[#27272A] px-2 py-0.5 rounded shadow-xs">
            ESC
          </kbd>
          <button 
            onClick={onClose} 
            className="text-[#71717A] hover:text-white p-1 rounded-lg hover:bg-[#27272A] transition-colors"
            aria-label="Close Command Palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl cursor-pointer text-xs transition-all",
                    isSelected
                      ? "bg-[#18181D] border border-[#FF2A1A] text-white shadow-md shadow-[#FF2A1A]/10"
                      : "hover:bg-[#18181D] text-[#D4D4D8] border border-transparent"
                  )}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                      isSelected ? "bg-[#121216] border-[#FF2A1A]/60" : "bg-[#18181D] border-[#27272A]"
                    )}>
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-mono font-medium text-[#71717A] uppercase">
                          · {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <div className="text-[11px] text-[#A1A1AA] mt-0.5 line-clamp-1">
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#FF6E63] font-semibold bg-[#121216] px-2 py-0.5 rounded border border-[#FF2A1A]/40">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-xs text-[#71717A] space-y-1">
              <Sparkles className="w-6 h-6 mx-auto text-[#52525B]" />
              <p className="font-semibold text-white">No matching commands found</p>
              <p className="text-[11px]">Try searching for &quot;cockpit&quot;, &quot;statutes&quot;, &quot;sony&quot;, or &quot;nch&quot;</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#18181D] border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#71717A] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1 text-[#FF6E63] font-semibold">
            <span>FinePrint Local MCP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
