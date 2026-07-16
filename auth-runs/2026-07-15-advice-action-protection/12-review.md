# Auth Review

## Findings

- Fixed: advice generation callable without direct session verification.
- Fixed: assistant messages attempted through a client path forbidden by rules.
- Fixed: session listener re-subscribed on user changes and swallowed cookie-sync failures.
- Hardened: all Firestore access now runs through session-verified Admin actions; browser writes are denied.
- Verified false positive: React Doctor artifact warning is Firebase Auth internals; built chunk contains no app collection names or `userId`.
- Verified false positives: two query-filter warnings target server-only Admin actions after required-session checks.

## Verdict

PASS with credentialed Firebase browser QA remaining for the user.
