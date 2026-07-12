# BestPrintsCo Repository Operating Rules

## Non-negotiable safety

* Never run `shopify theme publish` or `shopify theme push --publish`.
* Never publish or replace the entire development theme as the live theme.
* Initial implementation and validation must target unpublished development theme `130287665232` on `cute-sneakers.myshopify.com`.
* After a completed task passes proportionate validation, Codex may automatically deploy only that task's isolated files to live theme `122053689424`.
* Never include unrelated files in a live deployment.
* Use `--nodelete` for isolated theme-file deployments.
* Preserve a practical rollback method before live deployment.
* Use risk-proportionate validation:

  * Minor, isolated, reversible changes require one focused live check.
  * Product forms, variants, cart, checkout entry, pricing, inventory, URLs, navigation, schema, sitewide JavaScript, or bulk changes require deeper desktop/mobile validation.
* Do not repeat checks that already passed unless code changes, validation fails, or new evidence indicates a risk.
* Never commit credentials, tokens, customer/order data, or private raw exports.
* Never fabricate product facts, reviews, activity, sales, scarcity, guarantees, or business claims.
* Never copy competitor content or treat competitor listings as authoritative product evidence.

## Task and Git controls

- Read `AGENTS.md`, `docs/seo/PROJECT-STATE.md`, `docs/seo/TASKS.yaml`, and `docs/seo/CHATGPT-HANDOFF.md` before work.
- Never implement directly on `main`; use a task branch or Codex-managed worktree.
- Keep `main` as the last approved, tested development-theme state.
- Execute only one `ready` task in the current phase with completed dependencies.
- Only one theme-code task may be `in_progress`, and only one task may deploy to the development theme at a time.
- Do not mix phases, implement unrelated discoveries, or advance phases without a recorded gate outcome of `passed` or `passed_with_documented_debt`.
- Add unrelated findings to `TASKS.yaml` instead of implementing them.
- Do not remove apps, widgets, integrations, or suspected legacy code without source, purpose, usage, and regression evidence.

## Catalog and content controls

- Follow the evidence hierarchy in `docs/seo/CONTENT-STANDARDS.md`; unknown facts remain unknown.
- Do not bulk rewrite products or collections without an immutable snapshot, before/after proposal, validation, approval, controlled batch, post-update verification, and rollback.
- Preserve handles, prices, variants, inventory, and publication status during pilots unless a later task explicitly authorizes otherwise.
- Do not change product handles during the initial pilot.
- Inspect at least the main image of every product before approving its final title.
- Generate image alt text only after product titles and page meaning are approved.
- Do not create keyword-stuffed, duplicate, thin, or doorway pages.

## Cost Control and Reporting

- Use the lowest-cost suitable model and low reasoning for simple work; use normal speed and never use Fast mode unless the owner explicitly asks.
- Read only task-relevant files, reuse verified context, and do not start repo-wide scans, full-catalog analysis, or broad SEO audits without explicit owner approval.
- Do not launch review agents, critic agents, subagents, or multi-agent work unless the owner explicitly asks and the task materially benefits.
- Do not create or update handoffs, state reports, audit reports, inventory reports, or similar status artifacts unless explicitly requested or required by the selected task workflow.
- After a task, report at most six short bullets: changed files, validation, and any blocker. Do not create follow-on tasks or advance a phase without instruction.

## Required workflow

1. Read the required governance and state files.
2. Confirm the current phase, gate, selected task, dependencies, approval, and risk.
3. Create a task-specific branch or worktree from the approved base.
4. Confirm clean status and record relevant baseline tests.
5. Implement only the selected task.
6. Run task validation, including Theme Check and affected-page tests for theme work.
7. Review the complete diff and confirm Shopify/live-theme boundaries.
8. Update `TASKS.yaml` and `PROJECT-STATE.md` with evidence, acceptance results, rollback, and commit/preview fields.
9. Update `CHATGPT-HANDOFF.md` when a task completes or a phase gate is reviewed.
10. Commit with the task ID; merge only after acceptance criteria pass.
11. Deploy only clean, approved `main` to development theme `130287665232` when explicitly authorized.
12. Record changed files, tests, commit, deployment status, and preview URL; run a gate review before changing phase.
