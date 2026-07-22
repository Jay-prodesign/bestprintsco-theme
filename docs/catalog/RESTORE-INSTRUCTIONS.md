# Catalog Restore Instructions v1.0.0

This backup is evidence and deterministic restore input, not authorization to mutate. Confirm a job lock, exact owner-approved fields, a complete BEFORE artifact, and readable rollback before any future forward write.

1. Verify each private artifact against the public manifest SHA-256 and schema version.
2. Resolve live resources by preserved Shopify GID; stop on missing/replaced IDs.
3. Compare all allowed and protected fields before generating a mutation plan.
4. Generate `BPC-JOB-<JOB-ID>-ROLLBACK-BATCH-###` from the complete BEFORE snapshot and read it back before writing.
5. Apply only explicitly approved fields, re-read every resource, generate AFTER/CHANGELOG/PROTECTED_DIFF, and require protected equality.

Deleting and recreating a product or variant does not restore its original Shopify ID. This system never authorizes deletion, merge, variant reconstruction, handle/SKU changes, or destructive restructuring; each requires separate owner approval and a limitation-aware ledger.
