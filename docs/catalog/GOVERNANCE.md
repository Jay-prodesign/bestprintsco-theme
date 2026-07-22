# Catalog Governance v1.0.0

Current Shopify Admin and the live storefront override GitHub, PCC history, cached IDs, CSVs, and reports. Runtime tools must query theme roles, catalog counts, publications, and API evidence anew. Historical values may remain only when labeled with a snapshot UTC.

The canonical shared queue is PCC `Codex Jobs`. A job lock records job ID, executor, run reference, UTC start, exact product/field scope, branch, cursor owner, and status. Conflicting locks stop execution. Valid transitions are `QUEUED -> IN_PROGRESS -> READY_FOR_QA -> DONE`, or `IN_PROGRESS -> BLOCKED`; evidence is required for every transition.

Canonical sources and IDs are listed in `AGENTS.md`. Raw backups live only in the owner-only Drive folder. Git contains schemas, tooling, aggregate counts, artifact names, hashes, coverage, and restore instructions.

## Preserved checkpoints

- Duplicate scan: 10,300 PP variants complete through `SKU-STREAM-200`; boundary `PP.13849559`; next cursor `SKU-STREAM-201`.
- Footwear media classification: 2,142 ACTIVE footwear products; 96 affected products; 289 proven-wrong links; prepared pilot evidence and exact re-append mappings preserved. No bootstrap rescan or media mutation.

## Dependency graph

1. CAT-000 governance/live reconciliation
2. CAT-BACKUP-001 immutable full backup
3. CAT-MEDIA-001 proven-wrong footwear pilot
4. CAT-PPMEDIA-001 PP exact external media recovery
5. CAT-DUP-001 continuation from SKU-STREAM-201
6. Supplier/base-family discovery
7. Variant and size-structure discovery
8. Size-chart mapping
9. Taxonomy and typed metafield/metaobject schema
10. CAT-CLAIMS-001
11. CAT-IDENTITY-001
12. CAT-COPY-001
13. CAT-ALT-001
14. Combined PDP/SEO/accessibility/mobile QA
15. Channel/feed readiness and IP-risk controls
16. Pricing proposal and owner approval
17. Catalog Operations app after rules are proven

Later jobs require their own locks and approvals. Eligible PP products retain product title, SEO title, and handle until exact media recovery is COMPLETE or WAIVED. Source order is Pillow Profits, PopCustoms, YesWeVibe/another exact-SKU exact-mockup store, another exact-SKU listing, then controlled derived media from verified exact-product images. Exact SKU proves identity, not retailer claims. Final media must be exact, uploaded (not hotlinked), clean, deduplicated, construction-faithful, and must preserve primary/order/featured media unless separately approved.

Technical/material claims require exact supplier/base-family evidence; experience claims require aggregated exact-family reviews. Durable facts use typed metafields/metaobjects; tags remain controlled operational inputs and never an SEO keyword database. Copy uses factual natural US English, concise HTML, final media, verified facts, and approved identity/Claim Profiles. Alt text waits for final media/order/featured lock and approved identity terminology; it describes only visible facts by exact media ID. CAT-COPY-001 and CAT-ALT-001 may later run in parallel only under separate field locks.

## Integrated ecommerce gate

Every later job records `PASS`, `FAIL`, `NOT APPLICABLE`, or `OWNER APPROVAL REQUIRED` for: commercial/customer value; SEO intent/cannibalization; discovery/architecture; CRO clarity; mobile; accessibility; performance; claim safety; catalog/variant/media integrity; protected fields; QA; deterministic rollback. A technical pass cannot override a failed customer, SEO, evidence, integrity, QA, or rollback gate.

## Recovery limitation

Use `BPC-JOB-<JOB-ID>-BEFORE-BATCH-###`, `AFTER`, `ROLLBACK`, and `CHANGELOG`. Capture all allowed and protected fields and prove rollback readability before a future write. Deleting/recreating products or variants cannot restore original Shopify IDs; backup never authorizes deletion, merge, reconstruction, handle/SKU change, or destructive restructuring.
