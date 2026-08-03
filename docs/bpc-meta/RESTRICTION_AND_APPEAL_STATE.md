# Restriction and Appeal State

Audit date: 2026-08-03
State: ROOT CAUSE PARTIALLY RESOLVED — no appeal submitted

- Restricted asset: historical Cvtie ad account
- Exact asset ID: `55495642`
- Restriction type: ad account restricted; advertising unavailable
- Meta displayed reason: Meta says some account activity appears not to comply with its rules
- First observed date: 2020-01-01 in prior Account Quality readback
- Required remediation: preserve as historical, do not use it for BestPrintsCo spend, and reconcile current review eligibility only after the Instagram/Page foundation is complete
- Remediation completed: account status and current Page assignments read read-only; no bypass account, appeal, payment change, or ad publication attempted
- Review eligibility: Ads Manager currently exposes a `Değerlendirme talep et` entry point, while earlier Account Quality said the review window had expired; no appeal will be submitted until this inconsistency and the controlling assets are fully reconciled
- Owner action required: none for the historical ad account at this cursor
- Expected next trigger: complete the clean Instagram portfolio claim, then re-read Account Quality and advertising eligibility from the exact controlling assets

Instagram-claim diagnosis: the legacy partial Page link was disconnected. Portfolio `913146750869963` still shows no Instagram asset and no pending/sent claim request. The restricted account `55495642` lists only `Geeky Gift Ideas` and `AltPanties` under its live Page assignments; Best Prints Co Page `1153511934521436` is absent. The only exact claim error observed so far is `CSRF nonce is invalid`, consistent with a stale/duplicate OAuth flow rather than proven ad-account ownership. A single fresh owner-authentication tab is ready.
