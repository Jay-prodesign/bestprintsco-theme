# ChatGPT Handoff

Task: CAT-000 + CAT-BACKUP-001 bootstrap
Status: CAT-000 DONE; CAT-BACKUP-001 BLOCKED
Branch: `task/CAT-000-catalog-governance`
Implementation commits: `4a0a4ae`, `d568573`; reviewed coordination-state commit: `24a0d1f`; final coordination record: current PR/branch HEAD.

Changed repository paths: `AGENTS.md`, `.gitignore`, `docs/catalog/`, `schemas/`, `scripts/catalog/governance/`, `tests/fixtures/catalog/`, `data/shopify/snapshots/README.md`, `docs/ai/`.

Shopify resource changes: none. Read-only bulk IDs `5696731447376`, `5696739410000`, and supplemental `5696857374800` completed. Private Drive folder `1jW99qfYFjrP2LLSAp_qarsWMYdcAD20i` contains raw/normalized artifacts. Raw data is absent from Git.

Validation: existing artifact post-upload SHA-256 PASS by independent byte readback; four of five new artifacts now independently PASS from Drive raw-byte base64 streams; inventory/fulfillment coverage and counts PASS; recovery fixture PASS. Blocked: `normalized-inventory-levels.jsonl` (66,458,524 bytes) exceeds the connector's 67,108,864-byte IPC response frame after transport expansion, so its post-upload hash is unverified; deterministic samples remain unrun.

Rollback: revert all PR commits in reverse order, beginning with current PR/branch HEAD coordination changes, then continuation implementation changes, `24a0d1f`, `d568573`, and `4a0a4ae` as applicable; restore prior PCC/Current Project State revisions. No Shopify rollback.

Recommended next action: obtain a supported streaming/direct-byte download for `normalized-inventory-levels.jsonl`, verify its SHA-256, then run the fixed-seed live-versus-backup sample; do not start CAT-MEDIA-001.
