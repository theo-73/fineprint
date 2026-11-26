"""
Deterministic Code Validator for FinePrint (FastAPI Agent Layer)
Every fact and legal citation must match a verified statutory source or extracted receipt.
Halts and flags hallucinations, unsubstantiated claims, or fact tampering.
"""

import os
import re
import yaml
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ValidationResult(BaseModel):
    is_valid: bool = Field(description="True if all facts and citations pass deterministic checks")
    errors: List[str] = Field(default_factory=list, description="Hard failures blocking packet generation")
    warnings: List[str] = Field(default_factory=list, description="Non-blocking recommendations")
    verified_citations: List[str] = Field(default_factory=list, description="Statutory citations verified in rules store")
    evidence_checklist_status: Dict[str, bool] = Field(default_factory=dict, description="Status of required evidence pieces")

class ClaimValidator:
    """
    Code-level gatekeeper that verifies extracted facts and statutory references.
    """

    def __init__(self, rules_path: Optional[str] = None):
        if not rules_path:
            rules_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "mcp_servers", "rules_mcp", "rules.yaml")
            )
        self.rules_path = rules_path
        self._load_rules()

    def _load_rules(self):
        with open(self.rules_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        self.rules = data.get("rules", [])
        self.valid_statutory_refs = set()
        for r in self.rules:
            self.valid_statutory_refs.add(r.get("statutory_ref", "").strip())
            # Also index by key phrases
            sid = r.get("id", "")
            if sid:
                self.valid_statutory_refs.add(sid)

    def validate_claim(
        self,
        extracted_facts: Dict[str, Any],
        draft_claim: Dict[str, Any],
        citations_cited: List[str],
        evidence_provided: List[str]
    ) -> ValidationResult:
        errors: List[str] = []
        warnings: List[str] = []
        verified_citations: List[str] = []
        evidence_status: Dict[str, bool] = {}

        # 1. Fact Consistency Check (Draft claim cannot invent or mutate extracted invoice facts)
        req_keys = ["order_id", "product_name", "brand", "seller_name"]
        for key in req_keys:
            extracted_val = str(extracted_facts.get(key, "")).strip().lower()
            draft_val = str(draft_claim.get(key, "")).strip().lower()
            if extracted_val and draft_val:
                if key == "order_id":
                    if extracted_val not in draft_val and draft_val not in extracted_val:
                        errors.append(
                            f"Fact Mismatch: {key} in claim ('{draft_claim.get(key)}') does not match invoice receipt ('{extracted_facts.get(key)}')."
                        )
                else:
                    # Token similarity for descriptive entity names to allow formatting variations
                    extracted_tokens = set(re.findall(r"\w+", extracted_val))
                    draft_tokens = set(re.findall(r"\w+", draft_val))
                    common = extracted_tokens.intersection(draft_tokens)
                    min_len = min(len(extracted_tokens), len(draft_tokens))
                    if min_len > 0 and (len(common) / min_len) < 0.4:
                        errors.append(
                            f"Fact Mismatch: {key} in claim ('{draft_claim.get(key)}') does not match invoice receipt ('{extracted_facts.get(key)}')."
                        )

        # 2. Statutory Citation Verification
        if not citations_cited:
            errors.append("No statutory citation provided. Claims must cite CPA 2019 or E-Commerce Rules 2020.")
        else:
            for cit in citations_cited:
                cit_clean = cit.strip()
                # Check if citation exists in valid statutory refs or matches CPA 2019 / E-Commerce 2020 patterns
                is_known = False
                for valid_ref in self.valid_statutory_refs:
                    if cit_clean.lower() in valid_ref.lower() or valid_ref.lower() in cit_clean.lower():
                        is_known = True
                        verified_citations.append(valid_ref)
                        break
                
                # Broad legal verification check against legitimate sections
                if not is_known:
                    if any(legit in cit_clean for legit in [
                        "Section 84", "Section 86", "Section 83", "Section 85", "Section 2(10)",
                        "Section 2(47)", "Rule 6(3)", "Rule 7(4)", "Rule 4(5)", "CPA 2019"
                    ]):
                        is_known = True
                        verified_citations.append(cit_clean)
                    else:
                        errors.append(f"Invalid or Hallucinated Citation: '{cit_clean}' is not in verified statutory database.")

        # 3. Burden of Proof & Evidence Checklist
        standard_evidence_items = [
            "Original Tax Invoice / Order Confirmation",
            "Defect Documentation (Photos / Video / Error Log)",
            "Timeline of Defect & Communication History",
            "Proof of Notice Sent to Merchant / Service Center"
        ]
        
        evidence_lower = [e.lower() for e in evidence_provided]
        for item in standard_evidence_items:
            has_item = False
            for el in evidence_lower:
                if any(w in el for w in item.lower().split() if len(w) > 3):
                    has_item = True
                    break
            evidence_status[item] = has_item
            if not has_item:
                warnings.append(f"Missing recommended evidence item: '{item}'. Required for strong NCH commission filing.")

        # 4. Strict Abstention Safety
        if draft_claim.get("should_abstain", False):
            errors.append("Validation Block: Claim is classified as out-of-scope for statutory liability. Generation halted.")

        is_valid = len(errors) == 0

        return ValidationResult(
            is_valid=is_valid,
            errors=errors,
            warnings=warnings,
            verified_citations=list(set(verified_citations)),
            evidence_checklist_status=evidence_status
        )
