# AGENTS.md

## Agent skills

### Issue tracker

GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (`GLOSSARY.md` and `docs/adr/` at repo root). See `docs/agents/domain.md`.

### Grilling

Only ask one question per each grilling round.

### Documentation synchronization

Binding parity rule: Whenever documentation pages, endpoints, configurations, or supported SDKs/libraries change, contributors and AI agents MUST update `static/llms.txt` (the documentation index), `static/onboard.md` (the agent onboarding specification), and `static/llms-full.txt` (consolidated context) to maintain continuous parity between human-facing docs and machine-readable agent specifications.
