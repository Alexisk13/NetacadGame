# Project context: exam prep game for "Datoru tīkli I"

## Who and what
- The user is a student in Latvia taking the course **"Datoru tīkli I un ieskats nozarē"**, based on **Cisco NetAcad CCNA: Introduction to Networks (ITN v7)**.
- Goal: build a **web game** that helps the user and a friend prepare for the exam.
- All factual content must follow **Cisco ITN v7** wording and facts, because exam and quiz questions come from it.
- Default language for game UI and content: **Latvian**, with English Cisco terms in brackets where useful (e.g. "komutators (switch)"). NetAcad quiz questions are in English, so quiz mode may keep the English originals. Ask the user if unsure.
- User preference: **never use em dashes** in any text (code comments, UI copy, docs). Use colons, commas or hyphens instead.

## Exam structure (what the game should train)
1. **Oral theory exam:** the student draws a random ticket from the 18 topics below, gives a **5-minute speech**, then answers follow-up questions.
2. **Lab exam:** configure a Cisco switch over the console and ping it from a PC (steps and commands below).
3. **NetAcad module quizzes:** multiple choice in English (see "Quiz bank").

## The 18 oral exam tickets (official list, exact wording)
1. OSI, TCP/IP modeļi.
2. Vītā pāra kabeļu datu pārraides vide.
3. Optisko kabeļu datu pārraides vide.
4. Bezvadu lokālie tīkli.
5. Decimālā, binārā un heksadecimālā skaitīšanas sistēmas.
6. Ethernet protokols.
7. Ethernet komutēšana (switching).
8. IPv4 protokols.
9. IPv6 protokols.
10. IP virzīšana (routing).
11. TCP protokols.
12. UDP protokols.
13. Populārākie lietojumu slāņa protokoli un pielietojumi.
14. Enkapsulācijas/dekapsulācijas procesi.
15. DNS sistēma.
16. Kādas datortīkla plūsmas notiek, atverot Tīmekļa vietni.
17. Cisco IOS lietošana un iekārtas konfigurēšana.
18. Datoru tīklu drošība.

## 5-minute speech structure (same for every ticket)
| Time | Part | Content |
| --- | --- | --- |
| 0:00-0:30 | Ievads | One-sentence definition and why it matters |
| 0:30-2:00 | Kā tas darbojas | Main mechanism step by step |
| 2:00-3:30 | Detaļas | Numbers, fields, standards, ports |
| 3:30-4:30 | Piemērs | One real situation or comparison |
| 4:30-5:00 | Noslēgums | Summary and link to another topic |
About 600-700 words. Concrete numbers (20 B header, port 443, 48 bits) score well. If stuck, start from "this works at OSI layer N".

## Key facts per ticket

### 1. OSI and TCP/IP models (ITN 3)
- Benefits of layered models: assists protocol design, fosters competition (vendors interoperate), technology change in one layer does not affect others, common language.
- Protocol model = TCP/IP; reference model = OSI.
- OSI 7 to 1: Application (HTTP, DNS), Presentation (JPEG, encryption, compression), Session (dialogs), Transport (TCP/UDP, segment), Network (IP, packet, router), Data link (Ethernet, frame, switch), Physical (bits). Mnemonic: All People Seem To Need Data Processing.
- TCP/IP: Application = OSI 7+6+5; Transport = 4; Internet = 3; Network access = 2+1.
- Cisco TCP/IP suite table: Application: DNS, DHCP, SMTP, POP3, IMAP, FTP, SFTP, TFTP, HTTP. Transport: TCP, UDP. Internet: Internet Protocol (IPv4, IPv6, NAT), Messaging (ICMPv4, ICMPv6), Routing protocols (OSPF, EIGRP, BGP). Network access: Address resolution (ARP), Data link protocols (Ethernet, WLAN).
- Protocol requirements: encoding, formatting and encapsulation, size, timing (flow control, response timeout, access method), delivery options (unicast, multicast, broadcast).
- Protocol types: network communication (IP, TCP, HTTP), network security (SSH, SSL, TLS), routing (OSPF, BGP), service discovery (DHCP, DNS).
- Protocol functions: addressing, reliability, flow control, sequencing (labels segments for reassembly), error detection, application interface.
- Standards orgs (vendor-neutral): IETF (RFCs, protocols), ISOC (promotes open internet), IAB (oversees standards), IRTF (long-term research), IEEE (802.x), ICANN/IANA (addresses, domains, ports), TIA (cabling T568A/B, radio, cell towers, VoIP, satellite), EIA (electrical wiring, connectors, 19-inch racks), ITU-T (video compression, IPTV, broadband/DSL).

