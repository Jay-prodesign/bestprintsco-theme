# BLOCK-201 Purchase Foundation Pilot

Status: complete; deployed to unpublished development theme `130287665232` and verified on desktop and mobile.

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

## Development-theme deployment and validation

- Deployment: pushed only `templates/product.json` and `config/settings_data.json` to unpublished development theme `130287665232` with `--nodelete`; no publish command was used.
- Preview URL: `https://cute-sneakers.myshopify.com?preview_theme_id=130287665232`
- Desktop validation: 1440x900 product, Add to Cart, cart, and Shopify Checkout entry passed. Unsupported sold, visitor, stock-countdown, and cart-countdown claims were not visible.
- Mobile validation: 390x844 product, Add to Cart, cart, and Shopify Checkout entry passed. Unsupported sold, visitor, stock-countdown, and cart-countdown claims were not visible.
- Owner-account Shopify CLI access was required. Theme Access token auth continued to return 401; owner OAuth plus `store auth` with `write_themes` succeeded.

## Boundaries, validation, and rollback

- No product, price, inventory, URL, supplier, live-theme, or checkout configuration was changed.
- `git diff --check` passed. Template references and block order were reviewed after removal.
- `shopify theme check` ran but reports pre-existing repository-wide theme and locale errors outside this change; it does not isolate a new error in either modified file.
- Development-theme deployment completed on theme `130287665232`; live theme `122053689424` was not targeted or modified.
- Roll back with `git revert` of the BLOCK-201 commit, then push only the reverted change to development theme `130287665232`.

## Remaining items

- No visible size guide was present on the representative product. This is an optional improvement until a verified size source is available.
- Accelerated checkout was not rendered on the product page because the template setting is disabled; standard checkout handoff works. Do not enable it without payment-method and conversion evidence.
