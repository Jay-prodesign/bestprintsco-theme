# Shopify-Meta Integration Report

Evidence date: 2026-08-03
Store: `cute-sneakers.myshopify.com`
Live domain: `bestprintsco.com`

## Connection state

| Component | Exact identity | State |
| --- | --- | --- |
| Official sales channel | Facebook & Instagram by Meta / Shopify by Facebook | Installed and active |
| Business Portfolio | `913146750869963` | Connected BestPrintsCo portfolio |
| Facebook Page | `1153511934521436` | Connected; Facebook Shop active |
| Instagram | `17841401039012650` | Basic Page link only; full portfolio/shop claim blocked by legacy Instagram ad account |
| Ad Account | `2258717414903571` | Active, linked to the dataset, no payment method, no ads, no spend |
| Catalog | `1046542707869496` | Controlling Shopify catalog; default country United States |
| Commerce Account | `1995776851046152` | Facebook channel present; Instagram channel incomplete |
| Dataset | `2092696251642333` | Shopify partner integration and Conversions API active |
| Domain asset | `1033409412946916` | Added to the portfolio; verification pending public DNS propagation |

## Catalog QA

- Shopify reports approximately 4.2K approved products.
- Commerce Manager reports 43,303 catalog items; this is an item/variant-level count and is not directly comparable with Shopify's product count.
- Currency is USD and catalog default country is United States.
- Product URLs and destination domain point to BestPrintsCo.
- No Nstyled product or domain contamination was found.
- No product title, description, price, compare-at price, inventory, variant, URL, publication state, or classification was changed.
- Four issue rows were reported for missing images:
  - `Vintage Sun and Moon Women's Leather Boots`
  - `Moon Dream Catcher Women's Leather Boots` (two rows/variants)
  - `Pink Argyle Sneakers (White)`

These product-data issues are reported only; they remain outside this task's write scope.

## Domain and support settings

- Meta domain-verification TXT value was added through Shopify DNS.
- Public DNS did not yet return the TXT record at the final check, so Meta still shows the domain as not verified.
- Shopify's Meta support email was corrected to `help@bestprintsco.com`.
- Shopify domain-registration email verification is separately pending with the registrant; no password or mailbox data was accessed.

## Dataset, Pixel, and CAPI validation

| Event | Browser/server readback | Current quality decision |
| --- | --- | --- |
| PageView | Active from browser and server; EMQ 4.4; about 8.1K | Working |
| ViewContent | Active from browser and server; EMQ 4.4; about 2.3K | Working |
| Search | Active from browser and server; EMQ 4.4; 82 | Working |
| AddToCart | Active from browser and server; EMQ 0; 85 | Fires, but not healthy enough for launch optimization |
| InitiateCheckout | No verified active readback | Not validated |
| AddPaymentInfo | No verified active readback | Not validated |
| Purchase | No verified active readback | Not validated; no paid test order was created |

- No active diagnostics errors were shown.
- No manual second Pixel was added to the Shopify theme.
- Browser/server Purchase deduplication cannot be certified until a safe test or real owner-authorized order produces the event.
- Shopify preview traffic was identified as test traffic and blocked from future dataset intake by the production-domain allowlist.

## Consent and privacy

- Data sharing was already set to Maximum before this task.
- The live privacy/consent review did not establish an enabled cookie banner, a US opt-out page, or automated privacy settings sufficient to silently certify Maximum as fully compliant.
- No legal text or privacy setting was changed. The owner/legal reviewer must reconcile the live disclosures and regional consent behavior before treating Maximum as approved.
- Shopify's `Returns not accepted` setting and the live defective/incorrect-item replacement/refund wording are not identical. This legal/commercial conflict is recorded and was not changed.
