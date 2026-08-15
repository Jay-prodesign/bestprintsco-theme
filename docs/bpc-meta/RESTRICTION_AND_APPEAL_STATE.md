# Restriction and Appeal State

Latest live audit: 2026-08-15
State: `OWNER DOCUMENTS REQUIRED - BUSINESS MANAGER ADMIN DISPUTE FORM OPEN`

## Controlling diagnosis

- Restricted asset: legacy Instagram-created ad account `cvtie-ad`
- Exact asset ID: `1104252943250335`
- Affected Instagram: `@bestprintsco_`, `17841401039012650`
- Restriction type: legacy ad account disabled; not eligible for review through Meta's automated support chat
- Meta's live case readback:
  - ad account `1104252943250335` is disabled;
  - Instagram `@bestprintsco_` has no active restriction or enforcement;
  - releasing or switching Instagram away from the disabled account requires specialized account-management steps outside automated support.
- Owner-provided historical clue: a friend previously had access to the Instagram account and may have created ads. This is a hypothesis for the ownership chain, not a verified asset owner.
- Billing readback: the legacy billing surface shows `Ad account disabled` and `Unable to change payment settings`. The owner-approved `Assign full control` action returned `Unable to update permissions` and instructed use of Business Settings; no access or payment state changed. Sensitive payment details exposed by the page were not used, stored, or reported, and no payment action occurred.
- First observed date for `1104252943250335`: not exposed.

## Remediation completed

1. Audited and separated BestPrintsCo, historical Cvtie, Nstyled, and unknown assets by exact ID.
2. Preserved the Page/Instagram organic connection and all historical assets.
3. Created clean portfolio-owned ad account `2258717414903571` without bypassing the restriction or starting spend.
4. Attempted owner self-access, Facebook authentication, the Instagram `Switch` flow twice, and direct portfolio claim. Meta returned permission, blank-dialog, unavailable-page, or unknown/system errors; no legacy ownership write occurred.
5. Submitted Meta support case `1667557011016000` on 2026-08-10 for `Devre dışı bırakılmış veya kısıtlanmış varlık`. Meta originally showed the case as active and `Alındı`.
6. Sent the exact Instagram, legacy ad-account, target portfolio, and target ad-account IDs through the authenticated support flow.
7. Added the possible prior-friend access context and explicit Nstyled exclusion to the case record.
8. The direct case-chat reply channel remained stuck at `Sending` twice, including after one controlled reload. The functioning Meta AI case channel confirmed that the details were added to case `1667557011016000` for the asset-recovery/account-management specialists.
9. Opened the unread Meta Support Messenger thread on 2026-08-10 at 15:41 Europe/Istanbul and successfully requested the additional human asset-recovery option. Meta replied that it cannot connect a human agent for this specific issue at this time and cannot perform the transfer. The case remained active / received.
10. Reconciled the case on 2026-08-15: Meta had automatically closed case `1667557011016000` on 2026-08-12 without remediation.
11. Retried the owner-approved Page-to-Instagram confirmation from Page `1153511934521436`. Meta returned `Business account is not allowed to advertise`; the portfolio still showed no Instagram or connected Page asset. No Commerce state changed.
12. Sent a new exact-ID escalation through authenticated Meta Support using `help@bestprintsco.com`. Meta confirmed that disabled account `1104252943250335` is the direct source of the error and that the current profile lacks administrator access to it.
13. Meta could not connect a live specialist because of support volume. Its current self-service fallback is Instagram mobile `Settings -> Business/Creator -> Payments -> Ad Account`; otherwise retry human support when capacity becomes available.
14. The owner approved and selected `Assign full control` on the legacy billing surface. Meta returned `Unable to update permissions` and `Go to your business account settings and try again`; full control was not granted and no asset/payment state changed.
15. Meta support confirmed that the Instagram is linked to a portfolio where the current profile lacks administrative access; standard self-service recovery is exhausted.
16. Verified Meta's official `Business Manager admin dispute` recovery instructions. They require an accepted requester ID, an accepted business-ownership document, and a signed authorization letter on business letterhead in unmodified PDF/JPEG/PNG form.
17. Opened the authenticated `Destek ekibiyle iletişime geç` admin-dispute contact form. No issue text, identity data, document, declaration, or submission was entered because those steps are owner-gated.

## Separate historical personal account

- Asset: personal ad account `55495642`
- State: disabled since 2020; Meta says the review window expired and instructs use of another ad account
- Relation to current issue: separate from `cvtie-ad`; deleting or appealing it would not release Instagram
- Decision: preserve read-only and never use for BestPrintsCo spend

## Review state and next trigger

- Appeal submitted: no. This is an asset-release/support case, not a policy appeal.
- Support case: `1667557011016000`
- Submitted: 2026-08-10, authenticated Meta Business Support
- Current state: prior case automatically closed 2026-08-12 without remediation; exact-ID re-escalation sent 2026-08-15; human handoff unavailable because of support volume; official admin-dispute form open and awaiting owner documents
- Required remediation: release Instagram `17841401039012650` from disabled legacy ad account `1104252943250335`, verify any external controlling owner/business chain, and make it claimable by portfolio `913146750869963` and ad account `2258717414903571`.
- Owner action required now: prepare accepted ID, accepted business-ownership proof, and a signed authorization letter; then say `Belgeler hazır`. Documents must remain private and must not be placed in the repository or chat. Upload, signature/affirmation, and final Submit remain owner-only.
- Expected next trigger: `Belgeler hazır`, a successful exact mobile release, or the exact Instagram ID appears in the controlling portfolio.
- Continuation cursor: verify Instagram ID `17841401039012650` under portfolio `913146750869963`, assign only allowlisted BestPrintsCo assets, then re-read advertising eligibility without restarting the broad audit.
- Safe fallback: keep the Page-level organic connection, preserve historical accounts, keep payment blank, and do not publish or spend.
- Review condition: do not repeat permission self-assignment, blank Instagram `Switch`, or Page-confirmation. Resume at the open admin-dispute form only when the owner documents are ready, or on an exact asset-state change.
