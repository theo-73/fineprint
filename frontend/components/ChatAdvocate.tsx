'use client';

import React from 'react';
import { MessageSquare, Send, RefreshCw, FileText, ArrowRight, Sparkles, Scale } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

interface ChatAdvocateProps {
  messages: ChatMessage[];
  input?: string;
  chatInput?: string;
  loading: boolean;
  onInputChange: (val: string) => void;
  onSendMessage: (msg?: string) => void;
  onOpenCase: (caseId: number) => void;
}

const QUICK_SUGGESTIONS = [
  'Sony XM5 headphones right ear dead after 35 days',
  'Laptop arrived DOA yesterday, bot rejected return',
  'Authorized service center refused repair citing no spare parts',
  'Accidentally dropped phone down the stairs and screen cracked',
];

export const ChatAdvocate: React.FC<ChatAdvocateProps> = ({
  messages,
  input,
  chatInput,
  loading,
  onInputChange,
  onSendMessage,
  onOpenCase,
}) => {
  const activeInput = input !== undefined ? input : (chatInput || '');

  return (
    <div className="bg-[#121216] border border-[#27272A] rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden animate-enter">
      {/* Top Banner */}
      <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#18181D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF2A1A]/10 border border-[#FF2A1A]/20 flex items-center justify-center text-[#FF2A1A]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F4F4F6] tracking-tight">FinePrint Interactive Advocate</h2>
            <p className="text-[11px] text-[#A1A1AA]">Direct statutory intake under CPA 2019 & E-Commerce Rules 2020</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 font-medium">
            Local MCP Client Active
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm",
                  isUser
                    ? "bg-[#FF2A1A] text-white rounded-br-sm shadow-md shadow-[#FF2A1A]/20"
                    : "bg-[#18181D] border border-[#27272A] text-[#F4F4F6] rounded-bl-sm"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#FF2A1A] mb-1.5 uppercase tracking-wider">
                    <Scale className="w-3 h-3" />
                    <span>FinePrint Statutory Agent</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.caseId && (
                  <button
                    onClick={() => onOpenCase(msg.caseId!)}
                    className="btn-press mt-3 py-2 px-3.5 rounded-xl bg-[#FF2A1A] hover:bg-[#E02416] text-white font-semibold text-[11px] flex items-center gap-2 shadow-md transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Generated Claim Docket #{msg.caseId}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#18181D] border border-[#27272A] rounded-2xl rounded-bl-sm p-4 text-xs text-[#A1A1AA] flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 animate-spin text-[#FF2A1A]" />
              <span>Evaluating statutory liabilities via rules-mcp...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#27272A] bg-[#15151A] flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-[#A1A1AA] font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF2A1A]" />
          <span>Quick Prompts:</span>
        </span>
        {QUICK_SUGGESTIONS.map((suggestion, sIdx) => (
          <button
            key={sIdx}
            onClick={() => onInputChange(suggestion)}
            className="btn-press px-2.5 py-1 rounded-full bg-[#18181D] hover:bg-[#FF2A1A]/15 text-[#D4D4D8] hover:text-[#FF6E63] border border-[#27272A] hover:border-[#FF2A1A]/30 whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#27272A] bg-[#18181D] flex items-center gap-2">
        <input
          type="text"
          value={activeInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage(activeInput);
            }
          }}
          placeholder="Describe your purchase issue or defect to evaluate statutory rights..."
          className="flex-1 bg-[#121216] border border-[#27272A] rounded-xl px-4 py-2.5 text-xs text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A] focus:ring-1 focus:ring-[#FF2A1A] transition-colors"
        />
        <button
          disabled={loading || !activeInput.trim()}
          onClick={() => onSendMessage(activeInput)}
          className="btn-press p-2.5 rounded-xl bg-[#FF2A1A] hover:bg-[#E02416] text-white disabled:opacity-40 transition-all shadow-lg shadow-[#FF2A1A]/20"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
