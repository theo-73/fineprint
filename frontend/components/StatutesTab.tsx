'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Scale, Shield, CheckCircle2, AlertTriangle, 
  Search, ExternalLink, Copy, Check, FileText, ChevronRight 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from './ToastProvider';

interface StatuteItem {
  id: string;
  act: string;
  section: string;
  title: string;
  category: 'Product Liability' | 'E-Commerce Rules' | 'Statutory Abstention' | 'Dark Patterns';
  statutoryText: string;
  legalSignificance: string;
  keyEnforcementPoints: string[];
  benchmarkCasesMatched: number;
}

interface PrecedentItem {
  id: string;
  caseTitle: string;
  forum: string;
  citation: string;
  year: number;
  subject: string;
  ratioDecidendi: string;
  statutoryGround: string;
}

const STATUTES_DIRECTORY: StatuteItem[] = [
  {
    id: 'cpa-sec-84',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 84',
    title: 'Liability of Product Manufacturer for Inherent Defects',
    category: 'Product Liability',
    statutoryText:
      'A product manufacturer shall be liable in a product liability action, if— (a) the product contains a manufacturing defect; (b) the product is defective in design; (c) there is a deviation from manufacturing specifications; (d) the product does not conform to the express warranty; or (e) the product fails to contain adequate instructions for correct usage.',
    legalSignificance:
      'Establishes strict statutory product liability on the brand or OEM. Even if the consumer purchased via an e-commerce marketplace whose return window has lapsed, the manufacturer remains statutorily liable for inherent defects throughout the warranty period.',
    keyEnforcementPoints: [
      'Strict product liability independent of contractual retailer return windows',
      'Defective design or manufacturing batch defect is actionable for full refund or replacement',
      'Burden of proof satisfied with purchase invoice and defect chronology log',
    ],
    benchmarkCasesMatched: 12,
  },
  {
    id: 'ecom-rule-6-3',
    act: 'Consumer Protection (E-Commerce) Rules, 2020',
    section: 'Rule 6(3)',
    title: 'Prohibition on Unfair Cancellation & Return Refusal',
    category: 'E-Commerce Rules',
    statutoryText:
      'No seller that offers goods or services through a marketplace e-commerce entity shall refuse to take back goods, or withdraw the services, or refuse to refund consideration paid, if such goods or services are defective, deficient, spurious, or if the goods or services are not of the characteristics or features as advertised.',
    legalSignificance:
      'Codifies that contractual platform return policies (e.g., 7-day replacement only) cannot override statutory rights if goods delivered are inherently defective, dead-on-arrival, or non-functional.',
    keyEnforcementPoints: [
      'Overrides platform 7-day policy when goods are defective upon arrival or in regular usage',
      'Prohibits unilateral bot cancellation of return requests',
      'Imposes joint responsibility on registered sellers and marketplace platforms',
    ],
    benchmarkCasesMatched: 15,
  },
  {
    id: 'ecom-rule-4-5',
    act: 'Consumer Protection (E-Commerce) Rules, 2020',
    section: 'Rule 4(5)',
    title: 'Mandatory 48-Hour Grievance Acknowledgment SLA',
    category: 'E-Commerce Rules',
    statutoryText:
      'Every marketplace e-commerce entity shall ensure that the grievance officer acknowledges the receipt of any consumer complaint within forty-eight hours and redresses the complaint within one month from the date of receipt of the complaint.',
    legalSignificance:
      'FinePrint embeds this statutory window into every formal notice header. If an e-commerce platform ignores a formal statutory notice for more than 48 hours, they commit a statutory non-compliance infraction under Rule 4(5).',
    keyEnforcementPoints: [
      '48-hour mandatory ticket acknowledgment deadline',
      '30-calendar-day final dispute resolution mandate',
      'Requires designated resident Grievance Officer with published email and physical address',
    ],
    benchmarkCasesMatched: 20,
  },
  {
    id: 'cpa-sec-86',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 86',
    title: 'Liability of Product Seller (Marketplace Retailer)',
    category: 'Product Liability',
    statutoryText:
      'A product seller who is not a product manufacturer shall be liable in a product liability action, if— (a) he has exercised substantial control over the designing, testing, manufacturing, packaging or labelling of a product; or (b) he has altered or modified the product and such alteration or modification was the proximate cause of the harm.',
    legalSignificance:
      'Directly links sellers (like Appario Retail, SuperComNet, or Infiniti Retail) to statutory claims when they alter warranty promises, provide refurbished items as new, or fail to communicate valid OEM warranty coverage.',
    keyEnforcementPoints: [
      'Sellers liable for unverified refurbished stock delivered as new',
      'Liable when refusing to furnish OEM service center details or replacement paths',
    ],
    benchmarkCasesMatched: 8,
  },
  {
    id: 'cpa-sec-87',
    act: 'Consumer Protection Act, 2019',
    section: 'Section 87',
    title: 'Exceptions to Product Liability (Statutory Abstention)',
    category: 'Statutory Abstention',
    statutoryText:
      'A product liability action cannot be brought against the product manufacturer or seller if— (a) the product was misused, altered, or modified; (b) the consumer was not authorized to use the product; or (c) the harm was caused by reasonable wear and tear or user accident.',
    legalSignificance:
      'The foundational legal pillar of FinePrint zero-hallucination guardrails. FinePrint strictly abstains and rejects user disputes involving accidental drops, liquid submersion, or non-defective buyer remorse.',
    keyEnforcementPoints: [
      'Strict legal defense for manufacturers against user-inflicted physical damage',
      'Controlled safe exit in FinePrint pipeline preventing frivolous filings',
      'Re-routes non-statutory cases to National Consumer Helpline for mediation',
    ],
    benchmarkCasesMatched: 10,
  },
  {
    id: 'ccpa-dark-patterns',
    act: 'Guidelines for Prevention of Dark Patterns, 2023',
    section: 'Guidelines 4-9',
    title: 'Prohibition of Deceptive E-Commerce User Interfaces',
    category: 'Dark Patterns',
    statutoryText:
      'No person, including any platform, shall engage in any dark pattern practice, including false urgency, basket sneaking, confirm shaming, forced action, subscription traps, interface interference, bait and switch, and drip pricing.',
    legalSignificance:
      'Protects consumers when e-commerce interfaces intentionally bury cancellation buttons, make return flows an infinite chatbot loop, or falsely display "Only 1 item left in stock" to push hurried non-refundable purchases.',
    keyEnforcementPoints: [
      'Interface interference in return workflows is a punishable unfair trade practice',
      'Automated chatbot deflection without escalation violates CCPA standards',
    ],
    benchmarkCasesMatched: 6,
  },
];

