# BestPrintsCo Codex Operating Rules

## Role

Codex is the implementation executor.

ChatGPT and the owner handle strategy, SEO planning, copy decisions, progress tracking, review, and selection of the next batch.

Implement only the exact approved batch.

Do not choose or begin follow-up work.

## Cost control

- Read only files directly needed for the approved batch.
- Do not perform broad audits, catalog scans, competitor research, or repeated discovery.
- Do not use subagents, critic agents, parallel agents, or Fast mode.
- Do not create reports, roadmaps, decision logs, handoffs, or status documents unless the current prompt explicitly requires one.
- Do not rerun successful checks.
- Stop after two failures with the same cause.
- Keep the final response concise.

## Shopify safety

- Never run `shopify theme publish`.
- Never run `shopify theme push --publish`.
- Never perform a full-theme push.
- Never overwrite live theme `122053689424`.
- Deploy only explicitly authorized files and use `--nodelete`.
- New batches deploy to development theme `130287665232` unless the current prompt explicitly authorizes a live selective deployment.

## Protected catalog data

Never change unless explicitly authorized:

- product handles or URLs;
- SKUs or variant SKUs;
- prices or compare-at prices;
- inventory;
- variants or options;
- publication status;
- customer or order data;
- checkout settings;
- supplier data.

## Content integrity

- Never fabricate sales, visitors, stock, scarcity, reviews, ratings, guarantees, shipping, delivery, returns, exchanges, materials, fit, comfort, compatibility, safety, or performance claims.
- Do not copy competitor content.
- Unknown facts remain unknown.
- Prefer removing misleading copy over adding generic marketing copy.

## Validation levels

Low-risk text/settings change:
- `git diff --check`
- changed-file syntax validation
- one affected-page check

Medium-risk layout/navigation change:
- low-risk checks
- affected page on desktop and mobile
- affected links and controls
- new browser-console errors

High-risk product/cart/variant JavaScript change:
- medium-risk checks
- variant selection
- Add to Cart
- cart line
- checkout handoff

Do not run high-risk validation for low- or medium-risk changes.

## Git and reporting

- Use one focused branch and reversible commit per commercial batch.
- Do not update project-management documents during normal batches.
- Git commits are the implementation history.
- Return only the commit, branch, deployment result, and blocker.

## AI coordination documents

- Treat `docs/ai/` as the GitHub communication layer between Codex and ChatGPT.
- At the end of every completed or blocked task, update:
  - `docs/ai/CHATGPT-HANDOFF.md`
  - `docs/ai/PROJECT-STATE.md`
  - `docs/ai/DECISION-LOG.md`
  - `docs/ai/NEXT-TASKS.yaml`
- Record the task ID/objective, branch/worktree, start/final commits, repository-relative files changed, Shopify resources changed, validation, deployment status, evidence, blockers, risks, rollback procedure, and recommended next action.
- Keep entries concise, factual, machine-readable, and safe for GitHub review.
- Include commit SHAs and repository-relative paths.
- Never expose secrets, tokens, credentials, private customer data, or authorization headers.
- Commit and push AI coordination updates with the related implementation commit or as a clearly labelled evidence commit.
- Never leave authoritative project state only in a Codex chat response.
