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
| META-DEC-001 | 2026-08-03 | Preserve and exact-ID separate all BestPrintsCo, historical Cvtie, Nstyled, and unknown assets before writes. | Names are not reliable identity and Nstyled is absolutely protected. | active |
| META-DEC-002 | 2026-08-03 | Use clean portfolio-owned account `2258717414903571`; preserve but never spend from `1104252943250335` or `55495642`. | The legacy Instagram account is restricted and the personal historical account is disabled/review-expired. | active |
| META-DEC-003 | 2026-08-03 | Stop Instagram switch retries after two identical blank dialogs and route release/review through Meta's functioning support surface. | Exact permission/OAuth/switch failures establish a platform blocker; blind retries add risk. | active |
| META-DEC-004 | 2026-08-03 | Leave the new ad account payment method blank and keep spend at zero. | Explicit owner decision; financial setup and Publish remain owner-only. | active |
| META-DEC-005 | 2026-08-03 | Preserve Dataset `2092696251642333` as controlling after excluding preview traffic and finding no Nstyled source. | Historical Cvtie measurement is clean enough to retain and production-domain allowlisting prevents future contamination. | active |
| META-DEC-006 | 2026-08-03 | Keep the organic queue inactive and provide a deployable first-US-ad manifest instead of a live draft. | Approved creative/cadence, Purchase health, Instagram, domain, budget, and payment gates remain open. | active |
| PI-DEC-001 | 2026-08-14 | Fail closed and perform no Capri Description/SEO mutation for the exact 68 title-PASS rows. | Fresh live descriptionHtml differs from both the frozen Current and frozen Final values on all 68 rows; ST-012 requires DELTA_REBUILD_REQUIRED. | active |
| PI-DEC-002 | 2026-08-14 | Preserve the four evidence-exhausted Capri products and keep Tags, media, alt, and title stages closed. | Exact pre/post equality proves no Shopify resource changed; the immutable handoff authorizes only the current Description/SEO gate. | active |
