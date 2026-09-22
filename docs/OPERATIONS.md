# Operations

Operational readiness for Pickle.me: quality gates, failure drills, monitoring,
and rollback. Proportional to a Next.js App Router + Firebase Auth/Firestore +
multi-provider AI advice app with authenticated games and score persistence.

## Quality gates

Local (same commands as CI):

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
runs `npm ci` → lint → typecheck → test → build on pushes to `dev`/`main` and on
pull requests. Public Firebase client env names (`NEXT_PUBLIC_FIREBASE_*`) are
wired as workflow `env` so `next build` can import client init at module load.
`OPENAI_API_KEY` and other provider secrets are not required for lint/typecheck/test/build.

Observed green run on `dev` at `4ce76ece23ef9ea2178ade312cb9eff8908e1b2d`:
https://github.com/brown2020/pickledotme/actions/runs/35694569068 (CI `check`
conclusion `success`, including `scores-auth`, `scores-recovery`, and
`advice-recovery` tests).

Local vs CI vs host:

| Concern | Local | CI | Host (Vercel + Firebase) |
| --- | --- | --- | --- |
| Node | developer machine (22.x) | Actions Node 22 | Vercel Node |
| `NEXT_PUBLIC_FIREBASE_*` | `.env` / `.env.local` | workflow `env` (pickledotme project only) | Vercel project env |
| Provider API keys (`OPENAI_API_KEY`, etc.) | `.env.local` | absent (build does not call providers) | Vercel secrets |
| Auth/data | live Firebase project | none (unit tests mock Admin/Firestore) | live Firebase project |

## Critical operations and owners

| Operation | Owner | Failure surface |
| --- | --- | --- |
| Score write / best-score | `src/actions/scores.ts` + `requireAuthenticatedSessionUid` | Auth deny before Firestore; zod validation; transaction write; `revalidatePath` for `/profile` and games |
| Advice stream | `src/actions/getAdvice.ts` | Session required; unsupported model throws; `streamText` `onError` / catch → stream error (no silent success) |
| Advice threads CRUD | `src/actions/adviceThreads.ts` | Session uid + ownership checks; batch write recovery covered by tests |
| Session / route gate | `src/lib/requireAuth.ts` + `src/proxy.ts` | Server actions verify session via Admin; proxy redirects only (not mutation authority) |
| Client crash isolation | `src/components/ErrorBoundary.tsx`, `src/app/error.tsx` | Providers wrap the tree; route-level error UI with retry |

## Failure drills (observed)

Automated evidence (also run in CI):

1. **Unauthenticated / invalid session score write** —
   `src/__tests__/scores-auth.test.ts` — missing or bogus session cookie →
   `Authentication required`; Firestore Admin must not be reached.
2. **Score write recovery** — `src/__tests__/scores-recovery.test.ts` —
   duplicate submits become separate history rows; transient create failure
   retries without inventing success; concurrent writes preserve ownership.
3. **Advice thread recovery** — `src/__tests__/advice-recovery.test.ts` —
   duplicate creates and commit failure paths stay consistent.
4. **Unauthenticated advice thread create** — `scores-auth.test.ts` —
   deny inside the server action before Firestore writes.

Manual smoke (optional after deploy):

```bash
npm run build && npm run start -- -p 3010
# Unauthenticated call to saveGameResult / advice thread create → deny, no write.
# Forged session cookie → Authentication required.
```

## Monitoring and diagnostics

- Route errors: `src/app/error.tsx` shows a sanitized message and optional
  `error.digest` (no stacks or secrets in UI); logs digests server/client console.
- Feature crashes: `ErrorBoundary` isolates the provider tree.
- CI is the primary actionable signal for lint/typecheck/test/build regressions on `dev`.
- Host health: Vercel deployment status + Firebase console (Auth/Firestore). No
  separate APM required at current risk.

## Rollback / restore

1. **App rollback** — in Vercel, promote the previous production deployment, or
   `git revert` the bad commit on `dev` and let the host redeploy.
2. **Data** — Firestore is the source of truth for scores and advice threads;
   session cookies remain Auth-issued. Restoring an older deployment does not
   require rebuilding a local cache beyond `revalidatePath` owners in
   `ARCHITECTURE.md`.
3. **Rules** — `firestore.rules` / `storage.rules` deploy via Firebase tooling when
   changed; keep ownership checks intact.
4. **Secrets drift** — Vercel owns provider secrets and `NEXT_PUBLIC_FIREBASE_*`;
   CI embeds only pickledotme public Firebase client values for build (never
   other apps’ keys).

## Configuration ownership

| Config | Owner | Drift check |
| --- | --- | --- |
| Public Firebase client | Vercel env + `.env.example` + CI workflow `env` | Names must match `src/lib/firebaseConfig.ts`; project must be pickledotme |
| Provider API keys | Vercel secrets / local `.env.local` | Never commit; CI build must not require them |
| Quality gate commands | `package.json` scripts + `.github/workflows/ci.yml` | Keep AGENTS.md Commands in sync |
| Runtime budget | `docs/PERFORMANCE_BUDGET.md` | Re-measure after large dependency or bundle changes |
