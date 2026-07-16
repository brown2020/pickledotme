# CLAUDE.md - AI Coding Assistant Guide for Pickle.me

## Project Overview

**Pickle.me** is an AI-powered advice platform with brain-training games. Users get guidance from multiple AI models (GPT-5.2, Claude Sonnet 4.5, Gemini 2.5 Flash, Mistral Large) and train cognitive skills with 6 pickle-themed mini-games.

**Live:** https://pickledotme.vercel.app/
**License:** AGPL-3.0

## Tech Stack

- **Framework:** Next.js 16.2.10 (App Router) + React 19.2.7 + TypeScript 6.0.3 (strict)
- **Styling:** Tailwind CSS 4.3.2
- **AI:** Vercel AI SDK 7.0.29 with multi-provider support
- **Auth/DB:** Firebase 12.16.0 + Firebase Admin 14.1.0 (Google OAuth, session cookies, and Firestore)
- **State:** Zustand (settings), SWR (data fetching), React Context (auth/theme)
- **UI:** Framer Motion, Lucide React, react-markdown

## Project Structure

```
src/
├── actions/           # Session, advice, and score Server Actions
├── app/               # Next.js App Router pages
│   ├── api/auth/      # Session management
│   ├── games/         # Games routes (protected)
│   ├── pickle/        # AI advice interface
│   └── profile/       # User stats
├── components/
│   ├── games/         # 6 game implementations + common/
│   ├── ui/            # Base components (Button, Card, Input, etc.)
│   └── layout/        # Header, Footer, PageBackground
├── hooks/             # Custom hooks (useGameBase, useSound, useScores, etc.)
├── lib/               # Utilities (cn, firebase configs, validations)
├── providers/         # Auth + Theme contexts
├── stores/            # Zustand stores
├── types/             # TypeScript types
└── proxy.ts           # Route protection (Next.js 16 middleware replacement)
```

## Commands

```bash
npm run dev      # Dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Strict TypeScript check
npm start        # Production server
```

## Key Patterns

### Game Architecture
- All games extend `useGameBase()` hook for shared state/auth/scoring
- Game-specific hooks in `src/hooks/use[GameName]Game.ts`
- Timer logic centralized in `useGameTimer()`
- Scores: `bestScores` (single best per game) + `scoreHistory` (all attempts)

### Route Protection
- `proxy.ts` validates session cookies via Firebase Admin SDK
- Protected routes: `/games`, `/pickle`, `/profile`
- Redirects to home with `?redirect=` param

### Data Fetching
- **SWR** for cached client orchestration
- **Server Actions** for AI streaming and all Firestore access
- **Firebase Admin** for session-verified persistence

### Validation
- Zod schemas in `src/lib/validations.ts`
- `validateOrThrow()` for server actions
- `.safeParse()` for client form validation

### Styling
- Tailwind utilities with `cn()` helper (clsx + tailwind-merge)
- Dark mode: class-based ("light"/"dark" on html element)
- Primary color: emerald
- Font: Outfit

### Audio
- Web Audio API synthesized tones (not file-based)
- Zustand store for mute toggle with localStorage persistence

## Environment Variables

```bash
# AI Providers (at least one required)
OPENAI_API_KEY
GOOGLE_API_KEY
ANTHROPIC_API_KEY
MISTRAL_API_KEY

# Firebase (required)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Server-side Firebase Admin sessions and Firestore access
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

## Adding a New Game

1. Create hook: `src/hooks/use[GameName]Game.ts` (extend `useGameBase`)
2. Create component: `src/components/games/[GameName].tsx`
3. Add config: `src/config/games.ts` (metadata, difficulty, colors)
4. Register: `src/app/games/[gameId]/GameContent.tsx`
5. Export: `src/components/games/index.ts`

## Code Style

- Functional components with hooks
- `"use client"` for interactive components
- Server Actions for backend operations
- Type inference preferred; explicit types for public APIs
- Game IDs are branded types (`GameId`) for compile-time validation

## Error Handling

- Service boundaries translate Firebase failures into user-facing messages
- Server actions validate untrusted input with Zod before processing

## Security Notes

- httpOnly session cookies (not client-accessible tokens)
- Firestore rules in `firestore.rules`
- CSP headers configured in proxy.ts
- Server-side session validation for protected routes
