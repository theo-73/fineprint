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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-sm overflow-hidden animate-enter">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-850">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">FinePrint Interactive Advocate</h2>
            <p className="text-[11px] text-slate-400">Direct statutory intake under CPA 2019 & E-Commerce Rules 2020</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
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
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-850 border border-slate-700/80 text-slate-200 rounded-bl-sm"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-blue-400 mb-1.5 uppercase tracking-wider">
                    <Scale className="w-3 h-3" />
                    <span>FinePrint Statutory Agent</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.caseId && (
                  <button
                    onClick={() => onOpenCase(msg.caseId!)}
                    className="btn-press mt-3 py-2 px-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-[11px] flex items-center gap-2 shadow-sm transition-all"
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
            <div className="bg-slate-850 border border-slate-700/80 rounded-2xl rounded-bl-sm p-4 text-xs text-slate-400 flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Evaluating statutory liabilities via rules-mcp...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Prompts:</span>
        </span>
        {QUICK_SUGGESTIONS.map((suggestion, sIdx) => (
          <button
            key={sIdx}
            onClick={() => onInputChange(suggestion)}
            className="btn-press px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center gap-2">
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
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <button
          disabled={loading || !chatInput.trim()}
          onClick={onSendMessage}
          className="btn-press p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow-md shadow-blue-600/20"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
