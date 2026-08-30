"""
NetSage AI - Automated Test Suite
Built-in unittest suite verifying cases.csv dataset completeness, prompt files, deterministic rule checker logic, and Responsible AI log.
"""

import os
import csv
import unittest
from rule_checker import NetworkRuleChecker
from ai_diagnoser import AIDiagnoser
from review_system import HumanReviewSystem

class TestNetSageAI(unittest.TestCase):

    def test_cases_csv_exists_and_valid(self):
        """Verify cases.csv exists and contains at least 30 valid cases with all required fields."""
        self.assertTrue(os.path.exists("cases.csv"), "cases.csv does not exist!")
        
        with open("cases.csv", "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            
        self.assertGreaterEqual(len(reader), 30, f"Expected at least 30 cases, but found {len(reader)}.")
        
        required_fields = ["case_id", "symptom", "topology_note", "show_outputs", "expected_fault", "osi_layer", "concept", "severity"]
        for i, row in enumerate(reader):
            for field in required_fields:
                self.assertIn(field, row, f"Row {i} ({row.get('case_id')}) missing field '{field}'")
                self.assertTrue(row[field].strip() != "", f"Row {i} ({row.get('case_id')}) has empty field '{field}'")

    def test_diagnose_prompt_exists_and_complete(self):
        """Verify diagnose_prompt.md exists, contains structured JSON schema, and includes 3 worked examples."""
        self.assertTrue(os.path.exists("diagnose_prompt.md"), "diagnose_prompt.md does not exist!")
        
        with open("diagnose_prompt.md", "r", encoding="utf-8") as f:
            content = f.read()
            
        self.assertIn("root_cause", content)
        self.assertIn("confidence", content)
        self.assertIn("evidence", content)
        self.assertIn("next_command", content)
        self.assertIn("fix_steps", content)
        self.assertIn("Worked Example 1", content)
        self.assertIn("Worked Example 2", content)
        self.assertIn("Worked Example 3", content)

    def test_rule_checker_interface_down(self):
        """Test deterministic rule checker catches interface down states."""
        checker = NetworkRuleChecker()
        show = "Vlan1 10.1.1.2 YES manual administratively down down"
        res = checker.check_interface_down(show)
        self.assertGreaterEqual(len(res), 1)
        self.assertEqual(res[0]["category"], "Interface Down")

    def test_rule_checker_gateway_mismatch(self):
        """Test deterministic rule checker catches host default gateway mismatch."""
        checker = NetworkRuleChecker()
        show = """
        Default Gateway . . . . . . . . . : 192.168.1.254
        Gi0/0 192.168.1.1 YES manual up up
        """
        res = checker.check_gateway_mismatch(show)
        self.assertGreaterEqual(len(res), 1)
        self.assertEqual(res[0]["category"], "Gateway Mismatch")

    def test_rule_checker_missing_vlan(self):
        """Test deterministic rule checker catches non-existent VLAN."""
        checker = NetworkRuleChecker()
        show = "% VLAN 30 does not exist in switch database!"
        res = checker.check_missing_vlan(show)
        self.assertGreaterEqual(len(res), 1)
        self.assertEqual(res[0]["category"], "Missing VLAN")

    def test_rule_checker_wildcard_mask_error(self):
        """Test deterministic rule checker catches ACL subnet mask vs wildcard mask errors."""
        checker = NetworkRuleChecker()
        show = "IOS interpreted 255.255.255.0 as host match instead of wildcard 0.0.0.255"
        res = checker.check_subnet_masks(show)
        self.assertGreaterEqual(len(res), 1)
        self.assertEqual(res[0]["category"], "Wildcard Mask Error")

    def test_ai_diagnoser_structured_output(self):
        """Test AIDiagnoser returns valid structured JSON matching the expected schema."""
        diagnoser = AIDiagnoser()
        sample = {
            "case_id": "NET-001",
            "symptom": "PC1 cannot reach PC2",
            "topology_note": "PC1 -> SW1 -> SW2 -> PC2",
            "show_outputs": "SW1# show interfaces trunk\nGi0/24 allowed 10,30-40",
            "expected_fault": "Trunk port Gi0/24 pruned VLAN 20.",
            "osi_layer": "Layer 2",
            "concept": "VLAN"
        }
        diag = diagnoser.diagnose_case(sample)
        self.assertIn("root_cause", diag)
        self.assertIn("confidence", diag)
        self.assertIn("evidence", diag)
        self.assertIn("next_command", diag)
        self.assertIn("fix_steps", diag)

    def test_responsible_ai_log_completeness(self):
        """Verify responsible_ai_log.md exists and documents at least 5 corrected cases."""
        self.assertTrue(os.path.exists("responsible_ai_log.md"), "responsible_ai_log.md missing!")
        
        with open("responsible_ai_log.md", "r", encoding="utf-8") as f:
            content = f.read()
            
        self.assertIn("Case 1:", content)
        self.assertIn("Case 2:", content)
        self.assertIn("Case 3:", content)
        self.assertIn("Case 4:", content)
        self.assertIn("Case 5:", content)
        self.assertIn("Responsible AI Safety Guardrail Lesson", content)

if __name__ == "__main__":
    unittest.main()
