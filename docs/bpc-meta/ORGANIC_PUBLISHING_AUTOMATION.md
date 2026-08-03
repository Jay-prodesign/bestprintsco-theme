# Organic Publishing Automation Package

State: FOUNDATION VALIDATED; SCHEDULER INACTIVE
Project: `C:\Projects\bestprintsco-meta-automation`
Commits: `87f6065`, `eee3faf`

## Architecture

- A separate secrets-free repository keeps automation code outside the Shopify theme.
- Mode 1 uses a versioned approved-content queue and Meta's native scheduler; it requires no additional API cost.
- Mode 2 is intentionally unimplemented. A generative API may be added only after the owner separately approves its cost and every generated item enters the same approval queue.
- No live Meta token, Shopify token, password, cookie, recovery code, or authorization header is stored.

## Queue contract

Queue file: `queue/approved-content-queue.json`
Schema: `schemas/content-queue.schema.json`

Each future entry must contain an approved BestPrintsCo product/media reference, a live BestPrintsCo product URL, caption, hashtags, destination, UTM values, schedule/version data, and a stable deduplication key. The validator rejects:

- Nstyled IDs or content;
- non-BestPrintsCo domains;
- draft or unpublished products;
- missing approval evidence;
- duplicate entry keys;
- an enabled schedule without an approved cadence;
- repeat use inside the minimum 14-day window.

The queue contains zero entries and `activation_state: inactive`. No BPC-MARKETING cadence or BPC-PRODUCT-MEDIA-approved first creative set was found in the accessible records, so activation was deliberately not inferred.

## Publishing controls

- Publication IDs and outcomes must be written back to the queue/log before a retry.
- A failed post must not be blindly retried or duplicated.
- The owner can stop publication by leaving or setting the queue state to `inactive`.
- Live schedule changes must be versioned and pass `npm run queue:validate`.
- Native Facebook publishing access exists. Instagram publishing remains blocked until Instagram `17841401039012650` is fully claimed by portfolio `913146750869963`.

## Activation procedure

1. Add only BPC-PRODUCT-MEDIA-approved footwear assets and verified live Shopify URLs.
2. Record an approved BPC-MARKETING cadence and change the queue state in a reviewable commit.
3. Run `npm run validate` and require all checks to pass.
4. Complete the Instagram portfolio claim if Instagram scheduling is required.
5. Load the approved queue into Meta's native scheduler. Any final publish/schedule authorization remains owner-gated.

Current validation: config PASS, empty inactive queue PASS, Meta-Shopify reconciliation tests PASS.
