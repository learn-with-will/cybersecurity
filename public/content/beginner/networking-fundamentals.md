---
id: lesson-04
slug: networking-fundamentals
title: "Networking Fundamentals for Security"
level: beginner
order: 4
duration: 20
tags:
  - networking
  - tcp-ip
  - ports
  - dns
  - packets
summary: "Just enough networking to reason about security — the TCP/IP layers, IP addresses and MAC addresses, ports and the services behind them, TCP versus UDP, how DNS turns names into addresses, and the full journey of a web request — with the security lesson that anything unencrypted on the wire can be read or changed."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the **TCP/IP layers** and what each does.
- Explain **IP addresses**, **MAC addresses**, and **ports**.
- Compare **TCP** and **UDP** and describe the **TCP handshake**.
- Explain how **DNS** resolves a name and why it matters for security.
- Trace a **web request** end to end and spot where attackers listen.

# Why It Matters

Attacks travel over networks, and defenses live on them: firewalls, encryption, monitoring. If you
don't know how data moves — what a port is, how a name becomes an address, where traffic can be
intercepted — the rest of security is guesswork. This lesson is the plumbing under web security, TLS,
network defense, and detection. The single most important security takeaway: **by default, data on a
network is visible to anything along its path.** That fact drives the need for encryption (Lesson 12).

# Concept Explanation

### The TCP/IP layered model

Networking is built in **layers**, each handling one job and relying on the one below. The practical
**TCP/IP model** has four layers (the academic **OSI model** splits the same ideas into seven):

```text
 TCP/IP layer        Job                                Example
 -----------------   --------------------------------   -----------------------
 Application         The actual service/data            HTTP, DNS, SSH, email
 Transport           End-to-end delivery, ports         TCP, UDP
 Internet            Addressing & routing between nets   IP (addresses, packets)
 Link                The local physical/next-hop link    Ethernet, Wi-Fi (MAC)
```

Data is **encapsulated**: your web request (application) is wrapped in a TCP segment (transport),
inside an IP packet (internet), inside an Ethernet frame (link) — like putting a letter in an
envelope, in a mailbag, on a truck. Each layer only reads its own wrapper.

### Addresses: IP and MAC

- An **IP address** identifies a device on a network so packets can be routed to it. **IPv4** looks
  like `203.0.113.10` (four numbers 0–255); **IPv6** is longer (e.g. `2001:db8::1`) because IPv4 ran
  out of addresses.
- A **MAC address** identifies a network interface on the *local* link (e.g. `00:1a:2b:3c:4d:5e`).
  IP gets you across the internet; MAC gets you across the local Wi-Fi or cable to the next hop.
- **Private IP ranges** (like `192.168.x.x`, `10.x.x.x`) are used inside home/office networks and
  translated to a public IP by **NAT (Network Address Translation)** at the router.

### Ports and services

One device runs many services at once, so the **transport layer** uses **ports** (numbers 0–65535) to
say *which* service a packet is for. A **port** is like an apartment number on the building's street
address (the IP). Some **well-known ports** (as commonly assigned):

```text
 Port    Service        Encrypted?
 -----   ------------   ---------------------------
 22      SSH            yes
 53      DNS            usually not (DoH/DoT add it)
 80      HTTP           NO  (plaintext)
 443     HTTPS          yes (HTTP over TLS)
 25/587  SMTP (email)   often, with STARTTLS
```

Security link: **every open port is a door** — part of your attack surface (Lesson 2). "Port
scanning" is how both attackers and defenders find which doors are open. Closing or firewalling ports
you don't need is one of the cheapest defenses.

### TCP vs UDP

The two main transport protocols make different promises:

- **TCP (Transmission Control Protocol)** is **connection-oriented and reliable**: it sets up a
  connection, guarantees ordered delivery, and retransmits lost data. Web, SSH, and email use it. TCP
  starts with a **three-way handshake**:

```text
 Client  --- SYN --->      Server     "Can we talk?"
 Client  <-- SYN-ACK ---   Server     "Yes, can we?"
 Client  --- ACK --->      Server     "Yes — connected."
```

