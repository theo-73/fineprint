"""
Rules Engine for FinePrint (rules-mcp)
Codified Indian Consumer Protection Rules & Statutory Escalation Matcher
"""

import os
import re
import yaml
from datetime import datetime, date
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class RuleMatch(BaseModel):
    rule_id: str
    statutory_ref: str
    summary: str
    statutory_text: str
    route: str
    statutory_framework: str
    evidence_required: List[str]
    days_to_escalate: int = 30
    acknowledgment_sla_hours: Optional[int] = 48
    confidence: float = 1.0

class CaseClassification(BaseModel):
    is_in_scope: bool
    should_abstain: bool
    abstention_reason: Optional[str] = None
    recommended_route: str
    rule_match: Optional[RuleMatch] = None
    route_explanation: str
    suggested_destinations: List[str]
    evidence_checklist: List[str]
    deadlines: Dict[str, Any]

class RulesEngine:
    def __init__(self, yaml_path: Optional[str] = None):
        if not yaml_path:
            yaml_path = os.path.join(os.path.dirname(__file__), "rules.yaml")
        self.yaml_path = yaml_path
        self._load_rules()

    def _load_rules(self):
        with open(self.yaml_path, "r", encoding="utf-8") as f:
            self.data = yaml.safe_load(f)
        self.rules = {r["id"]: r for r in self.data.get("rules", [])}
        self.abstentions = self.data.get("abstention_triggers", [])

    def check_deadline(
        self,
        purchase_date_str: str,
        return_window_days: int = 7,
        warranty_months: int = 12
    ) -> Dict[str, Any]:
        """Calculates contractual and statutory deadlines."""
        p_date = None
        date_formats = [
            "%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y",
            "%d %b %Y", "%d %B %Y", "%b %d, %Y", "%B %d, %Y",
            "%d %b, %Y", "%d %B, %Y"
        ]
        clean_date_str = str(purchase_date_str).strip()
        for fmt in date_formats:
            try:
                p_date = datetime.strptime(clean_date_str, fmt).date()
                break
            except ValueError:
                continue
        if not p_date:
            p_date = date.today()

        today = date.today()
        days_since_purchase = (today - p_date).days

        return_window_active = days_since_purchase <= return_window_days
        warranty_days = warranty_months * 30
        warranty_active = days_since_purchase <= warranty_days

        return {
            "purchase_date": p_date.isoformat(),
            "days_since_purchase": days_since_purchase,
            "return_window_days": return_window_days,
            "return_window_active": return_window_active,
            "warranty_months": warranty_months,
            "warranty_active": warranty_active,
            "statutory_grievance_sla_days": 30,
            "acknowledgment_sla_hours": 48
        }

    def classify_case(
        self,
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
        is_perishable_food: bool = False,
        is_tampered: bool = False
    ) -> CaseClassification:
        """
        Classifies an Indian consumer dispute deterministically.
        Strictly abstains if user caused damage, food expired, or pure change of mind.
        """
        deadline_info = self.check_deadline(purchase_date, return_window_days, warranty_months)
        days = days_since_purchase if days_since_purchase is not None else deadline_info["days_since_purchase"]
        deadline_info["days_since_purchase"] = days
        deadline_info["return_window_active"] = (days <= return_window_days)
        deadline_info["warranty_active"] = (days <= (warranty_months * 30))
        
        desc_lower = defect_description.lower()

        # Keyword checks for user-caused accidental damage
        accidental_patterns = [
            r"\bdropp(ed|ing)\b", r"\bfell\b", r"\bcracked\b", r"\bshattered\b", 
            r"\bspill(ed)?\b", r"\bliquid\b", r"\bwater damage\b", r"\bphysical damage\b",
            r"\bhammer\b", r"\bstepped on\b", r"\bran over\b", r"\bhit the floor\b"
        ]
        if not is_accidental_physical_damage and any(re.search(p, desc_lower) for p in accidental_patterns):
            is_accidental_physical_damage = True

        # Keyword checks for tampering / unauthorized repair
        tamper_patterns = [
            r"\btamper(ed)?\b", r"\bsolder(ed|ing)?\b", r"\bcustom wire(s)?\b",
            r"\bopened (the )?back\b", r"\bbroken seal\b", r"\bthird party repair\b"
        ]
        if not is_tampered and any(re.search(p, desc_lower) for p in tamper_patterns):
            is_tampered = True

        # Keyword checks for pure change of mind
        change_of_mind_patterns = [
            r"\bdon'?t like\b", r"\bchange(d)? (my|our) mind\b", r"\bbought by mistake\b",
            r"\bno longer (need|needed|want|wanted)\b", r"\bunwanted gift\b",
            r"\bprefer another (color|model|brand)\b", r"\bcolor doesn'?t match\b"
        ]
        if not is_pure_change_of_mind and any(re.search(p, desc_lower) for p in change_of_mind_patterns):
            is_pure_change_of_mind = True

        # Keyword checks for perishable food / grocery
        food_patterns = [
            r"\bfood\b", r"\bgrocery\b", r"\bpizza\b", r"\bbiryani\b", r"\bburger\b",
            r"\brotten\b", r"\bstale\b", r"\bspoil(ed)?\b", r"\bmilk\b", r"\bfruit\b"
        ]
        if not is_perishable_food and (product_category.lower() in ["food", "grocery", "perishable"] or any(re.search(p, desc_lower) for p in food_patterns)):
            is_perishable_food = True

        # 1. EVALUATE ABSTENTION CRITERIA FIRST (Zero Hallucinations)
        if is_tampered:
            return CaseClassification(
                is_in_scope=False,
                should_abstain=True,
                abstention_reason="Unauthorized self-modification, soldering, or broken warranty seal voids manufacturer and seller liability under Section 87 of CPA 2019.",
                recommended_route="ABSTAIN_WARRANTY_VOID_BY_TAMPER",
                rule_match=None,
                route_explanation="Statutory product liability does not apply to consumer-tampered products under Section 87.",
                suggested_destinations=["Third-party independent electronics repair"],
                evidence_checklist=["None applicable"],
                deadlines=deadline_info
            )

        if is_pure_change_of_mind:
            return CaseClassification(
                is_in_scope=False,
                should_abstain=True,
                abstention_reason="Statutory product liability applies to defects and non-conformities; there is no statutory right to return a non-defective product after the contractual return window has elapsed.",
                recommended_route="ABSTAIN_NO_DEFECT_ASSERTED",
                rule_match=None,
                route_explanation="Under Section 2(47) of CPA 2019, buyers cannot force returns for change-of-mind once the agreed return window closes.",
                suggested_destinations=["No statutory escalation viable. You may request merchant goodwill."],
                evidence_checklist=["None applicable"],
                deadlines=deadline_info
            )

        if is_accidental_physical_damage:
            return CaseClassification(
                is_in_scope=False,
                should_abstain=True,
                abstention_reason="Physical accidental breakage or liquid immersion is excluded from statutory manufacturing defect claims under Section 84 of CPA 2019 unless you purchased explicit Accidental Damage Protection.",
                recommended_route="ABSTAIN_WARRANTY_EXCLUDED",
                rule_match=None,
                route_explanation="Manufacturing defect claims require proving an inherent product fault, not user-induced physical drops or liquid ingress.",
                suggested_destinations=["Paid brand repair center or third-party repair."],
                evidence_checklist=["Repair estimate from brand service centre"],
                deadlines=deadline_info
            )

        if is_perishable_food:
            return CaseClassification(
                is_in_scope=False,
                should_abstain=True,
                abstention_reason="Perishable food orders cannot be disputed under consumer electronics product liability weeks after receipt without immediate spoilage timestamps.",
                recommended_route="ABSTAIN_PERISHABLE_OUT_OF_SCOPE",
                rule_match=None,
                route_explanation="Food delivery disputes require unboxing photos and immediate raising with platform support under FSSAI / NCH guidelines.",
                suggested_destinations=["National Consumer Helpline (NCH 1915)", "FSSAI Consumer Portal"],
                evidence_checklist=["Unboxing photo / FSSAI complaint number"],
                deadlines=deadline_info
            )

        # 2. IN-SCOPE STATUTORY ROUTING

        # Scenario A: Within 7-10 days platform return window
        if deadline_info["return_window_active"]:
            rule = self.rules["IN_ECOM_DEFECT_NO_REFUSAL"]
            rm = RuleMatch(
                rule_id=rule["id"],
                statutory_ref=rule["statutory_ref"],
                summary=rule["summary"],
                statutory_text=rule["statutory_text"],
                route="MARKETPLACE_REPLACEMENT_OR_REFUND",
                statutory_framework="Consumer Protection (E-Commerce) Rules, 2020",
                evidence_required=rule["evidence_required"],
                days_to_escalate=14,
                acknowledgment_sla_hours=rule.get("acknowledgment_sla_hours", 48)
            )
            return CaseClassification(
                is_in_scope=True,
                should_abstain=False,
                recommended_route="MARKETPLACE_RETURN_WINDOW",
                rule_match=rm,
                route_explanation="You are within the platform return period. Under Rule 6(3)(a) of the E-Commerce Rules, 2020, the platform/seller cannot refuse a replacement or refund for defective goods.",
                suggested_destinations=["Marketplace App Return Section", "Grievance Officer (48h SLA)"],
                evidence_checklist=rule["evidence_required"],
                deadlines=deadline_info
            )

        # Scenario B: Repeat failure during earlier repair period / inherent recurring defect
        if attempted_brand_service or "repeatedly" in desc_lower or "3rd time" in desc_lower:
            rule = self.rules["IN_DEFECT_AFTER_REPAIR_FAILURE"]
            rm = RuleMatch(
                rule_id=rule["id"],
                statutory_ref=rule["statutory_ref"],
                summary=rule["summary"],
                statutory_text=rule["statutory_text"],
                route="NCH_PRE_LITIGATION_ESCALATION",
                statutory_framework="Consumer Protection Act, 2019 (Section 84 & 2(10))",
                evidence_required=rule["evidence_required"],
                days_to_escalate=30
            )
            return CaseClassification(
                is_in_scope=True,
                should_abstain=False,
                recommended_route="NCH_PRE_LITIGATION_ESCALATION",
                rule_match=rm,
                route_explanation="Multiple documented failures of the same component establish an inherent manufacturing defect existing since inception.",
                suggested_destinations=[
                    "National Consumer Helpline (consumerhelpline.gov.in)",
                    "Brand Legal Nodal Officer",
                    "e-Jagriti Consumer Commission Docket"
                ],
                evidence_checklist=rule["evidence_required"],
                deadlines=deadline_info
            )

        # Scenario C: Beyond return window, but service centre refused, lacks parts, or declared unfixable
        if service_refused_or_bounced:
            rule = self.rules["IN_CPA_PRODUCT_LIABILITY_SELLER"]
            rm = RuleMatch(
                rule_id=rule["id"],
                statutory_ref=rule["statutory_ref"],
                summary=rule["summary"],
                statutory_text=rule["statutory_text"],
                route="SELLER_AND_MARKETPLACE_PRODUCT_LIABILITY",
                statutory_framework="Consumer Protection Act, 2019 (Chapter VI)",
                evidence_required=rule["evidence_required"],
                days_to_escalate=30,
                acknowledgment_sla_hours=48
            )
            return CaseClassification(
                is_in_scope=True,
                should_abstain=False,
                recommended_route="SELLER_AND_MARKETPLACE_ESCALATION",
                rule_match=rm,
                route_explanation="Since the authorized service centre failed to repair or supply parts, liability falls back upon the Seller and Marketplace Grievance Officer under Section 86 of CPA 2019.",
                suggested_destinations=[
                    "Marketplace Grievance Officer (Rule 4(5) 48h SLA)",
                    "Seller Legal Notice / Demand Letter",
                    "National Consumer Helpline (NCH Portal)"
                ],
                evidence_checklist=rule["evidence_required"],
                deadlines=deadline_info
            )

        # Scenario D: Post-return window, within 1-year standard manufacturer warranty
        if deadline_info["warranty_active"]:
            rule = self.rules["IN_CPA_PRODUCT_LIABILITY_MFR"]
            rm = RuleMatch(
                rule_id=rule["id"],
                statutory_ref=rule["statutory_ref"],
                summary=rule["summary"],
                statutory_text=rule["statutory_text"],
                route="BRAND_MANUFACTURER_WARRANTY",
                statutory_framework="Consumer Protection Act, 2019 (Section 84)",
                evidence_required=rule["evidence_required"],
                days_to_escalate=30,
                acknowledgment_sla_hours=48
            )
            return CaseClassification(
                is_in_scope=True,
                should_abstain=False,
                recommended_route="BRAND_SERVICE_CENTER_INSPECTION",
                rule_match=rm,
                route_explanation="The 7-day platform window has passed, but the product is within its statutory 1-year manufacturer warranty. Under Section 84 of CPA 2019, the manufacturer is strictly liable for defects.",
                suggested_destinations=[
                    "Authorized Brand Service Centre (Free repair/replacement)",
                    "Brand Escalation Desk / Nodal Officer",
                    "National Consumer Helpline (NCH 1915) if service centre fails to honor"
                ],
                evidence_checklist=rule["evidence_required"],
                deadlines=deadline_info
            )

        # Scenario E: Completely expired warranty without prior defect report
        return CaseClassification(
            is_in_scope=False,
            should_abstain=True,
            abstention_reason=f"The product was purchased {days} days ago, exceeding both the return window and the standard manufacturer warranty period of {warranty_months} months with no recorded prior service claims.",
            recommended_route="ABSTAIN_WARRANTY_EXPIRED",
            rule_match=None,
            route_explanation="Statutory warranty coverage has lapsed. You may consult an independent repair provider or file a general grievance on NCH.",
            suggested_destinations=["National Consumer Helpline (1915 / consumerhelpline.gov.in)"],
            evidence_checklist=["Invoice with date of purchase"],
            deadlines=deadline_info
        )

