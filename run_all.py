"""
NetSage AI - Master Workflow Runner
Executes full troubleshooting pipeline: data validation, rule checking, AI diagnosis, human review logging, and dashboard generation.
"""

import sys
import csv
from rule_checker import NetworkRuleChecker
from ai_diagnoser import AIDiagnoser
from review_system import HumanReviewSystem
from dashboard import run_dashboard_analytics

def main():
    print("[NetSage AI] Initializing master troubleshooting pipeline...")

    # Step 1: Validate cases.csv
    try:
        with open("cases.csv", "r", encoding="utf-8") as f:
            cases = list(csv.DictReader(f))
        print(f"[SUCCESS] Loaded {len(cases)} cases from cases.csv.")
    except Exception as e:
        print(f"[ERROR] Failed to load cases.csv: {e}")
        sys.exit(1)

    # Step 2: Run Rule Checker
    checker = NetworkRuleChecker()
    rule_hits = sum(1 for c in cases if checker.run_all_checks(c["show_outputs"], c["topology_note"]))
    print(f"[SUCCESS] Executed deterministic rule checks. {rule_hits} cases flagged config warnings.")

    # Step 3: Run AI Diagnosis Engine
    diagnoser = AIDiagnoser()
    diagnoses = [diagnoser.diagnose_case(c) for c in cases]
    print(f"[SUCCESS] Diagnosed all {len(diagnoses)} cases with structured JSON output.")

    # Step 4: Run Dashboard Analytics
    run_dashboard_analytics()
    print("[NetSage AI] Complete workflow pipeline executed successfully!")

if __name__ == "__main__":
    main()
