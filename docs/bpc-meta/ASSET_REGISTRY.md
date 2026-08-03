# BestPrintsCo Meta Asset Registry

Evidence date: 2026-08-03 live Meta and Shopify readback
Write policy: only assets explicitly marked `ALLOWLISTED` may receive a scoped BestPrintsCo write after its precondition is verified.

| Asset type | Current name | Exact ID / identity | Owner / connection / permission | Status |
| --- | --- | --- | --- | --- |
| Owner Facebook profile | Gurkan Senel | Personal profile ID not exposed in the audited UI | Sole visible person with portfolio full control | OWNER; ID NOT GUESSED |
| Business Portfolio | Best Prints Co. | `913146750869963` | Gurkan Senel full control; no partners | ALLOWLISTED; no visible portfolio restriction |
| Facebook Page business asset | Best Prints Co | `1153511934521436` | Portfolio `913146750869963`; owner full control | ALLOWLISTED; Page Quality clean |
| Facebook public alias | Best Prints Co | `61588760788226` | Maps to Page asset `1153511934521436` | REFERENCE ONLY |
| Instagram professional account | `@bestprintsco_` | `17841401039012650` | Basic Page link present; not claimed by controlling portfolio | ALLOWLISTED ONLY FOR EXACT CLAIM/RELEASE |
| Controlling Ad Account | BestPrintsCo Ads | `2258717414903571`; internal asset `120249954540640219` | Portfolio `913146750869963`; owner full control | ALLOWLISTED; ACTIVE; USD; Pacific; NO PAYMENT; ZERO ADS/SPEND |
| Legacy Instagram Ad Account | `cvtie-ad` | `1104252943250335` | Directly surfaced by Instagram; no portfolio ownership shown | HISTORICAL CVTIE; RESTRICTED; RELEASE/SWITCH ONLY |
| Historical personal Ad Account | Gurkan Senel | `55495642` | Personal advertising account | HISTORICAL; DISABLED; REVIEW EXPIRED; DO NOT USE |
| Pixel/Dataset | `CVTIE's pixel` | `2092696251642333` | Portfolio `913146750869963`; Shopify CAPI; linked to controlling ad account | ALLOWLISTED CONTROLLING DATASET |
| Controlling Catalog | Shopify Product Catalog (`cute-sneakers.myshopify.com`) | `1046542707869496` | Portfolio `913146750869963`; official Shopify feed | ALLOWLISTED FOR CONNECTION QA |
| Derived Catalog | Offers catalog | `1066222409425615` | Derived/dependent catalog | HISTORICAL/DEPENDENT; NO DIRECT USE |
| Commerce Account | Best Prints Co. | `1995776851046152` | Portfolio `913146750869963`; Facebook channel present | ALLOWLISTED FOR CONNECTION QA |
| Domain asset | `bestprintsco.com` | `1033409412946916` | Portfolio `913146750869963`; Shopify DNS | ALLOWLISTED; VERIFICATION PENDING |
| Shopify connection | Shopify by Facebook | `cute-sneakers.myshopify.com`; live `bestprintsco.com` | Official channel, Page and catalog connected | ACTIVE; INSTAGRAM INCOMPLETE |
| System user | Conversions API System User | `61593069680483` | Portfolio system user; no assets/apps exposed in readback | REFERENCE ONLY; NO WRITE |

## Public profile readback

- Facebook display name: Best Prints Co
- Facebook category: Clothing Brand
- Facebook website: `https://bestprintsco.com/`
- Facebook action button: `Learn more` -> `https://bestprintsco.com/collections/footwear`
- Instagram display name: Best Prints Co
- Instagram username: `bestprintsco_`
- Instagram live-site link: `bestprintsco.com` with existing social UTM parameters

## Permission, payment, and eligibility readback

- BestPrintsCo portfolio shows one person, Gurkan Senel, with full control and no partner.
- Security Center did not require portfolio-wide 2FA or business verification at the audit cursor.
- The new ad account has no payment method, no balance due, no ads, and no spend. The owner elected not to add payment now.
- Facebook Page and the new ad account showed no active restriction.
- Instagram eligibility remains unresolved because the account is still tied to restricted legacy account `1104252943250335`.

## Unknown - no write

Other accessible Pages, profiles, ad accounts, datasets, catalogs, audiences, or portfolios not listed above or in `NSTYLED_PROTECTED_ASSETS.md` remain `UNKNOWN - NO WRITE`. Names alone are never sufficient identity evidence.
