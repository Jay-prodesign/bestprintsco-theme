# BestPrintsCo Meta Before/After Change Log

| Time | Asset | Field | Before | After | Reason | Rollback | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-03 | Meta/Shopify assets | Initial audit | Unreconciled | Exact BestPrintsCo allowlist and Nstyled protected manifest recorded | Mandatory pre-write separation | Documentation-only; revert task commit | Live Meta Business Settings, Page, Instagram, Business Suite, and Shopify readback |
| 2026-08-03 | Domain | Portfolio domain asset absent | `bestprintsco.com` added as `1033409412946916`, Not Verified | Establish exact BestPrintsCo domain ownership boundary | Remove domain asset from the portfolio | Meta Business Settings live readback |
| 2026-08-03 | Facebook Page `1153511934521436` | Website | `http://bestprintsco.com/` | `https://bestprintsco.com/` | Canonical secure live-store URL | Restore prior URL in Page settings | Facebook Page live readback |
| 2026-08-03 | Facebook Page `1153511934521436` | Action button | No destination CTA | `Daha fazla bilgi al` -> footwear collection | Owner-approved first destination | Edit or remove Page action button | Facebook Page action-button readback |
| 2026-08-03 | Page `1153511934521436` / Instagram `17841401039012650` | Legacy partial connection | Connected with limited features | Disconnected after explicit owner authorization | Remove the stale link that blocked exact portfolio claim | Reconnect the same allowlisted Page and Instagram after the portfolio claim succeeds | Meta `Hesabın Bağlantısı Kesildi` confirmation |
| 2026-08-03 | Instagram `17841401039012650` | Portfolio claim | Not exposed in portfolio `913146750869963` | Clean OAuth flow prepared; owner login confirmation pending | Meta requires direct account-holder confirmation | Owner clicks `bestprintsco_ olarak giriş yap`; Codex then verifies the ID and reconnects Page/Commerce | Live Instagram authorization screen |

Meta asset writes: `4`
Nstyled asset writes: `0`
Live ad spend started: `No`
