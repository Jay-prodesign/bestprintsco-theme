# Field Coverage — BPC-CATALOG-FULL-20260722T113351Z

Status: **FAIL / CAT-BACKUP-001 BLOCKED**. Bulk completion, root counts, aggregate counts, local SHA-256, Drive upload, and Drive byte-size readback passed. The completion gate did not pass.

Covered: product GID/legacy ID/title/handle/status/timestamps; description HTML/SEO; vendor/type/category/tags; every returned product metafield; collection memberships; media IDs/types/URLs/alt/status/order-by-provider-output and featured-media ID; option IDs/names/positions/value IDs and names; variant GID/legacy ID/position/options/SKU/barcode/prices/taxable/inventory policy/quantity; inventory item ID/tracked/requires-shipping/unit cost/weight; publication IDs/names/isPublished/publishDate.

Gaps and implications:

- Inventory levels by location and fulfillment-service/location identifiers were not exported. The core bulk query reached Shopify's five-connection limit and these essential protected/fulfillment fields require another verified bulk/control export. Recovery equality is incomplete without them.
- Post-upload SHA-256 could not be recalculated from Drive: the connector exposed Drive IDs and exact byte sizes but no SHA-256 metadata or local readback byte stream. Size readback passed, but it is not a hash verification substitute.
- Shopify media exposes output order through JSONL connection order; no standalone media `position` field was available in the validated schema. Recovery must preserve the ordered product media list.
- Customer/order data and secrets were not queried; the normalizer's protected-type stop check passed.
- Random family/readback sampling was not continued after the stop conditions. Full recoverability is not claimed.

API version `2026-07` is the current Admin GraphQL version used by the connected schema on the snapshot date. Raw data is private in Drive folder `1jW99qfYFjrP2LLSAp_qarsWMYdcAD20i` and absent from Git.
