# BestPrintsCo SEO Project State

Last updated: 2026-07-11

| Field | State |
|---|---|
| Current phase | Phase 1 — Catalog source-of-truth and commercial discovery |
| Phase-gate status | Phase 0 `passed_with_documented_debt` |
| Current task | DISC-101 — Export and inventory products and collections read-only |
| Last completed task | GATE-0 — Review Phase 0 commercial-first governance gate (`pending`) |
| Open blockers | DISC-101 must prove safe read-only Shopify access; supplier/source ownership remains due before DISC-102 approval |
| Required business decisions | GOV-003 tracks brand positioning, priority markets, verified review source, and PillowProfits/source records at their stated due conditions |
| Development-theme deployment status | No governance files deployed; development theme unchanged |
| Last verified commit | `pending` (GATE-0 implementation commit) |
| Last preview URL | https://bestprintsco.com/?preview_theme_id=130287665232 |

## Phase gate

Phase 0 is recorded as `passed_with_documented_debt` under DEC-014. DEC-008 assigns routine reversible approvals, DEC-012 approves the ordered read-only access method, and GOV-003 records the owner, due conditions, risks, and rollback posture for deferred business facts.

## Current constraints

- DOC-001 changed governance/documentation only; no theme code or Shopify data was changed.
- No Shopify push or publish occurred during DOC-001.
- DISC-101 is the next dependency-safe task. It is read-only and must establish access and baseline evidence before any catalog analysis or write.
