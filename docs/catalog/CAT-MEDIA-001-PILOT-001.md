# CAT-MEDIA-001 PILOT-001 safe evidence summary

- Activation: 2026-07-22T14:25:22Z; Sol; Admin API 2026-07.
- Branch/start: `task/CAT-000-catalog-governance` / `8935359ccbc82262966862845c0de8cd53eadfd4`; Draft PR #3.
- Locks: product `gid://shopify/Product/6827404427344`; variant `gid://shopify/ProductVariant/40130542862416`; media `gid://shopify/MediaImage/23339769135184`.
- Fresh prepared scope: 16 ACTIVE products, 46 exact associations present, 0 exclusions, complete pagination.
- Mutation: detached the locked association only; mutation count 1; userErrors 0.
- Readback: intended association absent; product media count 1→1; order and featured media unchanged; five publications unchanged; all protected values equal; unexplained differences 0.
- Live QA: desktop and 390×844 mobile galleries passed for affected and unaffected sizes; Add to Cart passed and the QA line was removed; console errors 0; mobile overflow false.
- Private Drive evidence: before `1gBdUfHLBdRi_VKGBTwfawliJP21mP6gV` / 5,378 bytes / SHA-256 `97f2a874f1bfe0532b54a4dc665e4cd85a2ab1fdd8c4d68fc7b0c6ab17725bc8`; after `12_belDX6yrQxPDIXfcFBJ4AHmtwtD0PK` / 2,386 bytes / SHA-256 `720d3679c3bf87981f7a74e61d9f9d3506032dd90b366f499b3e864362582b37`; rollback `1SpjFxtyuWOXXX9SCowczup1nKr82uszp` / 619 bytes / SHA-256 `90b90c1b89c522f9d91bb13db1f6472aa7dd34b6ab3037c67c49fb084aade4ab`.
- Rollback: validated exact append operation; not applied.
- Verdict: PASS. No scaling or downstream job started.
- Next action: Continue CAT-MEDIA-001 with Terra at the next safe checkpoint using the exact same approved rule and all unchanged gates.
