import csv

cases = [
    # VLAN domain
    {
        "case_id": "NET-001",
        "symptom": "PC1 in VLAN 10 cannot ping PC2 in VLAN 20 across Switch 1 and Switch 2 trunk link.",
        "topology_note": "PC1 (192.168.10.10/24) -> SW1 (Gi0/1) -> Trunk Gi0/24 -> SW2 (Gi0/24) -> PC2 (192.168.20.20/24). Inter-VLAN router on SW1.",
        "show_outputs": """SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/24      10,30-40

SW1# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/2-23
10   Sales                            active    Gi0/1
20   Engineering                      active    
30   Management                       active    """,
        "expected_fault": "Trunk port Gi0/24 on SW1 has allowed VLAN list set to '10,30-40', pruning VLAN 20 traffic from reaching SW2.",
        "osi_layer": "Layer 2",
        "concept": "VLAN",
        "severity": "High"
    },
    {
        "case_id": "NET-002",
        "symptom": "Native VLAN mismatch warning logged on console; untagged traffic crossing trunk between SW1 and SW2 leaks into wrong VLAN.",
        "topology_note": "SW1 (Gi0/24) connected to SW2 (Gi0/24) via Dot1Q trunk link.",
        "show_outputs": """SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      10

SW2# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      1
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch detected on GigabitEthernet0/24 (10), with SW2 GigabitEthernet0/24 (1).""",
        "expected_fault": "Native VLAN mismatch: SW1 Gi0/24 is configured with native VLAN 10 while SW2 Gi0/24 uses default native VLAN 1.",
        "osi_layer": "Layer 2",
        "concept": "VLAN",
        "severity": "High"
    },
    {
        "case_id": "NET-003",
        "symptom": "PC3 connected to SW1 port Gi0/5 has link light green but no network connectivity or gateway access.",
        "topology_note": "PC3 (192.168.30.15/24) connected to SW1 port Gi0/5. Target VLAN is VLAN 30 (Finance).",
        "show_outputs": """SW1# show mac address-table interface Gi0/5
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
30      0050.56aa.1122    DYNAMIC     Gi0/5

SW1# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/1-4, Gi0/6-24
10   Sales                            active    
20   Engineering                      active    
% VLAN 30 does not exist in switch database!""",
        "expected_fault": "Access port Gi0/5 is assigned to VLAN 30, but VLAN 30 has not been created in the switch VLAN database (`vlan 30`).",
        "osi_layer": "Layer 2",
        "concept": "VLAN",
        "severity": "Medium"
    },
    {
        "case_id": "NET-004",
        "symptom": "Inter-VLAN routing fails for VLAN 20 hosts on Router-on-a-stick setup.",
        "topology_note": "R1 (Gi0/0) -> SW1 (Gi0/24 trunk). R1 G0/0 has subinterfaces G0/0.10 and G0/0.20.",
        "show_outputs": """R1# show ip interface brief
Interface          IP-Address      OK? Method Status                Protocol
Gi0/0              unassigned      YES unset  up                    up
Gi0/0.10           192.168.10.1    YES manual up                    up
Gi0/0.20           192.168.20.1    YES manual up                    up

R1# show running-config interface Gi0/0.20
building configuration...
interface GigabitEthernet0/0.20
 encapsulation dot1Q 30
 ip address 192.168.20.1 255.255.255.0""",
        "expected_fault": "Router subinterface Gi0/0.20 has encapsulation dot1Q 30 misconfigured instead of dot1Q 20.",
        "osi_layer": "Layer 2",
        "concept": "VLAN",
        "severity": "High"
    },

    # Gateway domain
    {
        "case_id": "NET-005",
        "symptom": "PC1 obtains IP address 192.168.1.50/24 but cannot reach external IP 8.8.8.8. Local LAN pings work.",
        "topology_note": "PC1 (192.168.1.50/24) -> Switch 1 -> Router R1 (Gi0/0 IP 192.168.1.1).",
        "show_outputs": """C:\\> ipconfig /all
Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . . . . . . : 192.168.1.50
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.254

R1# show ip interface brief Gi0/0
Interface          IP-Address      OK? Method Status                Protocol
Gi0/0              192.168.1.1     YES manual up                    up""",
        "expected_fault": "Host default gateway mismatch: PC1 is configured with gateway 192.168.1.254 instead of R1 IP 192.168.1.1.",
        "osi_layer": "Layer 3",
        "concept": "Gateway",
        "severity": "High"
    },
    {
        "case_id": "NET-006",
        "symptom": "Administrator cannot SSH to Switch SW1 management interface from remote subnet 10.2.2.0/24.",
        "topology_note": "Management Host (10.2.2.50) -> R1 -> SW1 SVI Interface VLAN 1 (10.1.1.2/24).",
        "show_outputs": """SW1# show ip interface brief
Interface          IP-Address      OK? Method Status                Protocol
Vlan1              10.1.1.2        YES manual administratively down down
Gi0/1              unassigned      YES unset  up                    up

SW1# show running-config | include default-gateway
ip default-gateway 10.1.1.1""",
        "expected_fault": "Switch management SVI Interface Vlan1 is in 'administratively down' state (needs `no shutdown`).",
        "osi_layer": "Layer 3",
        "concept": "Gateway",
        "severity": "Medium"
    },
    {
        "case_id": "NET-007",
        "symptom": "Switch SW2 management IP 172.16.10.2 is reachable locally on VLAN 10, but unreachable from admin workstation on VLAN 20.",
        "topology_note": "Admin Workstation (172.16.20.5) -> R1 Router -> SW2 (VLAN 10 SVI 172.16.10.2/24).",
        "show_outputs": """SW2# show ip interface brief Vlan10
Interface          IP-Address      OK? Method Status                Protocol
Vlan10             172.16.10.2     YES manual up                    up

SW2# show running-config | include default-gateway
% No default-gateway configured.""",
        "expected_fault": "Switch SW2 lacks global configuration `ip default-gateway 172.16.10.1`, preventing return traffic across subnets.",
        "osi_layer": "Layer 3",
        "concept": "Gateway",
        "severity": "Medium"
    },
    {
        "case_id": "NET-008",
        "symptom": "PC2 network icon shows 'No Internet Access'; static IP setting error suspected.",
        "topology_note": "PC2 in Subnet 192.168.20.0/24, Gateway R1 Gi0/0.20 IP is 192.168.20.1.",
        "show_outputs": """C:\\> ipconfig
Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . . . . . . : 192.168.20.45
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1""",
        "expected_fault": "Default gateway IP 192.168.10.1 is on a completely different subnet than the host IP 192.168.20.45/24.",
        "osi_layer": "Layer 3",
        "concept": "Gateway",
        "severity": "High"
    },

    # DHCP domain
    {
        "case_id": "NET-009",
        "symptom": "Clients on VLAN 10 receive APIPA IP addresses (169.254.x.x) and cannot reach network resources.",
        "topology_note": "Clients (VLAN 10) -> SW1 -> R1 (Router/DHCP Relay G0/0.10) -> Central DHCP Server (10.1.1.100).",
        "show_outputs": """C:\\> ipconfig
IPv4 Address. . . . . . . . . . . : 169.254.42.108
Subnet Mask . . . . . . . . . . . : 255.255.0.0

R1# show running-config interface Gi0/0.10
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
 % Missing ip helper-address statement!""",
        "expected_fault": "DHCP Relay configuration missing on router subinterface Gi0/0.10 (`ip helper-address 10.1.1.100` missing).",
        "osi_layer": "Layer 7",
        "concept": "DHCP",
        "severity": "Critical"
    },
    {
        "case_id": "NET-010",
        "symptom": "DHCP clients receive IP lease successfully, but cannot reach default gateway or remote networks.",
        "topology_note": "R1 acts as DHCP Server for LAN 192.168.1.0/24. Router LAN interface is 192.168.1.1.",
        "show_outputs": """R1# show ip dhcp pool LAN_POOL
Pool LAN_POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (Current/Total)    : 1 / 254
 Lease total / active / excluded: 5 / 5 / 0
 Default router                 : 192.168.1.250
 Domain Name                    : lab.cisco.com

R1# show ip interface brief Gi0/0
Gi0/0              192.168.1.1     YES manual up                    up""",
        "expected_fault": "DHCP pool option `default-router` specifies 192.168.1.250 instead of router LAN interface IP 192.168.1.1.",
        "osi_layer": "Layer 7",
        "concept": "DHCP",
        "severity": "High"
    },
    {
        "case_id": "NET-011",
        "symptom": "New workstations added to office fail to obtain IP address from router DHCP pool.",
        "topology_note": "R1 DHCP Server pool `SALES` configured for small subnet 192.168.5.0/28 (14 usable IPs). 14 hosts active.",
        "show_outputs": """R1# show ip dhcp pool SALES
Pool SALES :
 Subnet 192.168.5.0 /28
 Lease total / active / excluded: 14 / 14 / 0
 Current index                  : 192.168.5.15

R1# show ip dhcp binding
% All 14 dynamic bindings in 192.168.5.0/28 pool are allocated!""",
        "expected_fault": "DHCP IP address pool exhaustion: /28 subnet pool is fully allocated (14/14 leases used).",
        "osi_layer": "Layer 7",
        "concept": "DHCP",
        "severity": "Medium"
    },
    {
        "case_id": "NET-012",
        "symptom": "DHCP Reply packets dropped at access switch SW1; clients unable to complete DHCPOFFER/DHCPACK.",
        "topology_note": "DHCP Server -> SW1 (Gi0/24 uplink) -> Access ports Gi0/1-10.",
        "show_outputs": """SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs: 10,20

SW1# show ip dhcp snooping binding
% 0 bindings found

SW1# show ip dhcp snooping interfaces Gi0/24
Interface                  Trusted    Allow option 82  Rate limit (pps)
-----------------------    -------    ---------------  ----------------
GigabitEthernet0/24        No         Yes              unlimited""",
        "expected_fault": "DHCP Snooping enabled on SW1, but trunk uplink port Gi0/24 to DHCP server is untrusted (`ip dhcp snooping trust` missing).",
        "osi_layer": "Layer 7",
        "concept": "DHCP",
        "severity": "High"
    },

    # DNS domain
    {
        "case_id": "NET-013",
        "symptom": "PC can ping web server by IP (172.16.1.100), but browsing http://server.lab.com fails with domain lookup error.",
        "topology_note": "PC (192.168.1.20) -> Router R1 -> DNS Server (172.16.1.53).",
        "show_outputs": """C:\\> ipconfig /all
   IPv4 Address. . . . . . . . . . . : 192.168.1.20
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.254

C:\\> nslookup server.lab.com
DNS request timed out.
timeout was 2 seconds.
*** Request to UnKnown timed out""",
        "expected_fault": "PC configured with non-existent DNS server IP 192.168.1.254 instead of real DNS server 172.16.1.53.",
        "osi_layer": "Layer 7",
        "concept": "DNS",
        "severity": "High"
    },
    {
        "case_id": "NET-014",
        "symptom": "Internal domain name `app.corp.internal` cannot be resolved by any workstation on LAN.",
        "topology_note": "Clients query Server DNS1 (10.0.0.53). DNS Server running Packet Tracer DNS Service.",
        "show_outputs": """C:\\> nslookup app.corp.internal 10.0.0.53
Server:  dns1.corp.internal
Address:  10.0.0.53
*** dns1.corp.internal can't find app.corp.internal: Non-existent domain

DNS Server Configuration:
Service: DNS Enabled
Records:
  web.corp.internal -> 10.0.0.10 (A Record)
  mail.corp.internal -> 10.0.0.20 (A Record)
  % Missing record for app.corp.internal!""",
        "expected_fault": "Missing DNS Host (A) Record for hostname `app.corp.internal` on primary DNS server.",
        "osi_layer": "Layer 7",
        "concept": "DNS",
        "severity": "High"
    },
    {
        "case_id": "NET-015",
        "symptom": "Router CLI command `ping server1` fails immediately with 'Unknown command or computer name'.",
        "topology_note": "Admin executing ping on R1 targeting server1 (10.1.1.50).",
        "show_outputs": """R1# ping server1
Translating "server1"...domain server (255.255.255.255)
% Unknown command or computer name, or unable to find computer address

R1# show running-config | include domain
no ip domain lookup""",
        "expected_fault": "DNS name resolution disabled on router via `no ip domain lookup` command.",
        "osi_layer": "Layer 7",
        "concept": "DNS",
        "severity": "Low"
    },
    {
        "case_id": "NET-016",
        "symptom": "All DNS queries fail across entire enterprise network; primary DNS server unreachable.",
        "topology_note": "Central DNS Server (10.10.10.53) connected to Switch SW-CORE interface Gi0/10.",
        "show_outputs": """SW-CORE# show interface Gi0/10
GigabitEthernet0/10 is administratively down, line protocol is down 
  Hardware is Gigabit Ethernet, address is 0002.4b11.2233
  Description: Link to Central DNS Server""",
        "expected_fault": "Switch port Gi0/10 connected to Central DNS Server is in 'administratively down' state.",
        "osi_layer": "Layer 7",
        "concept": "DNS",
        "severity": "Critical"
    },

    # Routing domain
    {
        "case_id": "NET-017",
        "symptom": "OSPF neighbor adjacency fails to form between R1 and R2 across serial/gigabit link.",
        "topology_note": "R1 (Gi0/0: 10.0.0.1/30) <----> (Gi0/0: 10.0.0.2/30) R2. OSPF Process 1 Area 0.",
        "show_outputs": """R1# show ip ospf neighbor
% No OSPF neighbors in state FULL!

R1# show ip ospf interface Gi0/0
Gi0/0 is up, line protocol is up
  Internet Address 10.0.0.1/30, Area 0
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5

R2# show ip ospf interface Gi0/0
Gi0/0 is up, line protocol is up
  Internet Address 10.0.0.2/30, Area 0
  Timer intervals configured, Hello 30, Dead 120, Wait 120, Retransmit 5""",
        "expected_fault": "OSPF Hello/Dead timer mismatch: R1 has Hello 10s / Dead 40s while R2 has Hello 30s / Dead 120s.",
        "osi_layer": "Layer 3",
        "concept": "Routing",
        "severity": "High"
    },
    {
        "case_id": "NET-018",
        "symptom": "R2 LAN hosts cannot reach R1 LAN hosts; OSPF routes missing from routing tables.",
        "topology_note": "R1 (Area 0) connected directly to R2 (Area 1). No backbone Area 0 interface present on R2.",
        "show_outputs": """R1# show ip ospf interface brief
Interface           PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0               1     0               10.0.0.1/30        1     DR    0/0

R2# show ip ospf interface brief
Interface           PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0               1     1               10.0.0.2/30        1     DR    0/0""",
        "expected_fault": "OSPF Area mismatch on interconnecting link: R1 Gi0/0 is in Area 0 while R2 Gi0/0 is in Area 1.",
        "osi_layer": "Layer 3",
        "concept": "Routing",
        "severity": "High"
    },
    {
        "case_id": "NET-019",
        "symptom": "Static routing to remote subnet 172.16.50.0/24 drops packets at router R1.",
        "topology_note": "R1 (10.0.0.1/30) connected to R2 (10.0.0.2/30). Remote network behind R2 is 172.16.50.0/24.",
        "show_outputs": """R1# show ip route
Gateway of last resort is not set
10.0.0.0/30 is subnetted, 1 subnets
C        10.0.0.0 is directly connected, GigabitEthernet0/0
S        172.16.50.0/24 [1/0] via 10.0.0.5

R1# show ip arp
Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  10.0.0.1                -   0001.96a1.1111  ARPA   GigabitEthernet0/0
Internet  10.0.0.2               12   0002.4b22.3333  ARPA   GigabitEthernet0/0
% Next-hop 10.0.0.5 is unresolvable!""",
        "expected_fault": "Static route next-hop IP error: R1 configured with invalid next-hop 10.0.0.5 instead of 10.0.0.2.",
        "osi_layer": "Layer 3",
        "concept": "Routing",
        "severity": "High"
    },
    {
        "case_id": "NET-020",
        "symptom": "R1 does not form OSPF adjacency with R2 on LAN interface Gi0/1.",
        "topology_note": "R1 Gi0/1 (192.168.1.1/24) connected to R2 Gi0/0 (192.168.1.2/24).",
        "show_outputs": """R1# show running-config | section router ospf
router ospf 1
 router-id 1.1.1.1
 passive-interface GigabitEthernet0/1
 network 192.168.1.0 0.0.0.255 area 0

R2# show ip ospf neighbor
% No neighbors listed.""",
        "expected_fault": "Interface Gi0/1 configured as `passive-interface`, suppressing OSPF hello packet transmission.",
        "osi_layer": "Layer 3",
        "concept": "Routing",
        "severity": "High"
    },

    # ACL domain
    {
        "case_id": "NET-021",
        "symptom": "PC1 (192.168.10.50) cannot connect to Web Server (10.2.2.100:80), but can ping it.",
        "topology_note": "PC1 -> R1 Gi0/0 (192.168.10.1) -> Inbound ACL 101 -> Web Server (10.2.2.100).",
        "show_outputs": """R1# show ip access-lists 101
Extended IP access list 101
    10 deny tcp host 192.168.10.50 host 10.2.2.100 eq www (42 matches)
    20 permit ip any any (150 matches)

R1# show ip interface Gi0/0
GigabitEthernet0/0 is up, line protocol is up
  Inbound access list is 101""",
        "expected_fault": "Inbound ACL 101 rule 10 explicitly denies TCP port 80 traffic from PC1 to Web Server.",
        "osi_layer": "Layer 4",
        "concept": "ACL",
        "severity": "High"
    },
    {
        "case_id": "NET-022",
        "symptom": "Branch office subnets 192.168.10.0/24 and 192.168.20.0/24 are completely blocked by ACL 110.",
        "topology_note": "R1 WAN interface Gi0/1 inbound ACL filtering corporate traffic.",
        "show_outputs": """R1# show ip access-lists 110
Extended IP access list 110
    10 permit ip 192.168.10.0 255.255.255.0 any
    % IOS interpreted 255.255.255.0 as host match 255.255.255.0 instead of wildcard 0.0.0.255!
    20 deny ip any any (1200 matches)""",
        "expected_fault": "ACL wildcard mask syntax error: subnet mask `255.255.255.0` was entered instead of wildcard mask `0.0.0.255`.",
        "osi_layer": "Layer 4",
        "concept": "ACL",
        "severity": "High"
    },
    {
        "case_id": "NET-023",
        "symptom": "Network monitoring server cannot ping WAN router R1 interface Gi0/1.",
        "topology_note": "NMS (203.0.113.10) pings R1 WAN IP (203.0.113.1).",
        "show_outputs": """R1# show ip access-lists SECURE_IN
Extended IP access list SECURE_IN
    10 permit tcp any host 203.0.113.1 eq 22
    20 permit tcp any host 203.0.113.1 eq 443
    % Missing permit icmp entry!
    30 deny ip any any (85 matches)

R1# show ip interface Gi0/1 | include access list
  Inbound access list is SECURE_IN""",
        "expected_fault": "Inbound ACL SECURE_IN lacks `permit icmp any host 203.0.113.1` statement, dropping ICMP echo requests.",
        "osi_layer": "Layer 4",
        "concept": "ACL",
        "severity": "Medium"
    },
    {
        "case_id": "NET-024",
        "symptom": "Users on VLAN 10 report DNS resolution failure when ACL 102 is applied on router interface.",
        "topology_note": "VLAN 10 hosts send UDP 53 queries to External DNS Server 8.8.8.8.",
        "show_outputs": """R1# show ip access-lists 102
Extended IP access list 102
    10 permit tcp 192.168.10.0 0.0.0.255 any eq www
    20 permit tcp 192.168.10.0 0.0.0.255 any eq 443
    % Implicit deny at line 30 drops UDP port 53 (DNS) traffic!""",
        "expected_fault": "ACL 102 only permits TCP 80/443; UDP DNS traffic (port 53) hits implicit deny at end of access list.",
        "osi_layer": "Layer 4",
        "concept": "ACL",
        "severity": "High"
    },

    # NAT domain
    {
        "case_id": "NET-025",
        "symptom": "All internal hosts (192.168.1.0/24) fail to reach public internet sites; pings to ISP router 203.0.113.254 fail.",
        "topology_note": "LAN (192.168.1.0/24) -> R1 Gi0/0 (Inside) -> R1 Gi0/1 (Outside) -> ISP (203.0.113.254).",
        "show_outputs": """R1# show ip nat translations
% No NAT translations in table

R1# show interface Gi0/1
GigabitEthernet0/1 is up, line protocol is up
  Internet address is 203.0.113.1/30
  % Missing 'ip nat outside' command on Gi0/1!

R1# show running-config interface Gi0/0
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside""",
        "expected_fault": "NAT configuration incomplete: WAN interface Gi0/1 is missing the `ip nat outside` statement.",
        "osi_layer": "Layer 3",
        "concept": "NAT",
        "severity": "Critical"
    },
    {
        "case_id": "NET-026",
        "symptom": "Hosts on new subnet 192.168.2.0/24 cannot access internet, while hosts on 192.168.1.0/24 have full internet access.",
        "topology_note": "R1 performing NAT Overload on interface Gi0/1 using ACL 1.",
        "show_outputs": """R1# show running-config | include ip nat
ip nat inside source list 1 interface GigabitEthernet0/1 overload

R1# show ip access-lists 1
Standard IP access list 1
    10 permit 192.168.1.0 0.0.0.255 (450 matches)
    % Missing subnet 192.168.2.0 0.0.0.255!""",
        "expected_fault": "NAT ACL 1 only permits subnet 192.168.1.0/24, omitting subnet 192.168.2.0/24 from NAT translation.",
        "osi_layer": "Layer 3",
        "concept": "NAT",
        "severity": "High"
    },
    {
        "case_id": "NET-027",
        "symptom": "Internal Web Server (192.168.1.100) unreachable from external internet users at public IP 203.0.113.10.",
        "topology_note": "Static NAT mapping internal IP 192.168.1.100 to public IP 203.0.113.10.",
        "show_outputs": """R1# show running-config | include ip nat inside source static
ip nat inside source static 192.168.1.100 203.0.113.1

R1# show ip interface brief Gi0/1
Gi0/1              203.0.113.1     YES manual up                    up""",
        "expected_fault": "Static NAT IP conflict: Static NAT mapped public IP 203.0.113.1 is identical to router Gi0/1 interface IP.",
        "osi_layer": "Layer 3",
        "concept": "NAT",
        "severity": "High"
    },
    {
        "case_id": "NET-028",
        "symptom": "Only the first 5 LAN users can access internet simultaneously; 6th user connection drops.",
        "topology_note": "Dynamic NAT pool `PUBLIC_POOL` contains 5 public IPs (203.0.113.10 - 203.0.113.14).",
        "show_outputs": """R1# show running-config | include ip nat inside source
ip nat inside source list 10 pool PUBLIC_POOL
% Missing 'overload' keyword at end of command!

R1# show ip nat statistics
Total active translations: 5 (0 dynamic, 5 static, 5 extended)
Hits: 1200  Misses: 45
Pool PUBLIC_POOL : netmask 255.255.255.248
       start 203.0.113.10 end 203.0.113.14
       type generic, total addresses 5, allocated 5 (100%)""",
        "expected_fault": "Dynamic NAT pool exhausted because `overload` keyword was omitted, causing 1-to-1 IP allocation without PAT port multiplexing.",
        "osi_layer": "Layer 3",
        "concept": "NAT",
        "severity": "High"
    },

    # Wireless domain
    {
        "case_id": "NET-029",
        "symptom": "Guest Wi-Fi users connected to SSID 'Guest-Net' can successfully ping internal Corporate Database Server at 10.1.1.50.",
        "topology_note": "Guest Wi-Fi (VLAN 50) -> WLC / AP -> Core Switch -> Corp DB (10.1.1.50). Guest Isolation required.",
        "show_outputs": """WLC1# show wlan 2
WLAN Identifier.................................. 2
Profile Name..................................... Guest-Net
SSID............................................. Guest-Net
VLAN ID.......................................... 50
Interface Name................................... guest-vlan50
Client Peer-to-Peer Blocking..................... Disabled
ACL Name......................................... none

Core-SW# show ip access-lists GUEST_ACL
% Access list GUEST_ACL is not applied on Vlan50 interface!""",
        "expected_fault": "Guest Wi-Fi security isolation failure: No ACL applied on Guest VLAN 50 to block access to internal 10.0.0.0/8 network.",
        "osi_layer": "Layer 4",
        "concept": "Wireless",
        "severity": "Critical"
    },
    {
        "case_id": "NET-030",
        "symptom": "Wireless laptop fails to authenticate and connect to SSID 'Corp-Secure'.",
        "topology_note": "Laptop client connecting via WPA2-PSK to Wireless Router / Access Point.",
        "show_outputs": """Laptop Client Wireless Log:
[INFO] Scanning for SSID 'Corp-Secure'... Found (RSSI -55dBm)
[INFO] Initiating 4-way WPA2 handshake...
[ERROR] WPA2 MIC verification failed! Handshake timeout.
[ERROR] Disconnected from AP.

AP-1 Configuration:
SSID: Corp-Secure
Security: WPA2-PSK (AES)
Pre-Shared Key: Cisco12345!

Laptop Profile Configuration:
SSID: Corp-Secure
Key: Cisco12345 (Typo: missing trailing '!')""",
        "expected_fault": "WPA2 Pre-Shared Key (PSK) passphrase mismatch between Wireless Client profile and Access Point.",
        "osi_layer": "Layer 2",
        "concept": "Wireless",
        "severity": "High"
    },
    {
        "case_id": "NET-031",
        "symptom": "Newly deployed Lightweight Access Point AP-2 remains stuck in 'Downloading OS / Finding Controller' loop.",
        "topology_note": "AP-2 receives DHCP IP in VLAN 100. Wireless LAN Controller (WLC) IP is 10.10.10.5.",
        "show_outputs": """AP-2 Console Output:
*MAR 1 00:02:15.111: %DHCP-6-ADDRESS_ASSIGN: IP address 192.168.100.25 assigned.
*MAR 1 00:02:20.150: %WTP-5-OPTION43_FAIL: Option 43 not found in DHCP offer.
*MAR 1 00:02:25.200: %CAPWAP-3-ERRORLOG: Could not resolve Controller IP via Option 43 or DNS.

Router DHCP Pool Config:
ip dhcp pool AP_POOL
 network 192.168.100.0 255.255.255.0
 default-router 192.168.100.1
 % Option 43 hex statement missing!""",
        "expected_fault": "DHCP Option 43 (WLC IP address vendor specifier) missing in DHCP server pool configuration for Lightweight APs.",
        "osi_layer": "Layer 7",
        "concept": "Wireless",
        "severity": "High"
    },
    {
        "case_id": "NET-032",
        "symptom": "Workstations connected to SSID 'Staff-WLAN' cannot obtain IP or reach gateway.",
        "topology_note": "SSID 'Staff-WLAN' mapped to WLC Interface 'Staff-VLAN99'. Trunk between WLC and Switch SW1 carries VLANs 10,20.",
        "show_outputs": """WLC1# show wlan 1
WLAN Identifier.................................. 1
Profile Name..................................... Staff-WLAN
Interface Name................................... staff-vlan99 (VLAN 99)

SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/12      on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/12      10,20""",
        "expected_fault": "VLAN 99 mapped to Staff-WLAN SSID is omitted from the allowed VLAN list (`10,20`) on switch trunk port connected to WLC.",
        "osi_layer": "Layer 2",
        "concept": "Wireless",
        "severity": "High"
    }
]

def main():
    fieldnames = ["case_id", "symptom", "topology_note", "show_outputs", "expected_fault", "osi_layer", "concept", "severity"]
    with open("cases.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for c in cases:
            writer.writerow(c)
    print(f"Successfully wrote {len(cases)} cases to cases.csv!")

if __name__ == "__main__":
    main()
