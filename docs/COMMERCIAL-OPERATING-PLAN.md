# BestPrintsCo Canonical Commercial Operating Plan

Last updated: 2026-07-14
Status: ACTIVE — canonical strategy and progress source

This file supersedes older roadmap, project-state, task, audit, report, and handoff documents whenever they conflict with current GitHub commits, deployment evidence, or this plan.

## Primary goal

Make BestPrintsCo attract qualified traffic and generate sales as quickly as realistically possible while minimizing Codex credit use and avoiding unsafe Shopify changes.

Priority formula:

`Expected SEO/conversion impact × confidence × speed ÷ Codex cost`

## Source-of-truth order

1. Current live storefront and Shopify live-theme state.
2. Current GitHub branch, commits, and complete diff.
3. Development and live deployment evidence.
4. `docs/COMMERCIAL-OPERATING-PLAN.md`.
5. Older project documents.

A task is not complete merely because a document says `done`.

## Roles

Owner:

* approves business-sensitive facts and protected changes;
* decides verified offers and operational claims;
* authorizes exceptional or high-risk live work.

ChatGPT:

* inspects GitHub and relevant live pages;
* selects priorities;
* prepares exact scope, copy, safeguards, and acceptance criteria;
* reviews Codex diffs;
* authorizes the transition from `review` to `done`;
* prevents repeated work.

Codex:

* implements only the approved batch;
* performs minimum validation;
* commits, pushes, and selectively deploys;
* records evidence;
* does not independently select the next task;
* does not independently mark its own work `done`.

## Progress lifecycle

Use:

* `queued`
* `in_progress`
* `review`
* `done`
* `blocked`

Codex may move the current batch from `in_progress` to `review` after successful implementation and deployment.

Codex must never move its current batch directly to `done`.

After ChatGPT reviews the GitHub diff and deployment evidence, the next approved Codex batch may apply ChatGPT’s explicit `review` → `done` transition.

Do not create a separate documentation-only run for routine transitions.

## Persistent worktree

`C:\Projects\bestprintsco-theme-worktrees\commercial-sprint`

The worktree directory is persistent. Every batch uses a fresh branch. Dirty state causes a stop. Destructive cleanup is prohibited. Old discovery worktrees are not used for commercial implementation.

## Commercial priority sequence

1. Remove misleading promotions, fake urgency, and unsupported trust claims.
2. Header, navigation, and footer.
3. Homepage commercial and SEO hierarchy.
4. Strongest 3–5 collections.
5. Strongest 20–30 products in coherent batches.
6. Keyword-to-page mapping and internal links.
7. Sitemap, canonicals, Search Console, analytics, Merchant Center, and feeds.
8. Justified landing pages.
9. One or two buying guides.
10. Scale proven clusters.
11. Remaining material technical and performance debt.

## Shopify safety

* Never use `shopify theme publish`.
* Never use `shopify theme push --publish`.
* Never perform a full-theme push.
* Always use selective pushes with `--nodelete`.
* Never delete unrelated files.
* Development theme: `130287665232`.
* Live theme: `122053689424`.

Protected unless explicitly authorized:

* handles and URLs;
* SKUs and variant SKUs;
* prices and compare-at prices;
* inventory;
* variants and options;
* publication status;
* checkout settings;
* customer, order, or supplier data.

## Content integrity

Never fabricate:

* sales or visitor activity;
* scarcity or urgency;
* reviews or ratings;
* shipping, delivery, exchange, return, or guarantee promises;
* materials, fit, comfort, care, durability, or performance;
* facts not supported by visible product evidence or authoritative records.

## Progress Ledger

### W1-B0 — Purchase-path fake urgency cleanup

Status: done
Commit: 5303b67
Development: successful
Live: successful

### W1-B1 — Header, navigation, footer, and announcement cleanup

Status: ready_for_chatgpt_completion
Head commit: f85686a62f8ba7bb10a115e96fc6c1ba18e8801b
Development: successful
Reported live deployment: successful
Independent live reconciliation on 2026-07-14: failed
Reason: external live HTML still showed old promotion, header/menu, and footer output.

### W1-B2 — Homepage commercial hierarchy, trust cleanup, and W1-B1 reconciliation

Status: review
Branch: sprint/week-1-homepage-commercial-pass
Plan commit: ad4e7ca2e19e5218ce70ffc1b86d13f80fa96a11
Implementation commit: adde7d216ad7ce864af7ac0471ae48d4eb38977d
Correction commit: 4a8af70ab9646a1fd7dc8bd54d6102f6b7006833
Modified files: `templates/index.json`, `sections/slideshow.liquid`, `snippets/logo.liquid`, `config/settings_data.json`
Development deployment result: successful
Development HTML result: passed
Live deployment result: successful
Live HTML result: passed
Live deployed files: `templates/index.json`, `sections/slideshow.liquid`, `snippets/logo.liquid`, `config/settings_data.json`, `sections/footer-1.liquid`, `sections/footer-2.liquid`
W1-B1 reconciliation result: passed
Blocker: none

### W1-B3 — Priority collection package

Status: queued
Scope: strongest 3–5 collections

### W1-B4 — Priority product package 1

Status: queued
Scope: first 5–10 products from one verified commercial cluster

### W1-B5 — Remaining priority product packages

Status: queued
Target: 20–30 optimized products in total

### W1-B6 — Internal links, indexing, feeds, and measurement

Status: queued

## Homepage SEO preference proposal

Shopify Admin follow-up, not a theme-code change:

Title proposal:

`Unique Printed Boots, Shoes & Gifts | BestPrintsCo`

Meta-description proposal:

`Explore bold printed boots, shoes, bedding, car accessories and distinctive gifts from BestPrintsCo. Shop unique designs across footwear, home and more.`

Do not hardcode the homepage title or meta description into `layout/theme.liquid`.