### 2. Twisted pair (ITN 4)
- Bandwidth = capacity; throughput = measured actual; goodput = usable data minus overhead; latency = delay.
- Copper problems: attenuation (UTP max 100 m), EMI/RFI, crosstalk. Twisting fights crosstalk, shielding fights EMI/RFI.
- UTP (no shield, RJ-45), STP (foil + per-pair shield), coaxial (BNC, N, F connectors; cable internet).
- Categories: Cat3 10 Mbps (voice), Cat5 100 Mbps, Cat5e 1 Gbps, Cat6 1 Gbps (10 Gbps up to ~55 m, separator between pairs), Cat6a 10 Gbps at 100 m.
- T568A pins 1-8: w/green, green, w/orange, blue, w/blue, orange, w/brown, brown. T568B swaps green and orange pairs (pins 1, 2, 3, 6).
- Straight-through (A-A): host to switch. Crossover (A-B): like devices. Rollover: Cisco console. Auto-MDIX makes either work.
- Copper vs fiber: 10 Mbps-10 Gbps vs 10 Mbps-100 Gbps; 1-100 m vs 1-100 000 m; low vs high EMI immunity; cheapest vs most expensive; least vs most skill and safety precautions.

### 3. Fiber (ITN 4)
- Core, cladding, buffer, Kevlar strengthening, jacket. Two fibers for full duplex.
- SMF: tiny core, laser, one ray, low dispersion, long distance, yellow jacket. MMF: larger core, LED, more dispersion, up to 10 Gbps over 550 m, orange jacket.
- Uses: enterprise networks, FTTH, long-haul, submarine.
- Connectors: ST (round, bayonet twist), SC (square, push-pull), LC (smaller SC), duplex multimode LC.

### 4. Wireless LANs (ITN 4)
- Limitations: coverage area, interference, security, shared medium (half duplex).
- Standards: Wi-Fi 802.11 (CSMA/CA), Bluetooth 802.15 (WPAN), WiMAX 802.16 (point-to-multipoint), Zigbee 802.15.4 (IoT, low power).
- 802.11 2.4 GHz 2 Mbps; a 5 GHz 54 Mbps; b 2.4 GHz 11 Mbps; g 2.4 GHz 54 Mbps; n 2.4/5 GHz up to 600 Mbps; ac 5 GHz; ax (Wi-Fi 6) backward compatible; ad 60 GHz.
- 2.4 GHz reaches further; 5 GHz is faster with shorter range.
- Components: WAP, wireless NIC, home wireless router (router + switch + AP).
- Security: change default SSID/password, WPA2 with AES or WPA3, never WEP.

### 5. Number systems (ITN 5)
- Octet positional values 128 64 32 16 8 4 2 1. 11000000 = 192. 168 = 10101000 (subtraction method).
- Hex digit = 4 bits. 168 = 1010 1000 = A8. 7562 = 1D8A. FF02 = 65282. 13 = 1101.
- Mask octets: 128, 192, 224, 240, 248, 252, 254, 255.
- Binary for IPv4 and masks; hex for MAC (48 bits = 12 hex digits) and IPv6 (128 bits = 32 hex digits).

