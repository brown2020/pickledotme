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
  - OpenAI GPT-4o
  - Google Gemini 1.5 Pro
  - Anthropic Claude 3.5 Sonnet
  - Mistral Large
  - Fireworks LLaMA v3p1 405B
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
- **Styling**: Tailwind CSS 4.0.8
- **UI Components**: Framer Motion 12.4.7, Lucide React 0.479.0

### AI Integration

- **AI SDK**: Vercel AI SDK 4.0.6
- **AI Providers**:
  - @ai-sdk/openai 1.0.5
  - @ai-sdk/google 1.0.4
  - @ai-sdk/anthropic 1.0.2
  - @ai-sdk/mistral 1.0.3

## 📦 Installation

### Prerequisites

- Node.js 18+
- Firebase project
- AI provider API keys (OpenAI, Google, Anthropic, Mistral, Fireworks)

### Setup

1. Clone and install:

```bash
git clone https://github.com/yourusername/pickledotme.git
cd pickledotme
npm install
```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your API keys:

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
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Start development server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── actions/          # Server actions for AI integration
├── app/              # Next.js App Router pages
│   ├── games/        # Memory games routes
│   ├── pickle/       # AI advice interface
│   └── profile/      # User profile and statistics
├── components/       # React components
│   ├── games/        # Game-specific components
│   ├── home/         # Landing page components
│   ├── pickle/       # AI advice components
│   ├── profile/      # User profile components
│   └── shared/       # Shared UI components
├── constants/        # Application constants
├── hooks/            # Custom React hooks
├── lib/              # Firebase configuration and helpers
├── store/            # Zustand state management
└── types/            # TypeScript type definitions
```

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables
4. Deploy

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
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">
  Built with 🥒 by the Pickle.me Team
</div>
