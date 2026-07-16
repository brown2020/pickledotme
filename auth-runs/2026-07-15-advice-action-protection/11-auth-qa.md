# Auth QA

## Browser QA

Automated credentialed Google popup QA was not possible without accessing local secrets or Firebase console state. The user should test Google sign-in, advice persistence, score saving, and sign-out on `dev`.

## API/Server QA

Production smoke checks passed for public/protected routing, malformed session creation, and cookie deletion. Source review confirmed all AI/data actions verify a revoked-cookie-checked session before external work.

## Accessibility And Responsive States

Explicit button types/labels, reduced-motion handling, and responsive header/history components pass lint/build. React Doctor has no unreviewed React/accessibility findings.
