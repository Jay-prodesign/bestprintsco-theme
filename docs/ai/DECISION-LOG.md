# Decision Log

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| AI-DEC-001 | 2026-07-14 | Use `docs/ai/` as the GitHub communication layer. | Persistent review evidence. | active |
| CAT-DEC-000 | 2026-07-22 | Shopify/live is runtime truth; PCC Codex Jobs is the shared queue. | Prevent stale IDs/counts and overlapping work. | active |
| CAT-DEC-001 | 2026-07-22 | Resume duplicate scan only at SKU-STREAM-201 after PP.13849559. | Preserve completed work. | active |
| CAT-DEC-002 | 2026-07-22 | Preserve the original publication artifact and append an immutable corrective artifact. | Microsoft Copilot publication existed before the snapshot but was omitted from historical evidence. | superseded-blocker-resolved |
| CAT-DEC-003 | 2026-07-22 | Mark CAT-BACKUP-001 DONE; do not activate or start catalog mutation in this run. | Corrective artifact hash, 17/17 identical-seed sample, pagination and restore fixture all pass with zero unexplained differences. | active |
