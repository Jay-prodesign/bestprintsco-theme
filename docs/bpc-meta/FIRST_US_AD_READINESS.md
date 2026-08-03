# First United States Ad Readiness

State: `DEPLOYABLE MANIFEST PREPARED; META DRAFT NOT CREATED; SPEND = USD 0`

## Campaign manifest

| Level | Proposed value |
| --- | --- |
| Campaign | `BPC_LR01_US_FOOTWEAR_SALES` |
| Objective | Sales |
| Conversion location | Website |
| Ad set | `US_PROSPECTING_BROAD_V1` |
| Destination | `https://bestprintsco.com/collections/footwear` |
| Geography | United States only; no worldwide or additional country expansion |
| Audience | Acquisition-focused broad US audience; no unverified Cvtie audience or narrow interest stack |
| Placements | Facebook and Instagram Feed plus eligible vertical Story/Reel surfaces; report platforms separately; exclude Audience Network initially |
| Conversion event | Purchase only after Purchase and browser/server deduplication are verified |
| Temporary event | None currently. AddToCart fires but EMQ 0 means it is not approved for launch optimization. |
| CTA | Shop Now |

Meta identifies the Sales objective as the website-sales objective and supports optimization to specific conversion events when the Pixel is installed. The current Purchase event has not been verified, so selecting Purchase now would create false readiness. See [Meta Sales objective](https://www.facebook.com/business/ads/ad-objectives/sales).

## Tracking and reconciliation

URL parameter template:

`utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`

Before deployment, preview the resolved URL and store campaign/ad-set/ad IDs alongside the UTMs. Measurement must exclude owner, developer, Shopify preview, Meta preview, test-checkout, identifiable bot/AI, and Turkey internal traffic from the US acquisition result.

## Creative requirements

- Feed: approved BestPrintsCo footwear image, 4:5.
- Story/Reel: approved BestPrintsCo footwear image/video, 9:16 with safe areas.
- Optional carousel: only approved products whose live URLs and images pass validation.
- No external media, fabricated UGC, customer/review claims, unverifiable bestseller/discount/shipping claims, or material product alteration.

No accessible record contained a BPC-PRODUCT-MEDIA-approved first-ad creative set. Therefore creative files are a genuine deployment gate and were not fabricated.

## Verified-copy package

- Primary text: `Explore printed footwear designed to bring distinctive artwork to everyday style. Browse the BestPrintsCo footwear collection.`
- Headline: `Explore BestPrintsCo Footwear`
- Description: `Printed boots, sneakers and shoes.`
- Short variation: `Find your next distinctive pair at BestPrintsCo.`
- CTA: `Shop Now`

The copy avoids unverified discounts, shipping promises, guarantees, reviews, scarcity, and product-performance claims.

## Owner-approved budget gate

These are proposals, not authorization. Meta recommends giving a budget at least seven days to learn; Meta also states that daily spend can exceed the daily amount on a given day while remaining bounded over the week. See [Meta ad pricing and budgets](https://www.facebook.com/business/ads/pricing).

| Scenario | Daily budget | Minimum test | First decision threshold | Maximum seven-day owner risk |
| --- | ---: | --- | --- | ---: |
| Minimum viable | USD 15 | 7 days | 100 landing-page views or 7 full days, whichever is later | USD 105 |
| Controlled | USD 30 | 7 days | 200 landing-page views or 7 full days, whichever is later | USD 210 |
| Faster signal | USD 50 | 7 days | 300 landing-page views or 7 full days, whichever is later | USD 350 |

## Draft status and blockers

A live Meta draft was not created because Instagram is not fully claimed, domain verification is pending, Purchase/deduplication is unverified, AddToCart EMQ is 0, approved creatives are absent, payment is intentionally blank, and no exact budget is approved. This manifest is the maximum safe deployable state.

Exact future deployment order:

1. Release and claim Instagram ID `17841401039012650` into portfolio `913146750869963`.
2. Complete domain and Purchase/deduplication validation.
3. Attach approved 4:5 and 9:16 creatives.
4. Build the manifest in ad account `2258717414903571` and preview USA-only targeting, placements, URL, UTM, and event.
5. Owner selects a budget and privately adds payment when ready.
6. Owner performs the final Publish confirmation.

No publish, billing charge, or spend has occurred.
