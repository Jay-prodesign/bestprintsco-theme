# Historical Cvtie Preservation Record

Evidence date: 2026-08-03
Policy: historical data is preserved unless exact evidence proves that it is unsafe, cross-brand, or unusable.

## Preserved assets and history

| Historical asset | Exact ID | Current decision |
| --- | --- | --- |
| Facebook Page now named Best Prints Co | `1153511934521436` | Preserve followers, posts, comments, messages, insights, age, and trust history. No bulk deletion. |
| Instagram now named `@bestprintsco_` | `17841401039012650` | Preserve followers, posts, messages, and organic insights. The basic Page connection remains; full portfolio claim is blocked. |
| Cvtie Dataset/Pixel | `2092696251642333` | Preserve and use as the controlling BestPrintsCo dataset. Live domain review found BestPrintsCo plus a small Shopify-preview test source, and no Nstyled source. |
| Shopify catalog | `1046542707869496` | Preserve as the controlling catalog. Do not delete or recreate merely to remove the Cvtie history. |
| Derived offers catalog | `1066222409425615` | Preserve as a dependent historical catalog; do not use as the controlling Shopify catalog. |
| Instagram-created ad account `cvtie-ad` | `1104252943250335` | Preserve read-only. Restricted/disabled and excluded from BestPrintsCo spend and reporting. |
| Personal historical ad account | `55495642` | Preserve read-only. Disabled since 2020, review period expired, and excluded from BestPrintsCo. |
| Historical ads and audiences | Owning legacy accounts | Preserve in place. No export, migration, deletion, or use for acquisition until source ownership and Nstyled separation can be proven. |

## Normalization performed

- The existing Page and Instagram public names were already BestPrintsCo-branded; no rename was performed.
- The Facebook Page website was normalized from HTTP to HTTPS.
- The Page action button now uses the approved footwear collection destination.
- No historical Cvtie post was deleted or archived in bulk.
- No historical dataset, catalog, ad, audience, follower, message, comment, or insight was deleted.

## Dataset decision evidence

- Recent source volume was approximately 10.5K events from `bestprintsco.com` and 53 test events from the Shopify preview domain.
- No Nstyled domain was found in the dataset source readback.
- Browser and server sources were present for PageView, ViewContent, AddToCart, and Search.
- The dataset remains named `CVTIE's pixel`; a cosmetic rename was not required for safe operation.
- A dataset traffic allowlist now accepts only `bestprintsco.com` and its subdomains, preventing preview/test domains from becoming future production sources.

Rollback: remove the domain traffic allowlist only if it blocks legitimate BestPrintsCo production traffic. Do not delete the dataset.
