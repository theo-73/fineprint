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
              "pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all duration-300 animate-enter",
              toast.type === 'success' && "bg-[#FFFFFF]/95 border-[#BBF7D0] text-[#166534] shadow-[#16A34A]/10",
              toast.type === 'error' && "bg-[#FFFFFF]/95 border-[#FECDD3] text-[#9F1239] shadow-[#E11D48]/10",
              toast.type === 'info' && "bg-[#FFFFFF]/95 border-[#E5E2DC] text-[#181716] shadow-black/5"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#E11D48]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#C83625]" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-[#181716]">{toast.title}</div>
              {toast.description && (
                <div className="text-[11px] text-[#736E65] mt-0.5 leading-relaxed">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A39E93] hover:text-[#181716] p-1 rounded-lg hover:bg-[#FAF9F7] transition-colors"
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
