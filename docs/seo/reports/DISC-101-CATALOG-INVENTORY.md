# DISC-101 Read-Only Catalog Inventory

Completed: 2026-07-11

## Source and safety

- Store: `cute-sneakers.myshopify.com` (`BestPrintsCo`)
- Primary domain: https://bestprintsco.com
- Source: Shopify Admin GraphQL through authenticated `shopify store execute`
- Access scopes: `read_products`, `read_inventory`, `read_publications`
- Mutation permission: not enabled; the exporter never passes `--allow-mutations`
- Raw snapshot: `C:\Projects\bestprintsco-backups\2026-07-11_190759` (outside Git)
- Repository contents: sanitized counts, hashes, process documentation, and exporter only; no raw private catalog export

## Reconciliation

| Resource | Shopify exact count | Exported count | Unique stable IDs | Result |
|---|---:|---:|---:|---|
| Products | 7,469 | 7,469 | 7,469 | Pass |
| Variants | n/a | 91,170 | 91,170 | Pass |
| Media | n/a | 35,211 | 35,211 | Pass |
| Collections | 38 | 38 | 38 | Pass |

The product and collection totals use Shopify's `EXACT` count precision. All four exported resource files passed SHA-256 revalidation and stable-ID uniqueness checks.

## Immutable snapshot manifest

| File | Records | SHA-256 |
|---|---:|---|
| `products_baseline.csv` | 7,469 | `1b28ad39b303e90fcf349740a629831f3314c27aec549daa6835bcea9043584a` |
| `variants_baseline.csv` | 91,170 | `a93346ab00dd9610b8342073138a4df4244e70e3902b89d53e667ee8417823f6` |
| `media_baseline.csv` | 35,211 | `9ba46050f05b14dbf0e5f6263e6944dc2d60e7b1ceaec484f73ebc2072715b60` |
| `collections_baseline.csv` | 38 | `f334266c5996d464782a753f06378c38df45ab151917455bde58c6578ab19218` |

The external directory also contains `backup_manifest.csv` and `inventory_summary.json`. Older timestamped directories were not overwritten.

## Fields inventoried

- Products: stable ID, handle/URL, title, description HTML, SEO fields, type, vendor, exact tags, status, template, collection IDs/names, and timestamps.
- Variants: stable product/variant/inventory-item IDs, title, selected options, SKU, barcode, prices, inventory policy, and assigned media IDs.
- Media: stable media/file IDs, product relationship, position, type, URL, alt text, dimensions, and status.
- Collections: stable ID, handle/URL, title, description, SEO fields, image metadata, manual/automated classification and rules, product count, sort order, template, and timestamp.

## Limitations and next use

- This inventory does not include customer/order PII, sales performance, Search Console, Analytics, Merchant Center, redirects, or theme deployment state.
- Nested Shopify connections are guarded against truncation; the export fails if a product exceeds the captured collection, variant, media, or variant-media limits.
- DISC-102 may use this immutable snapshot to identify candidate product families, but PillowProfits/source ownership under GOV-003 remains due before cluster approval.

## Rollback

No Shopify or theme state changed. Reverting the task commit removes only the exporter and sanitized documentation. The immutable external snapshot may be retained for audit or manually removed by the owner.
