<div align="center">

# 🛡️ POP - Private Open Protocol

### Truly free, open-source, serverless P2P encrypted messaging

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P-orange.svg)](https://webrtc.org/)
[![AES-256](https://img.shields.io/badge/Encryption-AES--256--GCM-purple.svg)](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

[**🚀 Live Demo**](https://pop-app-chat.netlify.app) · [**📱 Android APK**](https://github.com/qaaph-zyld/pop_app/releases) · [**📖 Architecture**](./docs/ARCHITECTURE.md)

</div>

---

## ✨ Why POP?

Most "private" messengers still require:
- 📧 Email or phone number
- 🏢 Central servers that can be subpoenaed
- 📊 Metadata logging
- 💰 Premium features for full privacy

**POP requires nothing.** No signup. No servers. No logs. Just encrypted P2P.

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🆓 **Zero Registration** | No email, phone, or account required |
| 🔗 **P2P Architecture** | Direct WebRTC connection (no central server) |
| 🔐 **E2E Encryption** | AES-256-GCM encryption for all messages |
| 👤 **Anonymous** | Random usernames, no identity tracking |
| 📁 **File Sharing** | Send encrypted files directly to peers |
| 💨 **Self-Destructing** | Messages exist only in browser memory |
| 📱 **Mobile Ready** | Android APK available, PWA support |
| 🌐 **Open Source** | 100% transparent, auditable code |

---

## 🔄 How It Works

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Create    │  Share  │    Join     │  Share  │   Direct    │
│    Room     │ ──────► │    Room     │ ──────► │    P2P      │
│  (Invite)   │  Code   │  (Answer)   │  Code   │    Chat     │
└─────────────┘         └─────────────┘         └─────────────┘
```

1. **Create a Room** → Generate an encrypted invite code
2. **Share the Code** → Send it via any channel (SMS, email, etc.)
3. **Friend Joins** → They paste the code and generate a response
4. **Exchange Response** → You paste their response code
5. **Chat Securely** → Direct P2P, all messages AES-256 encrypted

> **No server ever sees your messages.** The invite code contains the encryption key and WebRTC offer, shared out-of-band.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + TypeScript | Modern component architecture |
| **Styling** | TailwindCSS 4 | Utility-first responsive design |
| **Bundler** | Vite 7 | Lightning-fast HMR & builds |
| **P2P** | WebRTC DataChannel | Direct peer communication |
| **Encryption** | Web Crypto API | AES-256-GCM (browser-native) |
| **Mobile** | Capacitor 7 | Native Android wrapper |
| **Icons** | Lucide React | Beautiful open-source icons |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/qaaph-zyld/pop_app.git
cd pop_app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# Output in 'dist' folder - deploy anywhere
```

### Build Android APK

```bash
npm run build
npx cap sync android
npx cap open android
# Build APK in Android Studio
```

---

## 🔒 Security

### Encryption Details

| Aspect | Implementation |
|--------|----------------|
| **Algorithm** | AES-256-GCM |
| **Key Size** | 256 bits (32 bytes) |
| **IV Size** | 96 bits (12 bytes) |
| **Key Exchange** | Out-of-band via invite code |
| **Transport** | WebRTC DTLS (additional layer) |

### Privacy Guarantees

- ✅ **No registration** - Use instantly without any personal info
- ✅ **No servers** - Messages never touch a central server
- ✅ **No storage** - Messages exist only in memory
- ✅ **No metadata** - No connection logs or analytics
- ✅ **No tracking** - Zero telemetry, no cookies
- ✅ **Auditable** - 100% open source code

### What We DON'T Do

- ❌ Store any messages
- ❌ Log IP addresses
- ❌ Track users
- ❌ Collect analytics
- ❌ Use third-party services (except STUN for connection setup)

> **Note**: STUN servers (Google's public servers) are only used for initial NAT traversal during connection setup. They never see message content.

---

## 📱 Mobile Apps

### Android

Download the latest APK from [Releases](https://github.com/qaaph-zyld/pop_app/releases) or build it yourself.

### iOS

Coming soon! For now, use the web app - it works great on Safari.

### PWA

Add to home screen from any browser for an app-like experience.

---

## 🏗️ Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed diagrams of:
- System overview
- Connection flow
- Security model
- Data flow
- File transfer protocol

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

```bash
# Fork the repo, then:
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

Free to use, modify, and distribute. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

- [WebRTC](https://webrtc.org/) - The magic behind P2P
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Browser-native encryption
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tooling
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">

**Made with ❤️ for privacy**

[Report Bug](https://github.com/qaaph-zyld/pop_app/issues) · [Request Feature](https://github.com/qaaph-zyld/pop_app/issues)

</div>
