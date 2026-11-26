'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'success' });
  }, [showToast]);

  const error = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'error' });
  }, [showToast]);

  const info = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'info' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Floating Viewport */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl transition-all duration-300 animate-enter",
              toast.type === 'success' && "bg-[#121216]/95 border-[#10B981]/30 text-[#10B981] shadow-[#10B981]/10",
              toast.type === 'error' && "bg-[#181012]/95 border-[#FF2A1A]/30 text-[#FF6E63] shadow-[#FF2A1A]/10",
              toast.type === 'info' && "bg-[#121216]/95 border-[#27272A] text-[#F4F4F6] shadow-black/40"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#FF2A1A]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#FF2A1A]" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-[#F4F4F6]">{toast.title}</div>
              {toast.description && (
                <div className="text-[11px] text-[#A1A1AA] mt-0.5 leading-relaxed">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#71717A] hover:text-white p-1 rounded-lg hover:bg-[#18181D] transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
