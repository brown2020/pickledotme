# Pickle.me (`pickledotme`)

AI advice for sticky situations plus pickle-themed brain-training games. Sign in with Google, play six mini-games with Firestore-backed scores, and chat with selectable AI models and tones. Live site: [pickle.me](https://pickle.me/).

## Features

Verified from the current codebase:

- Public marketing pages: home, about, privacy, terms
- Auth: Firebase Google sign-in; httpOnly session via `POST /api/auth/session`; route gate in `src/proxy.ts`
- Protected areas: `/games`, `/pickle` (AI advice), `/profile`
- Six games (`src/config/games.ts`): Sequence, Reaction, Matching, Pickle Pop, Speed, Word
- Score history and best scores written through authenticated server actions (`src/actions/scores.ts`) with Firestore Admin
- AI advice streaming (`src/actions/getAdvice.ts`) via Vercel AI SDK — models include `gpt-5.2`, `claude-sonnet-4-5`, `gemini-2.5-flash`, `mistral-large-latest`; tones: balanced, gentle, blunt, coach
- Advice thread persistence (`src/actions/adviceThreads.ts`)
- Dark/light/system theme; Framer Motion page transitions; SWR for score reads; Zustand settings store

## Tech stack

| Area | Choice | Version (package.json) |
| --- | --- | --- |
| Framework | Next.js (App Router) | ^16.3.5 |
| UI | React | ^19.3.0 |
| Language | TypeScript | ^6.0.3 |
| Styling | Tailwind CSS | ^4.3.3 |
| Motion | Framer Motion | ^12.43.0 |
| State | Zustand + SWR + React context | — |
| Auth / data | Firebase client + firebase-admin | ^12.19.0 / ^14.4.0 |
| AI | `ai` v7 + OpenAI / Anthropic / Google / Mistral providers + `@ai-sdk/rsc` | ai ^7.0.109 |
| Markdown | react-markdown | ^10.1.0 |
| Tests | Vitest | ^4.1.11 |

No Stripe in this repo.

## Project structure

```
src/
  app/
    page.tsx, about/, privacy/, terms/
    login/, signup/, forgot-password/
    games/, games/[gameId]/
    pickle/                  # AI advice UI
    profile/
    api/auth/session/
  actions/                   # getAdvice, adviceThreads, scores
  components/                # home, games, pickle, auth, layout, ui
  hooks/                     # per-game hooks, scores, advice, sound
  lib/                       # firebaseConfig, firebaseAdmin, requireAuth, …
  providers/ stores/ types/ config/
  proxy.ts
firestore.rules
storage.rules
.env.example
docs/ARCHITECTURE.md
docs/OPERATIONS.md
.github/workflows/ci.yml
```

## Getting started

### Prerequisites

- Node.js 22 (matches CI) or a current LTS
- npm
- Firebase project + Admin service account
- At least one AI provider API key for `/pickle`

### Clone and install

```bash
git clone https://github.com/brown2020/pickledotme.git
cd pickledotme
npm install
```

### Environment variables

Never commit real values. Start from `.env.example`.

| Name | Purpose | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key | Firebase Console → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | Same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project id | Same |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | Same |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender id | Same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App id | Same |
| `FIREBASE_ADMIN_PROJECT_ID` | Admin SDK project id | Service account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Admin client email | Same |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Admin private key (`\n` escaped) | Same |
| `OPENAI_API_KEY` | OpenAI models (listed in `.env.example`) | [OpenAI API keys](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Claude models (when selected) | Anthropic console |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini models (when selected) | Google AI Studio |
| `MISTRAL_API_KEY` | Mistral models (when selected) | Mistral console |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL for metadata (defaults to `https://pickle.me`) | Your deployed origin |
| `ALLOW_INSECURE_DEV_AUTH` | Local-only: `true` allows session flow without Admin creds (never in production) | Set only on your machine |

Provider keys beyond OpenAI are not in `.env.example` but are required by the corresponding `@ai-sdk/*` packages when those models are chosen.

### Firebase setup

1. Enable Google Auth; authorize your domains.
2. Deploy `firestore.rules` and `storage.rules` (client writes to scores are denied; Admin actions write).
3. Set Admin env vars for session verification and mutations.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |

## Testing and CI

- Vitest covers advice/score recovery, leaderboard auth, and Firebase auth error mapping under `src/__tests__/`.
- CI: lint → typecheck → test → build on `dev`/`main` and PRs (Node 22). Public `NEXT_PUBLIC_FIREBASE_*` come from Actions secrets. Provider keys are not required for the build.

## Deployment

Demo/production: [pickle.me](https://pickle.me/). Configure Firebase public + Admin env vars and AI provider secrets on the host. See `docs/OPERATIONS.md` for failure drills and env matrix.

## Contributing

1. Branch from `dev`.
2. Treat proxy as a UI gate only — mutations must keep `requireAuthenticatedSessionUid` checks.
3. Run lint, typecheck, and tests before opening a PR.
4. Never commit secrets; do not enable `ALLOW_INSECURE_DEV_AUTH` outside local dev.

## License

[GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0).
