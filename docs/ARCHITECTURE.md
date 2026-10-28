# Pickle.me architecture

## Privilege map

| Path | Client | Proxy (`src/proxy.ts`) | Server action / route | Durable store |
| --- | --- | --- | --- | --- |
| Google sign-in | Firebase Auth popup | n/a | `POST /api/auth/session` sets httpOnly session | Firebase Auth |
| `/games`, `/pickle`, `/profile` | UI only | Requires valid session cookie or `307` home | layouts still use loading AuthGuard | n/a |
| `saveGameResult` | calls action | page gate only | `requireAuthenticatedSessionUid` + zod + per-user rate limit; Admin write marked `verified: false` | Firestore `scoreHistory` / `bestScores` |
| Advice threads | calls actions | page gate only | session uid + ownership checks on thread docs | Firestore `adviceThreads` |
| `getAdvice` | calls action | page gate only | verified email + hourly rate limit; provider errors stay server-side | provider APIs |
| Firestore client SDK | read own advice threads and own score history | n/a | leaderboard (`bestScores`) and quotas are Admin-only; rules deny client writes | rules in `firestore.rules` |

Proxy is **not** authorization for mutations. Every mutation re-checks the session with Admin SDK.

## Cache / revalidation owners

| Fact | Writer | Cache owner |
| --- | --- | --- |
| Best score / history | `saveGameResult` (Admin) | Firestore primary; `revalidatePath` for `/profile` and `/games/**`; client SWR mutate on success |
| Advice threads / messages | advice thread actions (Admin) | Firestore primary; `revalidatePath("/pickle")`; client SWR mutate |

## Change exercises (read-only)

1. **Data:** add optional `metadata` string on score submit → update `scoreSubmissionSchema`, `saveGameResult` write, `DisplayScore` type, SWR consumers.
2. **Access:** `bestScores` client reads stay denied. Leaderboard continues via Admin SDK in `getHighScores`.

## CI

GitHub Actions: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs
lint → typecheck → test → build on `dev`/`main` and pull requests. Public
`NEXT_PUBLIC_FIREBASE_*` values for the pickledotme project are set as job `env`.
See [OPERATIONS.md](OPERATIONS.md) for failure drills, local/CI/host matrix, and
rollback. A mirror of the workflow shape (without env) lives at
`docs/github-ci.workflow.yml` for documentation only.
