"""
NetSage AI - Deterministic Rule Checker
Python module for detecting common Cisco configuration mistakes prior to or alongside AI diagnosis.
"""

import re
import ipaddress
from typing import List, Dict, Any

class NetworkRuleChecker:
    """
    Deterministic rule checker that parses Cisco show command outputs and topology notes
    to catch common configuration mistakes automatically.
    """

    def __init__(self):
        pass

    def check_interface_down(self, show_output: str) -> List[Dict[str, Any]]:
        """Detect interfaces that are down or administratively down."""
        results = []
        # Match 'show ip interface brief' or 'show interface' lines
        # e.g. Vlan1 10.1.1.2 YES manual administratively down down
        pattern = r'(\b[A-Za-z0-9\/\.\-]+)\s+([\d\.\s]+|unassigned)\s+YES\s+\w+\s+(administratively down|down)\s+(down)'
        matches = re.findall(pattern, show_output, re.IGNORECASE)
        
        for match in matches:
            iface = match[0]
            status = match[2]
            results.append({
                "rule_id": "RULE-001",
                "category": "Interface Down",
                "severity": "Critical" if "admin" in status.lower() else "High",
                "description": f"Interface {iface} is in '{status}' state.",
                "evidence": f"{iface} state is {status}",
                "recommended_fix": f"interface {iface} -> no shutdown"
            })
            
        # Match standalone 'administratively down'
        admin_down_pattern = r'(\b[A-Za-z0-9\/\.\-]+)\s+is administratively down'
        admin_matches = re.findall(admin_down_pattern, show_output, re.IGNORECASE)
        for iface in admin_matches:
            if not any(r["description"].find(iface) != -1 for r in results):
                results.append({
                    "rule_id": "RULE-001",
                    "category": "Interface Down",
                    "severity": "Critical",
                    "description": f"Interface {iface} is administratively down.",
                    "evidence": f"show interface {iface}: is administratively down",
                    "recommended_fix": f"interface {iface} -> no shutdown"
                })
        return results

    def check_gateway_mismatch(self, show_output: str, topology_note: str = "") -> List[Dict[str, Any]]:
        """Detect default gateway mismatches between client ipconfig and router interface IP."""
        results = []
        # Find host default gateway
        gw_match = re.search(r'Default Gateway[\s\.:]+([\d\.]+)', show_output, re.IGNORECASE)
        host_ip_match = re.search(r'IPv4 Address[\s\.:]+([\d\.]+)', show_output, re.IGNORECASE)
        mask_match = re.search(r'Subnet Mask[\s\.:]+([\d\.]+)', show_output, re.IGNORECASE)

        # Find router interface IPs
        router_ips = re.findall(r'Gi\d+[\/\d\.]*\s+([\d\.]+)', show_output)
        
        if gw_match and router_ips:
            configured_gw = gw_match.group(1)
            if configured_gw not in router_ips and configured_gw != "0.0.0.0":
                results.append({
                    "rule_id": "RULE-002",
                    "category": "Gateway Mismatch",
                    "severity": "High",
                    "description": f"Host configured Default Gateway ({configured_gw}) does not match router interface IP ({', '.join(router_ips)}).",
                    "evidence": f"Host Gateway: {configured_gw} vs Router IP: {', '.join(router_ips)}",
                    "recommended_fix": f"Set host default gateway to {router_ips[0]}"
                })
        
        # Check subnet mismatch between host IP and gateway IP
        if host_ip_match and gw_match and mask_match:
            try:
                host_ip = ipaddress.IPv4Address(host_ip_match.group(1))
                gw_ip = ipaddress.IPv4Address(gw_match.group(1))
                net_mask = mask_match.group(1)
                net = ipaddress.IPv4Network(f"{host_ip}/{net_mask}", strict=False)
                if gw_ip not in net and gw_ip != ipaddress.IPv4Address("0.0.0.0"):
                    results.append({
                        "rule_id": "RULE-003",
                        "category": "Subnet Mismatch",
                        "severity": "High",
                        "description": f"Host Gateway IP ({gw_ip}) is outside host subnet boundary ({net}).",
                        "evidence": f"Host IP: {host_ip}/{net_mask}, Gateway IP: {gw_ip}",
                        "recommended_fix": "Configure gateway IP inside local subnet address space"
                    })
            except ValueError:
                pass

        return results

    def check_missing_vlan(self, show_output: str) -> List[Dict[str, Any]]:
        """Detect access ports assigned to non-existent VLANs or native VLAN mismatches."""
        results = []
        if "% VLAN" in show_output and "does not exist" in show_output:
            vlan_match = re.search(r'% VLAN (\d+) does not exist', show_output)
            vlan_id = vlan_match.group(1) if vlan_match else "unknown"
            results.append({
                "rule_id": "RULE-004",
                "category": "Missing VLAN",
                "severity": "Medium",
                "description": f"Access port assigned to VLAN {vlan_id}, but VLAN {vlan_id} does not exist in switch database.",
                "evidence": f"VLAN {vlan_id} does not exist in switch database!",
                "recommended_fix": f"vlan {vlan_id} -> name VLAN_{vlan_id}"
            })

        if "NATIVE_VLAN_MISMATCH" in show_output:
            mismatch = re.search(r'Native VLAN mismatch detected on (\S+) \((\d+)\), with (\S+) (\S+) \((\d+)\)', show_output)
            if mismatch:
                local_if, local_vlan, remote_sw, remote_if, remote_vlan = mismatch.groups()
                results.append({
                    "rule_id": "RULE-005",
                    "category": "Native VLAN Mismatch",
                    "severity": "High",
                    "description": f"Native VLAN mismatch: Local {local_if} uses VLAN {local_vlan}, while remote {remote_sw} {remote_if} uses VLAN {remote_vlan}.",
                    "evidence": f"Native VLAN mismatch on {local_if} ({local_vlan}) vs remote ({remote_vlan})",
                    "recommended_fix": f"interface {local_if} -> switchport trunk native vlan {remote_vlan}"
                })
        return results

    def check_duplicate_ips(self, show_output: str, topology_note: str = "") -> List[Dict[str, Any]]:
        """Detect duplicate IP address assignments across interfaces or static NAT."""
        results = []
        if "duplicate" in show_output.lower() or "conflict" in show_output.lower():
            results.append({
                "rule_id": "RULE-006",
                "category": "Duplicate IP",
                "severity": "High",
                "description": "Duplicate IP address conflict detected in topology or static NAT configuration.",
                "evidence": "Duplicate IP log/conflict detected in show output",
                "recommended_fix": "Reassign non-conflicting IP address"
            })
        
        # Check static NAT conflicting with interface IP
        if "ip nat inside source static" in show_output and "show ip interface brief" in show_output:
            static_nat_ips = re.findall(r'ip nat inside source static\s+[\d\.]+\s+([\d\.]+)', show_output)
            interface_ips = re.findall(r'Gi\d+[\/\d\.]*\s+([\d\.]+)', show_output)
            for nat_ip in static_nat_ips:
                if nat_ip in interface_ips:
                    results.append({
                        "rule_id": "RULE-006",
                        "category": "Duplicate IP",
                        "severity": "High",
                        "description": f"Static NAT translated public IP ({nat_ip}) conflicts with router interface IP.",
                        "evidence": f"Static NAT public IP {nat_ip} equals interface IP {nat_ip}",
                        "recommended_fix": "Use a distinct public IP address from NAT pool"
                    })
        return results

    def check_missing_routes(self, show_output: str) -> List[Dict[str, Any]]:
        """Detect missing default routes, invalid next-hops, or unresolvable static routes."""
        results = []
        if "Gateway of last resort is not set" in show_output and "S" not in show_output:
            results.append({
                "rule_id": "RULE-007",
                "category": "Missing Route",
                "severity": "Medium",
                "description": "No default gateway / gateway of last resort is configured on router.",
                "evidence": "Gateway of last resort is not set",
                "recommended_fix": "ip route 0.0.0.0 0.0.0.0 <next-hop-ip>"
            })

        if "unresolvable" in show_output.lower() or "next-hop" in show_output.lower() and "%" in show_output:
            results.append({
                "rule_id": "RULE-008",
                "category": "Invalid Next-Hop",
                "severity": "High",
                "description": "Static route next-hop IP is unresolvable or not present in local ARP table.",
                "evidence": "Next-hop unresolvable in show ip arp / show ip route",
                "recommended_fix": "Correct static route next-hop IP address"
            })
        return results

    def check_subnet_masks(self, show_output: str) -> List[Dict[str, Any]]:
        """Detect wrong subnet mask formatting or ACL wildcard mask errors."""
        results = []
        if "interpreted 255.255.255.0 as host match" in show_output:
            results.append({
                "rule_id": "RULE-009",
                "category": "Wildcard Mask Error",
                "severity": "High",
                "description": "ACL configured with subnet mask 255.255.255.0 instead of wildcard mask 0.0.0.255.",
                "evidence": "IOS interpreted 255.255.255.0 as host match instead of wildcard 0.0.0.255",
                "recommended_fix": "Use inverse wildcard mask 0.0.0.255 in access list definition"
            })
        return results

    def run_all_checks(self, show_output: str, topology_note: str = "") -> List[Dict[str, Any]]:
        """Execute all deterministic checks and aggregate results."""
        findings = []
        findings.extend(self.check_interface_down(show_output))
        findings.extend(self.check_gateway_mismatch(show_output, topology_note))
        findings.extend(self.check_missing_vlan(show_output))
        findings.extend(self.check_duplicate_ips(show_output, topology_note))
        findings.extend(self.check_missing_routes(show_output))
        findings.extend(self.check_subnet_masks(show_output))
        return findings

# CLI usage test
if __name__ == "__main__":
    checker = NetworkRuleChecker()
    sample = """
    SW1# show ip interface brief
    Vlan1 10.1.1.2 YES manual administratively down down
    
    C:\\> ipconfig /all
    IPv4 Address. . . . . . . . . . . : 192.168.1.50
    Subnet Mask . . . . . . . . . . . : 255.255.255.0
    Default Gateway . . . . . . . . . : 192.168.1.254

    R1# show ip interface brief Gi0/0
    Gi0/0 192.168.1.1 YES manual up up
    """
    res = checker.run_all_checks(sample)
    print("Rule Checker Findings:")
    for r in res:
        print(f"[{r['severity']}] {r['category']}: {r['description']}")
