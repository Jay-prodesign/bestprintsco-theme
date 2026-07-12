# BLOCK-201 Purchase Foundation Pilot

Status: implementation committed; development-theme deployment and post-deployment verification blocked by expired Shopify CLI authentication.

## Representative journey and baseline

- Product: `/products/black-music-notes-design-shoes-womens-boots` (an active C04/C06-style boot with Style and Size options). It exercises the multi-option purchase path without changing catalog data.
- Desktop: 1440x900. Mobile: 390x844.
- Before changes, the selected `US6 (EU37)` variant updated the URL and form variant ID, Add to Cart added one correct line item, the cart kept the selected options, and the enabled Checkout button reached Shopify Checkout. Browser console reported no warnings or errors.

## Verified conversion risks and focused fixes

| Surface | Verified baseline | Fix |
|---|---|---|
| Product | Generated `sold in last ... hours`, visitor count, and `Only 0 left in stock` messages appeared without a verified source. | Disabled generated sales and countdown settings; removed visitor and stock-countdown blocks from the product template. |
| Cart | A countdown claimed another customer had ordered the cart item and that products were limited. | Disabled the configured cart countdown. |
| Purchase path | Variant, Add to Cart, cart line item, and Checkout handoff worked. No fix required. | Preserve existing controls. |

## Boundaries, validation, and rollback

- No product, price, inventory, URL, supplier, live-theme, or checkout configuration was changed.
- `git diff --check` passed. Template references and block order were reviewed after removal.
- `shopify theme check` ran but reports pre-existing repository-wide theme and locale errors outside this change; it does not isolate a new error in either modified file.
- Deployment was not attempted after Shopify CLI reported an invalid token; the development theme remains unchanged. Authenticate the CLI, push only to theme `130287665232`, and repeat the two viewport journeys before marking this task done.
- Roll back with `git revert` of the BLOCK-201 commit, then push only the reverted change to development theme `130287665232`.

## Remaining items

- No visible size guide was present on the representative product. This is an optional improvement until a verified size source is available.
- Accelerated checkout was not rendered on the product page because the template setting is disabled; standard checkout handoff works. Do not enable it without payment-method and conversion evidence.
