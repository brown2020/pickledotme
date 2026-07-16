# Auth Protection Plan

## Mode

Protection-only sub-run inside the active codebase stabilization pass.

## Session Truth

Add one server-only helper that maps the existing session cookie to a verified UID (including the explicitly opt-in insecure development cookie). Reuse it in proxy and every advice server action.

## Owned Changes

1. `src/lib/authSession.ts`, `src/proxy.ts`, `src/actions/getAdvice.ts`: shared verified-session UID and direct-call authorization.
2. `src/lib/firebaseAdmin.ts`, server actions, `PickleContent`, advice/score hooks: route every Firestore read/write through Admin after verifying the session and resource ownership; remove browser Firestore access.
3. `AuthProvider`: stabilize auth observer ownership, check session endpoint results, expose sync errors, and memoize context value.
4. Reports/docs and validation only; no sign-in provider, protected-route policy, cookie name/options, or product access changes.

## Verify Gate

- Unauthenticated/invalid-cookie server actions reject before provider/database work.
- Valid sessions expose only the verified UID.
- Assistant writes verify parent ownership and run through Admin Firestore.
- Firestore rules remain restrictive for client assistant writes.
- Lint, strict TypeScript, build, React Doctor changed-scope review, and diff checks pass.

## Stop Conditions

Stop for missing locally testable Admin API types, a product decision about advice access, or a validation failure that requires credentials. Retry cap: 3 focused attempts per protection task.
