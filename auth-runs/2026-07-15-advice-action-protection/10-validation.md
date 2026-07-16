# Auth Validation

| Check | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Lint | Pass | `npm run lint` | No warnings/errors |
| TypeScript | Pass | `npx tsc --noEmit` | Strict mode |
| Production build | Pass | `npm run build` | 17 static/generated routes |
| Public route | Pass | GET `/` = 200 | Production server |
| Protected routes | Pass | `/pickle`, `/games`, `/profile` = 307 | Return paths preserved |
| Malformed session creation | Pass | POST `{}` = 400 | Expected rejection |
| Hard cookie clearing | Pass | DELETE = 200 | Secure HttpOnly expiration cookie |
| Direct server action auth | Pass by review/build | Shared required-session helper | Credentialed execution manual |
| Firestore client writes | Pass | No client Firestore import; rules deny writes | Admin actions only |
| Password/admin flows | N/A | Product has neither | No inferred expansion |
| Google sign-in/revocation | Manual QA | Requires configured Firebase project | User test surface |
