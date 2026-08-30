"""
NetSage AI - Human Review Management System
Manages human oversight workflow (Accepted, Edited, Rejected) and logs AI accuracy metrics.
"""

import csv
import json
from typing import List, Dict, Any

class HumanReviewSystem:
    """
    Tracks and records human oversight decisions for AI network diagnoses.
    Enforces mandatory safety rule: A human reviewer must approve or correct every diagnosis.
    """

    def __init__(self):
        self.reviews = []

    def add_review(
        self,
        case_id: str,
        concept: str,
        ai_diagnosis: Dict[str, Any],
        decision: str,  # Accepted | Edited | Rejected
        reviewer_name: str,
        reviewer_notes: str,
        corrected_diagnosis: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Record a human review for an AI diagnosis.
        """
        if decision not in ["Accepted", "Edited", "Rejected"]:
            raise ValueError("Decision must be 'Accepted', 'Edited', or 'Rejected'.")

        review_entry = {
            "case_id": case_id,
            "concept": concept,
            "ai_root_cause": ai_diagnosis.get("root_cause", ""),
            "ai_confidence": ai_diagnosis.get("confidence", {}).get("level", "Medium"),
            "decision": decision,
            "reviewer_name": reviewer_name,
            "reviewer_notes": reviewer_notes,
            "final_root_cause": corrected_diagnosis.get("root_cause", "") if corrected_diagnosis else ai_diagnosis.get("root_cause", "")
        }
        self.reviews.append(review_entry)
        return review_entry

    def calculate_agreement_metrics(self) -> Dict[str, Any]:
        """
        Computes overall AI vs Human agreement metrics.
        """
        total = len(self.reviews)
        if total == 0:
            return {"total_cases": 0, "accepted_rate": 0.0, "edited_rate": 0.0, "rejected_rate": 0.0}

        accepted = sum(1 for r in self.reviews if r["decision"] == "Accepted")
        edited = sum(1 for r in self.reviews if r["decision"] == "Edited")
        rejected = sum(1 for r in self.reviews if r["decision"] == "Rejected")

        return {
            "total_cases": total,
            "accepted_count": accepted,
            "edited_count": edited,
            "rejected_count": rejected,
            "agreement_rate_pct": round((accepted / total) * 100, 1),
            "human_correction_pct": round(((edited + rejected) / total) * 100, 1)
        }

if __name__ == "__main__":
    system = HumanReviewSystem()
    system.add_review("NET-001", "VLAN", {"root_cause": "Trunk allowed VLAN 20 missing"}, "Accepted", "Senior NetEng", "AI correctly identified missing VLAN on trunk.")
    metrics = system.calculate_agreement_metrics()
    print("Human Oversight Metrics:", metrics)