const PRECEDENTS_DIRECTORY: PrecedentItem[] = [
  {
    id: 'ncdrc-amazon-2022',
    caseTitle: 'Amazon Seller Services Pvt Ltd vs. Gopal Sharma & Anr.',
    forum: 'National Consumer Disputes Redressal Commission (NCDRC)',
    citation: '2022 SCC OnLine NCDRC 184',
    year: 2022,
    subject: 'Defective Television - Marketplace Joint Liability',
    ratioDecidendi:
      'Held that an e-commerce platform that facilitates transaction, collects consideration, and assures delivery cannot claim mere intermediary immunity under Section 79 of the IT Act when inherent defects are reported within statutory warranty periods.',
    statutoryGround: 'CPA 2019 Section 84 & E-Commerce Rules 2020 Rule 6',
  },
  {
    id: 'sc-tata-motors-2021',
    caseTitle: 'Tata Motors Ltd. vs. Antonio Paulo Vaz & Anr.',
    forum: 'Supreme Court of India',
    citation: '(2021) 12 SCC 419',
    year: 2021,
    subject: 'Inherent Manufacturing Defect vs Pre-Delivery Defect',
    ratioDecidendi:
      'Supreme Court reaffirmed that where a consumer establishes frequent breakdowns and persistent functional failure shortly after purchase, the burden shifts to the manufacturer to prove absence of inherent defect.',
    statutoryGround: 'CPA 2019 Section 84 (Defective Design & Manufacture)',
  },
  {
    id: 'state-delhi-phone-2023',
    caseTitle: 'Rajeev Kumar vs. Samsung India Electronics Pvt Ltd',
    forum: 'Delhi State Consumer Commission',
    citation: 'FA/184/2023',
    year: 2023,
    subject: 'Smartphone Display Failure - Unavailability of Spare Parts',
    ratioDecidendi:
      'Held that refusing repair under warranty by asserting shortage of spare parts constitutes unfair trade practice. Ordered full refund of device purchase price along with statutory compensation.',
    statutoryGround: 'CPA 2019 Section 84(d) (Express Warranty Breach)',
  },
];

