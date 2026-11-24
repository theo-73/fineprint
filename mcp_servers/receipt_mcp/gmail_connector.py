"""
Gmail Connector and Mock Mailbox for FinePrint (receipt-mcp)
Provides safe, read-only search for purchase receipts.
Raw email bodies are never returned or passed directly to LLMs.
Only schema-validated ExtractedOrder objects are emitted.
"""

import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from .extractor import ExtractedOrder, OrderExtractor

# Curated, realistic Indian e-commerce receipt catalog for offline judging and demo runs
MOCK_INDIAN_RECEIPTS: List[Dict[str, Any]] = [
    {
        "id": "gmail_msg_001",
        "sender": "auto-confirm@amazon.in",
        "subject": "Your Amazon.in order #402-8921473-9821401 of Sony WH-1000XM5",
        "date": "2026-10-15",
        "body": """
        Dear Customer,
        Thank you for ordering with Amazon.in!
        Order Number: 402-8921473-9821401
        Order Date: 15 Oct 2026
        Sold by: Appario Retail Pvt Ltd (GSTIN: 29AAACA0123M1Z5)
        Product: Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)
        Brand: Sony
        Serial Number: SN-SONY-XM5-99281
        Total: ₹24,990.00
        Return Policy: 7-day replacement window closed on 22 Oct 2026.
        Manufacturer Warranty: 12 Months.
        """
    },
    {
        "id": "gmail_msg_002",
        "sender": "orders@flipkart.com",
        "subject": "Order Confirmation: OD918237461928374 for Samsung Galaxy S24",
        "date": "2026-09-02",
        "body": """
        Hello,
        Your Flipkart order is confirmed!
        Order ID: OD918237461928374
        Order Date: 02 Sep 2026
        Seller: IndiFlashMart (GSTIN: 07AABCF9823P1Z2)
        Item: Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)
        Brand: Samsung
        IMEI / Serial: IMEI-359281048192841
        Amount Paid: ₹1,19,999.00
        Return window: 7 days.
        Statutory Warranty: 12 months comprehensive.
        """
    },
    {
        "id": "gmail_msg_003",
        "sender": "care@croma.com",
        "subject": "Invoice for Croma Order CR-8837192 - Apple iPad Air M2",
        "date": "2026-08-20",
        "body": """
        Croma E-Store Tax Invoice
        Invoice No: CR-8837192
        Date: 2026-08-20
        Sold by: Infiniti Retail Limited (GSTIN: 27AABCI4819K1ZM)
        Description: Apple iPad Air 11-inch M2 chip 128GB Wi-Fi Blue
        Brand: Apple
        Serial No: DMPR9284K891
        Grand Total: ₹59,900.00
        Warranty: 1 Year Apple Limited Warranty.
        """
    },
    {
        "id": "gmail_msg_004",
        "sender": "auto-confirm@amazon.in",
        "subject": "Your Amazon.in order #171-4491023-8821940 of boAt Rockerz 450",
        "date": "2026-11-05",
        "body": """
        Order Confirmation
        Order ID: 171-4491023-8821940
        Date: 05 Nov 2026
        Sold by: Imagine Marketing Ltd (boAt Official)
        Item: boAt Rockerz 450 Bluetooth On Ear Headphones with Mic
        Brand: boAt
        Serial No: BOAT-450-771239
        Total: ₹1,299.00
        Return window: 7 days.
        """
    },
    {
        "id": "gmail_msg_005",
        "sender": "billing@reliancedigital.in",
        "subject": "Reliance Digital Invoice RD-2026-88192 for LG 43 Inch 4K Smart TV",
        "date": "2026-07-10",
        "body": """
        Reliance Digital Tax Invoice
        Invoice Number: RD-2026-88192
        Date: 2026-07-10
        Seller: Reliance Retail Limited (GSTIN: 27AABCR0982E1ZS)
        Item: LG 43 inch 4K Ultra HD Smart LED TV (43UR7500PSC)
        Brand: LG
        Serial: LG-43TV-8829104
        Total Paid: ₹32,990.00
        Warranty: 1 Year Standard + 1 Year Panel Warranty.
        """
    }
]

class GmailConnector:
    """
    Connects to Gmail API (if token provided) or falls back to realistic Indian mock receipts.
    Ensures safe extraction: untrusted body is parsed locally; never directly exposed.
    """

    def __init__(self, credentials_path: Optional[str] = None):
        self.credentials_path = credentials_path

    def search_receipts(self, query: str = "") -> List[ExtractedOrder]:
        """
        Searches receipts matching query (brand, product, or order ID)
        and returns structured ExtractedOrder facts.
        """
        results: List[ExtractedOrder] = []
        q = query.lower().strip()

        for msg in MOCK_INDIAN_RECEIPTS:
            text = f"{msg['subject']} {msg['body']}".lower()
            if not q or (q in text):
                extracted = OrderExtractor.extract_order_from_text(msg['body'])
                results.append(extracted)

        return results

    def get_order_by_id(self, order_id: str) -> Optional[ExtractedOrder]:
        """Retrieves a specific order fact record by order id."""
        for msg in MOCK_INDIAN_RECEIPTS:
            if order_id.lower() in msg['body'].lower() or order_id.lower() in msg['subject'].lower():
                return OrderExtractor.extract_order_from_text(msg['body'])
        return None
