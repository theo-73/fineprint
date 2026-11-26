"""
FastAPI Backend Application for FinePrint
Connects the React/Next.js Cockpit to the Local MCP Agent, Validator, and SQLite DB.
"""

import os
import re
import shutil
import uuid
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from backend.models import (
    CaseCreateRequest, CaseResponse, ChatRequest, ChatResponse,
    ExtractOrderRequest, ExtractOrderResponse
)
from backend.orchestrator import FinePrintOrchestrator
from backend.database import get_case, list_cases, log_audit_event, get_audit_logs, get_evidence_by_case, insert_evidence
from backend.mcp_client import FinePrintMCPClient
from mcp_servers.receipt_mcp.gmail_connector import MOCK_INDIAN_RECEIPTS
from mcp_servers.receipt_mcp.pdf_parser import PDFInvoiceParser

app = FastAPI(
    title="FinePrint Consumer Rights MCP Agent API",
    description="Statutory consumer protection claim agent under CPA 2019 and E-Commerce Rules 2020",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = FinePrintOrchestrator()
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploaded_invoices"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinePrint Agent Orchestrator",
        "mcp_servers": ["receipt-mcp", "rules-mcp"],
        "trust_boundary": "local_client_session"
    }

@app.get("/api/mock-mailbox")
@app.get("/api/receipts")
def get_mock_mailbox():
    """Returns curated Indian e-commerce order receipts for offline demo intake."""
    return {"receipts": MOCK_INDIAN_RECEIPTS}

@app.get("/api/rules")
def list_rules():
    """Returns codified Indian consumer protection rules and statutory citations."""
    from backend.validator import ClaimValidator
    val = ClaimValidator()
    return {"rules": val.rules, "count": len(val.rules)}

@app.post("/api/extract-text", response_model=ExtractOrderResponse)
def extract_text(req: ExtractOrderRequest):
    """Extracts structured facts from raw receipt text or email body using receipt-mcp."""
    try:
        extracted = FinePrintMCPClient.extract_order_from_text(req.raw_text)
        return ExtractOrderResponse(order=extracted, status="success")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract order facts from text: {str(e)}")

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

