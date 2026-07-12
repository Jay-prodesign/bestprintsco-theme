# BestPrintsCo SEO Project State

Last updated: 2026-07-12

| Field | State |
|---|---|
| Current phase | Phase 1 — Catalog source-of-truth and commercial discovery |
| Phase-gate status | Phase 0 `passed_with_documented_debt` |
| Current task | Cluster SEO Generation — proposed next phase (not started) |
| Last completed task | DISC-103 — Build reusable product SEO intelligence by cluster (`e4ff2cd`) |
| Open blockers | PillowProfits/source ownership remains unresolved, so DISC-102 clusters are structural candidates rather than supplier-approved base products; commercial performance and measurement sources are not available |
| Required business decisions | GOV-003 tracks brand positioning, priority markets, verified review source, and PillowProfits/source records at their stated due conditions |
| Development-theme deployment status | No governance files deployed; development theme unchanged |
| Last verified commit | `e4ff2cd` (DISC-103 implementation commit) |
| Last preview URL | https://bestprintsco.com/?preview_theme_id=130287665232 |

## Phase gate

Phase 0 is recorded as `passed_with_documented_debt` under DEC-014. DEC-008 assigns routine reversible approvals, DEC-012 approves the ordered read-only access method, and GOV-003 records the owner, due conditions, risks, and rollback posture for deferred business facts.

## Current constraints

- DOC-001 changed governance/documentation only; no theme code or Shopify data was changed.
- No Shopify push or publish occurred during DOC-001.
- DISC-101 produced an immutable external snapshot with 7,469 products, 91,170 variants, 35,211 media records, and 38 collections. Exact counts, hashes, unique IDs, and read-only boundaries passed.
- DISC-102 identified 30 high-volume structural candidate clusters covering 4,324 products, validated all aggregate counts against the immutable snapshot, and sampled 14 main images. No supplier specification was approved.
- DISC-103 created reusable cluster intelligence without generating copy or changing Shopify. Cluster SEO Generation is proposed but not started; it requires an active verified cluster and existing proposal, validation, and rollback controls.
