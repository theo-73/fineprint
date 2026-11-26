"""
End-to-End API and Integration Test Suite for FinePrint
Tests FastAPI endpoints, upload security guards, case evaluation,
PDF packet downloads, and MCP client integrations.
"""

import os
import io
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_and_metadata_endpoints():
    """Verify health check and public rule/receipt listings."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "mcp_servers" in data

    rules_res = client.get("/api/rules")
    assert rules_res.status_code == 200
    assert len(rules_res.json()["rules"]) >= 5

    receipts_res = client.get("/api/receipts")
    assert receipts_res.status_code == 200
    assert len(receipts_res.json()["receipts"]) >= 3

def test_text_extraction_with_font_artifacts():
    """Verify text extractor parses corrupted currency glyphs and GST parentheticals."""
    payload = {
        "raw_text": "Total Amount Paid (Inclusive of 18% GST) n24,990.00 Order ID: 402-8921473-9821401"
    }
    res = client.post("/api/extract-text", json=payload)
    assert res.status_code == 200
    data = res.json()["order"]
    assert data["amount_inr"] == 24990.0
    assert data["order_id"] == "402-8921473-9821401"

def test_invoice_upload_security_guards():
    """Verify upload security guards: file extension, magic bytes, and size verification."""
    # 1. Non-PDF extension rejected
    bad_ext = client.post(
        "/api/upload-invoice",
        files={"file": ("malicious.exe", b"MZ\x90\x00\x03\x00\x00\x00", "application/octet-stream")}
    )
    assert bad_ext.status_code == 400
    assert "Only valid .pdf files" in bad_ext.json()["detail"]

    # 2. PDF extension with invalid header (missing %PDF-) rejected
    bad_header = client.post(
        "/api/upload-invoice",
        files={"file": ("fake.pdf", b"<html>Fake PDF payload</html>", "application/pdf")}
    )
    assert bad_header.status_code == 400
    assert "Missing %PDF- header" in bad_header.json()["detail"]

    # 3. Valid PDF invoice accepted and extracted
    sample_pdf_path = os.path.join(os.path.dirname(__file__), "..", "sample_invoices", "test_amazon_invoice.pdf")
    with open(sample_pdf_path, "rb") as f:
        valid_pdf_content = f.read()

    good_res = client.post(
        "/api/upload-invoice",
        files={"file": ("test_invoice.pdf", valid_pdf_content, "application/pdf")}
    )
    assert good_res.status_code == 200
    extracted = good_res.json()["extracted_order"]
    assert extracted["amount_inr"] == 24990.0
    assert extracted["order_id"] == "402-8921473-9821401"

def test_case_creation_and_empty_guard():
    """Verify case creation rejects missing facts and succeeds with complete facts."""
    # 1. Missing facts raises 422 Unprocessable Entity
    bad_res = client.post("/api/cases", json={
        "problem_description": "unmatched gibberish without any brand or facts"
    })
    assert bad_res.status_code == 422

    # 2. Complete facts succeeds and creates case
    case_payload = {
        "problem_description": "The left audio driver stopped functioning after 45 days.",
        "order_id": "402-8921473-9821401",
        "product_name": "Sony WH-1000XM5 Wireless Headphones",
        "brand": "Sony",
        "seller_name": "Appario Retail Pvt Ltd",
        "amount_inr": 24990.0,
        "purchase_date": "2026-10-15",
        "serial_number": "SN-SONY-XM5-99281",
        "marketplace": "Amazon India",
        "complainant_name": "Test Consumer"
    }
    create_res = client.post("/api/cases", json=case_payload)
    assert create_res.status_code == 200
    case_data = create_res.json()
    assert case_data["id"] > 0
    assert case_data["status"] in ["READY", "READY_FOR_DISPATCH"]
    assert case_data["validation_passed"] is True
    assert case_data["amount_inr"] == 24990.0
    assert "pdf_download_url" in case_data

    # 3. Retrieve single case
    get_res = client.get(f"/api/cases/{case_data['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["order_id"] == "402-8921473-9821401"

    # 4. Download generated PDF packet
    download_res = client.get(f"/api/cases/{case_data['id']}/download-pdf")
    assert download_res.status_code == 200
    assert download_res.headers["content-type"] == "application/pdf"
    assert download_res.content.startswith(b"%PDF-")

    # 5. Retrieve case audit logs
    logs_res = client.get(f"/api/cases/{case_data['id']}/audit-logs")
    assert logs_res.status_code == 200
    assert len(logs_res.json()["logs"]) >= 1

def test_chat_intake_behavior():
    """Verify chat intake routes: accidental damage, match receipt, and intake guidance."""
    # 1. Accidental damage -> Strict abstention
    chat1 = client.post("/api/chat", json={
        "message": "I accidentally dropped the device on concrete and shattered the screen"
    })
    assert chat1.status_code == 200
    data1 = chat1.json()
    assert data1["classification"]["should_abstain"] is True
    assert "Sections 84 and 87" in data1["reply"]

    # 2. Defect with known order keyword -> Auto docket generation
    chat2 = client.post("/api/chat", json={
        "message": "My Sony XM5 headphones left ear audio failed completely"
    })
    assert chat2.status_code == 200
    data2 = chat2.json()
    assert data2["case_ready"] is True
    assert data2["extracted_order"]["amount_inr"] == 24990.0
    assert data2["case_id"] is not None

    # 3. Unmatched defect query -> Conversational guidance
    chat3 = client.post("/api/chat", json={
        "message": "My soundbar won't turn on anymore and the seller rejected replacement"
    })
    assert chat3.status_code == 200
    data3 = chat3.json()
    assert data3["case_ready"] is False
    assert "Rule 6(3)(a)" in data3["reply"]
    assert data3["step_indicator"] == 2
