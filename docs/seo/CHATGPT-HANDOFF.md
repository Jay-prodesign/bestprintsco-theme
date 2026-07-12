# BestPrintsCo ChatGPT Handoff

| Field | Latest state |
|---|---|
| Current phase | Phase 1 — Catalog source-of-truth and commercial discovery |
| Phase-gate status | Phase 0 `passed_with_documented_debt` |
| Current task | Cluster SEO Generation — proposed next phase (not started) |
| Last completed task | DISC-103 — Build reusable product SEO intelligence by cluster |
| Last verified commit | `e4ff2cd` |
| Development-theme deployment status | Development theme `130287665232` unchanged; no governance files deployed |
| Last preview URL | https://bestprintsco.com/?preview_theme_id=130287665232 |
| Work completed since previous handoff | Created the permanent cluster SEO intelligence knowledge base for C01–C30, with representative public terminology research, intent, vocabulary, content/link/CRO/schema recommendations, unknowns, risks, and evidence boundaries; no product copy or Shopify write occurred |
| Open blockers | PillowProfits/PopCustoms exact-product matching remains unresolved, so supplier facts and any generation batch require verification; performance and measurement sources remain unavailable |
| Required business-owner decisions | GOV-003 tracks brand positioning, priority markets, verified review source, and PillowProfits/source records at their stated due conditions |
| Next recommended task | Cluster SEO Generation: choose one active verified cluster, build source-backed proposals and before snapshots, then apply no changes until the existing validation and rollback workflow is satisfied |
| Repository files ChatGPT should inspect before advising | `AGENTS.md`; `docs/seo/CHATGPT-HANDOFF.md`; `docs/seo/PROJECT-STATE.md`; `docs/seo/TASKS.yaml`; `docs/seo/DECISIONS.md`; relevant phase reports |

## BLOCK-201 current status

- In progress on `task/BLOCK-201-purchase-foundation`; deployment is blocked until Shopify CLI authentication is renewed.
- Baseline purchase path passed on the representative boot product at desktop and mobile sizes. Generated sold, visitor, stock, and cart countdown claims are disabled in the branch.
- Development theme `130287665232` and the live theme remain unchanged. Resume by deploying only to development theme, then re-run the recorded journey before closing the task.

## BLOCK-201 final status

- Status: complete on `task/BLOCK-201-purchase-foundation`.
- Preview URL: `https://cute-sneakers.myshopify.com?preview_theme_id=130287665232`.
- Deployment: pushed only `templates/product.json` and `config/settings_data.json` to unpublished development theme `130287665232` with `--nodelete`; live theme `122053689424` was not targeted.
- Validation: representative boot product passed product, Add to Cart, cart, and checkout-entry checks at 1440x900 and 390x844 after deployment.
- Unsupported generated sold, visitor, stock-countdown, and cart-countdown claims were not visible after deployment.
- Next roadmap item remains the existing post-BLOCK controlled SEO roadmap; do not start a new phase without owner instruction and gate/dependency review.
