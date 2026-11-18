---
slug: dns-fundamentals
title: "DNS Fundamentals"
topic: foundations
kind: concept
summary: "DNS translates human-readable domain names into machine-readable IP addresses."
tags: [foundations, networking, dns]
related: [networking-fundamentals, tls-and-pki]
---
> **In one line:** DNS is the telephone directory of the internet, mapping domain names like `example.com` to numerical IP addresses.

## The idea

Computers don't talk in names like `google.com`; they use IP addresses. **DNS (Domain Name System)** provides the translation:

1. User requests a domain name.
2. The browser asks a DNS server for the IP address.
3. The server returns the IP, allowing the browser to connect.

Because DNS is often unencrypted, attackers can spoof it to redirect users to malicious servers.

## See it

```flow
User -> DNS Server: What is google.com?
DNS Server -> User: 142.250.190.46
User -> 142.250.190.46: Request page
```

## Remember
- DNS resolves domain names to IP addresses.
- DNS queries can be intercepted or spoofed if not secured.
- DNS is foundational for connecting to web resources.
