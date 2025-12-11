# Pickle.me 🥒

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://pickledotme.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

**AI-powered advice meets brain-training games**

[Live Demo](https://pickledotme.vercel.app/) • [Getting Started](#-getting-started) • [Features](#-features) • [Contributing](#-contributing)

</div>

---

## 📖 About

Pickle.me is a Next.js 16 application that combines AI-powered advice with engaging brain-training games. Whether you're stuck in a pickle and need guidance, or want to sharpen your cognitive skills with fun challenges, Pickle.me has you covered.

### Why Pickle.me?

- **🤖 Multi-Model AI** - Choose from 5 leading AI providers for personalized advice
- **🎮 6 Brain Games** - Train memory, reflexes, and problem-solving skills
- **🌙 Dark Mode** - Full dark mode support for comfortable viewing
- **📱 Responsive** - Works beautifully on desktop, tablet, and mobile
- **🔒 Secure** - Firebase authentication with server-side route protection

---

## ✨ Features

### AI Advice Engine

Get thoughtful, actionable advice for any dilemma using your choice of AI model:

| Provider  | Model             |
| --------- | ----------------- |
| OpenAI    | GPT-4.1           |
| Google    | Gemini 1.5 Pro    |
| Anthropic | Claude 3.5 Sonnet |
| Mistral   | Mistral Large     |
| Fireworks | LLaMA v3p1 405B   |

- Real-time streaming responses
- Markdown-formatted output
- Conversation context awareness

### Brain Training Games

Six pickle-themed games to challenge your mind:

| Game                 | Difficulty | Description                                     |
| -------------------- | ---------- | ----------------------------------------------- |
| **Sequence Pickle**  | 🟢 Easy    | Simon Says-style pattern memorization           |
| **Reaction Pickle**  | 🟢 Easy    | Test your reflexes - click when it turns green  |
| **Matching Pickles** | 🟡 Medium  | Classic memory card matching game               |
| **Pickle Pop**       | 🟡 Medium  | Whack-a-mole style - pop pickles as they appear |
| **Speed Pickle**     | 🔴 Hard    | Spot the different shade quickly                |
| **Word Pickle**      | 🔴 Hard    | Unscramble pickle-themed words                  |

Features:

- Score tracking and personal bests
- Progressive difficulty levels
- Sound effects (toggleable)
- Combo multipliers

### User System

- Google OAuth authentication
- Personal game statistics
- Score history tracking
- User profiles

---

## 🛠️ Tech Stack

### Core

| Technology                                | Version | Purpose                         |
| ----------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)            | 16.0.3  | React framework with App Router |
| [React](https://react.dev/)               | 19.0.0  | UI library                      |
| [TypeScript](https://typescriptlang.org/) | 5.x     | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)  | 4.0.8   | Utility-first styling           |

### AI & Backend

| Technology                                                                              | Version | Purpose                    |
| --------------------------------------------------------------------------------------- | ------- | -------------------------- |
| [Vercel AI SDK](https://sdk.vercel.ai/)                                                 | 5.0.44  | AI streaming & integration |
| [@ai-sdk/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)               | 2.0.30  | OpenAI provider            |
| [@ai-sdk/google](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) | 2.0.14  | Google AI provider         |
| [@ai-sdk/anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic)         | 2.0.17  | Anthropic provider         |
| [@ai-sdk/mistral](https://sdk.vercel.ai/providers/ai-sdk-providers/mistral)             | 2.0.14  | Mistral provider           |
| [Firebase](https://firebase.google.com/)                                                | 12.2.1  | Auth & Firestore database  |

### UI & Animation

| Technology                                                   | Version | Purpose                 |
| ------------------------------------------------------------ | ------- | ----------------------- |
| [Framer Motion](https://www.framer.com/motion/)              | 12.4.7  | Animations              |
| [Lucide React](https://lucide.dev/)                          | 0.559.0 | Icons                   |
| [SWR](https://swr.vercel.app/)                               | 2.3.6   | Data fetching & caching |
| [react-markdown](https://github.com/remarkjs/react-markdown) | 10.0.0  | Markdown rendering      |

### Utilities

| Technology                                                  | Version | Purpose                |
| ----------------------------------------------------------- | ------- | ---------------------- |
| [Zod](https://zod.dev/)                                     | 4.1.13  | Schema validation      |
| [clsx](https://github.com/lukeed/clsx)                      | 2.1.1   | Class name utilities   |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.4.0   | Tailwind class merging |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **Firebase** project with Firestore and Authentication enabled
- **API Keys** from at least one AI provider (OpenAI, Google, Anthropic, Mistral, or Fireworks)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/pickledotme.git
cd pickledotme
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# AI Provider Keys (at least one required)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
MISTRAL_API_KEY=...
FIREWORKS_API_KEY=...

# Firebase Configuration (required)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# App URL (optional, for metadata)
NEXT_PUBLIC_APP_URL=https://pickle.me
```

4. **Set up Firebase**

   - Create a [Firebase project](https://console.firebase.google.com/)
   - Enable **Authentication** with Google provider
   - Create a **Firestore** database
   - Add your web app and copy the config values

5. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
src/
├── actions/              # Server actions
│   └── getAdvice.ts      # AI advice generation
├── app/                  # Next.js App Router
│   ├── games/            # Games routes
│   │   ├── [gameId]/     # Dynamic game pages
│   │   ├── layout.tsx    # Games layout with auth
│   │   └── page.tsx      # Games list
│   ├── pickle/           # AI advice interface
│   ├── profile/          # User profile & stats
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── games/            # Game components
│   │   ├── common/       # Shared game UI
│   │   ├── MatchingPickles.tsx
│   │   ├── PicklePop.tsx
│   │   ├── ReactionPickle.tsx
│   │   ├── SequencePickle.tsx
│   │   ├── SpeedPickle.tsx
│   │   └── WordPickle.tsx
│   ├── home/             # Landing page
│   ├── layout/           # Header, Footer
│   ├── pickle/           # Advice UI
│   ├── profile/          # Profile UI
│   └── ui/               # Base components
├── config/
│   └── games.ts          # Game configurations
├── constants/
│   └── colors.ts         # Color constants
├── hooks/                # Custom React hooks
│   ├── useGameBase.ts    # Base game logic
│   ├── useGameTimer.ts   # Shared timer hook
│   ├── useMatchingGame.ts
│   ├── usePicklePopGame.ts
│   ├── useReactionGame.ts
│   ├── useScores.ts      # Score fetching (SWR)
│   ├── useSequenceGame.ts
│   ├── useSound.ts       # Audio effects
│   ├── useSpeedPickleGame.ts
│   └── useWordGame.ts
├── lib/
│   ├── cn.ts             # Class name utility
│   ├── errors.ts         # Error handling
│   ├── firebaseConfig.ts # Firebase setup
│   └── validations.ts    # Zod schemas
├── providers/
│   ├── AuthProvider.tsx  # Firebase auth context
│   ├── ThemeProvider.tsx # Dark mode
│   └── index.tsx         # Provider composition
├── proxy.ts              # Route protection (Next.js 16)
├── services/
│   └── scoreService.ts   # Firestore operations
└── types/
    ├── game.ts           # Game types
    ├── matching-game.ts  # Matching game types
    └── user.ts           # User types
```

---

## 🔧 Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Architecture Decisions

#### Route Protection (Next.js 16)

Uses `proxy.ts` (replacing middleware.ts) for server-side route protection:

```typescript
// Protected routes redirect to home if unauthenticated
const PROTECTED_ROUTES = ["/games", "/pickle", "/profile"];
```

Auth state is synced via cookies between client (Firebase) and server (proxy).

#### Game State Management

Games use custom hooks built on `useGameBase`:

- Handles score saving to Firestore
- Manages play/pause/reset states
- Tracks best scores

Timer logic is shared via `useGameTimer` for consistency.

#### Data Fetching

- **SWR** for client-side data with caching
- **Server Actions** for AI streaming responses
- **Firestore** for persistent storage

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed on any platform supporting Next.js 16:

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a feature branch

```bash
git checkout -b feature/amazing-feature
```

4. **Make** your changes
5. **Test** locally with `npm run dev`
6. **Lint** your code with `npm run lint`
7. **Commit** with a descriptive message

```bash
git commit -m "feat: add amazing feature"
```

8. **Push** to your fork
9. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Adding a New Game

1. Create the hook in `src/hooks/use[GameName]Game.ts`
2. Create the component in `src/components/games/[GameName].tsx`
3. Add config to `src/config/games.ts`
4. Register in `src/app/games/[gameId]/GameContent.tsx`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration made easy
- [Firebase](https://firebase.google.com/) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Beautiful animations
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<div align="center">

**Built with 🥒 by the Pickle.me Team**

[Report Bug](https://github.com/yourusername/pickledotme/issues) • [Request Feature](https://github.com/yourusername/pickledotme/issues)

</div>
