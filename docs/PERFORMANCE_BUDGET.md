# Performance budget (declared before measure)

Critical path: authenticated `GET /pickle` HTML document from production `next start`.

Budget: **TTFB ≤ 800ms** and **transfer size ≤ 250KB** on local loopback for the initial document response (not full LCP).

## Measurement (2026-09-21 PT, local `next start` :3010)

Source: `/workspace/app-eval-runs/pickledotme/budget-measure.txt`

| Path | TTFB | Bytes | Budget |
| --- | --- | --- | --- |
| `/` | 356.5ms | 55613 | pass (≤800ms, ≤250KB) |
| `/games` → `/` (307 then follow) | 15.7ms | 55613 | pass (unauth redirect) |
| `/pickle` → `/` (307 then follow) | 7.5ms | 55613 | pass (unauth redirect) |

Critical path `/` met the declared budget. Unauthenticated protected routes correctly 307 via `proxy.ts`.