@app.post("/api/upload-invoice")
def upload_invoice(file: UploadFile = File(...)):
    """Uploads a PDF invoice safely and extracts structured facts using receipt-mcp."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only valid .pdf files are accepted.")

    # Verify magic bytes header
    header = file.file.read(1024)
    if not header.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="Invalid PDF file format. Missing %PDF- header.")

    # Verify file size within 10MB limit
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail=f"File exceeds 10MB upload limit (size: {file_size / (1024*1024):.1f}MB).")

    # Sanitize filename against path traversal
    base_name = os.path.basename(file.filename or "invoice.pdf")
    sanitized_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', base_name)
    safe_name = f"{uuid.uuid4().hex[:8]}_{sanitized_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Call receipt-mcp via FinePrintMCPClient
        extracted_dict = FinePrintMCPClient.parse_invoice_pdf(file_path)
        log_audit_event("2_FIND", "User uploaded PDF invoice parsed via receipt-mcp", {
            "filename": sanitized_name,
            "safe_path": file_path,
            "order_id": extracted_dict.get("order_id"),
            "product_name": extracted_dict.get("product_name"),
            "amount_inr": extracted_dict.get("amount_inr")
        })
        return {
            "status": "success",
            "file_path": file_path,
            "filename": sanitized_name,
            "extracted_order": extracted_dict
        }
    except Exception as e:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF invoice: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
def chat_intake(req: ChatRequest):
    """
    Interactive chat intake. Handles problem descriptions, extracts order context,
    checks statutory rules, and conversationally guides the user.
    """
    msg = req.message.strip()
    msg_lower = msg.lower()

    # 1. Detect explicit accidental damage or change-of-mind -> Statutory Abstention Advisory
    if any(phrase in msg_lower for phrase in [
        "dropped", "dropped phone", "fell down", "cracked screen", "spilled", 
        "liquid damage", "water damage", "change of mind", "bought wrong", "dont like it"
    ]):
        reply = (
            "I analyzed your situation against Indian consumer protection statutory guidelines.\n\n"
            "⚠️ **Statutory Assessment: Abstain from Manufacturing Defect Claim**\n\n"
            "Under **Sections 84 and 87 of the Consumer Protection Act, 2019**, product liability is strictly "
            "limited to inherent manufacturing defects, design flaws, or non-conformity with express warranty. "
            "Accidental physical impacts, liquid ingress, or post-window buyer remorse are statutory exceptions.\n\n"
            "💡 **Recommended Next Step:** If you purchased an Accidental Damage Protection (ADP) policy, "
            "file a claim under that policy. Otherwise, request an out-of-warranty repair quote from an authorized service centre."
        )
        return ChatResponse(
            reply=reply,
            step_indicator=3,
            classification={"should_abstain": True, "reason": "Accidental physical damage or post-window change of mind"},
            case_ready=False
        )

    # 2. Check for order match in existing receipts via receipt-mcp
    matches = FinePrintMCPClient.search_receipts(msg)
    if matches:
        matched_order = matches[0]
        try:
            res = orchestrator.process_claim_pipeline(
                problem_description=msg,
                order_override=matched_order
            )
            reply = (
                f"I located your purchase record for **{res.get('product_name')}** (Order ID: `{res.get('order_id')}`) from **{res.get('seller_name')}**.\n\n"
                f"🏛️ **Statutory Assessment & Liability Analysis:**\n"
                f"• **Escalation Route:** `{res.get('primary_route')}`\n"
                f"• **Governing Statutes:** {', '.join(res.get('statutory_citations', []))}\n"
                f"• **Grievance SLA Mandate:** 48-Hour Written Acknowledgment (Rule 4(5))\n\n"
                f"I have assembled your complete evidence docket, statutory notice PDF, WhatsApp escalation text, and National Consumer Helpline (NCH 1915) filing text."
            )
            return ChatResponse(
                reply=reply,
                step_indicator=6,
                extracted_order={
                    "order_id": res.get("order_id"),
                    "product_name": res.get("product_name"),
                    "brand": res.get("brand"),
                    "seller_name": res.get("seller_name"),
                    "amount_inr": res.get("amount_inr")
                },
                classification={
                    "primary_route": res.get("primary_route"),
                    "statutory_citations": res.get("statutory_citations"),
                    "should_abstain": res.get("should_abstain")
                },
                case_ready=True,
                case_id=res.get("id")
            )
        except Exception:
            pass

    # 3. Defect mentioned, but no invoice/receipt attached yet -> Guide user
    if any(kw in msg_lower for kw in [
        "screen", "defect", "broke", "not working", "sound", "battery", 
        "refused", "service center", "return", "refund", "dead", "faulty", "stopped working"
    ]):
        reply = (
            "I hear you. If your electronics developed an inherent defect during normal usage, you are protected by law.\n\n"
            "📜 **Your Rights Under Indian Law:**\n"
            "• **Rule 6(3)(a) of E-Commerce Rules, 2020:** Sellers and platforms **cannot refuse** repair, replacement, or refund "
            "for defective goods, even if their platform 7-day return window has expired.\n"
            "• **Section 84 & 86 of CPA 2019:** Strict statutory product liability applies to both manufacturer and seller.\n\n"
            "To generate your verifiable claim docket, I need your purchase particulars:\n"
            "1. **Upload your invoice PDF** on the *Intake & File Claim* tab (or drop it in the file uploader), OR\n"
            "2. Provide your **Order ID, Product Name, Brand, Purchase Date, and Price Paid**.\n\n"
            "Once attached, I will automatically assemble your formal legal notice."
        )
        return ChatResponse(
            reply=reply,
            step_indicator=2,
            case_ready=False
        )

    # 4. General greeting / initial prompt
    return ChatResponse(
        reply=(
            "Welcome to FinePrint! I am your AI Consumer Rights Advocate for Indian E-Commerce.\n\n"
            "I help consumers enforce statutory warranties under the **Consumer Protection Act, 2019** and the "
            "**E-Commerce Rules, 2020** when platforms (Amazon, Flipkart, Croma) or brands refuse returns after 7 days.\n\n"
            "Tell me about the issue with your purchased device, or upload your purchase invoice PDF to get started."
        ),
        step_indicator=1,
        case_ready=False
    )

@app.post("/api/cases", response_model=CaseResponse)
def create_case(req: CaseCreateRequest):
    """Creates a new claim case and executes the 6-stage pipeline."""
    order_override = None
    if req.order_id:
        order_override = {
            "order_id": req.order_id,
            "purchase_date": req.purchase_date or "2026-10-15",
            "product_name": req.product_name or "Consumer Electronics",
            "brand": req.brand or "Brand",
            "seller_name": req.seller_name or "Authorized Retailer",
            "seller_gstin": None,
            "marketplace": req.marketplace or "Amazon India",
            "amount_inr": req.amount_inr or 4999.0,
            "serial_number": req.serial_number,
            "warranty_months": 12,
            "return_window_days": 7
        }

    try:
        case_record = orchestrator.process_claim_pipeline(
            problem_description=req.problem_description,
            invoice_text=req.invoice_text,
            invoice_pdf_path=req.invoice_pdf_path,
            order_override=order_override,
            complainant_name=req.complainant_name or "Consumer"
        )
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claim pipeline failed: {str(e)}")

    pdf_download_url = f"/api/cases/{case_record['id']}/download-pdf" if case_record.get("packet_pdf_path") else None

    return CaseResponse(
        id=case_record["id"],
        claim_ref=case_record["claim_ref"],
        created_at=datetime_now_iso(),
        status=case_record["status"],
        order_id=case_record["order_id"],
        purchase_date=case_record["purchase_date"],
        product_name=case_record["product_name"],
        brand=case_record["brand"],
        seller_name=case_record["seller_name"],
        amount_inr=case_record["amount_inr"],
        defect_description=case_record["defect_description"],
        primary_route=case_record["primary_route"],
        statutory_citations=case_record["statutory_citations"],
        should_abstain=case_record["should_abstain"],
        abstention_reason=case_record.get("abstention_reason"),
        validation_passed=case_record["validation_passed"],
        validation_errors=case_record["validation_errors"],
        validation_warnings=case_record["validation_warnings"],
        evidence_checklist=case_record.get("evidence_checklist", []),
        whatsapp_text=case_record.get("whatsapp_text"),
        nch_text=case_record.get("nch_text"),
        pdf_download_url=pdf_download_url
    )

def datetime_now_iso() -> str:
    from datetime import datetime
    return datetime.now().isoformat()

@app.get("/api/cases", response_model=List[CaseResponse])
def get_all_cases():
    cases = list_cases()
    res = []
    for c in cases:
        pdf_url = f"/api/cases/{c['id']}/download-pdf" if c.get("packet_pdf_path") else None
        res.append(CaseResponse(
            id=c["id"],
            claim_ref=c["claim_ref"],
            created_at=c["created_at"],
            status=c["status"],
            order_id=c["order_id"] or "",
            purchase_date=c["purchase_date"] or "",
            product_name=c["product_name"] or "",
            brand=c["brand"] or "",
            seller_name=c["seller_name"] or "",
            amount_inr=c["amount_inr"] or 0.0,
            defect_description=c["defect_description"] or "",
            primary_route=c["primary_route"] or "",
            statutory_citations=c["statutory_citations"],
            should_abstain=c["should_abstain"],
            abstention_reason=c.get("abstention_reason"),
            validation_passed=c["validation_passed"],
            validation_errors=c["validation_errors"],
            validation_warnings=c["validation_warnings"],
            evidence_checklist=c.get("evidence_checklist", [
                "Original Tax Invoice & GSTIN Record",
                "Serial / IMEI Proof Attached",
                "Defect Documentation Log",
                "Notice Reference Sent (48h Mandate)"
            ]),
            whatsapp_text=c.get("whatsapp_text"),
            nch_text=c.get("nch_text"),
            pdf_download_url=pdf_url
        ))
    return res

@app.get("/api/cases/{case_id}")
def get_single_case(case_id: int):
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    case["pdf_download_url"] = f"/api/cases/{case['id']}/download-pdf" if case.get("packet_pdf_path") else None
    return case

@app.get("/api/cases/{case_id}/download-pdf")
def download_pdf(case_id: int):
    case = get_case(case_id)
    if not case or not case.get("packet_pdf_path"):
        raise HTTPException(status_code=404, detail="PDF packet not found for this case")
    
    pdf_path = case["packet_pdf_path"]
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file on disk not found")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(pdf_path)
    )

@app.get("/api/cases/{case_id}/audit-logs")
def get_case_audit_logs(case_id: int):
    """Retrieves step-by-step audit logs for a specific case."""
    logs = get_audit_logs(case_id)
    return {"case_id": case_id, "logs": logs}

@app.get("/api/cases/{case_id}/evidence")
def get_case_evidence(case_id: int):
    """Retrieves uploaded evidence records associated with a case."""
    evidence = get_evidence_by_case(case_id)
    return {"case_id": case_id, "evidence": evidence}

@app.post("/api/benchmark/run")
def run_benchmark():
    """Runs the 30-case public benchmark and returns real-time metrics."""
    from tests.test_30_case_benchmark import run_full_benchmark_suite
    results = run_full_benchmark_suite()
    return results
