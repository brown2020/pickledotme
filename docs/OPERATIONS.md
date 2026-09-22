# Operations

## Quality gates (local / intended CI)

Run before pushing `dev`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The intended GitHub Actions workflow lives at `docs/github-ci.workflow.yml`
(lint → typecheck → test → build on `dev`/`main` and PRs). Landing it under
`.github/workflows/` requires a GitHub token with the `workflow` scope.

## Failure drill: invalid session on score write

1. Start production build: `npm run build && npm run start -- -p 3010`
2. Call `saveGameResult` without a session (or with a forged cookie).
3. Expect: action-level deny (`Authentication required` / redirect), no Firestore write.
4. Evidence: `src/__tests__/scores-auth.test.ts` asserts unauthenticated denial.

## Rollback

Revert the offending commit on `dev` and redeploy the previous Vercel production
deployment. Session cookies and Firestore remain the source of truth; no local
cache rebuild is required beyond `revalidatePath` owners documented in
`ARCHITECTURE.md`.
