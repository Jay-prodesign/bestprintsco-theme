# Project State

Status: CAT-AUTO-001 active; CAT-MEDIA-001 CHECKPOINT-010 BLOCKED; scaling stopped
Last updated: 2026-07-22T14:29:30Z
Repository: `Jay-prodesign/bestprintsco-theme`
Store: `cute-sneakers.myshopify.com`
Branch: `task/CAT-000-catalog-governance`
Start commit: `8935359ccbc82262966862845c0de8cd53eadfd4`
Final commit: current PR/branch HEAD
Draft PR: #3

- Runtime themes verified read-only: `130378989648` MAIN/Active; `130374139984` UNPUBLISHED/Draft.
- API version: `2026-07`; model: Sol; activation UTC: `2026-07-22T14:25:22Z`.
- CAT-BACKUP-001 remains DONE. Corrective publication artifact `1ftIqQbEmKW4EykaXhwt19dbj_9YCyVHd`; 17/17 sample PASS; pagination complete; restore fixture PASS; unexplained differences 0.
- Fresh CAT-MEDIA prepared scope: 16 ACTIVE products / 46 exact links, all present; 0 exclusions; complete pagination.
- Pilot: product `6827404427344`, handle `mandala-handcrafted-white-sole-sneakers-2`; detached variant `40130542862416` from media `23339769135184`.
- Shopify mutation count: 1; userErrors: 0. Only the approved association changed. Full protected-field, media, publication and storefront QA passed; unexplained differences 0.
- Rollback validated and available; not applied. No scaling or downstream job started.
- Checkpoint-010 blocker: the first authorized detach call produced no parseable mutation payload, so Shopify `userErrors = 0` cannot be proven. Immediate fresh read shows the requested link remains present; this checkpoint made zero catalog mutations and required no rollback.
- Next action: Resolve the recorded pilot blocker while keeping CAT-MEDIA-001 scaling stopped.

## BPC-META-FOUNDATION-001

- Status: PARTIAL — OWNER AUTHENTICATION REQUIRED.
- Branch: `task/BPC-META-FOUNDATION-001`; start commit `47f55f24340bc3407ebcbaee56f7c17b37f75318`.
- BestPrintsCo portfolio `913146750869963`; Page `1153511934521436`; Instagram `17841401039012650`.
- Legacy partial Page–Instagram link disconnected after explicit owner authorization.
- Clean Instagram portfolio-claim flow is open at `bestprintsco_ olarak giriş yap`.
- Exact continuation and fallback: `docs/bpc-meta/NEXT_TRIGGER.md`.
- Nstyled writes: 0. Live ad spend: 0. Shopify/theme/catalog commercial data: unchanged.
- Follow-up: no pending/sent Instagram claim exists; restricted ad account `55495642` does not list the Best Prints Co Page in its Page assignments.
- Current exact blocker remains a single fresh owner OAuth confirmation; prior exact error was `CSRF nonce is invalid`.

## BPC-PRICING-STOREWIDE-COMPLETION — BLOCKED PRE-WRITE

- Run: `BPC-PRICING-STOREWIDE-20260803`; UTC: `2026-08-03T16:23:34Z`; branch: `task/BPC-PRICING-STOREWIDE-COMPLETION`; start commit: `199d3d712b49737ebc57f9bba07bbfb28715fe2e`.
- Continuity: canonical PCC lane `BPC-PRICING-001`; packet `EXEC-PACKET-PRICING-SITEWIDE-005`; pricing source `BPC-MARKETING — Pricing Implementation Readiness v4` (`17rduqrAg43iYJNAawdFwyo-TVcJz-tQhQ_xymwhY_z4`).
- Exact trigger: PCC `Workstreams & Locks` row 25 remains ACTIVE under another dedicated executor; pricing log records compare-at cleanup through product `6827256610896` and ongoing continuation. Overlapping storewide price/compare-at lock was not acquired.
- Shopify writes: 0. Census/rollback manifests: not created because concurrent catalog mutation makes an exact storewide before-state unstable. Protected-field changes: 0.
- Execution path verified: Shopify CLI `4.6.0`; stored auth for `cute-sneakers`; `shopify store bulk execute` supports JSONL variable files, `--allow-mutations`, `--watch`, and output files. Validated mutation requires `read_products` and `write_products`.
- Safe fallback: no duplicate/direct writes. Resume only after the active executor releases the pricing lock and its final cursor/readback is reconciled; then use the native CLI bulk path, not manual product batches.
- Responsible owner: active `BPC-PRICING-001` executor / BPC-MASTER coordinator. Review condition: canonical lock released or explicitly transferred with a fresh cursor.
