# Decision Log

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| AI-DEC-001 | 2026-07-14 | Use `docs/ai/` as the GitHub communication layer. | Persistent review evidence. | active |
| CAT-DEC-000 | 2026-07-22 | Shopify/live is runtime truth; PCC Codex Jobs is the shared queue. | Prevent stale IDs/counts and overlapping work. | active |
| CAT-DEC-001 | 2026-07-22 | Resume duplicate scan only at SKU-STREAM-201 after PP.13849559. | Preserve completed work. | active |
| CAT-DEC-002 | 2026-07-22 | Preserve the original publication artifact and append an immutable corrective artifact. | Microsoft Copilot publication existed before the snapshot but was omitted from historical evidence. | superseded-blocker-resolved |
| CAT-DEC-003 | 2026-07-22 | Mark CAT-BACKUP-001 DONE; do not activate or start catalog mutation in this run. | Corrective artifact hash, 17/17 identical-seed sample, pagination and restore fixture all pass with zero unexplained differences. | active |
| CAT-DEC-004 | 2026-07-22 | Activate bounded autonomy at 2026-07-22T14:25:22Z for the smallest Sol CAT-MEDIA pilot only. | Backup, locks, current scope, immutable prewrite evidence and exact rollback all passed before the first write. | active |
| CAT-DEC-005 | 2026-07-22 | Accept PILOT-001 as PASS and stop before scaling; route later exact-rule checkpoints to Terra. | One association changed with zero user errors; complete protected-field/readback/storefront QA passed and unexplained differences were zero. | active |
| CAT-DEC-006 | 2026-07-22 | Stop CHECKPOINT-010 before treating any mutation as successful. | Connector mutation response was incomplete, so `userErrors = 0` was unproven; Shopify reread showed the target unchanged. | active |
| META-DEC-001 | 2026-08-03 | Disconnect only the legacy partial BestPrintsCo Page–Instagram link after explicit owner acceptance, then claim the exact Instagram ID through the controlling portfolio. | The partial link blocked the portfolio claim; Nstyled separation and historical preservation remain controlling. | owner-authentication-pending |
| META-DEC-002 | 2026-08-03 | Do not treat historical ad account `55495642` as the Instagram-claim cause without an exact ownership error. | Its live Page assignments exclude Best Prints Co, the portfolio has no pending/sent claim, and the only exact observed claim error is an invalid OAuth CSRF nonce. | active |
