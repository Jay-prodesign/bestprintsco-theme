# DISC-102 Candidate Product-Family Clusters

Completed: 2026-07-12

## Outcome

The immutable DISC-101 snapshot supports 30 high-volume structural candidate clusters covering 4,324 of 7,469 products (57.9%). These are catalog-structure candidates, not approved PillowProfits base-product identifications. No authoritative PillowProfits or archived supplier record was found in the repository, so materials, construction, fit, sizing meaning, care, production, and other supplier facts remain unknown.

The full candidate matrix is in `DISC-102-CANDIDATE-CLUSTERS.csv`. It records counts, collections, vendor, variant/price/option signatures, SKU family, media pattern, active-state count, structural confidence, unknowns, representative stable product IDs, and the next validation required for every candidate.

## Reproducible method

Source files: `C:\Projects\bestprintsco-backups\2026-07-11_190759\products_baseline.csv`, `variants_baseline.csv`, and `media_baseline.csv`, whose checksums were recorded by DISC-101.

Products were grouped only when these catalog signals agreed:

1. Non-generic collection membership (`All`, `Footwear`, and `Home page` excluded from the signature).
2. Vendor.
3. Exact variant count.
4. Exact price set.
5. Option-name sequence when present.
6. Normalized SKU-family pattern, preserving actual SKUs unchanged.
7. Media-count pattern.
8. Description lead, title terminology, and status as corroborating or contradiction signals.

The grouping does not use SKU sequence as proof of a base product, does not treat image similarity as a specification source, and does not merge different vendors. Broad collections such as `Bags` and `WOMENS LEGGINGS` remain mixed when titles or images contradict a single base-product interpretation.

## Highest-volume candidates

| ID | Candidate | Products | Strong agreeing signals | Confidence and boundary |
|---|---|---:|---|---|
| C01 | Front-seat cover pairs | 540 | Two car collections, BestPrintsCo, 1 variant, $64.95, PP SKU family, 3–4 images | High structural; supplier specifications unknown |
| C02 | Rear-seat pet covers | 333 | Seat-cover collection, 2 variants, $64.95, PP SKU family, 2–5 images | High structural; visually distinct from C01 |
| C03 | Car floor mats | 326 | Two car collections, 1 variant, $64.95, PP SKU family, 2–5 images | High structural; set contents and fit unknown |
| C04 | Ten-variant boots, legacy signature | 302 | Two boot collections, 10 variants, $64.95, PP SKU family | Medium; may be another generation of C06 |
| C05 | Steering-wheel covers | 295 | Two car collections, e-joyer vendor, 1 variant, $14.49, D-family SKU, 3 images | High structural; non-PillowProfits source must be identified |
| C06 | Ten-variant boots, current signature | 262 | Two boot collections, 10 variants, $65, Style/Size, PP SKU family | Medium; one TS-SKU outlier and relation to C04 unresolved |
| C07 | Mixed bags at $44.95 | 204 | Bags collection, 1 variant, PP SKU family | Low: tote, handbag, and crossbody titles/images prevent one family |
| C08 | SPOD adult T-shirts, 42 variants | 158 | SPOD, Color/Size, $24.95, 42 variants, 7 images | High structural; exact garment model unknown |
| C09 | Women's leggings/capri leggings | 148 | Leggings collection, 5 variants, $39.95, PP SKU family | Medium: full-length and capri products require separation |
| C10 | Hooded blankets | 123 | Two home collections, 2 variants, $59.95, PP SKU family | High structural; size/material facts unknown |
| C11 | CustomCat kids hoodies | 114 | CustomCat, two kids collections, 28 Color/Size variants, $29.95 | High structural; exact garment model unknown |
| C12 | Bedding sets | 113 | Two home collections, 12 variants, three-price set, PP SKU family | High structural; set contents unknown |
| C13 | SPOD hoodies | 102 | SPOD, 48 Color/Size variants, $39.95, 6–7 images | High structural; exact garment model unknown |
| C14 | Happy Monday high-top shoes | 102 | High Top collection, 18 Style/Size variants, $55, PP SKU family | High structural; exact supplier model unknown |
| C15 | Happy Monday low-top shoes | 95 | Low Top collection, 18 Style/Size variants, $55, PP SKU family | High structural; distinct from C14 by type/collection/image |

