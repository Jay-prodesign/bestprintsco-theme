# BestPrintsCo Shopify Data Requirements

The theme repository does not contain the full Shopify product and collection catalog. Catalog analysis and updates require a separately authorized Shopify CSV workflow or Admin API integration. Do not request or create credentials during Phase 0.

## Controlled future workflow

1. **Read-only export:** Obtain an authorized Shopify CSV or read-only Admin API export.
2. **Immutable before snapshot:** Store a dated, checksummed snapshot in the protected snapshot workflow; exclude raw sensitive exports from Git.
3. **Catalog analysis:** Profile completeness, duplicates, factual risks, taxonomy, image coverage, variants, availability, and relationships.
4. **Proposal:** Generate explicit before/after records with evidence, risk, validation, and affected handles/IDs.
5. **Validation:** Validate schema, lengths, uniqueness, HTML, URLs, variants, availability, and factual-source requirements.
6. **Approval:** Obtain approval for claims, strategy, high-risk fields, and each controlled batch.
7. **Controlled batch update:** Apply a limited, logged batch through the approved mechanism.
8. **Post-update verification:** Re-export/read back records and inspect affected storefront/feed pages.
9. **Rollback file:** Produce and test a rollback dataset derived from the immutable before snapshot.

## Fields the system must support

- Product titles and descriptions
- Product types, vendors, tags, and collections
- Handles
- SEO titles and descriptions
- Image alt text, filenames, images, and image-to-product relationships
- Variant data
- Availability data

## Data safety

- Never commit API keys, access tokens, credentials, customer data, order data, or private operational exports.
- Use stable Shopify IDs as record keys wherever available.
- Record export time, shop, API/CSV version, scope, row count, checksum, and source.
- Store proposals separately from immutable snapshots.
- Never overwrite a snapshot.
- No bulk write is authorized without a validated proposal, approval, batch limit, post-check, and rollback.

## Required business decisions before Phase 7

- CSV versus authorized Admin API workflow.
- Credential owner and secure storage mechanism outside Git.
- Approval roles and batch-size thresholds.
- Required product-fact sources.
- Feed/app dependencies and protected fields.
- Snapshot retention and rollback owner.
