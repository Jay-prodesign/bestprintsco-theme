# ChatGPT Handoff

Task: CAT-AUTO-001 activation and CAT-MEDIA-001 PILOT-001
Status: PASS; bounded autonomy active; stopped after smallest pilot
Branch: `task/CAT-000-catalog-governance`
Start commit: `8935359ccbc82262966862845c0de8cd53eadfd4`
Final commit: current PR/branch HEAD (this coordination record is intentionally non-self-referential)
Draft PR: #3

Shopify change: one `productVariantDetachMedia` mutation removed association `gid://shopify/ProductVariant/40130542862416` → `gid://shopify/MediaImage/23339769135184` on product `gid://shopify/Product/6827404427344`. User errors: 0. No other Shopify resource or field changed.

Validation: fresh prepared scope is 16 ACTIVE products / 46 exact links, all present; exclusions 0; pagination complete. Full pilot readback passed. Product media membership/count/order/featured media, five publications, product fields, variant IDs/options/SKUs/prices/inventory/fulfillment values, collections and metafields are equal. Storefront desktop/mobile affected and unaffected variants, gallery, Add to Cart, console and horizontal overflow checks passed. Product `updatedAt` is the only expected system timestamp difference.

Private evidence: before Drive `1gBdUfHLBdRi_VKGBTwfawliJP21mP6gV` (5,378 bytes, SHA-256 `97f2a874f1bfe0532b54a4dc665e4cd85a2ab1fdd8c4d68fc7b0c6ab17725bc8`); after Drive `12_belDX6yrQxPDIXfcFBJ4AHmtwtD0PK` (2,386 bytes, SHA-256 `720d3679c3bf87981f7a74e61d9f9d3506032dd90b366f499b3e864362582b37`); rollback Drive `1SpjFxtyuWOXXX9SCowczup1nKr82uszp` (619 bytes, SHA-256 `90b90c1b89c522f9d91bb13db1f6472aa7dd34b6ab3037c67c49fb084aade4ab`). Raw catalog data remains outside Git.

Rollback: not applied. If needed, execute the validated exact `productVariantAppendMedia` mapping in the private rollback artifact, then reread the full product and prove restoration.

Next action: Resolve the recorded pilot blocker while keeping CAT-MEDIA-001 scaling stopped.

## CAT-MEDIA-001 CHECKPOINT-010 — stopped before mutation

Terra fresh-read six unambiguous ACTIVE/live products and nine still-present approved links.  The first detach call returned an incomplete connector payload, so `userErrors = 0` could not be objectively proven.  Immediate Shopify reread proved the target association remained present; no catalog mutation occurred in this checkpoint and no rollback was needed.  Private prewrite evidence: before Drive `1K_YxiLdUrrxmILNZ6N1V0Ch-PLYLz4Ow` (2,595 bytes, SHA-256 `d9b0e87c6ba7909dcfbf5f979ab7063291aaadcc5480ae7070c74d4d3f2fe588`) and rollback Drive `14YRXUQ7JhLDH_w6f9GrGJJnM1QOOd9qo` (1,218 bytes, SHA-256 `7474559187340aa41c28ec315fe91330c257ddc1f5243cf012bf3c3593467563`). Scaling is stopped; no downstream job started.

## BPC-META-FOUNDATION-001 — platform blocker after foundation implementation

Status: BLOCKED — TECHNICAL OR PLATFORM BLOCKER
Objective: separate BestPrintsCo from Nstyled, implement the safe Meta/Shopify foundation, prepare read-only measurement/organic automation, and bring the first US footwear campaign to the maximum truthful pre-publish state without spend.
Branch/worktree: `task/BPC-META-FOUNDATION-001`, `C:\Projects\bestprintsco-theme`
Start commit: `47f55f24340bc3407ebcbaee56f7c17b37f75318`
Foundation-record commit: `1cab7381c4103e356d2802370bf1085c25e267f9`
Separate automation commits: `87f6065`, `eee3faf` in `C:\Projects\bestprintsco-meta-automation`

Implemented resources: portfolio `913146750869963`; Page `1153511934521436`; new ad account `2258717414903571`; Dataset `2092696251642333`; catalog `1046542707869496`; Commerce Account `1995776851046152`; domain asset `1033409412946916`; official Shopify Meta channel. Page URL/CTA, domain record, dataset domain allowlist, dataset/ad-account assignment, portfolio homepage, support email, catalog country, and Ads MCP catalog permission were normalized. No product commercial data or theme file changed.

Exact blocker: Instagram `17841401039012650` itself has no active enforcement, but its portfolio/shop claim remains blocked pending Meta specialist release from disabled Instagram-created account `cvtie-ad` `1104252943250335`. Meta says that legacy account is not eligible for automated review. Historical personal account `55495642` is separate, disabled, and review-expired. Do not delete either historical account, add payment as remediation, terminate unrecognized sessions, or create another bypass asset.

Support state: case `1667557011016000` is active, received on 2026-08-10, and routed through the working Meta case channel for asset-recovery/account-management specialist review. Two direct case-chat sends remained stuck and were not retried a third time. This is an asset-release support case, not a policy appeal.

Validation: domain asset `1033409412946916` is verified; Nstyled writes/queries 0; live spend USD 0; dataset sources contain no Nstyled domain; automation config/queue/reconciliation tests PASS. Shopify's official Meta channel remains active, with Facebook Shop connected and Instagram Shop pending the release case. Current Windows/Chrome is signed in only to `@bestprintsco_`; no Accounts Center profile or mobile session was logged out. Payment method remains blank by explicit owner decision. No appeal, ad draft, publish, or billing action occurred.

Changed records: `docs/bpc-meta/*` including asset/protected manifests, change log, restriction state, Shopify integration, measurement bridge, organic automation, first-US-ad manifest, owner actions, next trigger, and machine-readable state.

Rollback: every live change and its exact reversal is in `docs/bpc-meta/CHANGELOG.md`; historical assets must not be deleted. Recommended next action: when Meta updates case `1667557011016000` or releases Instagram `17841401039012650`, continue at `docs/bpc-meta/NEXT_TRIGGER.md` without restarting the audit. Owner acts only if Meta requests login, 2FA, identity confirmation, or final transfer confirmation.
