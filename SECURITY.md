# Security Policy

## Our Commitment

POP is built with security and privacy as its core principles. We take all security reports seriously and will respond promptly to fix verified vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Model

### What POP Protects Against

- ✅ **Eavesdropping** - All messages are AES-256-GCM encrypted
- ✅ **Man-in-the-middle** - Key exchange happens out-of-band
- ✅ **Server compromise** - No central server stores messages
- ✅ **Metadata collection** - No logging, no analytics
- ✅ **Message persistence** - Messages exist only in memory

### What POP Does NOT Protect Against

- ❌ **Compromised endpoints** - If your device is compromised, the attacker can see decrypted messages
- ❌ **Screen recording/screenshots** - Physical access to your screen
- ❌ **Invite code interception** - If the invite code is intercepted, the attacker could join
- ❌ **Browser vulnerabilities** - Zero-days in browsers could expose data
- ❌ **Coercion** - Legal or physical coercion to reveal messages

### Threat Model Assumptions

1. Your device is not compromised
2. Your browser is up-to-date
3. The invite code is shared through a reasonably secure channel
4. The recipient is who they claim to be

## Reporting a Vulnerability

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email**: [Create a private security advisory](https://github.com/qaaph-zyld/pop_app/security/advisories/new)
2. **GitHub Security Advisories**: Use the Security tab in the repository

### What to Include

- Type of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix timeline**: Depends on severity, typically 1-4 weeks
- **Disclosure**: Coordinated disclosure after fix is released

## Security Best Practices for Users

### Do

- ✅ Use the latest version of POP
- ✅ Keep your browser updated
- ✅ Share invite codes through secure channels (in-person, encrypted apps)
- ✅ Verify your peer's identity through another channel
- ✅ Use on trusted devices only

### Don't

- ❌ Share invite codes publicly
- ❌ Use on shared/public computers
- ❌ Trust that the person on the other end is who they claim
- ❌ Use for highly sensitive communications without additional verification

## Encryption Details

### Algorithm

- **Cipher**: AES-256-GCM (Galois/Counter Mode)
- **Key size**: 256 bits
- **IV size**: 96 bits (12 bytes)
- **Authentication tag**: 128 bits

### Key Generation

```javascript
// Keys are generated using Web Crypto API
crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
)
```

### Key Exchange

Keys are embedded in the invite code and shared out-of-band. This means:
- The key never travels over the WebRTC connection
- An attacker would need to intercept the invite code sharing mechanism
- STUN servers never see the encryption key

## Audit Status

POP has not undergone a formal security audit. The code is open source and available for review. We welcome security researchers to examine our implementation.

## Responsible Disclosure

We follow responsible disclosure practices:

1. Reporter submits vulnerability privately
2. We acknowledge receipt
3. We investigate and develop a fix
4. We release the fix
5. We credit the reporter (unless they prefer anonymity)
6. Details are made public after users have had time to update

## Bug Bounty

Currently, we do not have a formal bug bounty program. However, we deeply appreciate security research and will acknowledge all valid reports in our release notes and README.

## Contact

For security matters: Use [GitHub Security Advisories](https://github.com/qaaph-zyld/pop_app/security/advisories/new)

For general questions: Open a GitHub issue
