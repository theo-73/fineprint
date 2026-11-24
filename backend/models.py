"""
Data Models for FinePrint Backend (FastAPI Layer)
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CaseCreateRequest(BaseModel):
    problem_description: str
    order_id: Optional[str] = None
    invoice_text: Optional[str] = None
    product_name: Optional[str] = None
    brand: Optional[str] = None
    seller_name: Optional[str] = None
    amount_inr: Optional[float] = None
    purchase_date: Optional[str] = None
    serial_number: Optional[str] = None
    marketplace: Optional[str] = None
    complainant_name: Optional[str] = "Consumer"

class CaseResponse(BaseModel):
    id: int
    claim_ref: str
    created_at: str
    status: str
    order_id: str
    purchase_date: str
    product_name: str
    brand: str
    seller_name: str
    amount_inr: float
    defect_description: str
    primary_route: str
    statutory_citations: List[str]
    should_abstain: bool
    abstention_reason: Optional[str] = None
    validation_passed: bool
    validation_errors: List[str]
    validation_warnings: List[str]
    whatsapp_text: Optional[str] = None
    nch_text: Optional[str] = None
    pdf_download_url: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_state: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    step_indicator: int = Field(default=1, description="1..6 mapped to Slide 5 Architecture pipeline")
    extracted_order: Optional[Dict[str, Any]] = None
    classification: Optional[Dict[str, Any]] = None
    case_ready: bool = False
    case_id: Optional[int] = None
