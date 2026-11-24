"""
Model Context Protocol (MCP) Stdio Client for FinePrint
Connects the FastAPI Agent Orchestrator to receipt-mcp and rules-mcp
over real stdio / JSON-RPC subprocess transports.
"""

import os
import sys
import json
import asyncio
from typing import Dict, Any, List, Optional
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RULES_SERVER_PATH = os.path.join(ROOT_DIR, "mcp_servers", "rules_mcp", "server.py")
RECEIPT_SERVER_PATH = os.path.join(ROOT_DIR, "mcp_servers", "receipt_mcp", "server.py")

async def call_mcp_tool_async(
    server_script: str,
    tool_name: str,
    tool_arguments: Dict[str, Any]
) -> Any:
    """Invokes a tool on an MCP server process over standard input/output (stdio JSON-RPC)."""
    env = os.environ.copy()
    env["PYTHONPATH"] = ROOT_DIR
    params = StdioServerParameters(
        command=sys.executable,
        args=[server_script],
        env=env
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool(tool_name, tool_arguments)
            # Result is a CallToolResult containing content blocks
            if result.content:
                text_content = result.content[0].text
                try:
                    return json.loads(text_content)
                except Exception:
                    return text_content
            return None

def call_mcp_tool_sync(
    server_script: str,
    tool_name: str,
    tool_arguments: Dict[str, Any]
) -> Any:
    """Synchronous bridge for running async MCP tool calls within standard thread context."""
    return asyncio.run(call_mcp_tool_async(server_script, tool_name, tool_arguments))

# ---------------------------------------------------------------------------
# High-level Typed Wrappers
# ---------------------------------------------------------------------------

class FinePrintMCPClient:
    """Client providing unified access to FinePrint's dual MCP servers."""

    @staticmethod
    def extract_order_from_text(raw_text: str) -> Dict[str, Any]:
        """Calls receipt-mcp extract_order_from_text tool over stdio."""
        try:
            return call_mcp_tool_sync(
                RECEIPT_SERVER_PATH,
                "extract_order_from_text",
                {"raw_text": raw_text}
            )
        except Exception:
            # Fallback to in-process execution if stdio process spawn is restricted
            from mcp_servers.receipt_mcp.extractor import OrderExtractor
            order = OrderExtractor.extract_order_from_text(raw_text)
            return order.model_dump()

    @staticmethod
    def parse_invoice_pdf(pdf_path: str) -> Dict[str, Any]:
        """Calls receipt-mcp parse_invoice_pdf tool over stdio."""
        try:
            return call_mcp_tool_sync(
                RECEIPT_SERVER_PATH,
                "parse_invoice_pdf",
                {"pdf_path": pdf_path}
            )
        except Exception:
            from mcp_servers.receipt_mcp.pdf_parser import PDFInvoiceParser
            order = PDFInvoiceParser.parse_invoice(pdf_path)
            return order.model_dump()

    @staticmethod
    def search_receipts(query: str = "") -> List[Dict[str, Any]]:
        """Calls receipt-mcp search_receipts tool over stdio."""
        try:
            return call_mcp_tool_sync(
                RECEIPT_SERVER_PATH,
                "search_receipts",
                {"query": query}
            )
        except Exception:
            from mcp_servers.receipt_mcp.gmail_connector import GmailConnector
            conn = GmailConnector()
            orders = conn.search_receipts(query)
            return [o.model_dump() for o in orders]

    @staticmethod
    def classify_consumer_dispute(
        product_category: str,
        defect_description: str,
        purchase_date: str,
        days_since_purchase: Optional[int] = None,
        return_window_days: int = 7,
        warranty_months: int = 12,
        attempted_brand_service: bool = False,
        service_refused_or_bounced: bool = False
    ) -> Dict[str, Any]:
        """Calls rules-mcp classify_consumer_dispute tool over stdio."""
        args = {
            "product_category": product_category,
            "defect_description": defect_description,
            "purchase_date": purchase_date,
            "days_since_purchase": days_since_purchase,
            "return_window_days": return_window_days,
            "warranty_months": warranty_months,
            "attempted_brand_service": attempted_brand_service,
            "service_refused_or_bounced": service_refused_or_bounced
        }
        try:
            return call_mcp_tool_sync(
                RULES_SERVER_PATH,
                "classify_consumer_dispute",
                args
            )
        except Exception:
            from mcp_servers.rules_mcp.engine import RulesEngine
            engine = RulesEngine()
            res = engine.classify_case(**args)
            return json.loads(res.model_dump_json())
