"""
Local SQLite Database for FinePrint
Stores cases, evidence files, and step-by-step audit logs inside local trust boundary.
"""

import sqlite3
import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from contextlib import contextmanager

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fineprint.db"))

@contextmanager
def db_session():
    """Provides a managed SQLite connection context with automatic commit/rollback and closure."""
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    with db_session() as conn:
        cursor = conn.cursor()

        # Cases Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            claim_ref TEXT UNIQUE NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL,
            order_id TEXT,
            purchase_date TEXT,
            product_name TEXT,
            brand TEXT,
            seller_name TEXT,
            amount_inr REAL,
            marketplace TEXT,
            serial_number TEXT,
            defect_description TEXT,
            primary_route TEXT,
            statutory_citations TEXT,
            should_abstain INTEGER,
            abstention_reason TEXT,
            validation_passed INTEGER,
            validation_errors TEXT,
            validation_warnings TEXT,
            packet_pdf_path TEXT,
            whatsapp_text TEXT,
            nch_text TEXT
        );
        """)

        # Evidence Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS evidence (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            uploaded_at TEXT NOT NULL,
            FOREIGN KEY (case_id) REFERENCES cases(id)
        );
        """)

        # Audit Log Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            timestamp TEXT NOT NULL,
            step_name TEXT NOT NULL,
            event TEXT NOT NULL,
            details TEXT
        );
        """)

def log_audit_event(step_name: str, event: str, details: Dict[str, Any], case_id: Optional[int] = None):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audit_logs (case_id, timestamp, step_name, event, details)
            VALUES (?, ?, ?, ?, ?)
        """, (
            case_id,
            datetime.now().isoformat(),
            step_name,
            event,
            json.dumps(details)
        ))

def get_audit_logs(case_id: Optional[int] = None) -> List[Dict[str, Any]]:
    with db_session() as conn:
        cursor = conn.cursor()
        if case_id is not None:
            cursor.execute("SELECT * FROM audit_logs WHERE case_id = ? ORDER BY id ASC", (case_id,))
        else:
            cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100")
        rows = cursor.fetchall()
        results = []
        for r in rows:
            d = dict(r)
            try:
                d["details"] = json.loads(d["details"] or "{}")
            except Exception:
                pass
            results.append(d)
        return results

def insert_evidence(case_id: int, filename: str, file_type: str, file_path: str) -> int:
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO evidence (case_id, filename, file_type, file_path, uploaded_at)
            VALUES (?, ?, ?, ?, ?)
        """, (case_id, filename, file_type, file_path, datetime.now().isoformat()))
        return cursor.lastrowid

def get_evidence_by_case(case_id: int) -> List[Dict[str, Any]]:
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM evidence WHERE case_id = ? ORDER BY id ASC", (case_id,))
        return [dict(r) for r in cursor.fetchall()]

def insert_case(case_data: Dict[str, Any]) -> int:
    claim_ref = case_data.get("claim_ref", f"FP-IN-{datetime.now().strftime('%Y%m%d%H%M%S')}")
    created_at = case_data.get("created_at") or datetime.now().isoformat()
    case_data["created_at"] = created_at
    citations_json = json.dumps(case_data.get("statutory_citations", []))
    errors_json = json.dumps(case_data.get("validation_errors", []))
    warnings_json = json.dumps(case_data.get("validation_warnings", []))

    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO cases (
                claim_ref, created_at, status, order_id, purchase_date,
                product_name, brand, seller_name, amount_inr, marketplace,
                serial_number, defect_description, primary_route, statutory_citations,
                should_abstain, abstention_reason, validation_passed, validation_errors,
                validation_warnings, packet_pdf_path, whatsapp_text, nch_text
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            claim_ref,
            created_at,
            case_data.get("status", "READY"),
            case_data.get("order_id"),
            case_data.get("purchase_date"),
            case_data.get("product_name"),
            case_data.get("brand"),
            case_data.get("seller_name"),
            case_data.get("amount_inr", 0.0),
            case_data.get("marketplace", "Direct"),
            case_data.get("serial_number"),
            case_data.get("defect_description"),
            case_data.get("primary_route"),
            citations_json,
            1 if case_data.get("should_abstain") else 0,
            case_data.get("abstention_reason"),
            1 if case_data.get("validation_passed") else 0,
            errors_json,
            warnings_json,
            case_data.get("packet_pdf_path"),
            case_data.get("whatsapp_text"),
            case_data.get("nch_text")
        ))
        case_id = cursor.lastrowid

    # Automatically persist associated evidence documents
    if case_data.get("invoice_pdf_path") and os.path.exists(case_data.get("invoice_pdf_path")):
        inv_path = case_data["invoice_pdf_path"]
        insert_evidence(case_id, os.path.basename(inv_path), "INVOICE_PDF", inv_path)

    if case_data.get("packet_pdf_path") and os.path.exists(case_data.get("packet_pdf_path")):
        pkt_path = case_data["packet_pdf_path"]
        insert_evidence(case_id, os.path.basename(pkt_path), "CLAIM_DOCKET_PDF", pkt_path)

    log_audit_event("6_OUTPUT", "Case created and persisted in SQLite", {"case_id": case_id, "claim_ref": claim_ref}, case_id)
    return case_id

def get_case(case_id: int) -> Optional[Dict[str, Any]]:
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
        row = cursor.fetchone()

        if not row:
            return None

        d = dict(row)
        d["statutory_citations"] = json.loads(d["statutory_citations"] or "[]")
        d["validation_errors"] = json.loads(d["validation_errors"] or "[]")
        d["validation_warnings"] = json.loads(d["validation_warnings"] or "[]")
        d["should_abstain"] = bool(d["should_abstain"])
        d["validation_passed"] = bool(d["validation_passed"])
        d["evidence"] = get_evidence_by_case(case_id)
        return d

def list_cases() -> List[Dict[str, Any]]:
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cases ORDER BY id DESC")
        rows = cursor.fetchall()

        results = []
        for r in rows:
            d = dict(r)
            d["statutory_citations"] = json.loads(d["statutory_citations"] or "[]")
            d["validation_errors"] = json.loads(d["validation_errors"] or "[]")
            d["validation_warnings"] = json.loads(d["validation_warnings"] or "[]")
            d["should_abstain"] = bool(d["should_abstain"])
            d["validation_passed"] = bool(d["validation_passed"])
            d["evidence"] = get_evidence_by_case(d["id"])
            results.append(d)
        return results

# Initialize tables immediately on import
init_db()
