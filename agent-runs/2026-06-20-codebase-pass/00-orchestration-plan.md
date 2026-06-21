# Orchestration Plan

## Mode Selection

- Repo: `/Users/stephenbrown/Code/OPENSOURCE/pickledotme`
- Branch: `dev`
- Work mode: `full`
- Run folder: `agent-runs/2026-06-20-codebase-pass`
- Verifiable gates: Git read, fast-forward pull, dry-run push, workflow scaffold validation, `npm run build`, source search, targeted score/auth checks when code changes
- Human-decision blockers: product roadmap changes, broad architecture redesign, risky major package migrations, credential setup, unsafe local secret/data handling
- Resume policy: read `run-state.md`, `task-queue.md`, current Git state, and the latest phase report before continuing; push validated local commits before new edits

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop, Quality Gate Selection Loop | Repo-defined checks pass or failures are classified | Baseline report pushed |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop, Lean Code Loop | Highest-priority executable tasks pass targeted checks and quality gate | Fix batch pushed or blocked with evidence |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Safe package/dead-code changes are verified | Cleanup pushed or deferred |
| Review | Judge Loop | PASS or bounded follow-up tasks created | Review report pushed |
| Stabilization and Integrator | Stabilization Loop, Judge Loop | Completion criteria pass or real blocker recorded | Final report pushed |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | 00-orchestration-plan.md, run-state.md, task-queue.md | Startup planning and resume state |
| T-002 | AGENTS.md, SPEC.md, 01-preflight-and-repo-docs.md | Repo guidance and current-state docs |
| T-003 | 02-baseline-validation.md | Baseline validation only |
| T-004 | 03-findings-backlog.md, task-queue.md | Evidence-backed findings and scorecard |
