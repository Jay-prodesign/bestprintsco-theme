# BestPrintsCo SEO Master Roadmap

Every phase requires its own gate. No phase advances automatically.

## Phase 0 — Governance, baseline and project setup

- **Purpose:** Create durable safety, state, task, evidence, and rollback controls.
- **Scope:** Rules, baseline tag, roadmap, task schema, standards, directories, and state.
- **Exclusions:** Theme, storefront, catalog, navigation, and content changes.
- **Dependencies:** Clean initial repository and completed audit.
- **Deliverables:** All files under `docs/seo`, `AGENTS.md`, protected data structure, baseline tag.
- **Risks:** Ambiguous approvals or unsafe deployment behavior.
- **Validation:** YAML/Markdown validation, full diff review, no theme-file changes.
- **Exit criteria:** Governance committed and pushed; rules and identifiers verified.
- **Phase gate:** Owner accepts controls; gate recorded as passed or passed with debt.
- **Business-owner decisions:** Approval roles and deployment authority.
- **Data requirements:** Existing audit, repository state, verified theme IDs.

## Phase 1 — Deep site discovery and full inventory

- **Purpose:** Build an evidence-backed inventory of URLs, templates, content, apps, tracking, and markets.
- **Scope:** Read-only crawl, page types, templates, indexability, internal links, structured data, analytics requirements.
- **Exclusions:** Fixes, content rewrites, app removal, catalog updates.
- **Dependencies:** Phase 0 gate passed.
- **Deliverables:** Site inventory, crawl report, app/script map, template/URL mapping, measurement baseline.
- **Risks:** Preview/live differences, crawl gaps, inaccessible data.
- **Validation:** Reconciled crawl counts, sampled page verification, documented limitations.
- **Exit criteria:** Critical page types and dependencies inventoried; unknowns assigned.
- **Phase gate:** Discovery coverage accepted and blockers classified.
- **Business-owner decisions:** Priority markets, products, collections, and KPIs.
- **Data requirements:** Sitemap, Search Console/Analytics exports if authorized, Shopify catalog export later if approved.

## Phase 2 — Theme release blockers and code stabilization

- **Purpose:** Remove confirmed failures before optimization.
- **Scope:** Active syntax, JSON/schema, missing asset, undefined object, translation runtime, and markup blockers.
- **Exclusions:** Redesign, keyword/content work, legacy cleanup without evidence.
- **Dependencies:** Phase 1 inventory and active-template classification.
- **Deliverables:** Error-free active templates, classified residual findings, regression evidence.
- **Risks:** Legacy/app-generated code and behavior regressions.
- **Validation:** Theme Check, representative page tests, console checks, diff review.
- **Exit criteria:** Zero confirmed active blockers; residual debt documented.
- **Phase gate:** Technical QA passes on development preview.
- **Business-owner decisions:** Accept/remove legacy features only after evidence.
- **Data requirements:** Active template/section usage and app ownership map.

## Phase 3 — Trust, brand and storefront consistency

- **Purpose:** Align claims, identity, policies, navigation labels, and trust evidence.
- **Scope:** Verified brand copy, contact/social identity, promotions, footer, policy presentation, review provenance.
- **Exclusions:** Fabricated proof, unverified claims, broad architecture changes.
- **Dependencies:** Stable theme and approved brand facts.
- **Deliverables:** Consistency matrix and approved storefront trust changes.
- **Risks:** Unsupported claims or conflicting policies.
- **Validation:** Claim-source review, page sampling, legal/business approval where required.
- **Exit criteria:** No known placeholder or contradictory trust signals.
- **Phase gate:** Business owner approves facts and presentation.
- **Business-owner decisions:** Value proposition, guarantees, delivery/returns language, social accounts.
- **Data requirements:** Verified policies, contact details, review source, production/delivery facts.

## Phase 4 — Technical SEO and structured data

- **Purpose:** Ensure correct crawl, index, metadata, canonical, social, and schema behavior.
- **Scope:** Meta framework, canonicals, robots/index rules, JSON-LD, breadcrumbs, pagination/filter behavior.
- **Exclusions:** Bulk content production and unsupported rating schema.
- **Dependencies:** Phases 1–3.
- **Deliverables:** Valid templates and structured-data test evidence.
- **Risks:** Duplicate/indexable variants and invalid rich-result claims.
- **Validation:** Rich Results/schema validators, crawl comparison, page-source tests.
- **Exit criteria:** Critical templates meet defined technical SEO acceptance criteria.
- **Phase gate:** SEO QA passes with documented exceptions.
- **Business-owner decisions:** International/indexation strategy.
- **Data requirements:** URL inventory, market configuration, verified entity profiles.

## Phase 5 — Performance, mobile usability and accessibility

- **Purpose:** Improve real user experience and reduce avoidable payload/blocking work.
- **Scope:** CSS/JS loading, images, fonts, third parties, LCP/CLS/INP risks, keyboard/screen-reader issues.
- **Exclusions:** App removal without ownership analysis; visual redesign beyond approved fixes.
- **Dependencies:** Stable active templates and app map.
- **Deliverables:** Performance budget, optimized assets/loading, accessibility fixes, measurements.
- **Risks:** App/customizer regressions and preview measurement distortion.
- **Validation:** Theme Check, Lighthouse, device/page tests, Shopify real-user metrics when available.
- **Exit criteria:** Budgets/thresholds met or debt explicitly accepted.
- **Phase gate:** Mobile, accessibility, and performance QA approval.
- **Business-owner decisions:** App tradeoffs and performance targets.
- **Data requirements:** Field metrics, device mix, app ownership/usage.

## Phase 6 — Site architecture, navigation and collection strategy

