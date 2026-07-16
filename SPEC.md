# SPEC.md

## Current Product

Pickle.me is an AI advice and brain-training game app. The current implementation provides a public home/about/legal surface, authenticated routes for games, AI advice, and profile views, Firebase-backed authentication and score storage, and a themed React UI.

## Current User Workflows

- Visitors can view public marketing, about, privacy, and terms pages.
- Users can authenticate with Firebase-backed Google auth through the client provider and server session endpoint.
- Authenticated users can access `/games`, `/pickle`, and `/profile`.
- Users can play six configured games: sequence, reaction, matching, pop, speed, and word.
- Game scores are written transactionally to Firestore history and best-score collections through `src/actions/scores.ts`.
- Users can request AI advice with a selected model and tone through `src/actions/getAdvice.ts`.

## Architecture Summary

- Framework: Next.js App Router with React and TypeScript strict mode.
- Styling: Tailwind CSS with utility components in `src/components/ui`.
- Auth: Firebase client auth plus Firebase Admin session cookies.
- Route protection: `src/proxy.ts` redirects unauthenticated protected-route access.
- Persistence: session-verified Firebase Admin actions in `src/actions`.
- AI: Vercel AI SDK with OpenAI, Anthropic, Google, and Mistral providers.
- Client state: React context for auth/theme, SWR for score reads, Zustand for persisted settings.
- Game behavior: shared state in `useGameBase` and game-specific hooks under `src/hooks`.

## Current Validation Surface

- Repo-defined scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm run start`.
- TypeScript is configured with `strict: true` and `noEmit: true`.
- ESLint flat config exists and is run by `npm run lint`.
- No dedicated test script is currently defined in `package.json`.
- Dependency changes are verified with npm diagnostics, a clean `npm ci`,
  explicit `npx tsc --noEmit`, lint, and a production build.
- The July 2026 dependency baseline uses AI SDK 7, Firebase Admin 14,
  Next.js 16.2.10, React 19.2.7, Tailwind CSS 4.3.2, TypeScript 6.0.3, and
  ESLint 9.39.5. TypeScript 7 and ESLint 10 remain deferred until the current
  TypeScript-ESLint and Next plugin stack supports them.

## Known Quality Risks

- Score reads and writes cross `useScores`, `useGameBase`, and server actions and need targeted validation when changed.
- Advice orchestration crosses streaming actions, persistence actions, SWR hooks, and reducer state and needs targeted validation when changed.
- Local ignored secret-like files exist in the workspace; they should remain untracked and unread.

## Improvement Goals For This Run

- Establish a clean `dev` branch and pushed, resumable run state.
- Update direct and transitive packages to the newest locally verifiable releases.
- Repair compatibility bugs, warnings, and audit findings exposed by those updates.
- Reconcile dependency/version documentation with the installed package graph.
- Preserve the existing auth, AI advice, score persistence, and game behavior.
- Stabilize with clean install, lint, TypeScript, audit, and production-build evidence.
- Avoid creating new roadmap priorities in this workflow.
