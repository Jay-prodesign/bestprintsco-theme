# BestPrintsCo Meta Before/After Change Log

| Date | Asset | Field | Before | After | Reason | Rollback method | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-03 | Meta/Shopify namespaces | Asset separation | Unreconciled | Exact BestPrintsCo allowlist and Nstyled deny/protected manifest | Mandatory pre-write separation | Revert documentation commit only | Live Business Settings, Page, Instagram, Commerce, and Shopify readback |
| 2026-08-03 | Domain | Portfolio domain asset | Absent | `bestprintsco.com`, asset `1033409412946916`, pending verification | Establish exact domain ownership boundary | Remove only asset `1033409412946916` from portfolio | Meta Business Settings readback |
| 2026-08-03 | Shopify DNS | Meta verification TXT | Absent | Meta verification TXT added; public propagation pending | Enable domain verification | Remove the exact Meta verification TXT in Shopify DNS | Shopify DNS readback |
| 2026-08-03 | Facebook Page `1153511934521436` | Website | `http://bestprintsco.com/` | `https://bestprintsco.com/` | Canonical secure URL | Restore prior Page website value | Facebook Page readback |
| 2026-08-03 | Facebook Page `1153511934521436` | Action button | No destination CTA | `Learn more` -> footwear collection | Owner-approved first destination | Edit/remove Page action button | Facebook Page readback |
| 2026-08-03 | Page `1153511934521436` / Instagram `17841401039012650` | Connection | Legacy partial link | Disconnected after owner approval, then reconnected by owner through mobile; current state is basic/partial connection | Attempt clean portfolio claim while preserving accounts | Current basic link can be reviewed/removed only during exact claim remediation | Meta confirmation plus owner screenshots |
| 2026-08-03 | Dataset `2092696251642333` | Traffic permissions | Production and Shopify-preview sources observed | Allow only `bestprintsco.com` and subdomains | Prevent test/foreign source contamination | Remove/edit dataset traffic permission | Events Manager readback |
| 2026-08-03 | Business Portfolio `913146750869963` | Ad account | No clean controlling BestPrintsCo account | Created `BestPrintsCo Ads`, `2258717414903571` | Separate BestPrintsCo from restricted historical accounts | Close only through Meta's account-close process after owner impact review; no deletion attempted | Business Settings and Account Quality readback |
| 2026-08-03 | Dataset `2092696251642333` | Ad account access | New account not assigned | Assigned to `2258717414903571` | Enable future first-party measurement | Remove exact dataset assignment | Business Settings readback |
| 2026-08-03 | Business Portfolio `913146750869963` | Homepage | Not normalized | Best Prints Co Page | Consistent portfolio identity | Restore prior homepage selection | Business Info readback |
| 2026-08-03 | Shopify Meta channel | Support email | Stale/incorrect | `help@bestprintsco.com` | Match authoritative support address | Restore prior value if documented by owner | Shopify Meta-channel readback |
| 2026-08-03 | Catalog `1046542707869496` | Default country | Thailand | United States | Match first approved market | Restore Thailand only if commercial governance changes | Commerce Manager readback |
| 2026-08-03 | Meta Ads MCP | Catalog capability | Edit-capable catalog action | View-only catalog permission | Enforce measurement-only bridge | Restore edit only with new explicit authorization | Meta Business Settings MCP readback |
| 2026-08-03 | Legacy `cvtie-ad` `1104252943250335` | Owner access | Not manageable from Facebook | Permission assignment attempted; Meta rejected it; no state change | Test safe owner self-access/switch path | None needed; write failed | Exact Meta error readback |
| 2026-08-03 | New ad account `2258717414903571` | Payment method | Empty | Empty; owner intentionally deferred | Respect owner financial gate | Not applicable | Owner decision and billing readback |
| 2026-08-03 | Instagram `17841401039012650` | Ownership/release diagnosis | Transfer failed with generic/blank errors; owning portfolio unknown | Authenticated Meta Support identified an inaccessible Cvtie-related owning portfolio as the controlling blocker; support conversation saved, but no human case ID was created | Establish the exact remediation path without deleting historical assets or adding payment | No live asset change occurred; retain the saved support conversation | Meta Business Support conversation `Eski Reklam Hesabından Ayırma` and unavailable live-support readback |

| 2026-08-10 | Domain `1033409412946916` | Verification | Not Verified | Verified in portfolio `913146750869963` | Complete the exact BestPrintsCo domain boundary | Retain the DNS TXT record; removal would require a fresh impact review | Public DNS TXT readback and Meta Business Settings live readback |
| 2026-08-10 | Meta support / Instagram `17841401039012650` | Specialist release case | No human case ID | Active case `1667557011016000`, status Received / specialist review pending | Route the disabled legacy-account release through Meta without bypass assets | No asset mutation to roll back; close only after resolution or owner instruction | Meta case center and successful case-channel update |
| 2026-08-10 | Instagram account sessions | Conflict hypothesis | Multiple profiles visible in Accounts Center; active browser identity not reconciled | Current Windows/Chrome is signed in only to `@bestprintsco_`; no account or device session was logged out | Avoid disconnecting owner profiles or unrelated mobile sessions without exact identity evidence | Not applicable; no session change occurred | Instagram Accounts Center live readback |

Nstyled asset writes: `0`.
Historical asset deletions: `0`.
Product/catalog commercial-data edits: `0`.
Live ad publication: `No`.
Live spend: `USD 0`.
