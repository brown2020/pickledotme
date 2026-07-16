# Orchestration Plan

## Mode Selection

- Repo: `/Users/stephenbrown/Code/OPENSOURCE/pickledotme`
- Branch: `dev`
- Work mode: `full`; user-authorized dependency updates, bug/warning fixes, commit, and testing handoff
- Run folder: `agent-runs/2026-07-15-codebase-pass/`
- Verifiable gates: clean/synced Git state; `npm outdated`; `npm audit`; `npm ci`; `npm run lint`; `npx tsc --noEmit`; `npm run build`; scoped diff review
- Human-decision blockers: dependency upgrades that require product behavior changes, unavailable provider credentials, destructive data changes, or unresolved major-version migrations without a local verification path
- Resume policy: re-run Git preflight, read `run-state.md` and `task-queue.md`, validate any in-scope local commit or owned dirty files, then continue the recorded next action

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop | Lint, typecheck, build, outdated, and audit results are classified | All failures have evidence and owners |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes | Task Queue Loop, Fix Validation Loop | Confirmed baseline bugs and warnings are fixed or classified | No locally verifiable P0/P1 issue remains |
| Package Cleanup | Package Cleanup Loop, Dead Code Loop | Kept lockfile churn maps to verified updates; install/lint/type/build pass | Safe updates are complete; risky migrations are documented |
| Review | Judge Loop | Strict diff and report review returns `PASS` or bounded tasks | Findings are fixed, deferred, or blocked with evidence |
| Stabilization | Stabilization Loop, Judge Loop | Final clean install, audit, lint, typecheck, and build pass | Completion criteria pass or a real blocker is recorded |
| Integrate | Commit-Push Checkpoint Loop | Final report, clean worktree, and local/remote sync | All intended work is committed and pushed to `origin/dev` |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | `AGENTS.md`, `SPEC.md`, run plan/state/queue, `01-preflight-and-repo-docs.md` | Startup planning, repository map, and current validation guidance |
| T-002 | `02-baseline-validation.md`, run state/queue | Read-only baseline validation evidence |
| T-003 | `03-findings-backlog.md`, run state/queue | Evidence-backed package, bug, warning, architecture, and lean-code findings |
| T-004 | Confirmed source/config owners plus `04-execute-fixes-and-improvements.md` | Small bug and warning fixes surfaced by baseline or package migration |
| T-005 | `package.json`, `package-lock.json`, dependency docs, `05-package-and-dead-code-cleanup.md` | Controlled dependency updates and proven dead dependency/code cleanup |
| T-006 | Review/stabilization/final reports plus any exact fix owners added to the queue | Judge, stabilize, integrate, commit, and push |
