# Navigation, Account, And Sign-Out

## Result

- Navbar account controls and avatar/name behavior are preserved.
- Logout calls Firebase `signOut` and synchronously requests server-cookie clearing; the observer repeats clearing harmlessly.
- Protected-route return paths are preserved and validated as single-slash internal paths.
- No footer account control or admin navigation exists.

## State Matrix

| State | Navbar Result | Server Session Result |
| --- | --- | --- |
| Bootstrap | Skeleton | Sync pending |
| Signed out | Sign In | Cookie cleared |
| Signed in | Name + Sign Out | Verified cookie |
| Sync error | Error message | Protected actions reject |
| After logout | Sign In | Clearing cookie verified by API smoke test |
