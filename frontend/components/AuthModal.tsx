'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, User, Lock, Mail, Building } from 'lucide-react';
import { cn } from '../lib/utils';
import { BrandMark } from './BrandMark';

export interface AuthUser {
  name: string;
  role: string;
  email: string;
  department: string;
  badge: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

const DEMO_PERSONAS: AuthUser[] = [
  {
    name: 'Adv. Vikram Sharma',
    role: 'Senior Consumer Advocate',
    email: 'vikram.sharma@fineprint.law',
    department: 'CPA 2019 Litigation Bench',
    badge: 'National Bar Council · Bar ID: DL/2849/2016'
  },
  {
    name: 'Neha Roy',
    role: 'Statutory Grievance Officer',
    email: 'neha.roy@grievance.gov.in',
    department: 'E-Commerce Appellate Escalation Desk',
    badge: 'Rule 4(5) Authorized Redressal Officer'
  },
  {
    name: 'Arjun Mehta',
    role: 'Aggrieved Consumer Claimant',
    email: 'arjun.mehta@gmail.com',
    department: 'Hardware Defect Claimant',
    badge: 'Docket Claimant · Appario Dispute'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);

  if (!isOpen) return null;

  const handleDemoSignIn = (persona: AuthUser) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessUser(persona);
      setTimeout(() => {
        onSuccess(persona);
        onClose();
        setSuccessUser(null);
      }, 1200);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: AuthUser = {
        name: name || email.split('@')[0] || 'Advocate User',
        role: 'Verified Legal Counsel',
        email: email || 'counsel@fineprint.law',
        department: 'Consumer Commission Chamber',
        badge: 'CPA 2019 Authorized Practitioner'
      };
      setSuccessUser(user);
      setTimeout(() => {
        onSuccess(user);
        onClose();
        setSuccessUser(null);
      }, 1200);
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#09090B]/80 backdrop-blur-md animate-enter select-none"
      role="dialog" 
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-[#121216] border border-[#27272A] rounded-3xl shadow-2xl shadow-[#FF2A1A]/10 text-[#F4F4F6] overflow-hidden">
        
        {/* Ambient Neon Red Glow in Corners */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF2A1A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#FF3B30]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-xl text-[#A1A1AA] hover:text-[#FFFFFF] bg-[#18181D] hover:bg-[#27272A] border border-[#27272A] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* SUCCESS CELEBRATION (Yātrā Style) */}
        {successUser ? (
          <div className="p-8 text-center space-y-5 animate-enter">
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto my-2">
              <span className="absolute inset-0 rounded-full bg-[#FF2A1A]/20 animate-ping" />
              <div className="relative w-14 h-14 rounded-2xl bg-[#FF2A1A] flex items-center justify-center text-white text-2xl shadow-xl shadow-[#FF2A1A]/40 border border-white/20">
                ✓
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2A1A]/15 border border-[#FF2A1A]/30 text-[#FF6E63] text-xs font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A1A] animate-pulse" />
                <span>STATUTORY SESSION INITIALIZED</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Welcome back, {successUser.name}!
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                {successUser.role} · Launching Dispute Cockpit...
              </p>
            </div>

            {/* Checklist */}
            <div className="p-3.5 bg-[#18181D] rounded-2xl border border-[#27272A] text-left space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#10B981]">
                <span>✓</span>
                <span>FastMCP stdio subprocess synchronized</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <span>✓</span>
                <span>CPA 2019 § 84 &amp; Rule 6(3) rules engine active</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <span>✓</span>
                <span>Cryptographic SHA-256 session token issued</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="h-1.5 w-full bg-[#27272A] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF2A1A] via-[#FF6E63] to-[#FFFFFF] rounded-full animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="text-center space-y-2 pt-1">
              <div className="flex justify-center mb-1">
                <BrandMark size={48} />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {authMode === 'login' ? 'Access Statutory Cockpit' : 'Register Legal Counsel'}
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Enter directly with 1-click demo persona or provide counsel credentials.
              </p>
            </div>

            {/* 1-Click Demo Persona Selectors (APIx / Yātrā Inspired) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6E63] font-bold block">
                Quick 1-Click Demo Personas:
              </span>
              
              <div className="space-y-2">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.email}
                    type="button"
                    onClick={() => handleDemoSignIn(persona)}
                    disabled={loading}
                    className="w-full p-3 rounded-2xl bg-[#18181D] hover:bg-[#202027] border border-[#27272A] hover:border-[#FF2A1A] transition-all text-left flex items-center justify-between group shadow-sm"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-white group-hover:text-[#FF6E63] transition-colors truncate">
                          {persona.name}
                        </strong>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FF2A1A]/20 text-[#FF6E63] border border-[#FF2A1A]/30">
                          {persona.role.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A1A1AA] block truncate">
                        {persona.department}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#FF2A1A] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#27272A]" />
              <span className="absolute bg-[#121216] px-3 font-mono text-[10px] text-[#71717A] uppercase">
                OR EMAIL LOGIN
              </span>
            </div>

            {/* Custom Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adv. Rohit Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181D] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counsel@fineprint.law"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181D] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181D] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-press w-full py-3 rounded-xl bg-[#FF2A1A] hover:bg-[#E01E10] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#FF2A1A]/30 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? "Authenticating..." : authMode === 'login' ? "Sign In & Launch Cockpit" : "Create Account & Launch"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-1 border-t border-[#27272A] text-xs text-[#A1A1AA]">
              {authMode === 'login' ? (
                <span>
                  New legal counsel?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-[#FF6E63] font-bold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#FF6E63] font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
