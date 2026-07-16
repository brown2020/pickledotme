# Firebase Auth

## Providers

- Google popup sign-in remains the sole user-facing provider.
- Firebase client auth is used only for browser identity/bootstrap.
- Firebase Admin verifies revoked session cookies for every protected server action.

## Error Mapping

Popup cancellation and network errors retain user-friendly messages. Session creation/clearing failures now propagate to the provider and render an auth error instead of being console-only.

## Account/Profile

Display name, email, and avatar behavior is unchanged. No admin role or account-management expansion was in scope.
