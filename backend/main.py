"""
FastAPI Backend Application for FinePrint
Connects the React/Next.js Cockpit to the Local MCP Agent, Validator, and SQLite DB.
"""

import os
import shutil
import uuid
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from backend.models import CaseCreateRequest, CaseResponse, ChatRequest, ChatResponse
from backend.orchestrator import FinePrintOrchestrator
from backend.database import get_case, list_cases, log_audit_event, get_audit_logs, get_evidence_by_case, insert_evidence
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
def get_mock_mailbox():
    """Returns curated Indian e-commerce order receipts for offline demo intake."""
    return {"receipts": MOCK_INDIAN_RECEIPTS}

@app.post("/api/upload-invoice")
async def upload_invoice(file: UploadFile = File(...)):
    """Uploads a PDF invoice safely and extracts structured facts using receipt-mcp."""
    raw_name = os.path.basename(file.filename or "invoice.pdf")
    safe_name = f"{uuid.uuid4().hex[:8]}_{raw_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted = PDFInvoiceParser.parse_invoice(file_path)
        log_audit_event("2_FIND", "User uploaded PDF invoice parsed", {
            "filename": raw_name,
            "safe_path": file_path,
            "order_id": extracted.order_id,
            "product_name": extracted.product_name,
            "amount_inr": extracted.amount_inr
        })
        return {
            "status": "success",
            "file_path": file_path,
            "filename": raw_name,
            "extracted_order": extracted.model_dump()
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
    Interactive chat intake. Handles problem description and maps user to the 6-step flow.
    """
    msg = req.message.strip()
    msg_lower = msg.lower()

    # Check for direct defect description
    if any(kw in msg_lower for kw in ["screen", "defect", "broke", "not working", "sound", "battery", "damaged", "return", "refund"]):
        # Run pipeline
        res = orchestrator.process_claim_pipeline(problem_description=msg)
        if res.get("should_abstain"):
            reply = (
                f"I evaluated your issue against Indian consumer statutes. "
                f"**Notice: We must abstain from filing a manufacturing defect claim.**\n\n"
                f"**Reason:** {res.get('abstention_reason')}\n\n"
                f"Under the Consumer Protection Act 2019 (Section 84), accidental damage or change of mind is not covered under statutory product liability unless Accidental Damage Protection was purchased."
            )
            step_indicator = 3
        else:
            reply = (
                f"I found your order for **{res.get('product_name')}** (Order ID: `{res.get('order_id')}`) from {res.get('seller_name')}.\n\n"
                f"**Statutory Assessment:**\n"
                f"• Primary Escalation Route: `{res.get('primary_route')}`\n"
                f"• Applicable Statute: {', '.join(res.get('statutory_citations', []))}\n"
                f"• Status: Formal Claim Notice, WhatsApp text, and NCH docket generated.\n\n"
                f"Review the claim packet below and approve to export."
            )
            step_indicator = 6

        return ChatResponse(
            reply=reply,
            step_indicator=step_indicator,
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
    else:
        return ChatResponse(
            reply="Welcome to FinePrint! Please describe the issue with your purchased electronics or upload an invoice PDF to evaluate your statutory consumer rights under CPA 2019 and E-Commerce Rules 2020.",
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

    case_record = orchestrator.process_claim_pipeline(
        problem_description=req.problem_description,
        invoice_text=req.invoice_text,
        order_override=order_override,
        complainant_name=req.complainant_name or "Consumer"
    )

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
