# BestPrintsCo Commercial-First SEO Roadmap

Permanent priority: commercial discovery → critical trust and purchase blockers → homepage and priority collection SEO → product-page conversion → controlled product SEO pilot → image SEO after title/content approval → measurement → evidence-led navigation/architecture → controlled scaling → new landing pages → supporting content → remaining technical debt.

Every phase requires a recorded gate. No phase advances automatically.

## Phase 0 — Governance and baseline

- **Purpose:** Maintain safe task, evidence, approval, deployment, and rollback controls.
- **Scope:** Repository rules, baseline, state, task system, standards, normalization, and gate review.
- **Explicit exclusions:** Theme, catalog, navigation, Shopify Admin, and SEO implementation.
- **Dependencies:** Initial audit and clean repository.
- **Deliverables:** Normalized governance files and reviewed Phase 0 gate.
- **Risks:** Conflicting priorities or unclear approval authority.
- **Validation:** YAML/Markdown checks, full diff, no theme/data changes.
- **Exit criteria:** Commercial-first system accepted and decisions assigned.
- **Phase gate criteria:** `passed` or `passed_with_documented_debt` recorded by owner.
- **Business-owner decisions:** Approval roles, priority markets, data access, claims/review sources.
- **Data requirements:** Existing audit, verified theme IDs, repository state.

## Phase 1 — Catalog source-of-truth, commercial SEO discovery, catalog clustering and minimum keyword-to-page map

- **Purpose:** Identify commercially important collections/product families and establish factual catalog evidence before selecting pilots.
- **Scope:** Safe read-only product/collection inventory; first 3–5 priority-collection criteria; PillowProfits base-product clustering; repeated title/description analysis; collection completeness; minimum keyword-to-page map; pilot candidates; measurement requirements.
- **Explicit exclusions:** Product, collection, navigation, theme, image-alt, or Shopify Admin changes.
- **Dependencies:** Phase 0 gate passed and safe read-only access method approved.
- **Deliverables:** Source inventory, cluster report, pattern report, collection matrix, keyword map, pilot-candidate shortlist, evidence/confidence process, data-gap report.
- **Risks:** Incomplete supplier evidence, mixed base products, misleading visual similarity, unavailable commercial data.
- **Validation:** Counts reconciled; representative products validate clusters; every proposed fact has evidence/confidence; no writes.
- **Exit criteria:** One candidate base-product cluster (~20 products) and 3–5 collection candidates are evidence-backed but not yet changed.
- **Phase gate criteria:** Owner approves pilot selection criteria, candidates, evidence rules, and Phase 2 priorities.
- **Business-owner decisions:** Commercial collections, markets, source records, read-only access, KPI priorities.
- **Data requirements:** Shopify product/collection export; SKU/variant/vendor/type/tag/price/image data; PillowProfits documentation; optional Search Console, Analytics, and Shopify sales exports.

## Phase 2 — Critical trust problems, active technical blockers and product-page conversion foundation

- **Purpose:** Remove verified barriers to trust and purchase before SEO pilots.
- **Scope:** Misleading trust/sales/scarcity elements; broken product forms, variants, cart, Buy Now/accelerated checkout; serious mobile/render failures; active Liquid/HTML/JSON/schema/canonical/indexability failures; missing critical assets; foundational size/delivery/returns presentation.
- **Explicit exclusions:** Inactive translations, naming warnings, orphan/legacy cleanup, broad performance refactors, bulk SEO content.
- **Dependencies:** Phase 1 active-page/product evidence and approved priorities.
- **Deliverables:** Verified blocker register, corrected purchase foundation, QA evidence.
- **Risks:** App/customizer regression and unsupported claims.
- **Validation:** Theme Check scoped to active issues, mobile product/cart tests, variant/checkout tests, schema/canonical tests, preview review.
- **Exit criteria:** No verified critical purchase/trust/active technical blocker remains in pilot paths.
- **Phase gate criteria:** Owner approves trust facts; critical customer journeys pass.
- **Business-owner decisions:** Delivery/returns/size claims, review source, promotion rules, app ownership.
- **Data requirements:** Active template/app map, policies, fulfillment facts, test products.

## Phase 3 — Homepage and priority collection SEO pilot

