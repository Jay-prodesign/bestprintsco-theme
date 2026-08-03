# Restriction and Appeal State

Audit date: 2026-08-03
State: `TECHNICAL/PLATFORM BLOCKER - NO APPEAL SUBMITTED`

## Controlling diagnosis

- Restricted asset: legacy Instagram-created ad account `cvtie-ad`
- Exact asset ID: `1104252943250335`
- Affected Instagram: `@bestprintsco_`, `17841401039012650`
- Restriction type: ad account restricted/disabled; legacy Instagram ad-account attachment prevents a reliable portfolio claim/switch
- Meta displayed reasons:
  - account restricted because some activity did not comply with rules;
  - ad account disabled for unusual activity;
  - Instagram mobile shows a payment issue requiring review.
- Billing readback: visible current balance USD 0 and no amount due. No payment details are recorded.
- First observed date: not exposed for `1104252943250335`.

## Remediation attempted

1. Audited and separated BestPrintsCo, historical Cvtie, Nstyled, and unknown assets by exact ID.
2. Removed the stale partial Page link after owner approval, attempted a clean portfolio claim, and preserved both accounts.
3. Owner reconnected the Page from mobile; Meta reports `Connected`, but the linked-account screen confirms only partial features.
4. Created clean portfolio-owned ad account `2258717414903571` without bypassing the restriction or starting spend.
5. Attempted exact owner self-access to `1104252943250335`; Meta returned `Unable to update permissions` and made no change.
6. Attempted Facebook Ads Manager authentication; OAuth ended at `This Page Isn't Available`, and ordinary Ads Manager redirected to the new account.
7. Attempted Instagram's `Switch` flow twice; the dialog was blank both times. Retries stopped after the second identical failure.
8. Direct portfolio-add attempts returned unknown/system-unavailable errors and did not create a pending request.

## Separate historical personal account

- Asset: personal ad account `55495642`
- State: disabled since 2020; review period expired; Best Prints Co Page is not assigned to it
- Decision: preserve read-only and do not use or appeal as part of the Instagram release request

## Review and appeal readiness

Review eligibility for `1104252943250335` cannot be reached through a functioning form at the current cursor. No appeal/reference ID exists. Payment is intentionally deferred and should not be presented as remediation for a balance that Meta shows as USD 0.

Prepared support/review text (owner must review and submit if Meta exposes the form):

> I own the professional Instagram account @bestprintsco_ (ID 17841401039012650). It was previously used under the Cvtie name and is still attached to the disabled Instagram-created ad account cvtie-ad (ID 1104252943250335). BestPrintsCo now uses Business Portfolio 913146750869963 and clean ad account 2258717414903571. We are not attempting to evade a restriction. Please review or release the legacy attachment so the same Instagram account can be claimed by the BestPrintsCo portfolio. Nstyled is a separate business and none of its assets are involved.

- Owner action required now: none while the owner keeps this remediation deferred.
- Correct owner if a review/support form appears: Gurkan Senel.
- Expected next trigger: Meta exposes a nonblank switch/release form, or Meta Support returns a case/reference result for `1104252943250335`.
- Success condition: portfolio `913146750869963` displays Instagram ID `17841401039012650` and Instagram selects ad account `2258717414903571`.
- Safe fallback: retain the basic Page connection for organic continuity; do not disconnect again, create another account, add payment, or publish ads.
