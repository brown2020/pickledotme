# Pickle.me (`pickledotme`)

AI advice for sticky situations plus pickle-themed brain-training games. Sign in with email or Google, play six mini-games with Firestore-backed scores, and chat with selectable AI models and tones. Live site: [pickle.me](https://pickle.me/).

## Features

- Public pages: home, about, privacy, terms
- Auth: email/password and Google popup sign-in, email verification, password reset. httpOnly session cookie from `POST /api/auth/session`. Route gate in `src/proxy.ts`
- A failed Google sign-in stays on `/login` (or `/signup`) and shows the error
- Protected areas: `/games`, `/pickle` (AI advice), `/profile`
- Six games (`src/config/games.ts`): Sequence Pickle, Reaction Pickle, Matching Pickles, Pickle Pop, Speed Pickle, Word Pickle
- Scores: authenticated server actions (`src/actions/scores.ts`). History and best scores are stored with `verified: false` and `source: "client"`, with per-game caps. Leaderboard reads go through the Admin SDK
- Advice (`src/actions/getAdvice.ts`) streams from the Vercel AI SDK. Models: `gpt-5.2`, `claude-sonnet-4-5`, `gemini-2.5-flash`, `mistral-large-latest`. Tones: balanced, gentle, blunt, coach, funny. Advice requires a verified email. Threads persist via `src/actions/adviceThreads.ts`
- Quotas in Firestore (`rateLimits`): 20 advice requests per hour, 40 score saves per hour
- Dark/light/system theme, Framer Motion, SWR score reads, Zustand settings

## Tech stack

| Area | Choice | package.json |
| --- | --- | --- |
| Framework | Next.js (App Router) | ^16.4.3 |
| UI | React | ^19.3.1 |
| Language | TypeScript | ^6.0.3 |
| Styling | Tailwind CSS | ^4.3.3 |
| Motion | Framer Motion | ^14.7.1 |
| State | Zustand, SWR, React context | — |
| Auth / data | Firebase client + firebase-admin | ^13.1.0 / ^14.5.0 |
| AI | `ai` + OpenAI, Anthropic, Google, and Mistral providers + `@ai-sdk/rsc` | ai ^7.0.156 |
| Markdown | react-markdown | ^10.1.0 |
| Lint | ESLint + eslint-config-next | ^10.13.0 / ^16.4.3 |
| Tests | Vitest | ^5.0.5 |

`firebase-admin` 14 pulls `jwks-rsa` 4, which needs the `overrides` pin `"jwks-rsa": { "jose": "5.10.0" }` so Node can `require` jose. Leave that pin in place.

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
  lib/                       # firebase, session, rate limit, redirect, CSP
  providers/ stores/ types/ config/
  proxy.ts
firebase.json                # rules + indexes paths
firestore.rules
firestore.indexes.json
storage.rules
.env.example
docs/ARCHITECTURE.md
docs/OPERATIONS.md
.github/workflows/ci.yml
```

## Getting started

### Prerequisites

- Node.js 22 (matches CI)
- npm
- A Firebase project with Auth, Firestore, and Storage, plus an Admin service account
- At least one AI provider key to use `/pickle`

### Install

```bash
git clone https://github.com/brown2020/pickledotme.git
cd pickledotme
npm install
```

### Environment variables

Copy `.env.example` to `.env.local`. Set names only in git; never commit real values.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web config |
| `FIREBASE_ADMIN_PROJECT_ID` | Admin SDK (session cookies, Firestore) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Admin SDK |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Admin SDK private key, with escaped newlines |
| `OPENAI_API_KEY` | `gpt-5.2` |
| `ANTHROPIC_API_KEY` | `claude-sonnet-4-5` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `gemini-2.5-flash` |
| `MISTRAL_API_KEY` | `mistral-large-latest` |
| `NEXT_PUBLIC_APP_URL` | Canonical origin for metadata. Defaults to `https://pickle.me` |
| `ALLOW_INSECURE_DEV_AUTH` | Local only. `true` accepts a dev session cookie when `NODE_ENV` is not production. Never set this on a deployed environment |

CI supplies the `NEXT_PUBLIC_FIREBASE_*` names from Actions secrets. Provider keys are not required to build.

### Firebase

1. Enable Email/Password and Google sign-in. Authorize your domains.
2. `firebase.json` points at `firestore.rules`, `firestore.indexes.json`, and `storage.rules`.
3. Client writes to scores are denied. `scores` reads are owner-only. `bestScores` and `rateLimits` are server-only. Storage uploads are owner-only images under 5 MB.
4. Set the Admin env vars before using session cookies or server actions.

### Run

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

Vitest covers auth error mapping, auth-page redirect policy, advice and score recovery, leaderboard auth, and security controls under `src/__tests__/`.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on `dev`, `main`, and pull requests, on Node 22.

## Deployment

Production: [pickle.me](https://pickle.me/). Set the Firebase public and Admin variables and the AI provider secrets on the host. See `docs/OPERATIONS.md` for the env matrix and failure drills.

## Contributing

1. Branch from `dev`.
2. Treat `src/proxy.ts` as a UI gate. Mutations keep server-side session checks.
3. Run lint, typecheck, and tests before opening a PR.
4. Keep the `jwks-rsa` / `jose` 5.10.0 override while firebase-admin 14 and jwks-rsa 4 are installed.
5. Do not commit secrets, and do not set `ALLOW_INSECURE_DEV_AUTH` outside local dev.

## License

[GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0).
