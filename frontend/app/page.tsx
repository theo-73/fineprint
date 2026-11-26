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
import { LandingView } from '../components/LandingView';
import { CommandPalette } from '../components/CommandPalette';
import { ClaimDossierModal } from '../components/ClaimDossierModal';
import { ToastProvider, useToast } from '../components/ToastProvider';
import { AuthUser } from '../components/AuthModal';
import { 
  ExtractedOrder, CaseData, BenchmarkSummary, BenchmarkCase, 
  AuditLogItem, ChatMessage, MockReceipt 
} from '../types';

function FinePrintCockpitContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [dossierCase, setDossierCase] = useState<CaseData | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

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
        if (data.cases) setCasesList(data.cases);
      })
      .catch(() => {});
  };

  const loadAuditLogs = (caseId: number) => {
    fetch(`/api/cases/${caseId}/audit`)
      .then((r) => r.json())
      .then((data) => {
        if (data.audit_logs) setAuditLogs(data.audit_logs);
      })
      .catch(() => {});
  };

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
    } catch (err: unknown) {
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
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please upload a valid invoice PDF file.');
      error('Invalid File', 'Only PDF invoice files are accepted.');
      return;
    }
    setUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-invoice', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to upload invoice PDF.');
      }
      const data = await res.json();
      setUploadedFileName(data.filename);
      setUploadedFilePath(data.file_path);
      setSelectedReceipt(data.extracted_order);
      success('Invoice Parsed with MCP', `Extracted ${data.extracted_order?.product_name || 'order details'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during upload';
      setErrorMsg(msg);
      error('Upload Failed', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (!selectedReceipt) {
      setErrorMsg('Please select a receipt from your mailbox or upload an invoice PDF first.');
      error('Receipt Missing', 'Fact extraction requires an invoice PDF or curated order.');
      return;
    }
    if (!problemDescription.trim()) {
      setErrorMsg('Please enter a description of the defect.');
      error('Defect Missing', 'Please describe the defect symptoms.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCurrentStep(2);

    try {
      const payload = {
        problem_description: problemDescription,
        extracted_order: selectedReceipt,
        complainant_name: complainantName || 'Complainant',
        invoice_pdf_path: uploadedFilePath
      };

      const res = await fetch('/api/evaluate-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Evaluation failed.');
      }

      const caseData: CaseData = await res.json();
      setActiveCase(caseData);
      setCurrentStep(3);
      loadCases();
      if (caseData.id) loadAuditLogs(caseData.id);
      success('Statutory Claim Generated', `Enforceable notice compiled for ${caseData.product_name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error evaluating claim.';
      setErrorMsg(msg);
      error('Evaluation Failed', msg);
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    setBenchmarkLoading(true);
    try {
      const res = await fetch('/api/benchmark');
      if (!res.ok) throw new Error('Failed to load benchmark suite.');
      const data = await res.json();
      setBenchmarkSummary(data.summary);
      setBenchmarkCases(data.cases || []);
      success('Benchmark Executed', '30 evaluation cases verified against CPA 2019.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Benchmark error.';
      error('Benchmark Failed', msg);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const handleOpenCaseFromChat = (caseId: number) => {
    fetch(`/api/cases/${caseId}`)
      .then((r) => r.json())
      .then((caseItem: CaseData) => {
        if (caseItem && caseItem.id) {
          setActiveCase(caseItem);
          setActiveTab('cockpit');
          if (caseItem.id) loadAuditLogs(caseItem.id);
        }
      })
      .catch(() => {
        setActiveTab('cockpit');
      });
  };

  const handleSendChatMessage = async (userMsg: string) => {
    const userMessageObj: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMsg,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, userMessageObj]);
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

  // If on Landing Page ('overview'), render FULL SCREEN without sidebar or inner header
  if (activeTab === 'overview') {
    return (
      <>
        <LandingView
          onNavigate={(tab) => {
            setActiveTab(tab);
            if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
            if (tab === 'vault') loadCases();
          }}
          user={currentUser}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            success('Signed in as ' + user.name, user.role);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(tab) => {
            setActiveTab(tab);
            if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
            if (tab === 'vault') loadCases();
          }}
          onSelectSampleInvoice={(idx) => {
            if (mockReceipts[idx]) {
              handleSelectMockReceipt(mockReceipts[idx]);
              setActiveTab('cockpit');
            }
          }}
          onTriggerAction={(actionId) => {
            if (actionId === 'nch') {
              window.open('https://consumerhelpline.gov.in/', '_blank');
            } else if (actionId === 'sla') {
              setActiveTab('statutes');
            }
          }}
        />
      </>
    );
  }

  // INNER APP VIEW: Render Sidebar on left + Header on top + Inner tool view
  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] flex flex-row font-sans selection:bg-[#FF2A1A]/30 selection:text-white antialiased">
      {/* Desktop Collapsible Sidebar */}
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
          className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 bg-[#121216] h-full shadow-2xl flex flex-col p-4 animate-enter border-r border-[#27272A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <span className="font-bold text-sm text-white">Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#A1A1AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-4 space-y-1.5 flex-1">
              {[
                { id: 'overview', label: 'Overview & Showcase' },
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
                      ? 'bg-[#FF2A1A] text-white font-bold' 
                      : 'text-[#A1A1AA] hover:bg-[#18181D] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Inner Workspace Column */}
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
          user={currentUser}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
          {/* Global Error Banner */}
          {errorMsg && (
            <div className="bg-[#2A1215] border border-[#991B1B]/50 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-[#FCA5A5] shadow-sm animate-enter">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FF2A1A] flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-[#FF6E63] hover:text-white font-semibold text-[11px] px-2 py-0.5 rounded"
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
                    if (!showAuditTrail && activeCase?.id) loadAuditLogs(activeCase.id);
                    setShowAuditTrail(!showAuditTrail);
                  }}
                  onCopyWhatsApp={(text) => copyToClipboard(text, 'wa')}
                  onCopyNCH={(text) => copyToClipboard(text, 'nch')}
                  onOpenDossier={(caseItem) => setDossierCase(caseItem)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHAT ADVOCATE */}
          {activeTab === 'chat' && (
            <ChatAdvocate
              messages={chatMessages}
              input={chatInput}
              loading={chatLoading}
              onInputChange={setChatInput}
              onSendMessage={handleSendChatMessage}
              onOpenCase={handleOpenCaseFromChat}
            />
          )}

          {/* TAB 3: STATUTES & PRECEDENTS */}
          {activeTab === 'statutes' && <StatutesTab />}

          {/* TAB 4: PLATFORM INTEL RADAR */}
          {activeTab === 'intel' && <PlatformIntelTab />}

          {/* TAB 5: 30-CASE BENCHMARK */}
          {activeTab === 'benchmark' && (
            <BenchmarkTab
              summary={benchmarkSummary}
              cases={benchmarkCases}
              loading={benchmarkLoading}
              onRunBenchmark={handleRunBenchmark}
            />
          )}

          {/* TAB 6: SQLITE PERSISTENT VAULT */}
          {activeTab === 'vault' && (
            <VaultTab
              cases={casesList}
              onSelectCase={(c) => {
                setActiveCase(c);
                setActiveTab('cockpit');
                if (c.id) loadAuditLogs(c.id);
              }}
              onOpenDossier={(c) => setDossierCase(c)}
            />
          )}
        </main>
      </div>

      {/* Case Dossier Modal */}
      {dossierCase && (
        <ClaimDossierModal
          caseData={dossierCase}
          onClose={() => setDossierCase(null)}
          onCopyWhatsApp={(text) => copyToClipboard(text, 'wa')}
          onCopyNCH={(text) => copyToClipboard(text, 'nch')}
        />
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'benchmark' && !benchmarkSummary) handleRunBenchmark();
          if (tab === 'vault') loadCases();
        }}
        onSelectSampleInvoice={(idx) => {
          if (mockReceipts[idx]) {
            handleSelectMockReceipt(mockReceipts[idx]);
            setActiveTab('cockpit');
          }
        }}
        onTriggerAction={(actionId) => {
          if (actionId === 'nch') {
            window.open('https://consumerhelpline.gov.in/', '_blank');
          } else if (actionId === 'sla') {
            setActiveTab('statutes');
          }
        }}
      />
    </div>
  );
}

export default function FinePrintApp() {
  return (
    <ToastProvider>
      <FinePrintCockpitContent />
    </ToastProvider>
  );
}
