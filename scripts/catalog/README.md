# Catalog Scripts

Scripts must default to read-only/dry-run behavior, validate inputs, never embed credentials, produce explicit proposals, and support post-update verification and rollback.

`export-readonly-catalog.ps1` uses mutation-disabled `shopify store execute` queries and writes inventory CSVs, a checksum manifest, and reconciliation metadata to an explicitly supplied timestamped directory outside Git. It never requests `--allow-mutations`.
