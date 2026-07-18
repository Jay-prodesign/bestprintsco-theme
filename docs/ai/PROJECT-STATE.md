# Project State

Status: active
Repository: `Jay-prodesign/bestprintsco-theme`
Store: `cute-sneakers.myshopify.com`
Authoritative coordination path: `docs/ai/`
Last updated: 2026-07-18

## Current state

- Current requested batch is `CATALOG-NORMALIZATION-001`: live-first catalog normalization for Product Type, Shopify standard product category, automated collections, and Online Store navigation.
- The batch is blocked before snapshot or mutation because the only available Admin GraphQL session is the Shopify CLI Connector App with read catalog scopes and theme scopes, but no catalog write scopes.
- No Shopify data, theme, catalog, product, collection, navigation, price, inventory, customer, or order data was changed.

## Active branch

- `codex/ai-coordination-system`

## Latest coordination commit

- this commit

## Deployment state

- Development theme deployment: not applicable.
- Live theme deployment: not applicable.

## Known blocker

- `CATALOG-NORMALIZATION-001` requires a usable custom Admin API credential/session with catalog write scopes before live product classification, automated collection, or navigation mutations can proceed.
