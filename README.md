# Pickle.me 🥒

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://pickledotme.vercel.app/)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

**AI-powered advice meets brain-training games**

[Live Demo](https://pickledotme.vercel.app/) • [Getting Started](#-getting-started) • [Features](#-features) • [Contributing](#-contributing)

</div>

---

## 📖 About

Pickle.me is a Next.js 16 application that combines AI-powered advice with engaging brain-training games. Whether you're stuck in a pickle and need guidance, or want to sharpen your cognitive skills with fun challenges, Pickle.me has you covered.

### Why Pickle.me?

- **🤖 Multi-Model AI** - Choose from 4 leading AI providers for personalized advice
- **🎮 6 Brain Games** - Train memory, reflexes, and problem-solving skills
- **🌙 Dark Mode** - Full dark mode support for comfortable viewing
- **📱 Responsive** - Works beautifully on desktop, tablet, and mobile
- **🔒 Secure** - Firebase authentication with server-side route protection

---

## ✨ Features

### AI Advice Engine

Get thoughtful, actionable advice for any dilemma using your choice of AI model:

| Provider  | Model                  |
| --------- | ---------------------- |
| OpenAI    | GPT-5.2 Chat Latest    |
| Google    | Gemini 2.5 Flash       |
| Anthropic | Claude Sonnet 4.5      |
| Mistral   | Mistral Large (latest) |

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
| [Next.js](https://nextjs.org/)            | 16.2.10 | React framework with App Router |
| [React](https://react.dev/)               | 19.2.7  | UI library                      |
| [TypeScript](https://typescriptlang.org/) | 6.0.3   | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)  | 4.3.2   | Utility-first styling           |

### AI & Backend

| Technology                                                                              | Version | Purpose                    |
| --------------------------------------------------------------------------------------- | ------- | -------------------------- |
| [Vercel AI SDK](https://sdk.vercel.ai/)                                                 | 7.0.29  | AI streaming & integration |
| [@ai-sdk/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)               | 4.0.15  | OpenAI provider            |
| [@ai-sdk/google](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) | 4.0.17  | Google AI provider         |
| [@ai-sdk/anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic)         | 4.0.15  | Anthropic provider         |
| [@ai-sdk/mistral](https://sdk.vercel.ai/providers/ai-sdk-providers/mistral)             | 4.0.12  | Mistral provider           |
| [Firebase](https://firebase.google.com/)                                                | 12.16.0 | Auth & Firestore database  |
| [Firebase Admin](https://firebase.google.com/docs/admin/setup)                          | 14.1.0  | Server session validation  |

### UI & Animation

| Technology                                                   | Version | Purpose                 |
| ------------------------------------------------------------ | ------- | ----------------------- |
| [Framer Motion](https://www.framer.com/motion/)              | 12.42.2 | Animations              |
| [Lucide React](https://lucide.dev/)                          | 1.24.0  | Icons                   |
| [SWR](https://swr.vercel.app/)                               | 2.4.2   | Data fetching & caching |
| [react-markdown](https://github.com/remarkjs/react-markdown) | 10.1.0  | Markdown rendering      |

### Utilities

| Technology                                                  | Version | Purpose                |
| ----------------------------------------------------------- | ------- | ---------------------- |
| [Zod](https://zod.dev/)                                     | 4.4.3   | Schema validation      |
| [clsx](https://github.com/lukeed/clsx)                      | 2.1.1   | Class name utilities   |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.6.0   | Tailwind class merging |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22 or later
- **npm** (the committed lockfile is npm-managed)
- **Firebase** project with Firestore and Authentication enabled
- **API Keys** from at least one AI provider (OpenAI, Google, Anthropic, or Mistral)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/brown2020/pickledotme.git
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
# Firebase Configuration (required)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin configuration (required for sessions and persisted app data)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

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
│   ├── adviceThreads.ts  # Session-owned advice persistence
│   ├── authSession.ts    # Session-cookie synchronization
│   ├── getAdvice.ts      # AI advice generation
│   └── scores.ts         # Transactional score persistence and reads
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
│   ├── firebaseConfig.ts # Firebase setup
│   └── validations.ts    # Zod schemas
├── providers/
│   ├── AuthProvider.tsx  # Firebase auth context
│   ├── ThemeProvider.tsx # Dark mode
│   └── index.tsx         # Provider composition
├── proxy.ts              # Route protection (Next.js 16)
└── types/
    ├── advice.ts         # Advice records
    ├── matching-game.ts  # Matching game types
    └── score.ts          # Score records
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

# Run the strict TypeScript gate
npx tsc --noEmit
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

- Saves scores through a session-verified server action
- Manages play/pause/reset states
- Tracks best scores

Timer logic is shared via `useGameTimer` for consistency.

#### Data Fetching

- **SWR** for client-side data with caching
- **Server Actions** for AI streaming and session-owned data access
- **Firestore Admin SDK** for persistent storage; browser Firestore writes are denied

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
6. **Verify** with `npm run lint`, `npx tsc --noEmit`, and `npm run build`
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

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE.md) file for details.

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

[Report Bug](https://github.com/brown2020/pickledotme/issues) • [Request Feature](https://github.com/brown2020/pickledotme/issues)

</div>