### 6. Ethernet protocol (ITN 6, 7, 9)
- IEEE 802.3, layers 1 and 2. LLC (802.2) identifies the L3 protocol; MAC sublayer does encapsulation and media access.
- Contention-based access: CSMA/CD (legacy hubs), CSMA/CA (Wi-Fi). Modern switched Ethernet is full duplex, no collisions.
- Frame: Preamble 7 B + SFD 1 B, **Destination MAC 6 B (first)**, Source MAC 6 B, Type 2 B (0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP), Data 46-1500 B, FCS 4 B. Frame size 64-1518 B; below 64 = runt.
- MAC: 48 bits, physical address, first 24 = OUI (vendor, assigned by IEEE), last 24 vendor-assigned. Broadcast FF-FF-FF-FF-FF-FF. Multicast 01-00-5E (IPv4), 33-33 (IPv6).
- ARP: request is broadcast, reply is unicast. Remote destination: ARP resolves the default gateway MAC. `arp -a`, `show ip arp`. IPv6 uses Neighbor Discovery (NS/NA).

### 7. Ethernet switching (ITN 7)
- Learn from **source** MAC, forward by **destination** MAC; unknown unicast, broadcast and multicast are flooded out all ports except incoming. Aging 5 min. `show mac address-table`.
- Each switch port = own collision domain; switch = one broadcast domain; routers split broadcast domains.
- Store-and-forward (checks FCS/CRC, drops bad frames); cut-through: fast-forward (dest MAC only), fragment-free (first 64 B).
- Buffering: port-based vs shared memory (allows asymmetric switching).
- Autonegotiation, duplex mismatch, auto-MDIX.

