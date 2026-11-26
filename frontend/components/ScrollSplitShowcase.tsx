'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Sparkles, Scale, AlertCircle, CheckCircle2, Sliders, Eye, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface DefectHotspot {
  id: string;
  num: string;
  title: string;
  component: string;
  statute: string;
  finding: string;
  x: string; // percentage
  y: string; // percentage
}

const DEFECT_HOTSPOTS: DefectHotspot[] = [
  {
    id: 'spot-1',
    num: '01',
    title: 'Acoustic Voice Coil Burnout',
    component: '40mm Neodymium Driver Diaphragm',
    statute: 'CPA 2019 Section 84(1)(a)',
    finding: 'Physical open-circuit failure detected on Day 35. Unprovoked by electrical surge or liquid ingress. Governed as an inherent manufacturing defect with strict manufacturer liability.',
    x: '38%',
    y: '42%',
  },
  {
    id: 'spot-2',
    num: '02',
    title: 'Deceptive 7-Day Policy Nullified',
    component: 'Marketplace Adhesion Contract',
    statute: 'E-Commerce Rules 2020 Rule 6(3)',
    finding: 'Customer service automated bot rejected return on Day 8 citing "7-day policy". Rule 6(3) statutorily overrides contractual windows for latent manufacturing defects.',
    x: '62%',
    y: '32%',
  },
  {
    id: 'spot-3',
    num: '03',
    title: 'Forensic PDF Glyph Sanitization',
    component: 'Appario Retail Tax Invoice (GSTIN Clean)',
    statute: 'FastMCP stdio receipt-mcp',
    finding: 'Sanitized corrupted "n" currency glyphs into verified ₹24,990 consideration. Extracted serial number and model designation without LLM extraction hallucination.',
    x: '28%',
    y: '68%',
  },
  {
    id: 'spot-4',
    num: '04',
    title: 'Court-Admissible Evidence Dossier',
    component: 'SHA-256 Cryptographic Hash',
    statute: 'Bharatiya Sakshya Adhiniyam 2023 § 63',
    finding: 'Compiled tamper-evident PDF notice packet with electronic audit trail, ready for direct 1-click filing into National Consumer Helpline (NCH 1915).',
    x: '74%',
    y: '65%',
  },
];

