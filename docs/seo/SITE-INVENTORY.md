# BestPrintsCo Site Inventory

Status: Phase 1 read-only catalog baseline completed by DISC-101 on 2026-07-11.

## Known properties

| Property | Value |
|---|---|
| Public domain | https://bestprintsco.com/ |
| Shopify store | `cute-sneakers.myshopify.com` |
| Development preview | https://bestprintsco.com/?preview_theme_id=130287665232 |
| Development theme | `BestPrintsCo Development` / `130287665232` / unpublished |
| Protected live theme | `122053689424` |

## Catalog baseline

| Resource | Count | Evidence |
|---|---:|---|
| Products | 7,469 | Shopify exact count reconciled to immutable export |
| Variants | 91,170 | Exported stable variant IDs; uniqueness check passed |
| Product media | 35,211 | Exported stable media IDs; uniqueness check passed |
| Collections | 38 | Shopify exact count reconciled to immutable export |

Raw snapshot: `C:\Projects\bestprintsco-backups\2026-07-11_190759` (outside Git). See `reports/DISC-101-CATALOG-INVENTORY.md` for source, fields, checksums, limitations, and rollback.

## Local theme structure baseline

| Directory | Files | Role |
|---|---:|---|
| `assets` | 94 | CSS, JavaScript, fonts, icons, and static media |
| `config` | 2 | Theme settings schema and development-theme settings data |
| `layout` | 2 | Storefront and password layouts |
| `locales` | 4 | Translation and schema locale JSON |
| `sections` | 85 | Theme sections |
| `snippets` | 58 | Reusable Liquid snippets |
| `templates` | 29 | JSON/Liquid page templates, including customer templates |

## Phase 1 inventory tables

Populate with evidence, source date, canonical/index state, template, traffic/revenue tier if authorized, structured data, apps, owner, and notes.

### Page types and URLs

| URL | Page type | Template | Canonical/index state | Priority | Evidence | Notes |
|---|---|---|---|---|---|---|

### Apps and integrations

| Integration | Source | Purpose | Pages | Owner | Performance impact | Removal approved? |
|---|---|---|---|---|---|---|

### Unknowns

- Complete URL count and index coverage.
- Active versus legacy templates/sections/snippets.
- Authorized analytics/Search Console baselines.
- App ownership, necessity, and product/vendor scope.
- Market/language/currency strategy.
- Catalog field completeness patterns and collection-membership analysis (DISC-102 through DISC-105).