### 8. IPv4 (ITN 8, 11)
- Network layer ops: addressing, encapsulation, routing, de-encapsulation. IP is connectionless, best effort, media independent.
- Header 20 B (up to 60): version 0100, IHL, DS (DSCP + ECN), total length, identification/flags/fragment offset, TTL (minus 1 per router; at 0 drop + ICMP Time Exceeded to source), protocol (1 ICMP, 6 TCP, 17 UDP), header checksum, source IP, destination IP.
- 32 bits, **dotted-decimal format**. Network address = IP AND mask. Network, host, broadcast addresses.
- Private (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (need NAT). Loopback 127.0.0.0/8. APIPA 169.254.0.0/16 (no DHCP). Multicast 224.0.0.0-239.255.255.255.
- Legacy classes A/B/C/D/E; now classless (CIDR). RIRs: ARIN, LACNIC, RIPE NCC (Europe), AfriNIC, APNIC.
- Subnetting: hosts = 2^h - 2. /26 from 192.168.1.0/24: 4 subnets (.0, .64, .128, .192), 62 hosts each.

### 9. IPv6 (ITN 8, 12)
- 128 bits, 8 hextets. Header fixed 40 B, 8 fields: version 0110, traffic class, flow label, payload length, next header, hop limit, source, destination. No header checksum; routers do not fragment.
- Compression: omit leading zeros; `::` only once.
- Types: GUA 2000::/3, LLA fe80::/10, ULA fc00::/7, loopback ::1, unspecified ::, multicast ff00::/8 (ff02::1 all nodes, ff02::2 all routers), anycast. No broadcast.
- GUA: 48-bit global routing prefix + 16-bit subnet ID + 64-bit interface ID.
- RS/RA. Methods: SLAAC, SLAAC + stateless DHCPv6, stateful DHCPv6. Default gateway = router LLA. EUI-64: MAC FC:99:47:75:CE:E0 becomes FE99:47FF:FE75:CEE0. DAD.
- Migration: dual stack, tunneling, translation (NAT64).

### 10. Routing (ITN 8, 13)
- Host decides local vs remote by mask; remote traffic goes to default gateway. `route print`, `netstat -r`.
- Router table codes: C connected, L local interface IP, S static, O OSPF, D EIGRP; default route 0.0.0.0/0. Longest prefix match wins.
- Static vs dynamic. OSPF: open standard, link-state, areas. EIGRP: Cisco, metric from bandwidth, delay, load, reliability. BGP between ISPs.
- ICMP: echo request/reply (ping), destination unreachable, time exceeded. Traceroute increments TTL.

### 11. TCP (ITN 14)
- Features: session establishment, reliable delivery, same-order delivery, flow control.
- Header 20 B, 10 fields: source/dest port, sequence, acknowledgment, header length, reserved, control bits (URG ACK PSH RST SYN FIN), window, checksum, urgent, options.
- 3-way handshake SYN, SYN-ACK, ACK. Termination FIN, ACK, FIN, ACK. ISN is random.
- SACK retransmits only missing segments. Window size, MSS 1460 (1500 MTU - 20 IP - 20 TCP), congestion control.
- Ports: well-known 0-1023, registered 1024-49151, dynamic 49152-65535. Socket = IP + port.
- TCP ports: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS.

### 12. UDP (ITN 14)
- Connectionless, no ACK, no reordering, no flow control, 8 B header (source port, dest port, length, checksum). PDU = datagram.
- Used by VoIP, video, DNS, DHCP, SNMP, TFTP. DNS uses TCP if response > 512 B or for zone transfers.
- UDP ports: 53 DNS, 67 DHCP server, 68 DHCP client, 69 TFTP, 161 SNMP.

### 13. Application layer (ITN 15)
- Client-server vs P2P (BitTorrent, Gnutella).
- HTTP GET, POST, PUT; HTTPS = TLS. Email: SMTP sends (25), POP3 downloads and deletes (110), IMAP keeps copy on server (143).
- DHCP DORA: DISCOVER, OFFER, REQUEST, ACK; lease. FTP 21 control, 20 data. SFTP/SSH 22. SMB 445. Telnet unencrypted, SSH encrypted.

### 14. Encapsulation (ITN 3)
- Segmentation benefits: speed (multiplexing) and efficiency (resend only the lost part). Sequencing numbers segments.
- PDUs: data, segment (TCP) / datagram (UDP), packet, frame, bits. **PDU** is the general term at any layer.
- Sending order: HTTP, TCP, IP, Ethernet. Receiving (decapsulation): Ethernet, IP, TCP, HTTP.
- Logical address (IP) added at network layer; physical (MAC) at data link.
- IP addresses stay the same end-to-end; MAC addresses change every hop. Remote destination: frame dest MAC = default gateway.

### 15. DNS (ITN 15)
- FQDN to IP. Hierarchy: root, TLD (.com, .lv), second-level (cisco.com), subdomains (www, mail).
- Records: A (IPv4), AAAA (IPv6), NS (authoritative server), MX (mail exchange).
- Message sections: question, answer, authority, additional. Caching.
- `nslookup`, `ipconfig /displaydns`, `ipconfig /flushdns`. UDP 53.

### 16. Opening a website (synthesis)
DHCP (already have IP) -> ARP for gateway MAC -> DNS query (UDP 53) -> TCP handshake to 443 -> TLS -> HTTP GET -> HTML response -> browser renders -> repeat for extra resources -> FIN to close.

### 17. Cisco IOS (ITN 2, 10)
- Access: console (initial setup, special cable, no network needed), SSH (22), Telnet (23), AUX (modem).
- OS layers: shell (user interface, between user and kernel), kernel (talks to hardware), hardware.
- Modes: User EXEC `>`, Privileged EXEC `#` (`enable`), Global config `(config)#` (`configure terminal`), Line `(config-line)#`, Interface `(config-if)#`. `exit` one level, `end`/Ctrl+Z to `#`.
- Help: `?` lists commands in current mode and available keywords/arguments (context-sensitive help). Tab completes (separate feature). Ctrl+Shift+6 interrupts ping/traceroute.
- Syntax: prompt, command, keyword (fixed, e.g. `running-config`), argument (user value, e.g. IP).
- Memory: RAM = running-config (lost on restart); NVRAM = startup-config; Flash = IOS image; ROM = bootup.
- `copy running-config startup-config` saves to NVRAM (loaded on restart); `copy startup-config running-config` copies into RAM.
- Hostname rules: start with a letter, no spaces, end with letter or digit, only letters/digits/dashes, under 64 chars.
- Boot with startup-config but no console password -> User EXEC mode (setup mode only without startup-config).
- `enable secret` overrides `enable password`. `login` activates password checking on a line.
- Passwords can protect: console line, vty lines, privileged EXEC.
- `show ip interface brief`: interface status and IP.

### 18. Security (ITN 16)
- Threats: information theft, data loss and manipulation, identity theft, disruption of service.
- Vulnerabilities: technological, configuration, security policy. Physical threats: hardware, environmental, electrical, maintenance.
- Malware: virus (needs host program and user), worm (spreads itself via vulnerabilities), Trojan horse (looks legitimate, does not self-replicate).
- Attacks: reconnaissance (ping sweeps, port scans), access (password, trust exploitation, port redirection, MITM), DoS/DDoS.
- Defenses: VPN, ASA firewall, IPS, ESA/WSA, AAA (authentication, authorization, accounting), backups, patches. Firewall types: packet filtering, application filtering, URL filtering, stateful packet inspection. DMZ.
- Hardening: `security passwords min-length 8`, `login block-for 120 attempts 3 within 60`, `exec-timeout 5 0`, SSH only, `auto secure`.

## Lab exam: switch basic configuration
Physical: light blue console cable to the switch **console port** (back); Ethernet cable from PC to a front port (note the port number).

```
enable
configure terminal
hostname <NOSAUKUMS>
line console 0
password <KONSOLES_PAROLE>
login
exit
line vty 0 15
password <VTY_PAROLE>
login
exit
enable secret <ENABLE_PAROLE>
service password-encryption
banner motd #<ZIŅA>#
interface vlan 1
ip address <KOMUTATORA_IP> <MASKA>
no shutdown
exit
ip default-gateway <VĀRTEJAS_IP>   (optional, only to reach other networks)
end
copy running-config startup-config
```
Verify: `show running-config`, `show ip interface brief`, `ping <DATORA_IP>`.
Reset: `erase startup-config`, `delete flash:vlan.dat`, `reload` (answer no to save).
PC: Settings > Network > gear > IPv4 > Manual, same subnet, different host number (e.g. switch 192.168.1.2, PC 192.168.1.10, mask 255.255.255.0), toggle the connection, then ping. First ping reply may be lost (ARP).
Every command needs Enter. `line console 0` = console line number 0, not Ethernet port 0. IP needs a mask so the device knows which part is network.

Common mistakes from a classmate's notes: `host name` instead of `hostname`; saving before finishing (save last); `banner mo t d`; forgetting `login`; Vlan1 only goes up when a port has a device connected.

## Quiz bank (real NetAcad questions the user saw; correct answer after the arrow)
- Name for all computers that participate directly in communication -> Hosts
- Specialized ports on a networking device connecting to individual networks -> Interface
- Connection that physically connects the end device to the network -> NIC
- Router prioritizes voice traffic during congestion -> QoS (reliable network: fault tolerance, scalability, QoS, security)
- Using personal tools on a business or campus network -> BYOD
- How BYOD changes networks -> flexibility in where and how users access resources (it does NOT reduce the need for security policies)
- Network giving suppliers, customers, collaborators secure access -> Extranet (employees only = Intranet)
- Branch employee reaching confidential internal servers -> Intranet
- What is the Internet -> connections through interconnected global networks
- Two functions of end devices -> originate data; interface between humans and the network
- Device that determines the path through internetworks -> Router
- Two internet options without cables to the building -> Cellular, Satellite
- Step concerned with identifying sender and receiver address -> Formatting
- Three components of message timing -> Flow control, response timeout, access method
- BGP and OSPF are -> Routing protocols
- Two service discovery protocols -> DNS, DHCP
- Purpose of sequencing -> uniquely label segments for reassembly
- After Ethernet info is removed, next processed -> IP at the internet layer
- Two TCP/IP application layer protocols (OSPF, DNS, ICMP, DHCP, EIGRP) -> DNS, DHCP
- Three internet layer services -> Messaging, Internet Protocol, Routing Protocols (Address Resolution is network access)
- Three application layer protocols (NAT, FTP, DNS, DHCP, PPP, ARP) -> FTP, DNS, DHCP
- Two OSI layers equal to one TCP/IP layer -> Physical, Data link
- Two benefits of layered model -> assists protocol design; prevents technology in one layer affecting others
- TCP/IP layer that routes through an internetwork -> Internet
- OSI layer that segments and reassembles data -> Transport
- Transport layer PDU -> Segment; general term for data at any layer -> Protocol data unit
- Layer that encapsulates into frames -> Data link
- Done to IP packet before transmission -> encapsulated in a Layer 2 frame
- Client protocol stack order for a web request -> HTTP, TCP, IP, Ethernet
- Order of addresses in data link frame -> Destination MAC, source MAC
- Three true statements on addresses -> data link physical / network logical; data link = 12 hex digits; network = 32 or 128 bits
- Logical address for delivery to a remote network -> Destination IP
- Logical address added at which OSI layer -> Network
- ServerB contacts HostA on another network -> packet dest IP HostA; frame dest MAC RouterB
- Delivery to all devices simultaneously -> Broadcast
- Standards organizations vendor-neutral -> True
- Org responsible for RFCs -> IETF; EIA standards -> electric wiring and connectors
- New switch in equipment room -> Console; manager gives a special cable -> Console
- Secure privileged EXEC -> `enable secret class`
- Enable password authentication for user EXEC -> `login`
- Console user EXEC password in exhibit (enable password letmein, enable secret secretin, console lineconin, vty linevtyin) -> lineconin
- Three things protectable with passwords -> Console, VTY, Privileged EXEC
- IPv4 address structure -> Dotted-decimal format
- Three hostname guidelines -> no spaces, under 64 characters, begin with a letter
- Function of the shell -> interface between users and the kernel
- Router with NVRAM config, enable secret, no console password, boots into -> User EXEC mode
- Memory that loses contents on restart -> RAM; stores startup-config -> NVRAM
- `copy startup-config running-config` -> copies existing configuration into RAM
- `copy running-config startup-config` result -> new config loaded if switch restarts
- Context-sensitive help provides -> available options/keywords/arguments; list of commands in current mode
- Ctrl+Shift+6 after ping -> interrupt the ping process
- `interface vlan 1` + `ip address` + `no shutdown` configures -> SVI
- Verify interface status and IP -> `show ip interface brief`
- In `show running-config`, `running-config` is -> a keyword
- `.pka` files open in Cisco Packet Tracer (free with NetAcad login)

## Game design notes (suggestions, confirm with the user)
- Two players (user and friend): local turn-based or simple shared scoring.
- Possible modes:
  1. **Ticket drawer + 5-minute timer**, speech structure as on-screen checkpoints and a checklist of key facts to mention; friend can tick off facts heard.
  2. **Quiz mode**, Cisco-style multiple choice (single and "choose two/three") with explanations, seeded from the quiz bank.
  3. **Flashcards** for ports, PDUs, OSI layers, IOS modes, memory types.
  4. **CLI simulator** for the lab: type switch commands with prompts that change like real IOS (`Switch>`, `#`, `(config)#`, `(config-line)#`, `(config-if)#`), errors for typos.
  5. **Drag-and-drop** puzzles: OSI layer order, encapsulation order, T568A/B pin colors, protocol to port matching.
- Keep it a static web app (HTML/CSS/JS) unless the user asks otherwise; keep question data in separate JSON files so it is easy to extend.
- Full detailed notes for all 18 tickets also exist in the user's Claude Doc "Datortīkli: eksāmena konspekts un runu plāni"; the user can export it as Markdown and add it to this project.