export const ScrollSplitShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSpot, setActiveSpot] = useState<DefectHotspot>(DEFECT_HOTSPOTS[0]);

  // Track scroll progress within this container section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth out scroll tracking with spring physics for weighted Awwwards feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 1. Kinetic Typographic Tickers (Translate in opposite directions on scroll)
  const xTickerLeft = useTransform(smoothProgress, [0, 1], ['5%', '-25%']);
  const xTickerRight = useTransform(smoothProgress, [0, 1], ['-25%', '5%']);

  // 2. Dual Split-Curtain Opening Animation
  // Left curtain slides left (-100% to 0%), right curtain slides right (100% to 0%)
  const curtainLeftX = useTransform(smoothProgress, [0.15, 0.55], ['0%', '-102%']);
  const curtainRightX = useTransform(smoothProgress, [0.15, 0.55], ['0%', '102%']);
  const imageScale = useTransform(smoothProgress, [0.15, 0.6], [1.18, 1.0]);
  const dividerOpacity = useTransform(smoothProgress, [0.15, 0.45, 0.55], [1, 1, 0]);

  // 3. Hotspots Fade-In after split opening
  const hotspotsOpacity = useTransform(smoothProgress, [0.45, 0.65], [0, 1]);

  return (
    <section
      id="forensic"
      ref={containerRef}
      className="relative w-full py-20 bg-[#0C0C0E] overflow-hidden select-none"
    >
      {/* ========================================================
          BACKGROUND KINETIC PARALLAX TYPOGRAPHY TICKERS
      ======================================================== */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden flex flex-col justify-around">
        <motion.div
          style={{ x: xTickerLeft }}
          className="whitespace-nowrap font-display font-black text-7xl md:text-9xl text-white tracking-tighter uppercase"
        >
          CPA 2019 SECTION 84 · STRICT PRODUCT LIABILITY · LATENT DEFECT CLAIMS · 48-HOUR SLA MANDATE · ZERO CITATION HALLUCINATION ·
        </motion.div>
        <motion.div
          style={{ x: xTickerRight }}
          className="whitespace-nowrap font-display font-black text-7xl md:text-9xl text-[#FF2A1A] tracking-tighter uppercase"
        >
          E-COMMERCE RULES RULE 6(3) · 7-DAY RETURN BARRIER VOID · NCH 1915 LITIGATION · RESTITUTION COMPILATION ·
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* SECTION HEADER (Swiss Editorial Minimalism) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#27272A]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161B] border border-[#27272A] text-xs font-mono font-bold text-[#FF2A1A] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF2A1A] animate-pulse" />
              <span>{"// 02 FORENSIC DECOMPOSITION"}</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase">
              Scroll To Dismantle The Defect
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              As you scroll down, FinePrint&apos;s dual statutory aperture splits open to reveal the forensic hardware telemetry of an unprovoked driver burnout — proving strict statutory liability under CPA 2019.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#71717A] shrink-0">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#FF2A1A]" />
              <span>Interactive CAD Hotspots</span>
            </span>
            <span className="border-l border-[#27272A] pl-4">
              [APERTURE RATIO: 16:9]
            </span>
          </div>
        </div>

        {/* ========================================================
            SCROLL-LINKED SPLIT-OPENING IMAGE STAGE
        ======================================================== */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border border-[#27272A] shadow-2xl bg-[#09090B]">
          
          {/* THE REVEALED FORENSIC IMAGE CANVAS */}
          <motion.div
            style={{ scale: imageScale }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/fineprint_transducer.jpg"
              alt="Forensic Exploded Transducer Hardware Dissection"
              fill
              priority
              className="object-cover object-center"
            />

            {/* 1px Architectural Drafting Grid Overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* CAD Crosshairs & Dimensional Markings */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-white/80 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 uppercase tracking-wider">
              [CAD: 40MM TITANIUM DIAPHRAGM · TOLERANCE: ±0.02MM]
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] text-[#FF2A1A] bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-[#FF2A1A]/30 uppercase tracking-wider font-bold">
              [CPA 2019 § 84 FORENSIC AUDIT]
            </div>
          </motion.div>

          {/* DUAL SPLIT CURTAIN PANELS (Slide Apart on Scroll) */}
          <motion.div
            style={{ x: curtainLeftX }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#121216] border-r border-[#FF2A1A] z-20 flex flex-col justify-between p-6 sm:p-8"
          >
            <div className="font-mono text-xs text-[#71717A] uppercase tracking-widest">
              [STATUTORY SHIELD · WEST SECTOR]
            </div>
            <div>
              <span className="font-mono text-[11px] text-[#FF6E63] uppercase block mb-1">
                Forensic Ingestion
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                Physical Defect
              </h3>
            </div>
            <div className="font-mono text-[10px] text-[#A1A1AA]">
              Scroll to split aperture →
            </div>
          </motion.div>

          <motion.div
            style={{ x: curtainRightX }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#121216] border-l border-[#FF2A1A] z-20 flex flex-col justify-between p-6 sm:p-8 text-right"
          >
            <div className="font-mono text-xs text-[#71717A] uppercase tracking-widest">
              [STATUTORY SHIELD · EAST SECTOR]
            </div>
            <div>
              <span className="font-mono text-[11px] text-[#FF6E63] uppercase block mb-1">
                Codified Protection
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                Strict Liability
              </h3>
            </div>
            <div className="font-mono text-[10px] text-[#A1A1AA]">
              ← Scroll to split aperture
            </div>
          </motion.div>

          {/* Central Laser Divider Line (Fades out as split opens) */}
          <motion.div
            style={{ opacity: dividerOpacity }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#FF2A1A] z-30 pointer-events-none shadow-[0_0_12px_#FF2A1A]"
          />

          {/* INTERACTIVE DEFECT HOTSPOT PINS (Fade in when split is open) */}
          <motion.div
            style={{ opacity: hotspotsOpacity }}
            className="absolute inset-0 z-20 pointer-events-auto"
          >
            {DEFECT_HOTSPOTS.map((spot) => {
              const isSelected = activeSpot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveSpot(spot)}
                  style={{ top: spot.y, left: spot.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-125"
                  aria-label={`Inspect hotspot ${spot.num}: ${spot.title}`}
                >
                  <div className="relative flex items-center justify-center">
                    {isSelected && (
                      <span className="absolute w-10 h-10 rounded-full border border-[#FF2A1A] animate-ping opacity-80" />
                    )}
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shadow-2xl transition-all",
                        isSelected
                          ? "bg-[#FF2A1A] text-white ring-4 ring-[#FF2A1A]/40 scale-110"
                          : "bg-[#121216]/90 backdrop-blur-md text-white border border-[#27272A] hover:border-[#FF2A1A]"
                      )}
                    >
                      {spot.num}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================================
            ACTIVE HOTSPOT CAD TELEMETRY CARD (Editorial Precision)
        ======================================================== */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#18181D] border border-[#27272A] flex items-center justify-center font-mono text-sm font-bold text-[#FF2A1A] shrink-0">
              {activeSpot.num}
            </div>
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181D] text-[#FF6E63] border border-[#FF2A1A]/30 uppercase font-bold">
                  {activeSpot.statute}
                </span>
                <span className="text-xs font-mono text-[#71717A] hidden sm:inline">
                  {activeSpot.component}
                </span>
              </div>
              <h4 className="font-display font-bold text-base sm:text-lg text-white">
                {activeSpot.title}
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {activeSpot.finding}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-[#27272A] pt-3 md:pt-0">
            {DEFECT_HOTSPOTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSpot(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all",
                  activeSpot.id === s.id
                    ? "bg-[#FF2A1A] text-white shadow-sm"
                    : "bg-[#18181D] text-[#A1A1AA] hover:text-white border border-[#27272A]"
                )}
              >
                {s.num}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
