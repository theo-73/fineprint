'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Quote } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FieldNote {
  id: string;
  badge: string;
  badgeColor: string;
  restitution: string;
  product: string;
  seller: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
  statute: string;
}

export const FIELD_NOTES: FieldNote[] = [
  {
    id: 'sony-xm5',
    badge: 'ANC Driver Failure',
    badgeColor: 'bg-[#FF2A1A]/20 text-[#FFA49E] border-[#FF2A1A]/35',
    restitution: '₹24,990 Restitution',
    product: 'Sony WH-1000XM5 ANC',
    seller: 'Appario Retail Pvt Ltd · Amazon',
    quote: 'Appario closed my return on Day 8 saying 7 days were up. FinePrint cited Rule 6(3) and CPA § 84 in a statutory notice. Appario’s senior grievance desk refunded the full ₹24,990 in 48 hours.',
    author: 'Vikram S.',
    role: 'Software Architect · Bengaluru',
    initials: 'VS',
    statute: 'CPA 2019 § 84 · Rule 6(3)'
  },
  {
    id: 'apple-green-line',
    badge: 'Green Line OLED Defect',
    badgeColor: 'bg-[#FF2A1A]/20 text-[#FFA49E] border-[#FF2A1A]/35',
    restitution: '₹82,900 Free Display Swap',
    product: 'iPhone 15 Pro Display',
    seller: 'Apple India Authorized Retail',
    quote: 'Service center quoted ₹32,000 for display replacement claiming physical moisture. FinePrint compiled the NCDRC latent defect ratio. Apple authorized a 100% free screen replacement.',
    author: 'Neha R.',
    role: 'Product Designer · Mumbai',
    initials: 'NR',
    statute: 'NCDRC Latent Defect Ratio'
  },
  {
    id: 'samsung-washer',
    badge: 'No Spare Parts Deflection',
    badgeColor: 'bg-[#10B981]/20 text-[#6EE7B7] border-[#10B981]/35',
    restitution: '₹34,500 Full Replacement',
    product: 'Samsung 7kg Front-Load',
    seller: 'SuperComNet Retail · Flipkart',
    quote: 'The motor failed on Month 4 and the technician stalled for 6 weeks citing "parts out of stock". FinePrint sent a 48h SLA notice. Flipkart replaced the whole machine.',
    author: 'Col. K. Verma',
    role: 'Retired Veteran · Pune',
    initials: 'KV',
    statute: 'CPA 2019 § 86 (Service Defect)'
  },
  {
    id: 'oneplus-motherboard',
    badge: 'Bootloop Hardware Defect',
    badgeColor: 'bg-[#FF2A1A]/20 text-[#FFA49E] border-[#FF2A1A]/35',
    restitution: '₹56,990 Refund Received',
    product: 'OnePlus 11 5G 256GB',
    seller: 'Darshita Electronics · Amazon',
    quote: 'Phone went into bootloop after OTA update. Customer care claimed software damage out of warranty. FinePrint proved hardware controller fault under § 84. Full refund received.',
    author: 'Arjun K.',
    role: 'Advocate · New Delhi',
    initials: 'AK',
    statute: 'CPA 2019 § 84 (Design Defect)'
  },
  {
    id: 'whirlpool-refrigerator',
    badge: 'Cooling Coil Gas Leak',
    badgeColor: 'bg-[#10B981]/20 text-[#6EE7B7] border-[#10B981]/35',
    restitution: '₹28,490 Doorstep Refund',
    product: 'Whirlpool Pro-Cool 265L',
    seller: 'Infiniti Retail (Croma)',
    quote: 'Compressor cooled fine but freezer leaked gas. Brand technician blamed improper ventilation. FinePrint generated Section 65B evidence dossier. Croma picked up the fridge and refunded.',
    author: 'Priya & Rahul',
    role: 'Civil Servants · Hyderabad',
    initials: 'PR',
    statute: 'E-Commerce Rules Rule 4(5)'
  }
];

export const FieldNotesMarquee: React.FC = () => {
  return (
    <div id="restitution" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2A1A]/15 border border-[#FF2A1A]/30 text-[11px] font-mono font-bold text-[#FF6E63] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Wall of Statutory Restitution</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Real Citizens. Over ₹1.84 Crores Recovered.
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Verified cases where FinePrint&apos;s codified notices dismantled corporate deflections and forced compliance.
        </p>
      </div>

      {/* Grid of Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto select-none">
        {FIELD_NOTES.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] shadow-xl shadow-black/40 hover:shadow-2xl hover:border-[#FF2A1A]/60 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border", item.badgeColor)}>
                  {item.badge}
                </span>
                <span className="font-mono font-bold text-xs text-[#10B981]">
                  {item.restitution}
                </span>
              </div>

              <div>
                <strong className="text-sm font-bold text-white block">{item.product}</strong>
                <span className="text-[11px] text-[#A1A1AA]">{item.seller}</span>
              </div>

              <p className="text-xs text-[#D4D4D8] leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FF2A1A] text-white flex items-center justify-center font-bold text-xs font-mono shadow-md shadow-[#FF2A1A]/40">
                  {item.initials}
                </div>
                <div>
                  <strong className="text-white block text-xs">{item.author}</strong>
                  <span className="text-[10px] text-[#A1A1AA]">{item.role}</span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-[#FF6E63] bg-[#FF2A1A]/20 px-2 py-0.5 rounded border border-[#FF2A1A]/30">
                {item.statute.split('·')[0].trim()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
