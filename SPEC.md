# SPEC.md

## Product

Pickle.me is an AI advice app with six pickle-themed brain-training games. Visitors can read the public pages. Signed-in users play games, view a profile, and request advice from one of four providers.

Live origin: `https://pickle.me`.

## Accounts and sessions

- Email/password sign-up, sign-in, password reset, and Google popup sign-in (`src/providers/AuthProvider.tsx`).
- Email sign-up sends a verification message. Advice is refused until `email_verified` is true. Game scores do not require a verified email.
- The client exchanges a Firebase ID token for an httpOnly session cookie at `POST /api/auth/session` (7 days, `SameSite=strict`). The secure cookie name is `__Host-pickle-session`. On insecure HTTP the name is `pickle-session`.
- `src/proxy.ts` sends anonymous users from `/games`, `/pickle`, and `/profile` to `/login?redirect=`. Signed-in users are sent away from `/login`, `/signup`, and `/forgot-password`.
- Redirect targets pass through `safeInternalPath` (`https://pickle.me` origin, no backslash or protocol-relative tricks).
- A failed Google, email, or sign-up attempt sets `authFlow` to `failed`. The auth listener must not mint a session or leave the auth page while the attempt is `pending` or `failed`, so the mapped error stays on the form. An idle restored Firebase user may still refresh the cookie and leave `/login`.
- Confirmed invalid session cookies are cleared. Transient verifier failures deny the request and keep the cookie.
- `ALLOW_INSECURE_DEV_AUTH=true` with `NODE_ENV` other than production accepts the dev cookie value `dev`. Production ignores it.
- Production responses include a nonce Content-Security-Policy. The root layout reads `x-nonce`. Development does not emit that policy.

## Games

Configured in `src/config/games.ts`:

| Id | Name |
| --- | --- |
| `sequence-pickle` | Sequence Pickle |
| `reaction-pickle` | Reaction Pickle |
| `matching-pickles` | Matching Pickles |
| `pickle-pop` | Pickle Pop |
| `speed-pickle` | Speed Pickle |
| `word-pickle` | Word Pickle |

Shared timer, score, and save behavior lives in `useGameBase`. `endGame` reads the latest score from a ref so a same-tick penalty is not dropped. Each game has its own hook under `src/hooks`.

## Scores

- `saveGameResult` checks the session, validates the game id and score, then consumes the score quota (40 per hour).
- Stored rows include `verified: false` and `source: "client"`.
- Caps: reaction 1000, matching 800, word 50000, sequence / speed / pop 100000.
- Best scores and the leaderboard are Admin SDK reads. Ordered queries use the composite indexes in `firestore.indexes.json`, with an unordered fallback if the index is missing.
- Firestore rules: owner can read their `scores` and `scoreHistory`; client writes are denied. `bestScores` and `rateLimits` are denied to clients.

## Advice

- Page: `/pickle`. Models, unchanged: `gpt-5.2`, `claude-sonnet-4-5`, `gemini-2.5-flash`, `mistral-large-latest`.
- Tones: balanced, gentle, blunt, coach, funny. Follow-ups keep the thread's model and tone.
- Provider calls require a verified session, then the advice quota (20 per hour).
- Provider failures are logged on the server. The client sees a generic unavailable message, the verification message, or the rate-limit message.
- Threads are stored per user through Admin SDK actions.

## Stack

- Next.js 16.4 App Router, React 19.3, TypeScript 6.0 strict, Tailwind CSS 4.3, Framer Motion 14.
- Firebase JS 13 and firebase-admin 14. `jwks-rsa` 4 is pinned to `jose` 5.10.0 via `overrides`.
- ESLint 10 with `eslint-config-next` 16.4. Vitest 5.
- `firebase.json` maps Firestore rules, Firestore indexes, and Storage rules. Storage allows owner image uploads under 5 MB (`png`, `jpeg`, `webp`, `gif`).

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI on `dev` and `main` runs that sequence on Node.js 22 (`.github/workflows/ci.yml`). The Firebase web SDK declares `node >= 24.12.0`; Node 22 still loads it and npm prints `EBADENGINE`.

TypeScript 7.0 is published. `typescript-eslint` 8.72 peers `typescript <6.1.0`, so the app stays on TypeScript 6.0.3.
