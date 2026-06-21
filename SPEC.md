# SPEC.md

## Current Product

Pickle.me is an AI advice and brain-training game app. The current implementation provides a public home/about/legal surface, authenticated routes for games, AI advice, and profile views, Firebase-backed authentication and score storage, and a themed React UI.

## Current User Workflows

- Visitors can view public marketing, about, privacy, and terms pages.
- Users can authenticate with Firebase-backed Google auth through the client provider and server session endpoint.
- Authenticated users can access `/games`, `/pickle`, and `/profile`.
- Users can play six configured games: sequence, reaction, matching, pop, speed, and word.
- Game scores are written to Firestore history and best-score collections through `scoreService`.
- Users can request AI advice with a selected model and tone through `src/actions/getAdvice.ts`.

## Architecture Summary

- Framework: Next.js App Router with React and TypeScript strict mode.
- Styling: Tailwind CSS with utility components in `src/components/ui`.
- Auth: Firebase client auth plus Firebase Admin session cookies.
- Route protection: `src/proxy.ts` redirects unauthenticated protected-route access.
- Persistence: Firestore service modules in `src/services`.
- AI: Vercel AI SDK with OpenAI, Anthropic, Google, and Mistral providers.
- Client state: React context for auth/theme, SWR for score reads, Zustand for persisted settings.
- Game behavior: shared state in `useGameBase` and game-specific hooks under `src/hooks`.

## Current Validation Surface

- Repo-defined scripts: `npm run dev`, `npm run build`, `npm run start`.
- TypeScript is configured with `strict: true` and `noEmit: true`.
- ESLint flat config exists, but no package script currently runs it.
- No dedicated test script is currently defined in `package.json`.

## Known Quality Risks

- Persisted best-score loading and shared game state appear split between `useScores` and `useGameBase`, which needs verification before score-related fixes.
- The largest interactive module is `src/app/pickle/PickleContent.tsx`, which may be a maintainability hotspot.
- Documentation has version and command drift from `package.json`.
- AI provider docs and code currently differ from some README model/provider descriptions.
- Local ignored secret-like files exist in the workspace; they should remain untracked and unread.

## Improvement Goals For This Run

- Establish a clean `dev` branch and pushed, resumable run state.
- Record accurate repo guidance and current-state documentation.
- Establish baseline validation with the repo-defined checks.
- Build an evidence-backed findings backlog.
- Prioritize confirmed bugs and low-risk maintainability fixes that preserve product behavior.
- Avoid creating new roadmap priorities in this workflow.