- **UDP (User Datagram Protocol)** is **connectionless and fast**: it just sends packets with no
  handshake and no guarantee of delivery or order. DNS lookups, video calls, and games use it because
  speed matters more than perfect delivery.

### DNS: names to addresses

You type `example.com`, but packets need an IP. **DNS (Domain Name System)** is the internet's phone
book: it translates human names into IP addresses.

```bash
# Ask DNS for the address behind a name (dig is a lookup tool).
dig +short example.com
# 93.184.216.34   (example output; addresses change)
```

Security link: classic DNS is **unauthenticated and often unencrypted**, so it can be spied on or
spoofed — a wrong answer sends you to an attacker's server. **DNSSEC** adds integrity, and
**DNS-over-HTTPS/TLS (DoH/DoT)** add confidentiality.

### The journey of a web request

Putting it together, visiting `https://example.com` roughly does:

```text
 1. DNS:   name  example.com  →  IP  93.184.216.34         (UDP :53)
 2. TCP:   three-way handshake to the server               (TCP :443)
 3. TLS:   negotiate encryption, verify the certificate    (Lesson 12)
 4. HTTP:  send the request, receive the page               (inside TLS)
```

Every hop in between — your Wi-Fi, your ISP, routers along the way — can *see* traffic that isn't
encrypted and can *sit in the middle* of it. That is why steps 3 (TLS) exists and why plain HTTP
(port 80) is unsafe for anything private.

# Key Terminology

- **TCP/IP model** — the four networking layers: link, internet, transport, application.
- **Encapsulation** — wrapping data with each layer's header as it goes down the stack.
- **IP address / MAC address** — routable device address / local link interface address.
- **NAT** — translating private internal IPs to a shared public IP.
- **Port** — a number identifying which service a packet is for.
- **TCP / UDP** — reliable, connection-oriented / fast, connectionless transport.
- **Three-way handshake** — SYN, SYN-ACK, ACK to start a TCP connection.
- **DNS** — the system that resolves names to IP addresses.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Transport | TCP (reliable) | UDP (fast) | TCP when every byte must arrive in order (web, files); UDP when speed beats completeness (calls, games, DNS). |
| Exposed ports | Open many for convenience | Open only what's needed | Open only what's needed and firewall the rest — each port is attack surface. |
| DNS privacy | Classic DNS | DoH / DoT | Use encrypted DNS where possible to stop eavesdropping and tampering. |
| Web protocol | HTTP (port 80) | HTTPS (port 443) | Always HTTPS — plaintext HTTP can be read and modified in transit. |

# Worked Example

You want to see which services your own machine is offering to the network:

```bash
# List listening TCP/UDP sockets and the ports they use (Linux).
ss -tuln
# Netid  State    Local Address:Port
# tcp    LISTEN   0.0.0.0:22          <- SSH open to any address
# tcp    LISTEN   127.0.0.1:5432      <- database, localhost only (safer)
```

The SSH line (`0.0.0.0:22`) means SSH accepts connections from **any** network address — a door open
to the world. The database (`127.0.0.1:5432`) only listens on **localhost**, so remote machines can't
reach it. A defender would ask: *does SSH need to be open to everyone, or can I restrict it?* Reducing
those exposed ports directly shrinks the attack surface.

# Real World Analogy

Sending data is like mailing a **postcard through the postal system**. The **IP address** is the
street address; the **port** is the apartment number; **DNS** is looking the address up in a directory
by name. The postcard passes through many hands (routers) on the way — and because a **postcard is not
in an envelope (plaintext HTTP)**, anyone handling it can read or alter it. Encryption (TLS) is the
envelope that keeps the message private and tamper-evident.

# Examples

## Example 1 — Basic: name to address

Running `dig +short example.com` returns an IP address. Your browser needed that translation because
it can connect only to an **IP**, not to a name — DNS quietly does this before every new site you
visit.

**Why this works:** it shows the invisible first step of every web request and where a spoofed answer
could redirect you.

## Example 2 — Real-world: closing an exposed port

A team scans their own servers and finds an old database listening on `0.0.0.0:5432` — reachable from
the internet. They restrict it to the application server's address only. An entire class of remote
attacks on that database disappears because the door is no longer open to strangers.

