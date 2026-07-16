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
| F-001 | P0 | Package update/security | Done | Firebase transitive graph | Critical `websocket-driver@0.7.4` advisories | Firebase 12.16 removes the audited path; clean audit | Critical resource exhaustion/message corruption exposure | Small | clean install and audit passed | checkpoint T-005 |
| F-002 | P1 | Bug | Done | `useGameTimer` | `subtractTime()` can set time to zero without calling `onTimeUp`, leaving a game active indefinitely | fixed with synchronized refs and guarded completion outside state updaters | Core game fails to end | Small | lint/type/build plus direct lifecycle review passed | checkpoint T-004 |
| F-003 | P2 | Race condition | Done | `useSequenceGame` | Async sequence playback continues after reset/unmount and can overwrite reset state | playback ID invalidates stale work after each delay and lifecycle exit | stale UI and post-unmount updates | Small | cancellation review; lint/type/build passed | checkpoint T-004 |
| F-004 | P2 | Race condition | Done | `useWordGame` | Correct/wrong-attempt timeouts survive reset, time-up, restart, and unmount | owned timeout set clears on all lifecycle exits | new word or state mutation after game ends | Small | timeout review; lint/type/build passed | checkpoint T-004 |
| F-005 | P2 | Race condition | Done | `useReactionGame` | Pending round timeout has reset cleanup but no unmount cleanup | cleanup effect uses existing timeout owner | post-unmount state/save work | Small | cleanup review; lint/type/build passed | checkpoint T-004 |
| F-006 | P1 | Package update | Done | Direct dependency graph | 25 direct packages were outdated, including compatible major families | all moved to latest compatible versions; only incompatible TS7/ESLint10 majors deferred | missed fixes/security/support | Medium | clean install/lint/type/build passed | checkpoint T-005 |
| F-007 | P2 | Package update/security | Done | Next/PostCSS graph | Next embedded vulnerable `postcss@8.4.31`; npm's forced-fix downgrade was unsafe | direct-reference override dedupes Next to `postcss@8.5.19`; audit/build pass | moderate XSS advisory removed | Small | audit/build passed | checkpoint T-005 |
| F-008 | P2 | Documentation | Done | Dependency docs | Runtime, package versions, AI providers/models, and install guidance drifted from code/package metadata | README/CLAUDE/AGENTS/SPEC reconciled to final graph/code | misleading setup/test handoff | Small | search/diff/lint/build passed | checkpoint T-005 |
| F-009 | P3 | Dead code/install cleanup | Done | `node_modules` | Six extraneous WASM/N-API packages existed in the prior install tree | clean `npm ci`; `npm ls --depth=0` has none | noisy/non-reproducible local tree | Small | clean install and tree check passed | checkpoint T-005 |
| F-011 | P1 | Auth/security bug | Done | AI advice actions | Exported advice action trusted page proxy and assistant persistence used a client write forbidden by rules | direct revoked-cookie session checks plus Admin persistence | unauthorized direct invocation and lost replies | Medium | auth review, lint/type/build, signed-out smoke | checkpoint T-006 |
| F-012 | P1 | Data authority/security | Done | Advice and scores | Browser code supplied ownership fields and best-score writes were client-authorized | all Firestore access moved to session-owned Admin actions; rules deny client writes | larger browser attack surface and mutable leaderboard authority | Medium | imports/rules/actions review, build, React Doctor | checkpoint T-006 |
| F-013 | P2 | Game correctness | Done | Matching/Reaction/Sequence/Speed/Word/Pop | Matching/Reaction did not end shared state, Sequence/Speed wrote duplicate interim histories, hinted final letters skipped the penalty, and state updaters performed side effects | one final-score end boundary, hint override, ref-owned pickle/results transitions | stuck controls, duplicate history, and incorrect scores | Medium | source review, lint/type/build | checkpoint T-006 |
| F-014 | P2 | React/UI quality | Done | Providers/components | 78 React Doctor hypotheses included real reduced-motion, button, provider drift, component/state, dead-code, and bundle issues | high-confidence findings fixed; three security diagnostics evidence-classified as false positives | accessibility/performance/maintenance regressions | Medium | React Doctor reduced to 3 reviewed warnings/0 errors | checkpoint T-006 |
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
| Dependency direction | Pass | Final client -> action -> Admin flow keeps server authority out of browser bundles | Preserve |
| Module cohesion | Pass | Advice reducer/history/conversation and focused action modules | Preserve |
| Public surface area | Pass | Dead barrels/helpers/exports removed after reference proof | Preserve |
| Data and side-effect flow | Pass | Session-owned Admin reads/writes and transactional best scores | Preserve |
| Async/cache/resource lifecycle | Pass | F-002 through F-005 and timer ownership follow-ups closed | Preserve |
| Duplication and dead code | Pass | Duplicated history UI and verified dead source removed | Preserve |
| Dependency lean-ness | Pass | Compatible latest graph, clean tree, zero audit | Revisit TS7/ESLint10 peers later |
| Testability | Watch | Lint/type/build/smoke pass; no credentialed automated suite | Record residual risk |

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
