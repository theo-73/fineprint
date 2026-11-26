'use client';

import React, { useState } from 'react';
import { Shield, Lock, FileText, CheckCircle2, Scale, ArrowRight, Zap } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  sublabel: string;
  cx: number;
  cy: number;
  r: number;
  status: 'active' | 'verified' | 'isolated';
}

const NODES: NetworkNode[] = [
  { id: 'node-invoice', label: 'PDF Invoice', sublabel: 'receipt-mcp stdio', cx: 80, cy: 110, r: 18, status: 'isolated' },
  { id: 'node-facts', label: 'Fact Schema', sublabel: 'Order · Seller · GSTIN', cx: 210, cy: 70, r: 16, status: 'verified' },
  { id: 'node-ast', label: 'rules-mcp AST', sublabel: 'Statutory Classifier', cx: 370, cy: 50, r: 22, status: 'active' },
  { id: 'node-cpa', label: 'CPA 2019 Sec 84', sublabel: 'Product Liability', cx: 520, cy: 80, r: 20, status: 'verified' },
  { id: 'node-ecom', label: 'E-Com Rule 6(3)', sublabel: 'Non-Refusal Mandate', cx: 660, cy: 60, r: 17, status: 'verified' },
  { id: 'node-sla', label: 'Rule 4(5) SLA', sublabel: '48h Ack / 30d Redress', cx: 780, cy: 115, r: 19, status: 'active' },
  { id: 'node-notice', label: 'Statutory Notice', sublabel: 'Generated PDF / WA', cx: 620, cy: 180, r: 24, status: 'verified' },
  { id: 'node-nch', label: 'NCH 1915 Portal', sublabel: 'Pre-Litigation Escalation', cx: 440, cy: 190, r: 20, status: 'active' },
];

export const LandingHeroNetwork: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  return (
    <div className="relative w-full rounded-3xl bg-[#121216] border border-[#27272A] shadow-2xl shadow-black/80 overflow-hidden select-none p-4 sm:p-6 group">
      {/* Background Architectural Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Header Pill */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#27272A] mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2A1A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2A1A]" />
          </span>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Statutory Defense Constellation
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#A1A1AA] bg-[#18181D] px-2 py-0.5 rounded-full border border-[#27272A]">
          Interactive Pipeline Mesh · 8 Validated Nodes
        </div>
      </div>

      {/* SVG Interactive Constellation in Neon Red & White */}
      <div className="relative w-full aspect-[16/7] min-h-[260px] sm:min-h-[300px]">
        <svg 
          viewBox="0 0 860 250" 
          className="w-full h-full overflow-visible"
          aria-label="Statutory Pipeline Constellation Diagram"
        >
          {/* Ambient Neon Core Glow */}
          <radialGradient id="vermilion-glow" cx="44%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FF2A1A" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#FF2A1A" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FF2A1A" stopOpacity="0" />
          </radialGradient>
          <rect x="0" y="0" width="860" height="250" fill="url(#vermilion-glow)" />

          {/* Hairline Mesh Connecting Lines */}
          <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3">
            <line x1="80" y1="110" x2="210" y2="70" />
            <line x1="210" y1="70" x2="370" y2="50" />
            <line x1="370" y1="50" x2="520" y2="80" />
            <line x1="520" y1="80" x2="660" y2="60" />
            <line x1="660" y1="60" x2="780" y2="115" />
            <line x1="520" y1="80" x2="620" y2="180" />
            <line x1="620" y1="180" x2="780" y2="115" />
            <line x1="370" y1="50" x2="440" y2="190" />
            <line x1="440" y1="190" x2="620" y2="180" />
            <line x1="210" y1="70" x2="440" y2="190" />
          </g>

          {/* Animated Flowing Neon Red Pulses */}
          <g stroke="#FF2A1A" strokeWidth="2.4" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255, 42, 26, 0.7))">
            <line 
              x1="80" y1="110" x2="210" y2="70" 
              strokeDasharray="16 120"
              className="animate-pulse"
              style={{ animationDuration: '2.5s' }}
            />
            <line 
              x1="210" y1="70" x2="370" y2="50" 
              strokeDasharray="20 150"
              className="animate-pulse"
              style={{ animationDuration: '3s', animationDelay: '0.4s' }}
            />
            <line 
              x1="370" y1="50" x2="520" y2="80" 
              strokeDasharray="22 140"
              className="animate-pulse"
              style={{ animationDuration: '2.8s', animationDelay: '0.8s' }}
            />
            <line 
              x1="520" y1="80" x2="620" y2="180" 
              strokeDasharray="25 130"
              className="animate-pulse"
              style={{ animationDuration: '2.4s', animationDelay: '1.2s' }}
            />
          </g>

          {/* Nodes */}
          {NODES.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isMain = node.id === 'node-ast' || node.id === 'node-notice';

            return (
              <g 
                key={node.id} 
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Ring Pulse */}
                {isMain && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r + 7}
                    fill="none"
                    stroke="#FF2A1A"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ animationDuration: '14s', transformOrigin: `${node.cx}px ${node.cy}px` }}
                  />
                )}

                {/* Base Node Circle */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isHovered ? node.r + 3 : node.r}
                  fill={isHovered ? '#FF2A1A' : '#18181D'}
                  stroke={isHovered ? '#FFFFFF' : isMain ? '#FF2A1A' : '#3F3F46'}
                  strokeWidth={isMain ? '2.5' : '1.8'}
                  filter="drop-shadow(0 0 10px rgba(255, 42, 26, 0.4))"
                  className="transition-all duration-200"
                />

                {/* Inner Dot */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isMain ? 4 : 3}
                  fill={isHovered ? '#FFFFFF' : isMain ? '#FF2A1A' : '#10B981'}
                />

                {/* Node Label Text */}
                <text
                  x={node.cx}
                  y={node.cy + node.r + 14}
                  textAnchor="middle"
                  className="font-sans font-bold text-[11px] fill-white select-none pointer-events-none"
                >
                  {node.label}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + node.r + 25}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-[#A1A1AA] select-none pointer-events-none"
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Inspection Floating HUD Card */}
        {hoveredNode && (
          <div 
            className="absolute top-2 right-2 p-3 rounded-2xl bg-[#18181D]/95 backdrop-blur-md border border-[#FF2A1A]/50 shadow-2xl max-w-xs animate-enter z-20 text-xs"
            role="status"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF2A1A] animate-ping" />
              <span className="font-bold text-white font-sans">{hoveredNode.label}</span>
              <span className="text-[10px] font-mono uppercase bg-[#FF2A1A]/20 text-[#FF6E63] px-1.5 py-0.2 rounded font-bold border border-[#FF2A1A]/30">
                {hoveredNode.status}
              </span>
            </div>
            <p className="text-[11px] text-[#D4D4D8] leading-relaxed">
              Subsystem: <b className="font-mono text-white">{hoveredNode.sublabel}</b>. Deterministic JSON-RPC execution isolated within sandbox trust boundary.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Architectural Legend Bar */}
      <div className="pt-3 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A1A1AA] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Verified Fact Stream</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF2A1A]" />
            <span>Statutory Codified Anchor</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span>Rule 4(5) SLA Clock</span>
          </span>
        </div>
        <div className="text-[#FF6E63] font-bold">
          Zero Citations Hallucinated (PyTest 100%)
        </div>
      </div>
    </div>
  );
};
