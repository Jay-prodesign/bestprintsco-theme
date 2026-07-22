# Stale Runtime Inventory — CAT-000

Snapshot checked: `2026-07-22T11:15:18Z`. Shopify exact current controls: 6,948 ACTIVE; 6,279 ACTIVE published; 669 ACTIVE unpublished; MAIN `130374139984`. Historical references below must not drive runtime behavior.

| Area | Locations | Historical/stale value | Treatment |
| --- | --- | --- | --- |
| Theme IDs/roles | `docs/seo/CHATGPT-HANDOFF.md`, `DECISIONS.md`, `PROJECT-CHARTER.md`, `PROJECT-STATE.md`, `QA-CHECKLIST.md`, `SITE-INVENTORY.md`, `TASKS.yaml`, `reports/BLOCK-201-PURCHASE-FOUNDATION.md`, `SEO-AUDIT.md` | live `122053689424`; development `130287665232` | Retained as dated historical evidence; `AGENTS.md` now forbids runtime use and requires live role query. |
| Catalog baseline | `docs/ai/PROJECT-STATE.md`, `docs/seo/PROJECT-STATE.md`, `SITE-INVENTORY.md`, `TASKS.yaml`, `reports/DISC-101-CATALOG-INVENTORY.md`, `reports/DISC-102-PRODUCT-CLUSTERS.md` | 7,469 products; 91,170 variants; 35,211 media; July 11/18 snapshots | Retained as historical snapshots; current state and tools must query Shopify. |
| Queue/source truth | `docs/ai/NEXT-TASKS.yaml` | `docs/ai` declared source of truth | Superseded for shared execution status by PCC `Codex Jobs`; Git remains review/evidence layer. |
| Catalog scripts | `scripts/catalog/export-readonly-catalog.ps1`, normalization scripts | fixed store domain and first-page nested limits; non-bulk export; legacy manifest purpose | Historical tooling; not accepted for CAT-BACKUP-001 until complete nested coverage and bulk verification are implemented. |
| Job state | `docs/ai/*` | July 18 normalization review/current task | Historical; CAT-000 lock and current status live in PCC. |
| Duplicate cursor | PCC/Drive records (not previously represented in Git governance) | complete through SKU-STREAM-200 / PP.13849559 | Canonical resume checkpoint encoded; next is SKU-STREAM-201 and no rescan is allowed. |
| Media baseline | PCC/Footwear workbook (not previously represented in Git governance) | 2,142 classified; 96 products; 289 links | Preserved checkpoint encoded; no rescan/mutation in bootstrap. |

Stored snapshot dates and artifact counts remain valid only for the explicitly named historical artifact. No cached cursor, ID, count, or role is a substitute for a fresh Shopify read.
