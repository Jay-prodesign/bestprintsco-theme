# BestPrintsCo Meta Current State

Controlling task: `BPC-META-FOUNDATION-001`
Last live reconciliation: 2026-08-03
Classification: `BLOCKED - TECHNICAL OR PLATFORM BLOCKER`

## Controlling authority

The current owner prompt controls this implementation. It authorizes completion-first, exact-ID allowlisted BestPrintsCo configuration but does not authorize Nstyled writes, live ad publication, budget approval, payment entry, identity claims, or spend. The owner explicitly deferred payment setup on 2026-08-03.

## Reconciled architecture

- Business Portfolio: Best Prints Co., `913146750869963`.
- Facebook Page: Best Prints Co, `1153511934521436`; public alias `61588760788226`.
- Instagram: `@bestprintsco_`, `17841401039012650`; basic Page link present, but the portfolio still has no claimed Instagram asset.
- Controlling ad account: BestPrintsCo Ads, `2258717414903571` (internal asset `120249954540640219`); active, USD, Los Angeles/Pacific time zone, no ads, no payment method, and no spend.
- Controlling Dataset/Pixel: `2092696251642333`; BestPrintsCo-owned, connected to Shopify and the controlling ad account, with production-domain traffic allowlisting.
- Controlling Shopify catalog: `1046542707869496`; Commerce Account `1995776851046152`.
- Domain asset: `bestprintsco.com`, `1033409412946916`; DNS verification record added, public propagation still pending.
- Shopify connection: official Facebook & Instagram by Meta channel on `cute-sneakers.myshopify.com`.

## Completed foundation changes

- Created the clean BestPrintsCo ad account without using either historical restricted account.
- Linked the controlling dataset to the new ad account.
- Added the BestPrintsCo domain asset and Shopify DNS verification record.
- Restricted dataset traffic to `bestprintsco.com` and subdomains.
- Normalized the Facebook Page website to HTTPS and set its CTA to the footwear collection.
- Corrected the Shopify Meta support email to `help@bestprintsco.com`.
- Changed the controlling catalog's default country from Thailand to United States.
- Set the portfolio homepage to the Best Prints Co Page.
- Reduced the Meta Ads MCP catalog capability from edit to view-only.
- Created and validated a separate secrets-free, read-only measurement/organic automation foundation.

## Exact Instagram blocker

Instagram Professional Dashboard identifies legacy Instagram-created ad account `cvtie-ad`, `1104252943250335`, as restricted/disabled. Meta separately displays a rules restriction, unusual-activity disablement, and a payment-review notice even though the visible balance is USD 0 and no amount is due.

The legacy account cannot be managed in ordinary Facebook Ads Manager. Assigning owner self-access failed with `Unable to update permissions`; Facebook OAuth ended at `This Page Isn't Available`; and the Instagram `Switch` dialog loaded blank twice. Direct portfolio claim continues to return an unknown/system-unavailable error. Per the two-failure stop rule, no further blind retries are allowed.

Historical personal ad account `55495642` is a separate disabled account whose review period expired; it is not the same as `cvtie-ad` and is not used for BestPrintsCo.

## Remaining launch gates

- Meta must release or expose a working switch flow for legacy Instagram account `1104252943250335`.
- The exact Instagram ID must then appear under portfolio `913146750869963`.
- Meta domain verification must complete after DNS propagation.
- InitiateCheckout, Purchase, and browser/server Purchase deduplication remain unverified.
- AddToCart currently reports EMQ 0 and is not a suitable launch optimization event.
- No approved BPC-PRODUCT-MEDIA first-ad creative set or controlling organic cadence was found.
- Exact budget, payment setup, and final Publish remain owner-gated and intentionally unset.

Nstyled writes: `0`. Nstyled measurement queries/exports: `0`. Live ad spend: `USD 0`.

Concurrent catalog, theme, pricing, product-media, and SEO work was not modified. The unrelated untracked catalog script remains untouched.
