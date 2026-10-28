# Roadmap

Punchlist after the 2026-10-28 maintenance pass on `dev`. No open GitHub issues or pull requests.

## Next

1. QA this `dev` head, including a failed Google sign-in on `/login` (popup closed, popup blocked, and a bad network). The form should stay put and show the error. A successful sign-in should still land on `/` or the safe `redirect` path.
2. Promote `dev` to `main` only after that QA. Do not deploy Firebase rules again unless the rules files change; rules and indexes from `f462b00` are already deployed.
3. Move CI from Node 22 to Node 24 when you want the Firebase web SDK engine warning gone. `@firebase/*` asks for `node >= 24.12.0`. Node 22 still installs and runs. That bump is a Steve decision because it changes the CI image and any host that matches CI.

## Held upgrades

- TypeScript 7.0.2 is the latest release. Hold at 6.0.3 until `typescript-eslint` accepts it. 8.72.1 peers `typescript >=4.8.4 <6.1.0`, and `eslint-config-next` depends on that line.
- Keep `"jwks-rsa": { "jose": "5.10.0" }` while firebase-admin 14 and jwks-rsa 4 are installed. jose 6 is ESM-only and crashes `require('jwks-rsa')`.

## Known limitations

- Game scores are client-reported. The server caps them and stores `verified: false` / `source: "client"`. A determined client can still submit a legal score it did not earn. Server-side game simulation would be a new design.
- Advice has no App Check. Abuse control is the verified-email gate plus 20 requests per hour.
- Provider model ids are pinned (`gpt-5.2`, `claude-sonnet-4-5`, `gemini-2.5-flash`, `mistral-large-latest`). Change one only when that provider retires it.
- Vitest prints a future warning: `vitest.config.mts` uses `__dirname`, which the native config loader will not accept. Switch to `import.meta.dirname` when that loader becomes the default.
- `actions/checkout@v4` and `actions/setup-node@v4` warn that their Node 20 runtime is deprecated. Bump the action major when the replacements are the documented default.

## Not in this pass

- No Firebase rules or index deploy.
- No Vercel project, domain, or env var changes.
- No new secrets. CI already has the `NEXT_PUBLIC_FIREBASE_*` secrets it needs to build.
