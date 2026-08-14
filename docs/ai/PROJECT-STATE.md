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

- Status: BLOCKED — TECHNICAL OR PLATFORM BLOCKER.
- Branch: `task/BPC-META-FOUNDATION-001`; start `47f55f24340bc3407ebcbaee56f7c17b37f75318`; foundation records `1cab7381c4103e356d2802370bf1085c25e267f9`.
- Portfolio `913146750869963`; Page `1153511934521436`; Instagram `17841401039012650`; new ad account `2258717414903571`; Dataset `2092696251642333`; catalog `1046542707869496`; Commerce Account `1995776851046152`; domain `1033409412946916`.
- Foundation writes and Shopify integration QA are recorded under `docs/bpc-meta/`; no product commercial data or theme file changed.
- Instagram remains attached to restricted Instagram-created account `1104252943250335`. Two blank Switch dialogs, failed permission assignment, failed Facebook OAuth exposure, and unknown direct-claim errors establish the platform blocker.
- Historical personal account `55495642` is separate and review-expired. Both historical accounts remain preserved/read-only.
- Read-only automation project validated at commits `87f6065` and `eee3faf`; live connector OAuth remains pending.
- First-US-ad deployable manifest exists, but no Meta draft was created because Instagram, domain, Purchase/deduplication, creative, budget, and payment gates remain open.
- Owner explicitly deferred payment setup. Nstyled writes/queries: 0. Live ad spend: USD 0.
- Exact continuation and safe fallback: `docs/bpc-meta/NEXT_TRIGGER.md`.

## BPC-CAT-PI-FAST-CORE-001

- Status: CHANGES_REQUIRED — SOURCE_CONFLICT / NO SHOPIFY WRITE.
- Branch `task/BPC-CAT-PI-FAST-CORE-001`; start `fb63136`; tooling/evidence commit `d8b7f2f`.
- Same immutable job accepted; Shopify identity PASS for Best Prints Co. / `cute-sneakers.myshopify.com` / Shop `25581027408`. AKILTA writes: 0.
- Exact pre-read: 68/68. Authority/protected checks PASS except live `descriptionHtml` conflicts with both frozen Current and frozen Final on 68/68; `SOURCE_CONFLICT=68`, `PROTECTED_DRIFT=0`.
- Shopify mutation count: 0; userErrors: 0. Post-read: 68/68 full equality and 68/68 protected equality.
- Four `NO_WRITE_EVIDENCE_EXHAUSTED` Capri products remained untouched 4/4.
- Regression ST-012: PASS_FAIL_CLOSED / `DELTA_REBUILD_REQUIRED`; seeded spot checks 5/5.
- PI Completion Registry, PCC, and Current Project State updated. Tags, media, alt, and title writes remained closed.
- Exact continuation: BPC-MASTER must reconcile/delta-rebuild the 68 Current DescriptionHtml authority rows before the same scope can be reissued.

### Capri baseline reconciliation

- State corrected to `BASELINE_RECON_PASS — PRIOR SOURCE_CONFLICT WAS BASELINE-SELECTION FALSE POSITIVE`.
- Change Log row 1363 makes manifest Proposed DescriptionHtml the authorized interim baseline candidate.
- Fresh exact comparison: A EXPECTED_INTERIM 68; B ALREADY_FINAL 0; C TRUE_SOURCE_CONFLICT 0.
- Exact and normalized live-vs-Proposed equality: 68/68. Live-vs-Final equality: 0/68.
- Shopify identity PASS; read count 68/68; mutation count 0; four NO_WRITE products untouched 4/4.
- Evidence tooling commit `5a7d6fd`; private result `tmp/BPC-CAT-PI-FAST-CORE-001/capri-baseline-reconciliation.json`.
- No PCC global summary write. Tags, media, alt, title, and final Description/SEO mutation remain closed.

### Canonical reissue check — 2026-08-14T11:23:50Z

- Fresh-read Operating Manual v2.4, PCC `Workstreams & Locks` row 8, `Codex Jobs` row 41, Current Project State, Change Log row 1363, and CAT-PI registries.
- No final Description/native SEO reissue exists: the lock still permits read-only exact-68 reconciliation only, and the job remains `BLOCKED — execution closed / CHANGES_REQUIRED`.
- Codex cannot assume the BPC-MASTER planning/priority role or self-authorize the mutation. Shopify/Drive mutation count for this check: 0.
- Terminal condition: BPC-MASTER/ChatGPT must record an explicit reissue of the same immutable exact-68 final Description/native SEO scope in the canonical queue; then Codex may re-accept and execute it.

### Read-only Capri baseline reconciliation rerun — 2026-08-14T12:07:47Z

- Same immutable job and exact 68 scope; Best Prints Co. identity PASS.
- Fresh Proposed-first result: A EXPECTED_INTERIM 68, B ALREADY_FINAL 0, C TRUE_SOURCE_CONFLICT 0; exact and normalized LIVE==Proposed 68/68.
- Independent pre/post full equality 68/68 and protected equality 68/68; four NO_WRITE exceptions unchanged 4/4; mutation count 0.
- Private evidence: `tmp/BPC-CAT-PI-FAST-CORE-001/capri-baseline-recon-20260814T1127Z/result.json`; Tags, media, titles, other families, and frozen content remained untouched.
