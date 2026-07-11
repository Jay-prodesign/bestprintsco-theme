# BestPrintsCo SEO QA Checklist

## Before work

- [ ] Read `AGENTS.md`, `PROJECT-STATE.md`, and `TASKS.yaml`.
- [ ] Confirm current phase, task status, dependencies, approval, and risk.
- [ ] Confirm branch/worktree is task-specific and based on approved `main`.
- [ ] Confirm clean Git status.
- [ ] Record baseline tests and affected URLs.
- [ ] Confirm theme target is unpublished ID `130287665232`; never target `122053689424`.

## During work

- [ ] Modify only files listed or explicitly added to the task record.
- [ ] Put unrelated findings in backlog.
- [ ] Preserve integrations until source/purpose are known.
- [ ] Use evidence for product facts and business claims.
- [ ] Maintain rollback instructions and snapshots for data changes.

## Code validation

- [ ] Run `shopify theme check`.
- [ ] Validate JSON, JSON-LD, schema settings, and locale files.
- [ ] Test affected desktop and mobile paths on the unpublished preview.
- [ ] Check console errors, navigation, search, cart, variants, personalization, and localization as relevant.
- [ ] Check keyboard access, focus, accessible names, alt text, and heading order as relevant.
- [ ] Verify title, description, canonical, robots, social tags, and structured data as relevant.
- [ ] Measure performance against the recorded baseline as relevant.

## Diff and Git review

- [ ] Review `git status`, `git diff --check`, and the complete `git diff`.
- [ ] Confirm no secrets, exports, customer/order data, unrelated files, or live-theme references were added.
- [ ] Confirm acceptance criteria with evidence.
- [ ] Update `TASKS.yaml` and `PROJECT-STATE.md`.
- [ ] Commit with the task ID.

## Deployment and closeout

- [ ] Merge only after review and acceptance criteria pass.
- [ ] Deploy only clean, approved `main` to theme `130287665232`.
- [ ] Never run `shopify theme publish` or `shopify theme push --publish`.
- [ ] Record commit hash, exact changed files, test results, preview URL, and rollback.
- [ ] Confirm live theme `122053689424` was not modified.
- [ ] Do not advance phase without a recorded gate decision.
