# Session And Proxy

## Auth State Model

| State | Source Of Truth | UI Behavior | Server Behavior | Verification |
| --- | --- | --- | --- | --- |
| Bootstrap | Firebase observer + sync pending | Loading skeleton | Existing cookie independently verified | Source/lint/build |
| Signed out | Firebase returns null | Sign-in controls | Cookie cleared | DELETE smoke test 200 |
| Signed in | Firebase user + successful sync | Account controls | Revocation-checked UID | Source/build |
| Stale/invalid | Invalid/revoked cookie | Auth error or signed-out flow | Proxy redirects; actions reject | Shared verifier review |
| Admin | Not applicable | No admin UI | No admin routes | Inventory |

## Session Endpoints And Actions

- Existing `/api/auth/session` POST/DELETE behavior is preserved.
- `syncAuthSession` provides the same secure cookie exchange for the client provider without raw effect-level fetch calls.
- Production cookie: `__Host-pickle-session`, `HttpOnly`, `Secure`, `SameSite=Strict`, path `/`, seven-day maximum age.

## Server Verification

`getVerifiedSessionUid()` verifies session cookies with revocation checking. `requireAuthenticatedSessionUid()` is used before AI-provider or Firestore work. Firestore ownership fields are derived from that UID, never client input.

## Route Protection Matrix

| Scenario | Result | Evidence |
| --- | --- | --- |
| Public `/` signed out | Pass | production smoke: 200 |
| `/pickle` signed out | Pass | 307 to `/?redirect=%2Fpickle` |
| `/games` signed out | Pass | 307 to `/?redirect=%2Fgames` |
| `/profile` signed out | Pass | 307 to `/?redirect=%2Fprofile` |
| Malformed session POST | Pass | 400 |
| Session DELETE | Pass | 200 plus secure clearing cookie |
| Protected server action signed out | Pass by source/build | every exported data/AI action requires verified UID |
| Credentialed signed-in/revoked-cookie flow | Manual | requires Firebase credentials/console state |