- **Purpose:** Improve commercial targeting on the homepage and 3–5 approved priority collections.
- **Scope:** H1/title/meta, useful collection descriptions/supporting content, collection metadata, relevant homepage/collection/product internal links, trust-consistent presentation.
- **Explicit exclusions:** Catalog-wide rewrites, product-title batch, image-alt batch, navigation redesign.
- **Dependencies:** Phase 2 gate and approved Phase 1 collection/keyword map.
- **Deliverables:** Snapshots, approved proposals, implemented pilot, preview and indexation baseline.
- **Risks:** Cannibalization, unsupported positioning, thin collection copy.
- **Validation:** Unique intent, factual review, metadata/source tests, internal-link crawl, mobile UX.
- **Exit criteria:** Homepage and 3–5 collections meet approved commercial/SEO criteria.
- **Phase gate criteria:** Owner approves pages and pilot baseline.
- **Business-owner decisions:** Value proposition, priority collections, copy/offer approvals.
- **Data requirements:** Keyword map, catalog depth, collection counts, source facts.

## Phase 4 — Controlled product SEO pilot

- **Purpose:** Prove concise product titles, useful descriptions, and product-page conversion on one verified cluster.
- **Scope:** Normally one PillowProfits base-product cluster, approximately 20 products, from one priority collection/group; title/description/SEO proposals; variant/size/Add to Cart/Buy Now/mobile usability; related-product relevance.
- **Explicit exclusions:** Handle, price, variant, inventory, publication-status, or image-alt changes.
- **Dependencies:** Phase 3 gate, verified cluster, immutable snapshot, approved proposals and evidence process.
- **Deliverables:** Before snapshot, cluster fact sheet, unique proposals, duplicate checks, approved batch, verification, rollback.
- **Risks:** Incorrect shared facts, title collisions, feed/app regressions.
- **Validation:** Inspect every main image; exact/near-duplicate title checks; representative and full-field review; product/form/mobile/feed checks.
- **Exit criteria:** Pilot passes factual, uniqueness, purchase, and rollback criteria.
- **Phase gate criteria:** Owner approves results before image SEO or scaling.
- **Business-owner decisions:** Exact cluster/products, title style, description depth, conversion changes.
- **Data requirements:** Full cluster data, main images, verified supplier/base-product evidence.

## Phase 5 — Product image SEO pilot after product titles and descriptions are approved

- **Purpose:** Add accurate image meaning after page meaning is stable.
- **Scope:** Image inventory, role classification, alt proposals, filename opportunities where safe, accessibility verification for the approved Phase 4 pilot.
- **Explicit exclusions:** Alt generation before title/content approval; inferred visual details; catalog-wide image changes.
- **Dependencies:** Phase 4 gate and approved product titles/descriptions.
- **Deliverables:** Image snapshot, evidence-linked proposals, approved pilot updates, rollback.
- **Risks:** Incorrect visual claims, duplicate/spammy alts, destructive asset changes.
- **Validation:** Main image of every product inspected; decorative/content roles verified; storefront/accessibility checks.
- **Exit criteria:** Pilot image fields are accurate, concise, unique where useful, and reversible.
- **Phase gate criteria:** Owner approves image quality and workflow.
- **Business-owner decisions:** Visual terminology and filename-change tolerance.
- **Data requirements:** Product-image relationships, source images, approved page meaning.

## Phase 6 — Measurement and pilot iteration

- **Purpose:** Measure commercial/SEO effects before scaling.
- **Scope:** Search, engagement, product-view, add-to-cart, checkout, conversion, revenue, returns, and performance baselines where authorized; pilot comparison and iteration.
- **Explicit exclusions:** Scaling without sufficient observation; causal claims without evidence.
- **Dependencies:** Phases 3–5 pilots and reliable instrumentation.
- **Deliverables:** KPI baseline, data-quality report, pilot scorecard, approved iteration plan.
- **Risks:** Low volume, seasonality, attribution gaps, invalid comparisons.
- **Validation:** Data-source reconciliation, defined windows/segments, documented limitations.
- **Exit criteria:** Owner accepts pilot outcome and next hypothesis.
- **Phase gate criteria:** Explicit scale, revise, hold, or reject decision.
- **Business-owner decisions:** KPIs, observation window, success thresholds.
- **Data requirements:** Search Console, Analytics, Shopify sales/funnel data where authorized.

## Phase 7 — Navigation, site architecture and internal-link implementation based on evidence

