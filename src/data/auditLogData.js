export const auditLogData = [
  {
    case_id: "NET-009",
    concept: "DHCP",
    osi_layer: "Layer 7",
    review_decision: "Edited",
    ai_root_cause: "Missing DHCP relay configuration on R1 subinterface Gi0/0.10.",
    ai_suggested_cmd: "ip dhcp-relay 10.1.1.100",
    human_correction: "Corrected command syntax to 'ip helper-address 10.1.1.100' on subinterface Gi0/0.10.",
    failure_mode: "CLI Syntax Hallucination",
    safety_lesson: "LLMs generate invalid CLI syntax; enforce deterministic command syntax checkers before applying configuration."
  },
  {
    case_id: "NET-022",
    concept: "ACL",
    osi_layer: "Layer 4",
    review_decision: "Rejected",
    ai_root_cause: "Layer 3 routing failure; static route missing for subnet 192.168.10.0/24 on router R1.",
    ai_suggested_cmd: "ip route 192.168.10.0 255.255.255.0 10.0.0.2",
    human_correction: "ACL wildcard mask error: 'permit ip 192.168.10.0 255.255.255.0' entered instead of wildcard '0.0.0.255'.",
    failure_mode: "Symptom Misclassification",
    safety_lesson: "AI misclassifies ACL syntax drops as routing failures without deterministic rule check support."
  },
  {
    case_id: "NET-024",
    concept: "ACL",
    osi_layer: "Layer 4",
    review_decision: "Edited",
    ai_root_cause: "External DNS Server 8.8.8.8 is down or unreachable over WAN link.",
    ai_suggested_cmd: "ping 8.8.8.8",
    human_correction: "Inbound ACL 102 only permitted TCP 80/443; UDP port 53 DNS traffic hit implicit deny line 30. Added '30 permit udp any any eq domain'.",
    failure_mode: "Implicit Rule Neglect",
    safety_lesson: "AI models miss implicit deny semantics in Cisco ACLs unless explicitly instructed to check fall-through rules."
  },
  {
    case_id: "NET-027",
    concept: "NAT",
    osi_layer: "Layer 3",
    review_decision: "Rejected",
    ai_root_cause: "Web server local IP 192.168.1.100 default gateway is down or unreachable.",
    ai_suggested_cmd: "show ip route",
    human_correction: "Static NAT mapped public IP 203.0.113.1 conflicts with router WAN interface Gi0/1 IP 203.0.113.1.",
    failure_mode: "Cross-Feature Context Blindness",
    safety_lesson: "AI misses public IP overlaps between static NAT mappings and router interface IP tables."
  },
  {
    case_id: "NET-029",
    concept: "Wireless",
    osi_layer: "Layer 4",
    review_decision: "Edited",
    ai_root_cause: "Layer 2 VLAN tagging mismatch on Guest Wireless Access Point.",
    ai_suggested_cmd: "show vlan brief",
    human_correction: "Layer 2 VLAN 50 tagging was correct, but WLC lacked Guest isolation ACL ('ACL Name: none'). Created BLOCK_GUEST_TO_CORP ACL.",
    failure_mode: "Security Intent Alignment",
    safety_lesson: "Functional connectivity success does not imply policy compliance; security isolation rules must be explicitly validated."
  },
  {
    case_id: "NET-031",
    concept: "Wireless",
    osi_layer: "Layer 7",
    review_decision: "Edited",
    ai_root_cause: "Physical cable fault or Power-over-Ethernet (PoE) failure on Access Point AP-2.",
    ai_suggested_cmd: "show interface status",
    human_correction: "AP-2 console logged '%WTP-5-OPTION43_FAIL'. Added Option 43 hex string to router DHCP pool AP_POOL.",
    failure_mode: "Vendor Protocol Nuance",
    safety_lesson: "Enterprise wireless CAPWAP join discovery requires vendor-specific option code guidance."
  }
];
