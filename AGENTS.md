# BestPrintsCo Repository Operating Rules

These rules apply to every task in this repository.

## Safety and Shopify boundaries

- Never run `shopify theme publish`.
- Never use `shopify theme push --publish`.
- Never modify, overwrite, or push to live theme ID `122053689424`.
- Work only with unpublished development theme ID `130287665232` on `cute-sneakers.myshopify.com`.
- Never store API keys, tokens, customer data, order data, credentials, or raw private exports in Git.
- Do not request or create API credentials unless a separately approved task explicitly requires them.
- Do not remove an app, widget, or integration without identifying and documenting its source and purpose.

## Git and deployment controls

- Never work directly on `main`.
- Use a task-specific branch or Codex-managed worktree for every implementation task.
- Keep `main` as the last approved and tested development-theme state.
- Only a clean, approved `main` branch may be pushed to unpublished theme `130287665232`.
- Only one theme-code implementation task may push to the Shopify development theme at a time.
- Review the complete Git diff before committing.
- Include the task ID in every implementation commit message.
- Merge only after acceptance criteria and validation pass.
- Record the commit hash, test evidence, acceptance-criteria results, and preview URL before marking a task done.

## Phase and task controls

- Read `AGENTS.md`, `docs/seo/PROJECT-STATE.md`, and `docs/seo/TASKS.yaml` before every task.
- Confirm the current phase before doing work.
- Execute only tasks in the current phase with status `ready` and completed dependencies.
- Only one theme-code implementation task may have status `in_progress`.
- Do not mix phases or automatically advance to the next phase.
- Add unrelated discoveries to the backlog instead of implementing them immediately.
- Require a phase-gate review before changing phases.
- A phase may advance only when its gate is `passed` or `passed_with_documented_debt`.
- Run baseline tests before modifying code.
- Run Shopify Theme Check and relevant page tests after changes.
- Update `TASKS.yaml` and `PROJECT-STATE.md` at the end of every task.
- Do not mark a task done without test evidence, commit hash, and acceptance-criteria results.

## Content and catalog integrity

- Never fabricate reviews, customer activity, visitor counts, sales, stock scarcity, endorsements, or business claims.
- Never generate keyword-stuffed, duplicate, thin, or doorway pages.
- Never rewrite products or collections in bulk without snapshots, proposals, validation, approval where required, controlled updates, post-update verification, and rollback files.
- Do not change product handles during the initial product SEO pilot.
- Do not infer product materials, features, compatibility, performance, or visual details without evidence.
- The theme repository is not the source of truth for all product and collection data; use the controlled data workflow in `docs/seo/DATA-REQUIREMENTS.md`.

## Required workflow

1. Read `AGENTS.md`.
2. Read `docs/seo/PROJECT-STATE.md`.
3. Read `docs/seo/TASKS.yaml`.
4. Confirm the current phase.
5. Select one `ready` task whose dependencies are complete.
6. Create a task-specific branch or Codex-managed worktree from `main`.
7. Run and record baseline tests.
8. Implement only the selected task.
9. Run validation.
10. Review the full diff.
11. Update task records and project state.
12. Commit with the task ID in the commit message.
13. Merge only after acceptance criteria pass.
14. Push only approved `main` to unpublished development theme `130287665232`.
15. Record preview URL, test results, and commit hash.
16. Run a phase-gate review before advancing phases.
