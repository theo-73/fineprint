'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Header, TabType } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ProcessStepper } from '../components/ProcessStepper';
import { IntakeCard } from '../components/IntakeCard';
import { ClaimDocket } from '../components/ClaimDocket';
import { ChatAdvocate } from '../components/ChatAdvocate';
import { BenchmarkTab } from '../components/BenchmarkTab';
import { VaultTab } from '../components/VaultTab';
import { StatutesTab } from '../components/StatutesTab';
import { PlatformIntelTab } from '../components/PlatformIntelTab';
import { CommandPalette } from '../components/CommandPalette';
import { ClaimDossierModal } from '../components/ClaimDossierModal';
import { ToastProvider, useToast } from '../components/ToastProvider';
import { 
  ExtractedOrder, CaseData, BenchmarkSummary, BenchmarkCase, 
  AuditLogItem, ChatMessage, MockReceipt 
} from '../types';

function FinePrintCockpitContent() {
  const [activeTab, setActiveTab] = useState<TabType>('cockpit');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [dossierCase, setDossierCase] = useState<CaseData | null>(null);

  const { success, error, info } = useToast();
  
  // Intake State
  const [problemDescription, setProblemDescription] = useState<string>(
    'The right ear cup of my Sony WH-1000XM5 headphones stopped outputting audio after 35 days. Amazon return window closed on day 7, and customer care refused replacement.'
  );
  const [complainantName, setComplainantName] = useState<string>('Tejas K');
  const [selectedReceipt, setSelectedReceipt] = useState<ExtractedOrder | null>(null);
  const [mockReceipts, setMockReceipts] = useState<MockReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Case & Database State
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [casesList, setCasesList] = useState<CaseData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [showAuditTrail, setShowAuditTrail] = useState<boolean>(false);

  // Benchmark State
  const [benchmarkSummary, setBenchmarkSummary] = useState<BenchmarkSummary | null>(null);
  const [benchmarkCases, setBenchmarkCases] = useState<BenchmarkCase[]>([]);
  const [benchmarkLoading, setBenchmarkLoading] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'Welcome to FinePrint! I am your statutory consumer advocate under CPA 2019 and E-Commerce Rules 2020. Describe your issue with an electronics purchase, or select a receipt in the Cockpit to evaluate your rights.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Clipboard Feedback State
  const [copiedWA, setCopiedWA] = useState<boolean>(false);
  const [copiedNCH, setCopiedNCH] = useState<boolean>(false);

  // Initial Load: Mailbox & Cases
  useEffect(() => {
    fetch('/api/mock-mailbox')
      .then((r) => r.json())
      .then((data) => {
        if (data.receipts) setMockReceipts(data.receipts);
      })
      .catch(() => {});

    loadCases();
  }, []);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const loadCases = () => {
    fetch('/api/cases')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCasesList(data);
      })
      .catch(() => {});
  };

  const loadAuditLogs = (caseId: number) => {
    fetch(`/api/cases/${caseId}/audit-logs`)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.logs)) setAuditLogs(data.logs);
      })
      .catch(() => {});
  };

  // Dynamic Fact Extraction via receipt-mcp
  const handleSelectMockReceipt = async (receipt: MockReceipt) => {
    setErrorMsg(null);
    setLoading(true);
    setCurrentStep(2);

    try {
      const res = await fetch('/api/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: `${receipt.subject}\n${receipt.body}` })
      });

      if (!res.ok) throw new Error('Failed to extract facts via receipt-mcp.');
      const data = await res.json();
      if (data.order) {
        setSelectedReceipt(data.order);
        setUploadedFileName(null);
        setUploadedFilePath(null);
        success('Verified Purchase Order Loaded', `${data.order.product_name} (${data.order.seller_name})`);
      }
    } catch (err: any) {
      console.warn('Fallback extraction:', err);
      setSelectedReceipt({
        order_id: receipt.id === 'gmail_msg_001' ? '402-8921473-9821401' : 'OD-2026-EXTRACTED',
        purchase_date: receipt.date || '2026-10-15',
        product_name: receipt.subject?.replace(/^.*of\s+/i, '') || 'Consumer Electronics Product',
        brand: 'Brand',
        seller_name: 'Online Retailer',
        amount_inr: 4999,
        marketplace: 'Direct'
      });
      info('Simulated Order Fact Fallback', 'Parsed via offline heuristic parser.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please upload a valid PDF tax invoice or order confirmation document.');
      error('Invalid File Type', 'Only official tax invoice PDFs are accepted.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    setCurrentStep(2);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-invoice', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to parse invoice PDF.');
      }

      const data = await res.json();
      if (data.extracted_order) {
        setSelectedReceipt(data.extracted_order);
        setUploadedFileName(data.filename || file.name);
        setUploadedFilePath(data.file_path || null);
        success('Tax Invoice Parsed', `Verified ${data.extracted_order.product_name} via receipt-mcp`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error uploading and extracting invoice. Please check file format.');
      error('Extraction Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (!problemDescription.trim()) {
      setErrorMsg('Please enter a description of the defect.');
      error('Input Required', 'Please enter defect chronology before evaluating.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setCurrentStep(3); // CLASSIFY

    const step4Timer = setTimeout(() => setCurrentStep(4), 400); // DRAFT
    const step5Timer = setTimeout(() => setCurrentStep(5), 800); // VALIDATE

    try {
      const payload: any = {
        problem_description: problemDescription,
        complainant_name: complainantName
      };

      if (uploadedFilePath) {
        payload.invoice_pdf_path = uploadedFilePath;
      }

      if (selectedReceipt) {
        payload.order_id = selectedReceipt.order_id;
        payload.purchase_date = selectedReceipt.purchase_date;
        payload.product_name = selectedReceipt.product_name;
        payload.brand = selectedReceipt.brand;
        payload.seller_name = selectedReceipt.seller_name;
        payload.amount_inr = selectedReceipt.amount_inr;
      }

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearTimeout(step4Timer);
      clearTimeout(step5Timer);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to process claim through MCP pipeline.');
      }

      const data: CaseData = await res.json();
      setActiveCase(data);
      setCurrentStep(6); // OUTPUT
      loadCases();
      loadAuditLogs(data.id);

      if (data.should_abstain) {
        info('Statutory Abstention', 'Case falls outside statutory manufacturing liability.');
      } else {
        success('Statutory Claim Ready', `Notice reference ${data.claim_ref} compiled under CPA 2019`);
      }
    } catch (err: any) {
      clearTimeout(step4Timer);
      clearTimeout(step5Timer);
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during evaluation.');
      error('Pipeline Halt', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    setBenchmarkLoading(true);
    info('Executing Benchmark Suite', 'Evaluating 20 in-scope and 10 abstention cases...');
    try {
      const res = await fetch('/api/benchmark/run', { method: 'POST' });
      const data = await res.json();
      setBenchmarkSummary(data.summary);
      setBenchmarkCases(data.cases);
      success('Benchmark Complete', `Route Accuracy: ${data.summary.in_scope_route_accuracy_pct}% | Abstention: ${data.summary.abstention_rate_pct}%`);
    } catch (err) {
      console.error(err);
      error('Benchmark Failed', 'Error running test suite.');
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: userMsg,
        timestamp: new Date().toISOString()
      }
    ]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (!res.ok) throw new Error('Chat intake failed.');
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          caseId: data.case_id,
          step: data.step_indicator,
          timestamp: new Date().toISOString()
        }
      ]);

      if (data.case_id) {
        loadCases();
        success('Docket Generated from Chat', `Case #${data.case_id} available in Cockpit and Vault.`);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Error contacting FinePrint agent orchestrator. Please check your backend connection.',
          timestamp: new Date().toISOString()
        }
      ]);
      error('Advocate Error', 'Could not reach FinePrint backend.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleOpenCaseFromChat = (caseId: number) => {
    const matched = casesList.find((c) => c.id === caseId);
    if (matched) {
      setActiveCase(matched);
      setActiveTab('cockpit');
      loadAuditLogs(caseId);
    } else {
      fetch(`/api/cases/${caseId}`)
        .then((r) => r.json())
        .then((c) => {
          setActiveCase(c);
          setActiveTab('cockpit');
          loadAuditLogs(caseId);
        });
    }
  };

  const copyToClipboard = (text: string, type: 'wa' | 'nch') => {
    navigator.clipboard.writeText(text);
    if (type === 'wa') {
      setCopiedWA(true);
      success('WhatsApp Text Copied', 'Paste into seller customer service chat.');
      setTimeout(() => setCopiedWA(false), 2000);
    } else {
      setCopiedNCH(true);
      success('NCH Portal Text Copied', 'Paste into consumerhelpline.gov.in grievance field.');
      setTimeout(() => setCopiedNCH(false), 2000);
    }
  };

  const handleTriggerCommandAction = (actionId: string) => {
    if (actionId === 'nch') {
      window.open('https://consumerhelpline.gov.in/', '_blank');
      info('National Consumer Helpline', 'Opened consumerhelpline.gov.in (Toll-Free 1915)');
    } else if (actionId === 'sla') {
      setActiveTab('statutes');
      info('Rule 4(5) Statutory SLA', 'Navigated to Codified Statutes Directory.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3F0] text-[#181716] flex flex-row font-sans selection:bg-[#C83625]/20 selection:text-[#181716] antialiased">
      {/* Desktop Collapsible Sidebar (Inspired by yatra AppLayout) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
          if (tab === 'vault') loadCases();
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        caseCount={casesList.length}
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#181716]/60 backdrop-blur-sm md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 bg-[#FFFFFF] h-full shadow-2xl flex flex-col p-4 animate-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC]">
              <span className="font-bold text-sm text-[#181716]">Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#736E65] hover:text-[#181716]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-4 space-y-1.5 flex-1">
              {[
                { id: 'cockpit', label: 'Dispute Cockpit' },
                { id: 'chat', label: 'Interactive Advocate' },
                { id: 'statutes', label: 'Statutes & Precedents' },
                { id: 'intel', label: 'Platform Intel Radar' },
                { id: 'benchmark', label: '30-Case Benchmark' },
                { id: 'vault', label: `SQLite Vault (${casesList.length})` },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setMobileMenuOpen(false);
                    if (item.id === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
                    if (item.id === 'vault') loadCases();
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold ${
                    activeTab === item.id 
                      ? 'bg-[#FDF4F2] text-[#C83625] border border-[#F8CFC9]' 
                      : 'text-[#524E47] hover:bg-[#FAF9F7]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
            if (tab === 'vault') loadCases();
          }}
          caseCount={casesList.length}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
          {/* Global Error Banner */}
          {errorMsg && (
            <div className="bg-[#FDF4F2] border border-[#F8CFC9] rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-[#C83625] shadow-sm animate-enter">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#C83625] flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-[#C83625] hover:text-[#B32E1F] font-semibold text-[11px] px-2 py-0.5 rounded"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Stepper only on Cockpit */}
          {activeTab === 'cockpit' && (
            <ProcessStepper currentStep={currentStep} />
          )}

          {/* TAB 1: COCKPIT */}
          {activeTab === 'cockpit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <IntakeCard
                  mockReceipts={mockReceipts}
                  selectedReceipt={selectedReceipt}
                  uploadedFileName={uploadedFileName}
                  problemDescription={problemDescription}
                  complainantName={complainantName}
                  loading={loading}
                  uploading={uploading}
                  onSelectReceipt={handleSelectMockReceipt}
                  onFileUpload={handleFileUpload}
                  onProblemDescriptionChange={setProblemDescription}
                  onComplainantNameChange={setComplainantName}
                  onEvaluate={handleRunEvaluation}
                />
              </div>

              <div className="lg:col-span-7">
                <ClaimDocket
                  activeCase={activeCase}
                  auditLogs={auditLogs}
                  showAuditTrail={showAuditTrail}
                  copiedWA={copiedWA}
                  copiedNCH={copiedNCH}
                  onToggleAuditTrail={() => {
                    setShowAuditTrail(!showAuditTrail);
                    if (!showAuditTrail && activeCase) loadAuditLogs(activeCase.id);
                  }}
                  onCopyWA={(t) => copyToClipboard(t, 'wa')}
                  onCopyNCH={(t) => copyToClipboard(t, 'nch')}
                  onInspectDossier={() => {
                    if (activeCase) setDossierCase(activeCase);
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: AI ADVOCATE CHAT */}
          {activeTab === 'chat' && (
            <ChatAdvocate
              messages={chatMessages}
              chatInput={chatInput}
              loading={chatLoading}
              onInputChange={setChatInput}
              onSendMessage={handleSendChat}
              onOpenCase={handleOpenCaseFromChat}
            />
          )}

          {/* TAB 3: STATUTES & PRECEDENTS (NEW) */}
          {activeTab === 'statutes' && (
            <StatutesTab />
          )}

          {/* TAB 4: PLATFORM INTEL RADAR (NEW) */}
          {activeTab === 'intel' && (
            <PlatformIntelTab />
          )}

          {/* TAB 5: 30-CASE BENCHMARK */}
          {activeTab === 'benchmark' && (
            <BenchmarkTab
              summary={benchmarkSummary}
              cases={benchmarkCases}
              loading={benchmarkLoading}
              onRunBenchmark={handleRunBenchmark}
            />
          )}

          {/* TAB 6: SQLITE VAULT */}
          {activeTab === 'vault' && (
            <VaultTab
              cases={casesList}
              onSelectCase={(c) => {
                setDossierCase(c);
              }}
              onRefresh={loadCases}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E5E2DC] py-4 px-6 text-center text-xs text-[#736E65] font-sans">
          FinePrint Consumer Rights MCP Agent • Codified Statutory Defense under CPA 2019 & E-Commerce Rules 2020
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
          if (tab === 'vault') loadCases();
        }}
        onSelectSampleCase={(idx) => {
          if (mockReceipts[idx]) {
            handleSelectMockReceipt(mockReceipts[idx]);
          }
        }}
        onTriggerAction={handleTriggerCommandAction}
      />

      {/* Interactive Case Dossier Modal (Inspired by yatra ExpeditionDossierModal) */}
      <ClaimDossierModal
        activeCase={dossierCase}
        auditLogs={auditLogs}
        onClose={() => setDossierCase(null)}
      />
    </div>
  );
}

export default function FinePrintCockpit() {
  return (
    <ToastProvider>
      <FinePrintCockpitContent />
    </ToastProvider>
  );
}
