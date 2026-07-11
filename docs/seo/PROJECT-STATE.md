# BestPrintsCo SEO Project State

Last updated: 2026-07-11

| Field | State |
|---|---|
| Current phase | Phase 1 — Catalog source-of-truth and commercial discovery |
| Phase-gate status | Phase 0 `passed_with_documented_debt` |
| Current task | DISC-102 — Identify product families and PillowProfits base-product clusters |
| Last completed task | DISC-101 — Export and inventory products and collections read-only (`pending`) |
| Open blockers | PillowProfits/source ownership remains due before DISC-102 cluster approval; commercial performance and measurement sources are not yet available |
| Required business decisions | GOV-003 tracks brand positioning, priority markets, verified review source, and PillowProfits/source records at their stated due conditions |
| Development-theme deployment status | No governance files deployed; development theme unchanged |
| Last verified commit | `pending` (DISC-101 implementation commit) |
| Last preview URL | https://bestprintsco.com/?preview_theme_id=130287665232 |

## Phase gate

Phase 0 is recorded as `passed_with_documented_debt` under DEC-014. DEC-008 assigns routine reversible approvals, DEC-012 approves the ordered read-only access method, and GOV-003 records the owner, due conditions, risks, and rollback posture for deferred business facts.

## Current constraints

- DOC-001 changed governance/documentation only; no theme code or Shopify data was changed.
- No Shopify push or publish occurred during DOC-001.
- DISC-101 produced an immutable external snapshot with 7,469 products, 91,170 variants, 35,211 media records, and 38 collections. Exact counts, hashes, unique IDs, and read-only boundaries passed.
- DISC-102 is the next ordered task; it may analyze the snapshot but may not approve factual base-product claims without the source evidence tracked by GOV-003.
