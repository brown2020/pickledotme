# AGENTS.md

## Project Snapshot

Pickle.me is a Next.js App Router application for AI advice and authenticated brain-training games. The app uses React, TypeScript, Tailwind CSS, Firebase Auth/Firestore, Firebase Admin session cookies, SWR, Zustand, Vercel AI SDK providers, and Framer Motion.

## Current Branch Workflow

- Default improvement branch: `dev`.
- `dev` was created from `origin/main` for the 2026-06-20 codebase-improvement run and tracks `origin/dev`.
- Keep the working tree clean before sync, commit, or push steps.
- Do not read or print local secret files such as `.env` or `service_key.json`.
- Use exact file staging for run reports, docs, and source changes.

## Commands

The current `package.json` exposes:

```bash
npm run dev
npm run build
npm run lint
npm run start
```

`npm run lint` uses the ESLint flat config in `eslint.config.mjs`.

The repository currently has no dedicated test or typecheck script. Use
`npx tsc --noEmit` for an explicit TypeScript gate, and use `npm run build` as
the production integration check. The verified local toolchain for the
2026-07-15 dependency pass is Node.js 22.22.3 with npm 11.17.0.

TypeScript 6.0.3 and ESLint 9.39.5 are the newest versions supported by the
current Next.js lint stack. TypeScript 7 is outside TypeScript-ESLint's
published range, while Next's React/import/accessibility plugins do not yet
support ESLint 10. Treat those two newer majors as compatibility migrations,
not routine package bumps.

## Architecture Notes

- `src/app/` contains Next.js App Router pages, layouts, and the auth session API route.
- `src/proxy.ts` handles protected route redirects and security headers.
- `src/lib/authSession.ts` and `src/lib/firebaseAdmin.ts` own server-side session-cookie configuration and Firebase Admin initialization.
- `src/providers/` owns client auth and theme context.
- `src/actions/getAdvice.ts` streams advice through selected AI providers.
- `src/actions/adviceThreads.ts` and `src/actions/scores.ts` own session-verified Firestore access through Firebase Admin.
- `src/hooks/useGameBase.ts` provides shared game state and score-saving behavior.
- Individual game hooks in `src/hooks/use*Game.ts` coordinate game-specific state.
- UI components live under `src/components/`, with game components grouped under `src/components/games/`.

## Risk Areas

- Score persistence spans `useGameBase`, game-specific hooks, `useScores`, and the server actions in `src/actions/scores.ts`; changes need targeted verification.
- Auth boundaries depend on server-issued session cookies plus proxy checks; avoid trusting client auth state for protected server behavior.
- Advice state orchestration lives in `src/app/pickle/PickleContent.tsx`; history and conversation rendering live in focused components under `src/components/pickle/`.
- The repo has local ignored secret-like files present in the workspace; do not inspect or commit them.
- The README and older assistant guidance may mention commands or versions that drift from `package.json`.

## Validation Notes

- Prefer `npm run lint`, `npx tsc --noEmit`, and `npm run build` as the standard gates.
- For dependency updates, also run `npm outdated`, `npm audit`, and a clean
  `npm ci` before the final lint/typecheck/build sequence.
- For docs/report-only changes, record when build or other checks are not run or fail for pre-existing reasons.
- For score changes, verify best-score and history behavior through the relevant hook/server-action path.
- For auth/session changes, verify both cookie creation/deletion and protected-route proxy behavior.
