"""
FinePrint Rules MCP Server (rules-mcp)
Exposes codified statutory consumer protection rules and case classification tools via MCP stdio.
"""

import sys
import json
from typing import Optional, Dict, Any, List
from mcp.server.mcpserver import MCPServer
from engine import RulesEngine, CaseClassification

server = MCPServer("fineprint-rules-mcp")
engine = RulesEngine()

@server.tool()
def classify_consumer_dispute(
    product_category: str,
    defect_description: str,
    purchase_date: str,
    days_since_purchase: Optional[int] = None,
    return_window_days: int = 7,
    warranty_months: int = 12,
    attempted_brand_service: bool = False,
    service_refused_or_bounced: bool = False,
    is_accidental_physical_damage: bool = False,
    is_pure_change_of_mind: bool = False,
    is_perishable_food: bool = False
) -> str:
    """
    Classifies an Indian consumer dispute under CPA 2019 and E-Commerce Rules 2020.
    Returns structured JSON with route, citations, evidence checklist, or explicit abstention.
    """
    result = engine.classify_case(
        product_category=product_category,
        defect_description=defect_description,
        purchase_date=purchase_date,
        days_since_purchase=days_since_purchase,
        return_window_days=return_window_days,
        warranty_months=warranty_months,
        attempted_brand_service=attempted_brand_service,
        service_refused_or_bounced=service_refused_or_bounced,
        is_accidental_physical_damage=is_accidental_physical_damage,
        is_pure_change_of_mind=is_pure_change_of_mind,
        is_perishable_food=is_perishable_food
    )
    return result.model_dump_json(indent=2)

@server.tool()
def get_statutory_citation(rule_id: str) -> str:
    """
    Retrieves full gazette citation and statutory text for a given rule ID.
    Example IDs: IN_ECOM_DEFECT_NO_REFUSAL, IN_CPA_PRODUCT_LIABILITY_MFR, IN_CPA_PRODUCT_LIABILITY_SELLER
    """
    rule = engine.rules.get(rule_id)
    if not rule:
        return json.dumps({
            "error": "Rule not found",
            "rule_id": rule_id,
            "abstain": True
        })
    return json.dumps(rule, indent=2)

@server.tool()
def check_claim_deadlines(
    purchase_date: str,
    return_window_days: int = 7,
    warranty_months: int = 12
) -> str:
    """
    Calculates statutory deadlines, grievance SLA windows, and warranty expiration dates.
    """
    deadlines = engine.check_deadline(purchase_date, return_window_days, warranty_months)
    return json.dumps(deadlines, indent=2)

@server.tool()
def list_available_rules() -> str:
    """
    Lists all active codified Indian consumer protection rules and their statutory references.
    """
    summary = []
    for r_id, r in engine.rules.items():
        summary.append({
            "id": r_id,
            "statutory_ref": r.get("statutory_ref"),
            "summary": r.get("summary"),
            "primary_route": r.get("primary_route"),
            "legal_deadline_days": r.get("legal_deadline_days")
        })
    return json.dumps(summary, indent=2)

if __name__ == "__main__":
    # Runs the MCP server via stdio transport
    server.run(transport="stdio")
