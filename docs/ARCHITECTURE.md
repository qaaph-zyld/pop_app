# POP Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              POP Client                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         React Frontend                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   Home   │→ │  Create  │→ │   Join   │→ │       Chat       │   │  │
│  │  │  Screen  │  │   Room   │  │   Room   │  │      Screen      │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         useChat Hook                               │  │
│  │  • Connection state management                                     │  │
│  │  • Message handling                                                │  │
│  │  • File transfer coordination                                      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│  ┌────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │     WebRTC Manager     │  │           Crypto Module                │ │
│  │  • Peer connections    │  │  • AES-256-GCM encryption             │ │
│  │  • ICE negotiation     │  │  • Key generation & exchange          │ │
│  │  • Data channels       │  │  • Message encrypt/decrypt            │ │
│  └────────────────────────┘  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WebRTC (P2P)
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                          STUN/TURN Servers                              │
│                    (Google's public STUN servers)                       │
│                      Only for connection setup                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Direct P2P Connection
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Remote Peer                                   │
│                      (Another POP Client)                               │
└─────────────────────────────────────────────────────────────────────────┘
```

## Connection Flow

```
    User A (Creator)                         User B (Joiner)
    ================                         ===============
          │                                        │
          │  1. Create Room                        │
          ▼                                        │
    ┌──────────┐                                   │
    │ Generate │                                   │
    │ Offer +  │                                   │
    │ AES Key  │                                   │
    └────┬─────┘                                   │
         │                                         │
         │  2. Share Invite Code                   │
         │     (via any channel)                   │
         ├────────────────────────────────────────►│
         │                                         │
         │                                    ┌────┴─────┐
         │                                    │  Decode  │
         │                                    │  Offer   │
         │                                    │ + Import │
         │                                    │   Key    │
         │                                    └────┬─────┘
         │                                         │
         │                                         │  3. Generate Answer
         │                                         ▼
         │                                   ┌──────────┐
         │                                   │ Generate │
         │                                   │  Answer  │
         │                                   └────┬─────┘
         │                                        │
         │  4. Share Response Code                │
         │◄───────────────────────────────────────┤
         │                                        │
    ┌────┴─────┐                                  │
    │  Decode  │                                  │
    │  Answer  │                                  │
    └────┬─────┘                                  │
         │                                        │
         │        5. P2P Connection               │
         │◄──────────────────────────────────────►│
         │         Established                    │
         │                                        │
         ▼                                        ▼
    ┌─────────────────────────────────────────────────┐
    │         Encrypted P2P Communication             │
    │                                                 │
    │   • All messages AES-256-GCM encrypted         │
    │   • Direct peer connection (no server)          │
    │   • No message storage anywhere                 │
    └─────────────────────────────────────────────────┘
```

## Security Model

### Encryption Layers

1. **Transport Layer (DTLS)**
   - WebRTC DataChannel uses DTLS by default
   - Provides channel encryption

2. **Application Layer (AES-256-GCM)**
   - All messages encrypted before transmission
   - Keys generated locally using Web Crypto API
   - Keys embedded in invite code (shared out-of-band)

### Key Exchange

```
┌────────────────────────────────────────────────────────────────┐
│                    Key Generation & Exchange                    │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Creator generates:                                          │
│     • WebRTC Offer (SDP)                                       │
│     • AES-256 Key (32 bytes random)                            │
│     • IV for encryption (12 bytes random)                      │
│                                                                 │
│  2. Bundle into Invite Code:                                    │
│     • Base64(Offer + Key + IV)                                 │
│                                                                 │
│  3. Joiner extracts:                                           │
│     • WebRTC Offer → Create Answer                             │
│     • AES Key + IV → Store for encryption                      │
│                                                                 │
│  4. Both peers now share:                                       │
│     • Same AES-256 key                                         │
│     • Same initialization vector                               │
│     • Direct P2P channel                                       │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Message Sending

```
User Input → Encrypt(AES-256-GCM) → WebRTC DataChannel → Network
                     │
                     └── Uses shared key from invite code
```

### Message Receiving

```
Network → WebRTC DataChannel → Decrypt(AES-256-GCM) → Display
                                        │
                                        └── Same shared key
```

### File Transfer

```
File Selection
      │
      ▼
┌─────────────────┐
│ Read as chunks  │
│ (64KB each)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Encrypt chunk   │
│ (AES-256-GCM)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send via        │
│ DataChannel     │
└────────┬────────┘
         │
         ▼
   Remote Peer
         │
         ▼
┌─────────────────┐
│ Decrypt chunk   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reassemble file │
└────────┬────────┘
         │
         ▼
   Download
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI | React 18 + TypeScript | Component-based UI |
| Styling | TailwindCSS | Utility-first CSS |
| P2P | WebRTC DataChannel | Direct peer communication |
| Encryption | Web Crypto API | AES-256-GCM encryption |
| Build | Vite | Fast development & bundling |
| Mobile | Capacitor | Native Android/iOS wrapper |

## Privacy Guarantees

| Aspect | Guarantee |
|--------|-----------|
| Registration | None required |
| Tracking | Zero analytics/tracking |
| Storage | No message persistence |
| Servers | No message relay servers |
| Metadata | No connection logs |
| Identity | Anonymous usernames only |
