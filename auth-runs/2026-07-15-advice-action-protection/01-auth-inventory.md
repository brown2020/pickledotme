# Auth Inventory

## Sources Read

`AGENTS.md`, `SPEC.md`, `README.md`, `src/providers/AuthProvider.tsx`, `src/lib/authSession.ts`, `src/lib/firebaseAdmin.ts`, `src/app/api/auth/session/route.ts`, `src/proxy.ts`, protected layouts/pages, advice actions/services, and `firestore.rules`.

## Framework And Firebase

- Next.js 16.2.10 App Router with `proxy.ts`.
- Firebase client 12.16.0 and modular Firebase Admin 14.1.0.
- Google popup sign-in; no non-Firebase auth provider found.
- Server-issued `HttpOnly`, `SameSite=Strict` session cookie; secure in production.

## Current Auth Provider

| Provider | Evidence | Verdict | Replacement Needed |
| --- | --- | --- | --- |
| Firebase | client provider, Admin session endpoint/proxy, Firestore rules | Active/sole provider | No |
| Clerk/Auth.js/Auth0/Supabase/WorkOS/Cognito/custom | no package/import/route evidence | Absent | No |

## Route Classes

| Route | Class | Evidence | Required Guard |
| --- | --- | --- | --- |
| `/`, `/about`, `/privacy`, `/terms` | Public | routes and proxy policy | None |
| `/games`, `/pickle`, `/profile` | Protected | `PROTECTED_ROUTES`, guarded layouts | Verified session cookie plus server checks for backend actions |
| `/api/auth/session` | Session endpoint | route handler | ID-token exchange/delete; JSON/preflight and strict cookie controls |
| Admin routes | None | no route/env policy evidence | N/A |

## Auth State Sources

- Client UI: Firebase `onAuthStateChanged` in `AuthProvider`.
- Server routes: verified session cookie in `proxy.ts`.
- Firestore data before this pass: Firebase Auth plus owner checks in `firestore.rules`.
- Gap: exported `getAdvice` server action had no session verification, so proxy-only page protection was insufficient.
- Gap: assistant messages were written by the Firebase client even though rules intentionally permit only user-role client messages.

## Auth State And Drift Risks

- Client/session cookie sync is asynchronous; existing UI intentionally stays client-driven.
- `AuthProvider` re-subscribes when `user` changes and can issue duplicate session sync work.
- Session-sync failures are console-only; this scoped pass will surface a user-facing auth error.
- External provider/Firebase-console state cannot be verified without credentials and remains a manual QA surface.

## Firebase Rules Verdict

The prior owner checks prevented forged writes, but shipping authority-bearing write code was unnecessary. Final architecture routes every Firestore read/write through revoked-cookie-checked Admin actions and denies all browser Firestore writes.

## Baseline Commands

`npm run lint`, `npx tsc --noEmit`, `npm run build`, scoped React Doctor, and Git diff checks.