**Why this works:** ports are attack surface; the fix is to stop listening where you don't need to.

## Example 3 — Pitfall: trusting open Wi-Fi

Someone logs into a plain-HTTP site over café Wi-Fi. Because the traffic is unencrypted, another
person on the same network captures the session with a packet sniffer and reads the login. The Wi-Fi
password protected *joining* the network, not the *contents* of the traffic.

**Why this bites:** on a shared/untrusted network, anything not encrypted (HTTPS, a VPN) is readable
by others on the path.

# Common Mistakes

- **Thinking a Wi-Fi password encrypts your browsing.** It controls access to the network, not the
  confidentiality of each site's traffic — that's what HTTPS does.
- **Leaving services bound to `0.0.0.0`.** Listening on all interfaces exposes them to the whole
  network; bind to localhost or restrict by firewall when possible.
- **Assuming DNS is trustworthy.** Classic DNS can be spoofed or watched; prefer DNSSEC/encrypted DNS.
- **Confusing IP and MAC.** IP routes across networks; MAC only reaches the next hop on the local link.

# Best Practices

- **Encrypt everything sensitive in transit** (HTTPS, SSH, VPNs) — assume the path is hostile.
- **Minimize open ports**; bind services narrowly and firewall the rest.
- **Use encrypted, integrity-protected DNS** (DoH/DoT, DNSSEC) where you can.
- **Segment networks** so a foothold in one area can't reach everything (a preview of Lesson 14).
- **Know your own footprint** — periodically scan what your systems expose.

# Summary

- Networking is **layered** (TCP/IP: link, internet, transport, application), and data is
  **encapsulated** as it goes down the stack.
- **IP** addresses route across networks, **MAC** addresses reach the local next hop, and **ports**
  pick the service — each open port is attack surface.
- **TCP** is reliable and connection-oriented (three-way handshake); **UDP** is fast and
  connectionless.
- **DNS** turns names into addresses and is a security-sensitive step.
- The core lesson: **unencrypted traffic can be read or modified by anything on its path** — which is
  why TLS exists.

# Flash Cards

Q: What are the four layers of the TCP/IP model, from top to bottom?
A: Application, Transport, Internet, and Link — each handling one job (the service, end-to-end delivery with ports, addressing/routing, and the local link).

Q: What is the difference between an IP address and a MAC address?
A: An IP address routes packets across networks (end to end); a MAC address identifies a network interface on the local link, reaching only the next hop.

Q: What does a port number identify, and why does it matter for security?
A: It identifies which service on a device a packet is for; every open port is a potential entry point, so open ports are part of your attack surface.

Q: How do TCP and UDP differ?
A: TCP is connection-oriented and reliable (ordered, retransmitted, starts with a three-way handshake); UDP is connectionless and fast with no delivery guarantee.

Q: What does DNS do, and what is its security weakness?
A: DNS translates human names into IP addresses; classic DNS is unauthenticated and often unencrypted, so answers can be spied on or spoofed unless DNSSEC/encrypted DNS is used.

Q: Why is plain HTTP over public Wi-Fi unsafe?
A: The traffic is unencrypted, so anyone on the path (including others on the same Wi-Fi) can read or modify it; HTTPS or a VPN encrypts it end to end.

# Exercises

### Easy
On your own computer, run `ss -tuln` (Linux/macOS) or `netstat -an` and list the ports it is
listening on. Note which are open to all addresses versus localhost only.

### Medium
Trace, in your own words, every step from typing `https://example.com` to seeing the page. Mark each
point where an attacker on the path could read or tamper with unencrypted data.

### Challenging
Explain why a Wi-Fi password does not protect the contents of your browsing, and describe two
different controls (one at the transport layer, one covering the whole connection) that would. Cite
where each protects the data.

# Further Reading

- Cloudflare Learning — *What is the OSI / TCP-IP model?*: <https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/>
- IETF RFC 9293 — *Transmission Control Protocol (TCP)*: <https://www.rfc-editor.org/rfc/rfc9293>
- IANA — *Service Name and Transport Protocol Port Number Registry*: <https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml>
- MDN — *DNS*: <https://developer.mozilla.org/en-US/docs/Glossary/DNS>
