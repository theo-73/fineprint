'use client';

import React from 'react';
import { MessageSquare, Send, RefreshCw, FileText, ArrowRight, Sparkles, Scale, Shield } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

interface ChatAdvocateProps {
  messages: ChatMessage[];
  chatInput: string;
  loading: boolean;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
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
  chatInput,
  loading,
  onInputChange,
  onSendMessage,
  onOpenCase,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E2DC] rounded-2xl flex flex-col h-[650px] shadow-sm overflow-hidden animate-enter">
      {/* Top Banner */}
      <div className="p-4 border-b border-[#E5E2DC] flex items-center justify-between bg-[#FAF9F7]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FDF4F2] border border-[#F8CFC9] flex items-center justify-center text-[#C83625]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#181716] tracking-tight">FinePrint Interactive Advocate</h2>
            <p className="text-[11px] text-[#736E65]">Direct statutory intake under CPA 2019 & E-Commerce Rules 2020</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-medium">
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
                    ? "bg-[#C83625] text-white rounded-br-sm shadow-[#C83625]/15"
                    : "bg-[#FAF9F7] border border-[#E5E2DC] text-[#181716] rounded-bl-sm"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#C83625] mb-1.5 uppercase tracking-wider">
                    <Scale className="w-3 h-3" />
                    <span>FinePrint Statutory Agent</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.caseId && (
                  <button
                    onClick={() => onOpenCase(msg.caseId!)}
                    className="btn-press mt-3 py-2 px-3.5 rounded-xl bg-[#C83625] hover:bg-[#B32E1F] text-white font-semibold text-[11px] flex items-center gap-2 shadow-sm transition-all"
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
            <div className="bg-[#FAF9F7] border border-[#E5E2DC] rounded-2xl rounded-bl-sm p-4 text-xs text-[#736E65] flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C83625]" />
              <span>Evaluating statutory liabilities via rules-mcp...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#E5E2DC] bg-[#FAF9F7]/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-[#736E65] font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#C83625]" />
          <span>Quick Prompts:</span>
        </span>
        {QUICK_SUGGESTIONS.map((suggestion, sIdx) => (
          <button
            key={sIdx}
            onClick={() => onInputChange(suggestion)}
            className="btn-press px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#FDF4F2] text-[#262422] hover:text-[#C83625] border border-[#E5E2DC] hover:border-[#F8CFC9] whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#E5E2DC] bg-[#FAF9F7] flex items-center gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder="Describe your purchase issue or defect to evaluate statutory rights..."
          className="flex-1 bg-[#FFFFFF] border border-[#D4D0C7] rounded-xl px-4 py-2.5 text-xs text-[#181716] placeholder-[#A39E93] focus:outline-none focus:border-[#C83625] focus:ring-1 focus:ring-[#C83625] transition-colors"
        />
        <button
          disabled={loading || !chatInput.trim()}
          onClick={onSendMessage}
          className="btn-press p-2.5 rounded-xl bg-[#C83625] hover:bg-[#B32E1F] text-white disabled:opacity-40 transition-all shadow-md shadow-[#C83625]/20"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
