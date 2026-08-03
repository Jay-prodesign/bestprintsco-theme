# BPC-MARKETING Measurement Bridge

State: `READ-ONLY FOUNDATION VALIDATED; LIVE CONNECTOR AUTHORIZATION PENDING`
Default authority: READ-ONLY

## Connection method

1. Preferred: Meta's official Ads MCP endpoint, `https://mcp.facebook.com/ads`.
2. Current safety state: catalog access was reduced to view-only; the new ad account is visible, but Meta reports that rule management is unavailable for this account and no ChatGPT/OAuth session was authorized.
3. Working fallback: versioned structured JSON in `C:\Projects\bestprintsco-meta-automation`.

The fallback has no network client and no code to create/publish ads, alter campaigns, budgets, audiences, payments, or permissions. Validation commits: `87f6065`, `eee3faf`.

## Exact BestPrintsCo allowlist

- Business Portfolio: `913146750869963`
- Facebook Page: `1153511934521436`
- Instagram: `17841401039012650`
- Controlling Ad Account: `2258717414903571`
- Historical Instagram ad account, exclusion only: `1104252943250335`
- Dataset: `2092696251642333`
- Catalog: `1046542707869496`
- Commerce Account: `1995776851046152`
- Shopify store: `cute-sneakers.myshopify.com`
- Domain: `bestprintsco.com`

All Nstyled exact IDs are denylisted. Any Nstyled marker, wrong account/portfolio, non-USD source, foreign Shopify store, or prohibited PII field causes validation to fail.

## Supported normalized metrics

The tested reconciliation layer supports aggregate spend, impressions, link clicks, landing-page views, add to cart, initiate checkout, Meta-reported purchases/value, CPM, link CPC/CTR, cost per purchase, Meta ROAS, Facebook-versus-Instagram platform results, Shopify order count, gross sales, discounts, refunds, cancellations, net sales, Meta-versus-Shopify difference, and non-US-spend detection.

Join dimensions are campaign ID, ad set ID, ad ID, UTM values, product ID, variant ID, landing page, date, and country. Meta-attributed purchases and Shopify-confirmed orders are always separate values.

Supported period labels: today, yesterday, last 7 days, last 30 days, campaign lifetime, and custom range.

## Not yet supported live

- Campaign/ad-set/ad and placement breakdowns cannot refresh until the official connector is owner-authorized and contains ads.
- Organic Page/Instagram metrics are specified but not imported by the current offline fallback.
- Age/gender aggregate breakdowns depend on Meta availability and privacy thresholds.
- Shopify order truth is not automatically imported; only PII-free aggregate input is accepted.
- Token expiry/renewal does not yet apply because no token was created. When enabled, renewal must use owner OAuth and an approved secret manager; never Git or chat.

## Test report and refresh

- `npm run validate`: PASS.
- Config allowlist/denylist: PASS.
- Approved-content queue: PASS, zero entries, inactive.
- Reconciliation tests: PASS, including Nstyled rejection, PII rejection, separate Meta/Shopify truth, platform split, and non-US spend alert.
- Baseline spend: USD 0.
- Baseline Meta purchases and Shopify orders: not imported; never inferred as zero.
- Refresh frequency now: manual/on-demand versioned JSON only.
- Intended live refresh after OAuth: on-demand plus daily aggregate snapshots, without mutation authority.

Query/read entry points: `reports/bpc-meta-latest.json`, `reports/bpc-meta-latest.md`, and the tested `src/reconcile.mjs` module in the automation project.
