"""
Public 30-Case Benchmark Suite for FinePrint (Track 1 wHACKiest 2026)
Verifies:
- 20 In-Scope Cases: Evaluates Route Accuracy (target >= 90%) and Statutory Citation Validity (100%)
- 10 Out-of-Scope Cases: Evaluates Abstention Rate (target 100% - zero hallucinations, no invented rights)
"""

import pytest
from typing import Dict, Any, List
from mcp_servers.rules_mcp.engine import RulesEngine
from backend.validator import ClaimValidator

# 30 Curated Indian Consumer Dispute Cases
BENCHMARK_CASES: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # 20 IN-SCOPE CASES (Defects, DOA, Bounced Service, Repeat Failure)
    # -------------------------------------------------------------
    {
        "id": "IN-01",
        "description": "Sony WH-1000XM5 right ear cup completely silent after 35 days of normal usage",
        "category": "Electronics",
        "days_since": 35,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-02",
        "description": "Samsung Galaxy S24 Ultra motherboard suddenly died after 60 days, no physical impact",
        "category": "Electronics",
        "days_since": 60,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-03",
        "description": "Delivered yesterday, brand new Asus Vivobook laptop does not turn on at all (DOA)",
        "category": "Electronics",
        "days_since": 2,
        "is_in_scope": True,
        "expected_route": "MARKETPLACE_RETURN_WINDOW",
        "expected_statute": "Rule 6(3)"
    },
    {
        "id": "IN-04",
        "description": "boAt Rockerz 450 headphone buttons unresponsive on day 4 after Flipkart delivery",
        "category": "Electronics",
        "days_since": 4,
        "is_in_scope": True,
        "expected_route": "MARKETPLACE_RETURN_WINDOW",
        "expected_statute": "Rule 6(3)"
    },
    {
        "id": "IN-05",
        "description": "LG 43-inch 4K TV screen shows vertical purple lines after 90 days",
        "category": "Electronics",
        "days_since": 90,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-06",
        "description": "Authorized HP service center refused repair citing lack of spare parts and no ETA",
        "category": "Electronics",
        "days_since": 120,
        "service_refused": True,
        "is_in_scope": True,
        "expected_route": "SELLER_AND_MARKETPLACE_ESCALATION",
        "expected_statute": "Section 86"
    },
    {
        "id": "IN-07",
        "description": "Lenovo service center denied repair claiming seller must handle warranty, support bouncing",
        "category": "Electronics",
        "days_since": 80,
        "service_refused": True,
        "is_in_scope": True,
        "expected_route": "SELLER_AND_MARKETPLACE_ESCALATION",
        "expected_statute": "Section 86"
    },
    {
        "id": "IN-08",
        "description": "OnePlus smartphone motherboard replaced twice by service center, same heating defect occurred a 3rd time",
        "category": "Electronics",
        "days_since": 380,
        "attempted_service": True,
        "is_in_scope": True,
        "expected_route": "NCH_PRE_LITIGATION_ESCALATION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-09",
        "description": "Apple iPad Air M2 charging port loose out of box, delivered 3 days ago",
        "category": "Electronics",
        "days_since": 3,
        "is_in_scope": True,
        "expected_route": "MARKETPLACE_RETURN_WINDOW",
        "expected_statute": "Rule 6(3)"
    },
    {
        "id": "IN-10",
        "description": "Whirlpool refrigerator cooling gas leaked internally at 5 months",
        "category": "Appliances",
        "days_since": 150,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-11",
        "description": "Bosch front load washing machine drum vibration and error code E18 within warranty",
        "category": "Appliances",
        "days_since": 200,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-12",
        "description": "Amazon delivered lower spec 8GB RAM laptop instead of ordered 16GB, return rejected by automated bot",
        "category": "Electronics",
        "days_since": 5,
        "is_in_scope": True,
        "expected_route": "MARKETPLACE_RETURN_WINDOW",
        "expected_statute": "Rule 6(3)"
    },
    {
        "id": "IN-13",
        "description": "Microwave oven magnetron sparked and burnt out at day 25",
        "category": "Appliances",
        "days_since": 25,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-14",
        "description": "Authorized Croma service center technician failed to show up for 3 scheduled visits, unfulfilled job sheet",
        "category": "Electronics",
        "days_since": 100,
        "service_refused": True,
        "is_in_scope": True,
        "expected_route": "SELLER_AND_MARKETPLACE_ESCALATION",
        "expected_statute": "Section 86"
    },
    {
        "id": "IN-15",
        "description": "Noise smartwatch battery drains in 15 minutes after 45 days of use",
        "category": "Electronics",
        "days_since": 45,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-16",
        "description": "Dell gaming monitor develops vertical cluster of dead pixels after 70 days",
        "category": "Electronics",
        "days_since": 70,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-17",
        "description": "Philips mixer grinder motor smelled burning and stopped working after 4 months",
        "category": "Appliances",
        "days_since": 120,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-18",
        "description": "Authorized brand center refused to inspect television claiming user must ship 55-inch TV at own cost contrary to warranty",
        "category": "Electronics",
        "days_since": 110,
        "service_refused": True,
        "is_in_scope": True,
        "expected_route": "SELLER_AND_MARKETPLACE_ESCALATION",
        "expected_statute": "Section 86"
    },
    {
        "id": "IN-19",
        "description": "DJI drone gimbal motor calibration failed repeatedly after 18 days",
        "category": "Electronics",
        "days_since": 18,
        "is_in_scope": True,
        "expected_route": "BRAND_SERVICE_CENTER_INSPECTION",
        "expected_statute": "Section 84"
    },
    {
        "id": "IN-20",
        "description": "Mechanical keyboard switches repeatedly chatter after two official service repairs",
        "category": "Electronics",
        "days_since": 370,
        "attempted_service": True,
        "is_in_scope": True,
        "expected_route": "NCH_PRE_LITIGATION_ESCALATION",
        "expected_statute": "Section 84"
    },

    # -------------------------------------------------------------
    # 10 OUT-OF-SCOPE / ABSTENTION CASES (Target: 100% Abstention)
    # -------------------------------------------------------------
    {
        "id": "OUT-01",
        "description": "I accidentally dropped my phone down the stairs and the glass cracked",
        "category": "Electronics",
        "days_since": 20,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Accidental physical drop"
    },
    {
        "id": "OUT-02",
        "description": "Spilled a full cup of hot coffee over the keyboard and trackpad",
        "category": "Electronics",
        "days_since": 15,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Liquid spill / immersion"
    },
    {
        "id": "OUT-03",
        "description": "I don't like the color of the jacket after 30 days and prefer another shade",
        "category": "Clothing",
        "days_since": 30,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Pure change of mind post return window"
    },
    {
        "id": "OUT-04",
        "description": "Ordered chicken biryani 2 weeks ago and found it too spicy",
        "category": "Food",
        "days_since": 14,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Perishable food out of scope"
    },
    {
        "id": "OUT-05",
        "description": "Tablet was stepped on and screen shattered into pieces",
        "category": "Electronics",
        "days_since": 40,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Severe physical impact"
    },
    {
        "id": "OUT-06",
        "description": "Purchased wireless mouse 3 years ago and now the left click is wearing out",
        "category": "Electronics",
        "days_since": 1100,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Warranty expired (>36 months) with no prior claim"
    },
    {
        "id": "OUT-07",
        "description": "Bought by mistake, no longer need this smartwatch, 25 days have passed",
        "category": "Electronics",
        "days_since": 25,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Change of mind after 7-day window"
    },
    {
        "id": "OUT-08",
        "description": "Fresh milk cartons delivered 10 days ago have gone sour in the fridge",
        "category": "Food",
        "days_since": 10,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Perishable dairy past consumption date"
    },
    {
        "id": "OUT-09",
        "description": "I opened the back cover and soldered custom wires, now device won't boot",
        "category": "Electronics",
        "days_since": 50,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Tampered / self-modified"
    },
    {
        "id": "OUT-10",
        "description": "Submerged smartwatch into swimming pool and water damage ruined motherboard",
        "category": "Electronics",
        "days_since": 30,
        "is_in_scope": False,
        "expected_abstain": True,
        "reason": "Water ingress / liquid damage"
    }
]

