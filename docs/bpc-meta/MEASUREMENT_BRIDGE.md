# BPC-MARKETING Measurement Bridge

State: DESIGN AND LIVE-SOURCE AUDIT IN PROGRESS
Default authority: READ-ONLY

## Exact allowlist

- Business Portfolio: `913146750869963`
- Facebook Page asset: `1153511934521436`
- Instagram account: `17841401039012650`
- Pixel/Dataset candidate: `2092696251642333`
- Catalog: `1046542707869496`
- Commerce Account: `1995776851046152`
- Ad Account: unresolved; must not be queried or written until exact BestPrintsCo ID is proven

## Guardrails

- The bridge will never create/publish ads, change budgets or audiences, manage payments, or query Nstyled assets.
- Meta-attributed purchases and Shopify-confirmed orders must remain separate metrics with an explicit difference.
- Only aggregate results may leave Meta/Shopify; no customer PII or follower lists.
- Türkiye owner/internal, preview, test-checkout, developer, Meta-preview, and identifiable bot traffic must be separated from the US acquisition cohort.

Connection method, supported metrics, refresh frequency, test report, and renewal process remain pending live access and event-source validation.
