# Skill Improvement Log

| ID | Trigger | What Happened | Skill Root Cause | Proposed Change | Classification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| SI-001 | None yet | N/A | N/A | N/A | N/A | Pending |
| SI-002 | Final report checkpoint | The final report is required before the final commit exists, so it cannot truthfully include its own final commit hash. | Workflow wants a self-referential value that Git cannot know before commit creation. | Add an explicit "final report commit pending at write time; final answer/post-push check records actual SHA" convention or a post-push ledger step that does not require committing its own hash. | Process improvement | Proposed |

## Applied Updates

- None.

## Source Sync

- Source repo: brown2020/sb-codex-skills
- Commit: None.
- Push status: Not needed.
- Install refresh: Not needed.

## Proposed Future Updates

- Add a final-report self-reference convention so future runs can close cleanly without stale "pending" wording being mistaken for an incomplete run.
