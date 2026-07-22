# Decision Log

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| AI-DEC-001 | 2026-07-14 | Use `docs/ai/` as the GitHub communication layer. | Persistent review evidence. | active |
| CAT-DEC-000 | 2026-07-22 | Shopify/live is runtime truth; PCC Codex Jobs is the shared queue. | Prevent stale IDs/counts and overlapping work. | active |
| CAT-DEC-001 | 2026-07-22 | Resume duplicate scan only at SKU-STREAM-201 after PP.13849559. | Preserve completed work. | active |
| CAT-DEC-002 | 2026-07-22 | Do not mark CAT-BACKUP-001 DONE. | Post-upload SHA-256 and essential inventory/fulfillment coverage are missing. | blocked |
| CAT-DEC-003 | 2026-07-22 | Keep all later catalog jobs blocked/queued. | Immutable verified backup gate did not pass. | active |
