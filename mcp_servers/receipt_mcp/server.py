"""
Receipt MCP Server for FinePrint (receipt-mcp)
Securely parses untrusted invoice text and emails into strictly-typed facts.
Mitigates Prompt Injection: Raw email/PDF bodies are parsed inside the local sandbox;
only validated ExtractedOrder JSON is exposed.
"""

import sys
import os
import json
from typing import List, Dict, Any, Optional

# Add parent directory to path for local imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from mcp.server.mcpserver import MCPServer
from mcp_servers.receipt_mcp.extractor import OrderExtractor, ExtractedOrder
from mcp_servers.receipt_mcp.pdf_parser import PDFInvoiceParser, generate_sample_invoice
from mcp_servers.receipt_mcp.gmail_connector import GmailConnector

server = MCPServer("receipt-mcp")
connector = GmailConnector()

@server.tool()
def search_receipts(query: str = "") -> str:
    """
    Search purchase receipts in the user's inbox by product name, brand, or order ID.
    Returns schema-validated JSON list of extracted orders.
    """
    orders = connector.search_receipts(query)
    return json.dumps([o.model_dump() for o in orders], indent=2)

@server.tool()
def extract_order_from_text(raw_text: str) -> str:
    """
    Extract structured order facts from raw receipt text or email snippet.
    Strictly sanitizes text and converts to ExtractedOrder JSON.
    """
    order = OrderExtractor.extract_order_from_text(raw_text)
    return json.dumps(order.model_dump(), indent=2)

@server.tool()
def parse_invoice_pdf(pdf_path: str) -> str:
    """
    Extracts text from a local PDF invoice, sanitizes it, and returns typed ExtractedOrder JSON.
    """
    order = PDFInvoiceParser.parse_invoice(pdf_path)
    return json.dumps(order.model_dump(), indent=2)

@server.tool()
def generate_demo_invoice(filename: str = "sample_amazon_invoice.pdf") -> str:
    """
    Generates a realistic Indian e-commerce tax invoice PDF for testing.
    """
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sample_invoices"))
    output_path = os.path.join(output_dir, filename)
    path = generate_sample_invoice(output_path)
    return json.dumps({"status": "generated", "path": path}, indent=2)

def main():
    import anyio
    anyio.run(server.run_stdio_async)

if __name__ == "__main__":
    main()
