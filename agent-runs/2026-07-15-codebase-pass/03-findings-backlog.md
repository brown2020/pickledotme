# Agent Report

## Agent

Name: Codex primary agent

## Scope

Converted the clean baseline, dependency diagnostics, official release metadata, import evidence, and timer/async source review into a prioritized package and correctness backlog.

## Inputs

Baseline report, `npm outdated`, `npm audit`, `npm ls`, npm package engine/peer metadata, official AI SDK/Firebase/ESLint/TypeScript documentation, direct import searches, and timer-bearing hooks/components.

## Branch and Push

- Branch: `dev`
- Upstream: `origin/dev`
- Commit: pending findings checkpoint
- Pushed to: pending `origin/dev`
- Sync status: clean and synchronized at `c806ce6` before findings report edits

## Loop

- Name: Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop
- Goal: identify only evidence-backed, locally verifiable bugs, races, package updates, warnings, and cleanup
- Verify gate: every finding has severity, file/command evidence, owned files, risk, and a verification method
- Stop condition: the backlog is prioritized and the highest-priority executable task is clear
- Attempt: 1 of 2
- Result: passed; four concrete lifecycle bugs and a controlled package migration are ready to execute

## Run State

- Current phase: Findings Backlog
- Current task: T-003
- Last pushed commit: `c806ce6`
- Next action: commit/push findings, then fix timer/async lifecycle bugs before package changes
- Blockers: none

## Commands Run

```text
source TODO/error/timer/AbortController search
direct dependency import/config search
npm view <major package>@latest version peerDependencies engines
npm ls websocket-driver
npm ls postcss
official migration/release documentation lookup
targeted source inspection for AI, Firebase Admin, Sequence, Word, Reaction, Pickle Pop, shared timer, and sound flows
```

## Findings

| ID | Severity | Type | Status | Area | Summary | Evidence | Risk | Effort | Verification | Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | P0 | Package update/security | Open | Firebase transitive graph | Critical `websocket-driver@0.7.4` advisories | `npm audit`; `npm ls websocket-driver` traces through `firebase@12.12.1` | Critical resource exhaustion/message corruption exposure | Small | update Firebase; clean install; audit | T-005 |
| F-002 | P1 | Bug | Open | `useGameTimer` | `subtractTime()` can set time to zero without calling `onTimeUp`, leaving a game active indefinitely | `useGameTimer.ts`: the interval exits when `timeLeft <= 0`; Pickle Pop subtracts time for rotten pickles | Core game fails to end | Small | lint/type/build plus direct lifecycle review | T-004 first |
| F-003 | P2 | Race condition | Open | `useSequenceGame` | Async sequence playback continues after reset/unmount and can overwrite reset state | uncancelled chained `setTimeout` promises in `showSequence()` | stale UI and post-unmount updates | Small | token/cancellation review; lint/type/build | T-004 |
| F-004 | P2 | Race condition | Open | `useWordGame` | Correct/wrong-attempt timeouts survive reset, time-up, restart, and unmount | untracked 1,000ms/500ms timeouts | new word or state mutation after game ends | Small | timeout ownership review; lint/type/build | T-004 |
| F-005 | P2 | Race condition | Open | `useReactionGame` | Pending round timeout has reset cleanup but no unmount cleanup | `timeoutRef` plus no cleanup effect | post-unmount state/save work | Small | cleanup review; lint/type/build | T-004 |
| F-006 | P1 | Package update | Open | Direct dependency graph | 25 direct packages are outdated, including compatible major families | `npm outdated --long`; latest package peers/engines accept Node 22/React/Zod used here | missed fixes/security/support | Medium | controlled installs; lint/type/build | T-005 |
| F-007 | P2 | Package update/security | Open | Next/PostCSS graph | Next embeds vulnerable `postcss@8.4.31`; npm's forced-fix downgrade is unsafe | `npm audit`; `npm ls postcss` | moderate XSS advisory remains | Small | update Next; apply compatible override if needed; audit/build | T-005 |
| F-008 | P2 | Documentation | Open | `README.md` | Runtime, package versions, AI providers/models, and install guidance drift from code/package metadata | README vs `package.json` and `getAdvice.ts` | misleading setup/test handoff | Small | rendered diff/search; lint/build | T-005 |
| F-009 | P3 | Dead code/install cleanup | Open | `node_modules` | Six extraneous WASM/N-API packages exist in current install tree | `npm ls --depth=0` | noisy/non-reproducible local tree | Small | clean `npm ci`; `npm ls --depth=0` | T-005 |
| F-010 | P2 | Test gap | Deferred | Runtime behavior | No automated test suite covers game timers, auth, Firestore, or AI streaming | no `test` script or test files | static/build gates cannot prove external/runtime behavior | Medium | future focused unit/integration suite | document residual risk |

### Execution Order

1. F-002 through F-005: correctness/lifecycle fixes in one bounded bug-fix phase.
2. F-001, F-006, F-007, and F-009: controlled package families, clean install, audit, and migration fixes.
3. F-008: reconcile README only after final installed versions are known.
4. Strict review and stabilization; keep F-010 deferred because adding a test framework is a separate product-engineering investment.

## Changes Made

- Findings report and run ledger only; no source or package files changed.

## Verification

Every direct production dependency has source/config/import evidence or is a required React/Next peer; no direct dependency removal is currently proven safe. Firebase Admin 14 and AI SDK 7 require Node 22, which matches the verified local runtime. Firebase Admin imports already use the modular entry points required by v14.

## Architecture and Lean Code Scorecard

| Area | Status | Evidence | Action |
| --- | --- | --- | --- |
| Dependency direction | Pass | Routes/components -> hooks/providers -> services remains clear | Preserve |
| Module cohesion | Watch | Large advice module remains but is unrelated to verified failures | Defer refactor |
| Public surface area | Pass | Major package APIs used in a small set of files | Migrate exact call sites only |
| Data and side-effect flow | Pass | Auth/advice/score service ownership is explicit | Preserve |
| Async/cache/resource lifecycle | Fail | F-002 through F-005 are concrete timer/cancellation defects | Fix in T-004 |
| Duplication and dead code | Watch | No source deletion proof; extraneous install artifacts only | Clean install; no speculative deletion |
| Dependency lean-ness | Fail | 25 outdated direct packages and 3 advisories | Update/audit in T-005 |
| Testability | Watch | Lint/type/build pass; no runtime test suite | Record residual risk |

## Quality Gate

- Command: baseline `npm run lint`, TypeScript, and build plus read-only searches
- Result: passed; findings are source/package evidence rather than new failures
- Notes: no source/package edits in this phase

## Commit-Push Checkpoint

- Status inspected: clean and synchronized before report edits
- Diff checked: passed with `git diff --check`; only T-003 report/ledger files changed
- Files staged: pending exact findings report/ledger staging
- Dry-run push: pending
- Push: pending
- Post-push sync: pending

## Stabilization

- Cycle: not started
- Completion criteria status: executable findings queued
- Remaining blockers: none

## Risks

Major package families can introduce compile/runtime migration work. External AI and Firebase calls cannot be exercised without credentials, which remain intentionally unread.

## Open Questions

- None.

## Recommended Next Step

Fix F-002 through F-005 with explicit timer ownership and cancellation, then run lint, TypeScript, and build before package updates.
