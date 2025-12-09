# Contributing to POP

First off, thank you for considering contributing to POP! It's people like you that make POP such a great tool for private communication.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, be patient, and be welcoming.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Browser/OS/device** information
- **Screenshots** if applicable

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature has already been suggested
- Provide a clear use case
- Explain how it benefits privacy/security
- Consider backward compatibility

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our style guide
4. **Test thoroughly** - ensure nothing is broken
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/pop_app.git
cd pop_app

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Style Guide

### Code Style

- **TypeScript** - Use strict typing where possible
- **React** - Functional components with hooks
- **Formatting** - ESLint rules apply automatically
- **Naming** - camelCase for variables/functions, PascalCase for components

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (no logic change)
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add file sharing progress indicator
fix: resolve connection timeout on slow networks
docs: update architecture diagram
```

### Security Considerations

When contributing, keep in mind:

- **Never log sensitive data** (encryption keys, message content)
- **No external analytics** or tracking
- **No unnecessary dependencies** - each addition is a potential attack vector
- **Review crypto code carefully** - when in doubt, ask

## Project Structure

```
pop_app/
├── src/
│   ├── components/     # React components
│   │   ├── HomeScreen.tsx
│   │   ├── CreateRoom.tsx
│   │   ├── JoinRoom.tsx
│   │   └── ChatScreen.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useChat.ts  # Main chat logic
│   ├── lib/            # Utilities
│   │   ├── crypto.ts   # Encryption functions
│   │   ├── webrtc.ts   # WebRTC handling
│   │   └── types.ts    # TypeScript types
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── docs/               # Documentation
└── android/            # Capacitor Android project
```

## Testing

Currently, manual testing is the primary method. When testing:

1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Test with slow network conditions
4. Test with VPN/proxy setups
5. Verify encryption by inspecting WebRTC traffic

## Questions?

Feel free to open an issue with your question or reach out via:
- GitHub Issues
- Pull Request comments

## Recognition

Contributors will be recognized in our README. Thank you for making POP better!
