# Pickle.me architecture

## Privilege map

| Path | Client | Proxy (`src/proxy.ts`) | Server action / route | Durable store |
| --- | --- | --- | --- | --- |
| Google sign-in | Firebase Auth popup | n/a | `POST /api/auth/session` sets httpOnly session | Firebase Auth |
| `/games`, `/pickle`, `/profile` | UI only | Requires valid session cookie or `307` home | layouts still use loading AuthGuard | n/a |
| `saveGameResult` | calls action | page gate only | `requireAuthenticatedSessionUid` + zod; Admin write | Firestore `scoreHistory` / `bestScores` |
| Advice threads | calls actions | page gate only | session uid + ownership checks on thread docs | Firestore `adviceThreads` |
| Firestore client SDK | read rules for own threads / signed-in bestScores | n/a | must not write (rules deny client writes) | rules in `firestore.rules` |

Proxy is **not** authorization for mutations. Every mutation re-checks the session with Admin SDK.

## Cache / revalidation owners

| Fact | Writer | Cache owner |
| --- | --- | --- |
| Best score / history | `saveGameResult` (Admin) | Firestore primary; `revalidatePath` for `/profile` and `/games/**`; client SWR mutate on success |
| Advice threads / messages | advice thread actions (Admin) | Firestore primary; `revalidatePath("/pickle")`; client SWR mutate |

## Change exercises (read-only)

1. **Data:** add optional `metadata` string on score submit → update `scoreSubmissionSchema`, `saveGameResult` write, `DisplayScore` type, SWR consumers.
2. **Access:** make `bestScores` owner-only reads in `firestore.rules` while leaderboard continues via Admin SDK in `getHighScores`.

## CI (intended)

The intended GitHub Actions workflow is checked in as `docs/github-ci.workflow.yml`
(lint, typecheck, test, build on `dev`/`main` and PRs). Landing it under
`.github/workflows/` requires a GitHub token with the `workflow` scope; until
then run the same commands locally before push.
