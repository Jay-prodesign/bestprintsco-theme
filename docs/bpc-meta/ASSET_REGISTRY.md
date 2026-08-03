# BestPrintsCo Meta Asset Registry

Evidence date: 2026-08-03 live Meta and Shopify readback
Write policy: only assets explicitly marked `ALLOWLISTED` may receive a scoped BestPrintsCo write after the relevant precondition is verified.

| Asset type | Current name | Exact ID / identity | Parent / owner | Status |
| --- | --- | --- | --- | --- |
| Business Portfolio | Best Prints Co. | `913146750869963` | Gürkan Şenel | ALLOWLISTED |
| Facebook Page business asset | Best Prints Co | `1153511934521436` | Portfolio `913146750869963` | ALLOWLISTED |
| Facebook public profile alias | Best Prints Co | `61588760788226` | Maps to Page asset `1153511934521436` | REFERENCE ONLY |
| Instagram professional account | `@bestprintsco_` | `17841401039012650` | Legacy Page link removed; portfolio claim awaiting owner login confirmation | ALLOWLISTED FOR THIS EXACT CLAIM ONLY |
| Ad Account | Not present in controlling portfolio | `UNRESOLVED` | None shown under portfolio `913146750869963` | NO WRITE UNTIL ACCESSIBLE ACCOUNTS AUDITED |
| Pixel/Dataset | CVTIE's pixel | `2092696251642333` | Portfolio `913146750869963` | READ-ONLY UNTIL DOMAIN/EVENT CONTAMINATION DECISION |
| Catalog | Shopify Product Catalog (`cute-sneakers.myshopify.com`) - 2026-07-24 System User | `1046542707869496` | Portfolio `913146750869963` | ALLOWLISTED FOR CONNECTION-ONLY FIXES |
| Commerce Account | Best Prints Co. | `1995776851046152` | Portfolio `913146750869963` | ALLOWLISTED FOR CONNECTION-ONLY FIXES |
| Domain asset | `bestprintsco.com` | `1033409412946916` | Portfolio `913146750869963` | ALLOWLISTED; NOT VERIFIED |
| Shopify connection | Shopify by Facebook | Store `cute-sneakers.myshopify.com`; live domain `bestprintsco.com` | Portfolio `913146750869963` | CONNECTED APP PRESENT; CHANNEL QA PENDING |

## Public profile readback

- Facebook display name: Best Prints Co
- Facebook category: Clothing Brand
- Facebook website field: `https://bestprintsco.com/`
- Facebook action button: `Daha fazla bilgi al` -> `https://bestprintsco.com/collections/footwear`
- Instagram display name: Best Prints Co
- Instagram username: `bestprintsco_`
- Instagram site link: `bestprintsco.com` with existing social UTM parameters

## UNKNOWN — no write

Other accessible Pages/profiles such as FVCKU, AltPanties, Geeky Gift Ideas, disabled legacy Pages, and the separate `bestprintsco` Instagram profile are outside this exact allowlist. They must not be modified unless live ownership and intended BestPrintsCo use are separately resolved.
