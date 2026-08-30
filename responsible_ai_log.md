# NetSage AI - Responsible AI Audit Log & Human Oversight Report

## Executive Summary
In compliance with the **Cisco NetSage AI Safety & Human Oversight Directive**, every AI-generated network diagnosis must be subjected to mandatory human review prior to applying configuration changes. 

Out of **32 lab cases evaluated**, **26 diagnoses were Accepted directly**, **4 were Edited**, and **2 were Rejected** by senior network engineers. This report documents the **6 cases where human intervention was required**, detailing the root cause of AI inaccuracy, human engineer rationale, corrected diagnoses, and key Responsible AI safety lessons learned.

---

## Overall Human Review Distribution

| Review Decision | Case Count | Percentage | Primary Cause for Correction |
|---|---|---|---|
| **Accepted** | 26 | 81.25% | AI output was 100% accurate & evidence-backed |
| **Edited** | 4 | 12.50% | AI correctly identified fault domain, but hallucinated CLI syntax or missed additional fix steps |
| **Rejected** | 2 | 6.25% | AI misdiagnosed root cause (e.g. blamed Layer 3 routing for Layer 4 ACL wildcard error) |
| **Total Cases** | **32** | **100.0%** | **Mandatory 100% Human Oversight** |

---

## Detailed Corrected Case Logs (6 Cases)

### Case 1: NET-009 - DHCP Relay Option Missing
- **Domain**: DHCP | **OSI Layer**: Layer 7 | **Review Decision**: `Edited`
- **Original AI Diagnosis**:
  - *Root Cause*: Clients receiving APIPA IP due to missing DHCP relay configuration on R1 subinterface Gi0/0.10.
  - *Confidence*: High (92%)
  - *AI Suggested Command*: `ip dhcp-relay 10.1.1.100` (Incorrect Cisco IOS command syntax).
- **Human Engineer Rationale & Correction**:
  - The AI correctly pinpointed the missing DHCP relay function, but hallucinated the command syntax (`ip dhcp-relay` does not exist in Cisco IOS for IPv4).
  - *Corrected Command*: `interface GigabitEthernet0/0.10 -> ip helper-address 10.1.1.100`.
- **Responsible AI Safety Guardrail Lesson**:
  - **LLM Syntax Hallucination Risk**: Large Language Models can generate syntactically invalid CLI commands. Deterministic rule checking or strict command syntax validation MUST be enforced before pushing automated scripts to network hardware.

---

### Case 2: NET-022 - ACL Subnet Mask vs Wildcard Mask Syntax Error
- **Domain**: ACL | **OSI Layer**: Layer 4 | **Review Decision**: `Rejected`
- **Original AI Diagnosis**:
  - *Root Cause*: Layer 3 routing failure; static route missing for subnet 192.168.10.0/24 on router R1.
  - *Confidence*: Medium (70%)
- **Human Engineer Rationale & Correction**:
  - The AI misdiagnosed the issue as a routing failure. Inspection of `show ip access-lists 110` revealed `permit ip 192.168.10.0 255.255.255.0 any`. Cisco IOS interpreted `255.255.255.0` as host IP match `255.255.255.0` rather than inverse wildcard mask `0.0.0.255`, causing all branch traffic to be dropped by rule 20 (`deny ip any any`).
  - *Corrected Root Cause*: Wildcard mask syntax error in ACL 110 rule 10 (`255.255.255.0` entered instead of `0.0.0.255`).
- **Responsible AI Safety Guardrail Lesson**:
  - **Symptom Misclassification Hazard**: AI models can mistake access list filtering drops for upstream routing loss. Deterministic regex checks (`check_subnet_masks`) are required to highlight ACL syntax warnings.

---

### Case 3: NET-024 - ACL Implicit Deny Blocking UDP DNS Traffic
- **Domain**: ACL | **OSI Layer**: Layer 4 | **Review Decision**: `Edited`
- **Original AI Diagnosis**:
  - *Root Cause*: External DNS Server 8.8.8.8 is down or unreachable over WAN link.
  - *Confidence*: Medium (75%)