The remaining C16–C30 candidates cover archived slippers, canvas totes, mostly archived backpacks, shower curtains, kids T-shirts, two hoodie-dress signatures, blankets, sarongs, wall tapestries, a second SPOD T-shirt signature, a 19-variant boot signature, Pops high-tops, active slippers, and casual slip-ons. Their complete evidence and boundaries are in the CSV matrix.

## Representative main-image sampling

Fourteen primary images were retrieved from the immutable media relationships and visually inspected. The samples were not used to invent materials or specifications.

| Candidate | Stable product ID | Visual result |
|---|---|---|
| C01 | `gid://shopify/Product/6826922836048` | Shows a pair of front-seat covers; supports separation from C02 |
| C02 | `gid://shopify/Product/6827194646608` | Shows a full-width rear-seat pet cover; supports the two-variant family boundary |
| C03 | `gid://shopify/Product/6827210997840` | Shows car floor mats; supports the collection/type signal |
| C04 | `gid://shopify/Product/4469692563536` | Shows lace-up ankle boots; does not prove material or supplier model |
| C06 | `gid://shopify/Product/4866798420048` | Same general boot silhouette as C04 with a different mockup/signature; keep separate pending supplier evidence |
| C27 | `gid://shopify/Product/6643903594576` | Same general boot silhouette but a 19-variant/status signature; keep separate |
| C05 | `gid://shopify/Product/6827197956176` | Shows a steering-wheel cover; supports the product type |
| C08 | `gid://shopify/Product/6827252973648` | Shows an adult T-shirt; supports the garment family only |
| C09 | `gid://shopify/Product/6837799419984` | Shows capri-length leggings; confirms C09 needs capri/full-length separation |
| C10 | `gid://shopify/Product/6827197792336` | Shows a hooded blanket |
| C12 | `gid://shopify/Product/6827354783824` | Shows a bedding set with coordinated printed pieces; exact contents remain unknown |
| C14 | `gid://shopify/Product/4828978937936` | Shows high-top canvas-style shoes; material remains unverified |
| C18 | `gid://shopify/Product/6831314665552` | Shows a backpack; archived-state question remains |
| C19 | `gid://shopify/Product/6827363139664` | Shows a shower curtain |

The C10 and C19 samples use the same butterfly artwork on different product types. This is direct evidence that image/design similarity must not merge base-product families.

## Contradictions and outliers

- C07 is not a usable base-product cluster until bag silhouettes are separated.
- C09 mixes capri and full-length leggings in the same structural signature.
- C04, C06, and C27 share a general lace-up boot silhouette but have different variant, option, price, media, and status signatures. They must remain separate candidates.
- C06 contains one `TS-` SKU-family outlier among otherwise `PP.` records; it requires isolation before any pilot selection.
- C16 has 94 products but zero active products; C18 has only one active product of 88; C27 has 13 active products of 60. Inactive families are not pilot candidates without an explicit merchandising purpose.
- Description leads are missing for most of the catalog, and some records begin with promotional text such as `FREE SHIPPING!`; descriptions cannot serve as authoritative family evidence.
- Vendor values include BestPrintsCo, Happy Monday Store, SPOD, CustomCat, Pops, Cute Sneakers, and e-joyer. Vendor boundaries must be preserved until source ownership is verified.

## Acceptance assessment

- Candidate clusters list all available catalog signals: pass (CSV matrix).
- Evidence and confidence recorded: pass for structural confidence only.
- Unknowns and representative validation requirements recorded: pass.
- Representative product review and main-image sampling: pass for 14 products across major families.
- Authoritative-source check: completed, but no PillowProfits/source documents were found. No base-product specification is approved.

DISC-102 is complete as a discovery task. GOV-003 / DEC-013 remains the blocker for factual cluster approval and supplier-backed content. No Shopify catalog field, theme file, theme, variant, SKU, price, inventory, publication state, or media relationship changed.

## Rollback

Revert the DISC-102 commits. The immutable DISC-101 snapshot and Shopify state remain unchanged.
