# Decision Log

| ID | Decision | Evidence | Alternatives | Result |
| --- | --- | --- | --- | --- |
| DEC-001 | Keep protection-only scope | React Doctor found direct-call server gap during CBI review | Full auth product expansion | Existing product/provider behavior preserved |
| DEC-002 | Reuse verified session-cookie UID for actions | `proxy.ts` already verifies with revocation checks | Trust client user/proxy visibility | Server truth at backend boundary |
| DEC-003 | Move all advice and score data access to Admin server actions | Rules protected client writes, but a server-only authority boundary is simpler and removes browser authority fields | Keep rule-checked client writes | All Firestore browser writes are denied; ownership derives from verified sessions |
| DEC-004 | Preserve current cookie options/routes | Existing endpoint uses HttpOnly/Secure/Strict/path `/`; no evidence requiring product change | Redesign session model | Narrow repair only |
| DEC-005 | Keep Firebase as the sole auth provider | Existing Google/Firebase flow is complete and no competing provider exists | Provider migration | No auth-provider churn |
| DEC-006 | Treat three final React Doctor warnings as false positives | Built chunk has no app collection or `userId` strings; remaining strings are Firebase Auth internals, and query warnings target Admin actions after `requireAuthenticatedSessionUid()` | Suppress rules or redesign collections | Recorded evidence without suppression |
