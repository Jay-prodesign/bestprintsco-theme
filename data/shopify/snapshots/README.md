# Shopify Snapshot Metadata

Store only non-sensitive snapshot manifests, schemas, checksums, and approved sanitized fixtures here. Raw exports and any customer, order, credential, token, or private operational data are excluded by `.gitignore` and must remain outside Git.

Runtime snapshot truth must be queried from Shopify. Full raw catalog backups belong only in the private Drive folder identified in `docs/catalog/GOVERNANCE.md`; Git may retain aggregate manifests and SHA-256 values only.
