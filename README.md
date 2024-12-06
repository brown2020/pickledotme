# Pickle.me 🥒

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://pickledotme.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[Live Demo](https://pickledotme.vercel.app/) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

## 📖 Overview

Pickle.me combines multiple AI language models with brain-training games, offering both personalized advice and cognitive exercises. Built with Next.js 15 and Firebase, it features real-time AI responses and engaging pickle-themed memory challenges.

## ✨ Key Features

### 🤖 Multi-Model AI Advice

- Support for multiple AI providers:
  - OpenAI GPT-4
  - Google Gemini Pro
  - Anthropic Claude
  - Mistral Large
  - Fireworks LLaMA
- Real-time streaming responses
- Conversation history tracking
- Markdown-formatted responses

### 🎮 Memory Games

- **Sequence Pickle**: Simon Says-style pattern memorization
- **Matching Pickles**: Timed pair-matching challenge
- **Speed Pickle**: Visual recognition game

### 👤 User System

- Google OAuth authentication
- Progress tracking
- Game statistics
- User profiles

## 🛠️ Technical Stack

### Core Technologies

- **Frontend**: Next.js 15.0.3 (App Router)
- **Language**: TypeScript 5
- **Auth/Database**: Firebase 11.0.1
- **State Management**: Zustand 5.0.1
- **Styling**: Tailwind CSS 3.4.1

### AI Integration

```json
{
  "@ai-sdk/anthropic": "^1.0.2",
  "@ai-sdk/google": "^1.0.4",
  "@ai-sdk/mistral": "^1.0.3",
  "@ai-sdk/openai": "^1.0.5",
  "ai": "^4.0.6"
}
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- Firebase project
- AI provider API keys (OpenAI, Google, etc.)

### Setup

1. Clone and install:

```bash
git clone https://github.com/brown2020/pickledotme.git
cd pickledotme
npm install
```

2. Configure environment variables:

```env
# AI Provider Keys
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
MISTRAL_API_KEY=your_key
FIREWORKS_API_KEY=your_key

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

3. Start development server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── actions/          # Server actions (AI integration)
├── app/
│   ├── games/       # Game routes & logic
│   ├── pickle/      # AI advice interface
│   └── profile/     # User management
├── components/
│   ├── games/       # Game components
│   ├── pickle/      # Advice components
│   └── layout/      # Common layouts
├── lib/             # Firebase & utilities
└── hooks/           # Custom React hooks
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  Built with 🥒 by the Pickle.me Team
</div>
