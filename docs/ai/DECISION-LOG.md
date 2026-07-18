# Decision Log

Purpose: concise record of decisions that future Codex and ChatGPT sessions should preserve.

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| AI-DEC-001 | 2026-07-14 | Use `docs/ai/` as the GitHub communication layer between Codex and ChatGPT. | Prevent project state from living only in chat transcripts. | active |
| AI-DEC-002 | 2026-07-14 | Update AI coordination files after every completed or blocked task. | Enables ChatGPT to review branch state, evidence, blockers, and next actions without copy/paste. | active |
| AI-DEC-003 | 2026-07-14 | Never store secrets, tokens, customer/order data, or authorization headers in coordination files. | Keeps GitHub-safe documentation. | active |
| AI-DEC-004 | 2026-07-18 | Live catalog normalization must use current Shopify Admin data only and must stop before mutation when catalog write scopes are unavailable. | Prevents stale DISC assumptions and unsafe partial catalog mutations. | active |