def run_full_benchmark_suite() -> Dict[str, Any]:
    engine = RulesEngine()
    validator = ClaimValidator()

    in_scope_total = 0
    in_scope_correct_route = 0
    in_scope_valid_citations = 0

    out_scope_total = 0
    out_scope_correct_abstain = 0

    detailed_results = []

    for case in BENCHMARK_CASES:
        is_in = case["is_in_scope"]
        serv_ref = case.get("service_refused", False)
        att_serv = case.get("attempted_service", False)

        classification = engine.classify_case(
            product_category=case.get("category", "Electronics"),
            defect_description=case["description"],
            purchase_date="2026-08-01",
            days_since_purchase=case.get("days_since", 30),
            return_window_days=7,
            warranty_months=12,
            attempted_brand_service=att_serv,
            service_refused_or_bounced=serv_ref
        )

        if is_in:
            in_scope_total += 1
            # Check route accuracy
            route_match = (classification.recommended_route == case["expected_route"])
            if route_match:
                in_scope_correct_route += 1

            # Check citation validity
            citations = []
            if classification.rule_match:
                citations.append(classification.rule_match.statutory_ref)
            val = validator.validate_claim(
                extracted_facts={"order_id": "ORD-123", "product_name": "Test", "brand": "Brand", "seller_name": "Seller"},
                draft_claim={"order_id": "ORD-123", "product_name": "Test", "brand": "Brand", "seller_name": "Seller"},
                citations_cited=citations,
                evidence_provided=["Invoice", "Defect photo", "Timeline"]
            )
            citation_valid = val.is_valid and len(val.errors) == 0
            if citation_valid:
                in_scope_valid_citations += 1

            detailed_results.append({
                "id": case["id"],
                "type": "IN_SCOPE",
                "description": case["description"],
                "expected_route": case["expected_route"],
                "assigned_route": classification.recommended_route,
                "route_passed": route_match,
                "citation_valid": citation_valid,
                "citations": citations
            })
        else:
            out_scope_total += 1
            abstained = classification.should_abstain
            if abstained:
                out_scope_correct_abstain += 1

            detailed_results.append({
                "id": case["id"],
                "type": "OUT_OF_SCOPE",
                "description": case["description"],
                "expected_abstain": True,
                "abstained": abstained,
                "abstention_reason": classification.abstention_reason,
                "passed": abstained
            })

    route_accuracy = (in_scope_correct_route / in_scope_total) * 100 if in_scope_total else 0
    citation_rate = (in_scope_valid_citations / in_scope_total) * 100 if in_scope_total else 0
    abstention_rate = (out_scope_correct_abstain / out_scope_total) * 100 if out_scope_total else 0

    return {
        "summary": {
            "total_cases": len(BENCHMARK_CASES),
            "in_scope_cases": in_scope_total,
            "in_scope_route_accuracy_pct": round(route_accuracy, 1),
            "in_scope_target_met": route_accuracy >= 90.0,
            "citation_validity_pct": round(citation_rate, 1),
            "out_of_scope_cases": out_scope_total,
            "abstention_rate_pct": round(abstention_rate, 1),
            "abstention_target_met": abstention_rate == 100.0,
            "overall_benchmark_passed": (route_accuracy >= 90.0 and abstention_rate == 100.0 and citation_rate == 100.0)
        },
        "cases": detailed_results
    }

# PyTest Integration
def test_public_30_case_benchmark():
    results = run_full_benchmark_suite()
    summary = results["summary"]
    
    # Assert in-scope route accuracy >= 90%
    assert summary["in_scope_route_accuracy_pct"] >= 90.0, f"Route accuracy {summary['in_scope_route_accuracy_pct']}% fell below 90% target"
    # Assert citation validity 100%
    assert summary["citation_validity_pct"] == 100.0, f"Citation validity {summary['citation_validity_pct']}% is not 100%"
    # Assert strict abstention 100%
    assert summary["abstention_rate_pct"] == 100.0, f"Abstention rate {summary['abstention_rate_pct']}% is not 100%"

if __name__ == "__main__":
    import json
    res = run_full_benchmark_suite()
    print(json.dumps(res["summary"], indent=2))
