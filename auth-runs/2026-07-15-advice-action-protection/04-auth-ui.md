# Auth UI

## Scope Result

The product uses Google popup sign-in rather than password/email forms. Password visibility, reset-password, email-action, and verification-screen work are therefore not applicable.

## Changes

- Preserved the existing header and home sign-in controls.
- Session-cookie sync failures now surface through the existing `authError` UI.
- Rejected protocol-relative redirect values in addition to non-relative paths.
- Kept loading states during Firebase bootstrap and server-session synchronization.

## Accessibility And Responsive QA

Native buttons now default to `type="button"`; header/theme/sound buttons have explicit types and accessible labels. Lint and production build passed. Interactive browser sign-in remains manual credentialed QA.
