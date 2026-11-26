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
    badgeColor: 'bg-[#FDF4F2] text-[#C83625] border-[#F8CFC9]',
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
    badgeColor: 'bg-[#FDF4F2] text-[#C83625] border-[#F8CFC9]',
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
    badgeColor: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
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
    badgeColor: 'bg-[#FDF4F2] text-[#C83625] border-[#F8CFC9]',
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
    badgeColor: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
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
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F7] border border-[#E5E2DC] text-[11px] font-mono font-bold text-[#C83625] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Wall of Statutory Restitution</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181716] tracking-tight">
          Real Citizens. Over ₹1.84 Crores Recovered.
        </h2>
        <p className="text-xs sm:text-sm text-[#736E65]">
          Verified cases where FinePrint&apos;s codified notices dismantled corporate deflections and forced compliance.
        </p>
      </div>

      {/* Grid of Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto select-none">
        {FIELD_NOTES.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E2DC] shadow-sm hover:shadow-md hover:border-[#C83625]/40 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DC]">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-bold border", item.badgeColor)}>
                  {item.badge}
                </span>
                <span className="font-mono font-bold text-xs text-[#16A34A]">
                  {item.restitution}
                </span>
              </div>

              <div>
                <strong className="text-sm font-bold text-[#181716] block">{item.product}</strong>
                <span className="text-[11px] text-[#736E65]">{item.seller}</span>
              </div>

              <p className="text-xs text-[#524E47] leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E2DC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#C83625] text-white flex items-center justify-center font-bold text-xs font-mono">
                  {item.initials}
                </div>
                <div>
                  <strong className="text-[#181716] block text-xs">{item.author}</strong>
                  <span className="text-[10px] text-[#736E65]">{item.role}</span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-[#C83625] bg-[#FDF4F2] px-2 py-0.5 rounded border border-[#F8CFC9]">
                {item.statute.split('·')[0].trim()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
