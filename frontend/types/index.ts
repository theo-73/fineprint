export interface ExtractedOrder {
  order_id: string;
  purchase_date: string;
  product_name: string;
  brand: string;
  seller_name: string;
  amount_inr: number;
  marketplace?: string;
  serial_number?: string;
  seller_gstin?: string;
  warranty_months?: number;
  return_window_days?: number;
  confidence_score?: number;
}

export interface CaseData {
  id: number;
  claim_ref: string;
  created_at: string;
  status: string;
  order_id: string;
  purchase_date: string;
  product_name: string;
  brand: string;
  seller_name: string;
  amount_inr: number;
  defect_description: string;
  primary_route: string;
  statutory_citations: string[];
  should_abstain: boolean;
  abstention_reason?: string;
  validation_passed: boolean;
  validation_errors: string[];
  validation_warnings: string[];
  evidence_checklist?: string[];
  evidence?: Array<{
    id: number;
    filename: string;
    file_type: string;
    file_path: string;
    uploaded_at: string;
  }>;
  whatsapp_text?: string;
  nch_text?: string;
  pdf_download_url?: string;
}

export interface BenchmarkSummary {
  total_cases: number;
  in_scope_cases: number;
  in_scope_route_accuracy_pct: number;
  in_scope_target_met: boolean;
  citation_validity_pct: number;
  out_of_scope_cases: number;
  abstention_rate_pct: number;
  abstention_target_met: boolean;
  overall_benchmark_passed: boolean;
}

export interface BenchmarkCase {
  id: string;
  type: 'IN_SCOPE' | 'OUT_OF_SCOPE';
  description: string;
  expected_route?: string;
  assigned_route?: string;
  route_passed?: boolean;
  expected_abstain?: boolean;
  abstained?: boolean;
  abstention_reason?: string;
  passed?: boolean;
  citations?: string[];
}

export interface AuditLogItem {
  id: number;
  case_id: number;
  timestamp: string;
  step_name: string;
  event: string;
  details: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  caseId?: number;
  step?: number;
  timestamp: string;
}

export interface MockReceipt {
  id: string;
  sender: string;
  subject: string;
  date: string;
  body: string;
}
