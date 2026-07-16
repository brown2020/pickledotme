# Error And Edge States

## User-Facing Errors

Session synchronization failures now render through `authError`. Advice and deletion failures preserve a visible reducer-owned error state. Score persistence remains non-blocking for gameplay and logs the failure.

## Redirect Safety

Redirects must start with one `/`; protocol-relative `//host` values are rejected.

## CSRF And Abuse Guardrails

Cookies remain `SameSite=Strict`; Next server actions enforce their origin boundary; all action inputs are Zod-validated; AI generation rejects before provider invocation when the session is absent/invalid.

## Stale Session Handling

Proxy and actions share revocation-checked cookie verification. Invalid cookies redirect protected pages and cannot authorize Admin Firestore actions.
