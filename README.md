# POP - Private Open Protocol

A truly free, open-source, serverless P2P encrypted messaging app.

![POP Screenshot](./docs/screenshot.png)

## Features

- **Zero Registration** - No email, phone, or account required
- **P2P Architecture** - Direct WebRTC connection (no central server)
- **E2E Encryption** - AES-256-GCM encryption for all messages
- **Anonymous** - Random usernames, no tracking
- **File Sharing** - Send encrypted files directly
- **Self-Destructing** - Messages exist only in browser memory
- **Open Source** - 100% transparent, auditable code

## How It Works

1. **Create a Room**: Generate an encrypted invite code
2. **Share the Code**: Send it to your friend via any channel
3. **Connect**: Your friend joins and sends back a response code
4. **Chat Securely**: Direct P2P connection, all messages encrypted

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **P2P**: WebRTC DataChannel
- **Encryption**: Web Crypto API (AES-256-GCM)
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Security

- All messages are encrypted using AES-256-GCM before transmission
- Encryption keys are generated locally and never sent to any server
- WebRTC connections use DTLS encryption
- No message history is stored anywhere
- No analytics, no tracking, no logs

## Deployment

This app can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

```bash
npm run build
# Deploy the 'dist' folder
```

## License

MIT License - Free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