- **Purpose:** Create coherent customer and search pathways.
- **Scope:** Taxonomy, menus, collection hierarchy, internal linking, facets, orphan pages.
- **Exclusions:** Bulk catalog rewrites and landing-page production.
- **Dependencies:** Full inventory, approved positioning, technical foundations.
- **Deliverables:** Architecture map, redirect plan, navigation/collection proposals.
- **Risks:** URL equity loss and shopper disorientation.
- **Validation:** Crawl model, click-depth comparison, redirect QA, owner approval.
- **Exit criteria:** Approved architecture ready for controlled rollout.
- **Phase gate:** Business/SEO/UX sign-off.
- **Business-owner decisions:** Priority categories, naming, merchandising.
- **Data requirements:** Catalog/collection exports, search/query and revenue data when available.

## Phase 7 — Shopify product and collection data pipeline

- **Purpose:** Create snapshot/proposal/validation/update/rollback controls for Shopify data.
- **Scope:** Authorized CSV or Admin API read/export and controlled update tooling.
- **Exclusions:** Production catalog updates before pipeline approval.
- **Dependencies:** Data authorization and approved schema.
- **Deliverables:** Immutable snapshots, proposal format, validators, batch and rollback process.
- **Risks:** Data loss, secrets exposure, unintended bulk changes.
- **Validation:** Dry runs, schema checks, sample round trip, rollback rehearsal.
- **Exit criteria:** Owner-approved pipeline proven on non-destructive samples.
- **Phase gate:** Data safety and authorization approval.
- **Business-owner decisions:** Access method, approval threshold, batch size.
- **Data requirements:** Authorized product/collection dataset; no credentials in Git.

## Phase 8 — Pilot collection and product SEO batch

- **Purpose:** Prove catalog SEO quality and operational safety on a small batch.
- **Scope:** One approved collection and limited products; titles, descriptions, SEO fields, alts where evidenced.
- **Exclusions:** Handle changes and uncontrolled bulk edits.
- **Dependencies:** Phase 7 pipeline and approved standards.
- **Deliverables:** Before snapshot, proposals, approved batch, verification, rollback.
- **Risks:** Feed/ad conflicts, factual errors, conversion loss.
- **Validation:** Field diffs, page/feed checks, indexing baseline, owner review.
- **Exit criteria:** Pilot passes quality and rollback requirements.
- **Phase gate:** Business owner approves scaling or remediation.
- **Business-owner decisions:** Pilot collection/products and approved facts.
- **Data requirements:** Complete pilot records, images, variants, availability, source evidence.

## Phase 9 — Controlled catalog SEO scaling

- **Purpose:** Scale proven catalog improvements in reversible batches.
- **Scope:** Approved product/collection batches using Phase 7 controls.
- **Exclusions:** Unreviewed automation, unsupported claims, handle changes without migration plan.
- **Dependencies:** Successful Phase 8 gate.
- **Deliverables:** Batch snapshots, proposals, approvals, updates, QA, rollback files.
- **Risks:** Quality drift and operational load.
- **Validation:** Automated validators plus sampled manual review and post-update checks.
- **Exit criteria:** In-scope catalog complete with exceptions recorded.
- **Phase gate:** Batch quality/performance review.
- **Business-owner decisions:** Batch priorities and exception handling.
- **Data requirements:** Current catalog snapshot before every batch.

## Phase 10 — SEO landing pages and collection content

- **Purpose:** Serve validated search/customer intents with useful pages.
- **Scope:** Approved collection content and non-duplicative landing pages.
- **Exclusions:** Doorway, thin, duplicate, or mass-generated pages.
- **Dependencies:** Architecture and catalog strategy.
- **Deliverables:** Briefs, reviewed content, internal links, metadata, measurement plan.
- **Risks:** Cannibalization and thin content.
- **Validation:** Intent uniqueness, factual review, crawl/index checks, UX QA.
- **Exit criteria:** Approved pages meet quality and differentiation standards.
- **Phase gate:** Content/SEO/business approval.
- **Business-owner decisions:** Priority intents and offers.
- **Data requirements:** Keyword/query research, inventory depth, verified product facts.

## Phase 11 — Blog and supporting topic clusters

- **Purpose:** Build helpful topical coverage that supports commercial journeys.
- **Scope:** Evidence-based guides, care, sizing, style, gift, and product education clusters.
- **Exclusions:** Generic AI filler, unsupported expertise, duplicate commercial pages.
- **Dependencies:** Architecture, standards, priority landing pages.
- **Deliverables:** Editorial roadmap, briefs, articles, linking, update cadence.
- **Risks:** Low-value content and maintenance debt.
- **Validation:** Originality, fact/source review, intent fit, internal links, performance tracking.
- **Exit criteria:** Initial clusters published and measured with update owners.
- **Phase gate:** Editorial quality and measurement review.
- **Business-owner decisions:** Voice, expertise, publishing capacity.
- **Data requirements:** Query research, customer questions, verified subject evidence.

## Phase 12 — Measurement, iteration and expansion

- **Purpose:** Operate continuous improvement based on reliable evidence.
- **Scope:** KPI reporting, experiments, refreshes, expansion prioritization, anomaly response.
- **Exclusions:** Unmeasured changes and automatic phase expansion.
- **Dependencies:** Instrumented prior phases.
- **Deliverables:** Dashboard/report cadence, experiment log, refresh backlog, quarterly roadmap.
- **Risks:** Attribution errors and false conclusions.
- **Validation:** Data-quality checks, predeclared experiment criteria, segmented analysis.
- **Exit criteria:** Repeatable operating cadence with accountable owners.
- **Phase gate:** Quarterly business/SEO review.
- **Business-owner decisions:** KPI targets, investment, expansion markets/categories.
- **Data requirements:** Search, analytics, Shopify, merchandising, performance, and support data.