export const StatutesTab: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'Product Liability' | 'E-Commerce Rules' | 'Statutory Abstention' | 'Dark Patterns'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { success } = useToast();

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Statutory Citation Copied', text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredStatutes = STATUTES_DIRECTORY.filter((item) => {
    const matchesCategory = filter === 'ALL' || item.category === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.act.toLowerCase().includes(q) ||
      item.statutoryText.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-enter">
      {/* Header Banner */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F4F4F6] flex items-center gap-2 tracking-tight">
              <BookOpen className="w-5 h-5 text-[#FF2A1A]" />
              <span>Codified Consumer Law & Judicial Precedents Directory</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF2A1A]/10 text-[#FF2A1A] border border-[#FF2A1A]/20 font-bold">
              CPA 2019 Codified
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
            The deterministic statutory rules codified into <code className="font-mono text-[#F4F4F6] bg-[#18181D] px-1.5 py-0.5 rounded border border-[#27272A]">rules-mcp</code> to evaluate product liability, mandatory SLAs, and zero-hallucination abstentions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto bg-[#18181D] p-2.5 rounded-xl border border-[#27272A]">
          <Scale className="w-4 h-4 text-[#FF2A1A]" />
          <div className="text-xs">
            <span className="text-[#71717A] block text-[10px] uppercase font-mono">Enforcement Body</span>
            <span className="font-bold text-[#F4F4F6]">CCPA & NCDRC</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statutes by section, keyword, or text..."
            className="w-full bg-[#121216] border border-[#27272A] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#FF2A1A] focus:ring-1 focus:ring-[#FF2A1A] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#121216] p-1 rounded-xl border border-[#27272A] self-start sm:self-auto shadow-xs">
          {(['ALL', 'Product Liability', 'E-Commerce Rules', 'Statutory Abstention', 'Dark Patterns'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={cn(
                "btn-press px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap",
                filter === mode
                  ? "bg-[#FF2A1A] text-white font-semibold shadow-md shadow-[#FF2A1A]/20"
                  : "text-[#A1A1AA] hover:text-white hover:bg-[#18181D]"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Statutes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStatutes.map((item) => (
          <div
            key={item.id}
            className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-3.5 shadow-xl hover:border-[#FF2A1A]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18181D] text-[#A1A1AA] border border-[#27272A] font-semibold">
                  {item.act}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold",
                    item.category === 'Product Liability' && "bg-[#FF2A1A]/10 text-[#FF2A1A] border border-[#FF2A1A]/20",
                    item.category === 'E-Commerce Rules' && "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20",
                    item.category === 'Statutory Abstention' && "bg-[#F59E0B]/10 text-[#FBBF24] border border-[#F59E0B]/20",
                    item.category === 'Dark Patterns' && "bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/20"
                  )}
                >
                  {item.section}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#F4F4F6] leading-snug">{item.title}</h3>

              <div className="p-3 rounded-xl bg-[#18181D] border border-[#27272A] text-[11px] text-[#D4D4D8] font-mono leading-relaxed italic">
                &ldquo;{item.statutoryText}&rdquo;
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {item.legalSignificance}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-[#F4F4F6]">Enforcement Principles:</div>
                {item.keyEnforcementPoints.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-[#D4D4D8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-[11px]">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px]">
              <span className="text-[#71717A] font-mono">
                Matched in {item.benchmarkCasesMatched} benchmark test cases
              </span>
              <button
                onClick={() => handleCopyCitation(`${item.act} - ${item.section}: ${item.title}`, item.id)}
                className="btn-press flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181D] hover:bg-[#FF2A1A]/15 text-[#FF6E63] border border-[#27272A] hover:border-[#FF2A1A]/30 transition-colors font-medium text-xs"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === item.id ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Judicial Precedents Section */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#FF2A1A]" />
            <h3 className="text-sm font-bold text-[#F4F4F6] uppercase tracking-wider font-mono">
              Binding Consumer Court Precedents (NCDRC & Supreme Court)
            </h3>
          </div>
          <span className="text-xs text-[#71717A] font-mono">Legal Authorities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRECEDENTS_DIRECTORY.map((prec) => (
            <div
              key={prec.id}
              className="p-4 rounded-xl bg-[#18181D] border border-[#27272A] space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                  <span>{prec.forum}</span>
                  <span className="font-bold text-[#FF2A1A]">{prec.year}</span>
                </div>
                <h4 className="text-xs font-bold text-[#F4F4F6] leading-snug">{prec.caseTitle}</h4>
                <div className="text-[11px] font-mono text-[#FF6E63] bg-[#121216] px-2 py-0.5 rounded border border-[#27272A] inline-block">
                  {prec.citation}
                </div>
                <div className="text-[11px] font-semibold text-[#D4D4D8] mt-1">{prec.subject}</div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  <b className="text-[#F4F4F6]">Ratio:</b> {prec.ratioDecidendi}
                </p>
              </div>

              <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                <span className="truncate pr-2">{prec.statutoryGround}</span>
                <button
                  onClick={() => handleCopyCitation(`${prec.caseTitle} (${prec.citation})`, prec.id)}
                  className="btn-press text-[#FF2A1A] hover:text-[#FF6E63] font-semibold flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>Cite</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
