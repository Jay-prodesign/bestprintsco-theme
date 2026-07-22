# Field Coverage — BPC-CATALOG-FULL-20260722T113351Z

Status: **FIELD COVERAGE PASS / CAT-BACKUP-001 BLOCKED**. Four of five supplemental artifacts passed independent post-upload SHA-256 from actual Drive byte streams. `normalized-inventory-levels.jsonl` remains unverified because its 66,458,524-byte raw response exceeds the connector's 67,108,864-byte IPC frame after base64 and metadata expansion. The ordered deterministic sample gate was not started.

Covered: product GID/legacy ID/title/handle/status/timestamps; description HTML/SEO; vendor/type/category/tags; every returned product metafield; collection memberships; media IDs/types/URLs/alt/status/order-by-provider-output and featured-media ID; option IDs/names/positions/value IDs and names; variant GID/legacy ID/position/options/SKU/barcode/prices/taxable/inventory policy/quantity; inventory item ID/tracked/requires-shipping/unit cost/weight; publication IDs/names/isPublished/publishDate.

Gaps and implications:

- Inventory/fulfillment coverage now includes variant GID/legacy ID and parent product GID; inventory item GID/legacy ID/tracked state; inventory level GID; all eight `inventoryProperties` quantity names; location GID/legacy ID/name/active state/online-fulfillment state; and fulfillment-service GID/handle/service name/type and operational identity flags. All 11 active/inactive/legacy locations were queried with `includeInactive` and `includeLegacy` and pagination completed.
- The seven original artifacts have an independently verified Drive byte-readback SHA-256 PASS. For the five new artifacts, Drive download returned exact sizes but only opaque `sediment://` references, not a local byte stream usable by SHA-256 tooling. New-file size readback passed; new-file post-upload SHA-256 remains blocked and is not inferred from size.
- Shopify media exposes output order through JSONL connection order; no standalone media `position` field was available in the validated schema. Recovery must preserve the ordered product media list.
- Customer/order data and secrets were not queried; the normalizer's protected-type stop check passed.
- Deterministic live-versus-backup sampling was not started because its prerequisite new-artifact hash gate did not pass. Full recoverability is not claimed.

API version `2026-07` is the current Admin GraphQL version used by the connected schema on the snapshot date. Raw data is private in Drive folder `1jW99qfYFjrP2LLSAp_qarsWMYdcAD20i` and absent from Git.