- **Purpose:** Improve discovery and authority flow using catalog, query, and pilot evidence.
- **Scope:** Menu/taxonomy refinement, collection relationships, breadcrumbs, internal links, orphan reduction, facet/index rules.
- **Explicit exclusions:** Speculative reorganization or handle changes without migration plan.
- **Dependencies:** Phase 6 measurement and approved architecture proposal.
- **Deliverables:** Current/proposed maps, link plan, redirects if required, implementation and crawl QA.
- **Risks:** Shopper confusion, lost equity, broken routes.
- **Validation:** Crawl/click-depth comparison, navigation/mobile tests, redirect/index checks.
- **Exit criteria:** Approved structure implemented without broken journeys.
- **Phase gate criteria:** Business/SEO/UX review passes.
- **Business-owner decisions:** Category naming, menu priority, merchandising relationships.
- **Data requirements:** Query, sales, collection, crawl, and pilot evidence.

## Phase 8 — Controlled collection and product SEO scaling

- **Purpose:** Scale only proven workflows in reversible batches.
- **Scope:** Approved collection/product clusters; titles, descriptions, metadata, supporting copy, internal links, and images only when prerequisites pass.
- **Explicit exclusions:** Unreviewed automation, handle changes, unsupported claims.
- **Dependencies:** Successful Phase 6/7 gates and proven snapshot/proposal/rollback pipeline.
- **Deliverables:** Batch snapshots, proposals, approvals, updates, verification, rollback records.
- **Risks:** Quality drift, collisions, feed/app impact.
- **Validation:** Automated rules plus sampled manual evidence and post-update checks.
- **Exit criteria:** In-scope batches meet quality/measurement thresholds.
- **Phase gate criteria:** Batch review authorizes continuation or correction.
- **Business-owner decisions:** Batch priority, size, exceptions.
- **Data requirements:** Fresh snapshots and current commercial performance.

## Phase 9 — New SEO landing pages with distinct intent and sufficient catalog depth

- **Purpose:** Serve validated unmet commercial intents.
- **Scope:** Only differentiated pages supported by sufficient products and clear internal-link roles.
- **Explicit exclusions:** Thin, duplicate, doorway, or mass-generated pages.
- **Dependencies:** Evidence from catalog, keyword map, architecture, and measurement.
- **Deliverables:** Intent briefs, catalog-depth proof, approved pages, links, measurement plan.
- **Risks:** Cannibalization and maintenance debt.
- **Validation:** Intent uniqueness, factual review, crawl/index and UX checks.
- **Exit criteria:** Pages demonstrate distinct value and adequate inventory.
- **Phase gate criteria:** Content/SEO/business approval.
- **Business-owner decisions:** Target intents, offers, merchandising support.
- **Data requirements:** Query evidence, inventory depth, approved facts.

## Phase 10 — Supporting blogs, guides and topic clusters

- **Purpose:** Support commercial journeys with useful education.
- **Scope:** Evidence-based sizing, care, style, gifting, product education, and relevant internal links.
- **Explicit exclusions:** Generic filler, unsupported expertise, duplicated commercial pages.
- **Dependencies:** Approved commercial pages and customer/query evidence.
- **Deliverables:** Editorial map, briefs, content, links, update ownership.
- **Risks:** Low-value content and stale guidance.
- **Validation:** Originality, sources, intent fit, helpfulness, link checks.
- **Exit criteria:** Initial supporting cluster is useful, maintained, and measured.
- **Phase gate criteria:** Editorial/business review passes.
- **Business-owner decisions:** Voice, expertise, publishing capacity.
- **Data requirements:** Customer questions, query data, verified product/supplier facts.

## Phase 11 — Remaining performance work and low-impact technical debt

- **Purpose:** Address residual work after commercial blockers and pilots.
- **Scope:** Inactive translation parity, variable naming, orphan snippets, unused legacy sections, preload/font cleanup, low-impact warnings, broader performance improvements.
- **Explicit exclusions:** Removing uncertain legacy/app code without evidence; displacing higher commercial work.
- **Dependencies:** Prior phase gates and active-impact classification.
- **Deliverables:** Debt register, verified cleanup batches, regression/performance evidence.
- **Risks:** Regression for limited commercial value.
- **Validation:** Theme Check, usage evidence, page/app regression tests, performance comparison.
- **Exit criteria:** Accepted debt threshold or completed verified cleanup.
- **Phase gate criteria:** Risk/value review accepts completion or remaining debt.
- **Business-owner decisions:** Performance budget and debt tolerance.
- **Data requirements:** Active usage/app maps and field/lab performance data.
