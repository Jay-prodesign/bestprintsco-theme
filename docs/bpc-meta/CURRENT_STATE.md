# BestPrintsCo Meta Current State

Controlling task: `BPC-META-FOUNDATION-001`
Last live reconciliation: 2026-08-10
Classification: `BLOCKED - TECHNICAL OR PLATFORM BLOCKER`

## Controlling authority

The owner prompt authorizes completion-first, exact-ID allowlisted BestPrintsCo configuration. It does not authorize Nstyled writes, live ad publication, payment entry, identity claims, or spend. Payment remains deliberately deferred.

## Reconciled architecture

- Business Portfolio: Best Prints Co., `913146750869963`.
- Facebook Page: Best Prints Co, `1153511934521436`; public alias `61588760788226`.
- Instagram: `@bestprintsco_`, `17841401039012650`; Page-level link present and no active Instagram enforcement, but no claimed Instagram asset is visible in the portfolio.
- Controlling ad account: BestPrintsCo Ads, `2258717414903571` (internal asset `120249954540640219`); active, USD, Pacific time zone, no ads, no payment method, and no spend.
- Controlling Dataset/Pixel: `2092696251642333`; BestPrintsCo-owned, connected to Shopify and the controlling ad account, with production-domain traffic allowlisting.
- Controlling Shopify catalog: `1046542707869496`; Commerce Account `1995776851046152`.
- Domain asset: `bestprintsco.com`, `1033409412946916`; Verified by Meta on 2026-08-10.
- Shopify connection: official Facebook & Instagram by Meta channel on `cute-sneakers.myshopify.com`.

## Completed foundation changes

- Created the clean BestPrintsCo ad account without using either historical disabled account.
- Linked the controlling dataset to the new ad account.
- Added and verified the BestPrintsCo domain through the Shopify DNS TXT record.
- Restricted dataset traffic to `bestprintsco.com` and subdomains.
- Normalized the Facebook Page website to HTTPS and set its CTA to the footwear collection.
- Corrected the Shopify Meta support email to `help@bestprintsco.com`.
- Changed the controlling catalog's default country from Thailand to United States.
- Set the portfolio homepage to the Best Prints Co Page.
- Reduced the Meta Ads MCP catalog capability from edit to view-only.
- Created and validated a separate secrets-free, read-only measurement/organic automation foundation.

## Exact Instagram blocker and support state

Instagram Professional Dashboard identifies legacy Instagram-created ad account `cvtie-ad`, `1104252943250335`, as disabled/restricted. Earlier owner-access, OAuth, direct-claim, and two blank `Switch` attempts failed without changing ownership.

On 2026-08-10, authenticated Meta support created active case `1667557011016000`. The live case response confirmed:

- `cvtie-ad` `1104252943250335` is disabled and not eligible for review through automated chat;
- Instagram `@bestprintsco_` has no active restriction or enforcement;
- releasing or switching Instagram away from the disabled account requires specialized account-management steps outside automated support.

The exact Instagram, legacy ad-account, controlling portfolio, and clean ad-account IDs were submitted. The owner's historical note that a friend may previously have created ads was added as an ownership-chain hypothesis, not a verified owner record. The functioning case channel confirmed that the details were added for asset-recovery/account-management specialists. Direct case-chat replies remained stuck at `Sending` twice, so no blind third retry was made.

Historical personal ad account `55495642` is separate, disabled since 2020, and beyond its review window. Meta instructs use of another account. Deleting it would not release Instagram.

## Shopify and commerce readback

- Facebook Shop and Page `1153511934521436` are connected; Instagram shop/profile remains incomplete.
- Dataset `2092696251642333` remains selected with Pixel, Advanced Matching, and Conversions API at the existing Maximum data-sharing setting.
- Approximately 4.2K products are approved and four product-data issues remain outside this task's write scope.
- Shipping settings show three options and a 2026-08-10 sync.
- Contact email remains `help@bestprintsco.com`; return setting remains `Returns not accepted`.

## Remaining launch gates

- Meta specialist support must release Instagram from disabled legacy account `1104252943250335` and verify any external controlling owner/business chain. Case `1667557011016000` is active/received.
- The exact Instagram ID must then appear under portfolio `913146750869963`.
- InitiateCheckout, Purchase, and browser/server Purchase deduplication remain unverified.
- AddToCart reports EMQ 0 and is not a suitable launch optimization event.
- No approved BPC-PRODUCT-MEDIA first-ad creative set or controlling organic cadence was found.
- Exact budget, payment setup, and final Publish remain owner-gated and intentionally unset.

Nstyled writes: `0`. Nstyled measurement queries/exports: `0`. Live ad spend: `USD 0`.

Concurrent catalog, theme, pricing, product-media, and SEO work was not modified. The unrelated untracked catalog script remains untouched.