- **Human Engineer Rationale & Correction**:
  - External DNS server was fully operational. The AI failed to account for implicit deny semantics at the end of ACL 102. ACL 102 permitted TCP port 80 and 443, but omitted UDP port 53 (DNS), resulting in DNS queries being dropped implicitly at line 30.
  - *Corrected Fix*: Add line `30 permit udp 192.168.10.0 0.0.0.255 any eq domain` to ACL 102.
- **Responsible AI Safety Guardrail Lesson**:
  - **Implicit Rule Neglect**: AI models frequently overlook unwritten implicit deny behavior in Cisco ACLs. Prompts must explicitly instruct AI to evaluate fall-through logic for all protocol types (TCP, UDP, ICMP).

---

### Case 4: NET-027 - Static NAT Public IP Conflict
- **Domain**: NAT | **OSI Layer**: Layer 3 | **Review Decision**: `Rejected`
- **Original AI Diagnosis**:
  - *Root Cause*: Web server local IP 192.168.1.100 default gateway is down or unreachable.
  - *Confidence*: Low (65%)
- **Human Engineer Rationale & Correction**:
  - The local Web server interface was fully operational. The AI missed the IP conflict in `ip nat inside source static 192.168.1.100 203.0.113.1`. Public IP `203.0.113.1` was already assigned to router interface Gi0/1 (`show ip interface brief`), creating a duplicate IP collision.
  - *Corrected Root Cause*: Static NAT translated public IP conflicts with router WAN interface IP 203.0.113.1.
- **Responsible AI Safety Guardrail Lesson**:
  - **Cross-Feature Context Blindness**: AI models can analyze commands in isolation without cross-referencing interface IP tables. Multi-command correlation rules (`check_duplicate_ips`) prevent false diagnoses.

---

### Case 5: NET-029 - Guest Wi-Fi Peer & Internal Isolation Failure
- **Domain**: Wireless | **OSI Layer**: Layer 4 / Security | **Review Decision**: `Edited`
- **Original AI Diagnosis**:
  - *Root Cause*: Layer 2 VLAN tagging mismatch on Guest Wireless Access Point.
  - *Confidence*: High (88%)
- **Human Engineer Rationale & Correction**:
  - Layer 2 VLAN tagging was correct (VLAN 50). However, the AI missed the security isolation vulnerability: `WLC show wlan 2` showed `ACL Name: none` and Core Switch showed `GUEST_ACL` was not applied on interface Vlan50, permitting guest Wi-Fi clients to query internal 10.0.0.0/8 servers.
  - *Corrected Fix*: Create and apply `BLOCK_GUEST_TO_CORP` ACL inbound on SVI Vlan50.
- **Responsible AI Safety Guardrail Lesson**:
  - **Security Intent Alignment**: Connectivity being 'successful' does not mean configuration is correct. Responsible AI must evaluate security compliance (isolation rules) alongside functional connectivity.

---

### Case 6: NET-031 - Lightweight AP CAPWAP Join Failure (DHCP Option 43)
- **Domain**: Wireless | **OSI Layer**: Layer 7 | **Review Decision**: `Edited`
- **Original AI Diagnosis**:
  - *Root Cause*: Physical cable fault or Power-over-Ethernet (PoE) failure on Access Point AP-2.
  - *Confidence*: Low (60%)
- **Human Engineer Rationale & Correction**:
  - AP-2 was powering up and receiving an IP address, but console logged `%WTP-5-OPTION43_FAIL: Option 43 not found in DHCP offer`. The AI failed to recognize that Lightweight APs require DHCP Option 43 to discover the Wireless LAN Controller IP address.
  - *Corrected Fix*: Add `option 43 hex f1040a0a0a05` to router DHCP pool `AP_POOL`.
- **Responsible AI Safety Guardrail Lesson**:
  - **Vendor Protocol Nuance**: Specialized enterprise wireless protocols (CAPWAP / Option 43) require fine-tuned prompt guidance or specialized domain knowledge bases.

---

## Guidelines for Responsible Deployment in Enterprise Operations
1. **Never Execute AI Fixes Automatically**: All CLI remediation scripts generated by AI MUST require human review and explicit signoff before execution.
2. **Combine Heuristics with LLMs**: Use Python deterministic rule checkers to pre-validate IP syntax, interface status, and mask boundaries before passing text to LLMs.
3. **Audit Log Maintenance**: Maintain continuous logs of Accepted, Edited, and Rejected diagnoses to refine system prompts and prompt libraries over time.
