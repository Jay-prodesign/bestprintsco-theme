import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
for (const required of ['authority', 'baseline-authority', 'before', 'out']) if (!args[required]) throw new Error(`--${required} is required`);
const authority = JSON.parse(readFileSync(resolve(args.authority), 'utf8'));
const baselineAuthority = JSON.parse(readFileSync(resolve(args['baseline-authority']), 'utf8'));
const before = JSON.parse(readFileSync(resolve(args.before), 'utf8'));
const outDir = resolve(args.out);
mkdirSync(outDir, { recursive: true });

const eligible = authority.records.filter((row) =>
  row['Title Gate'] === 'PASS' &&
  row['Description/SEO Disposition'] === 'PREP_PASS — RUNTIME_WRITE_PENDING' &&
  String(row['Description/SEO Gate']).startsWith('PASS')
);
if (eligible.length !== 68 || before.length !== 68) throw new Error(JSON.stringify({ eligible: eligible.length, before: before.length }));
const byId = new Map(before.map((product) => [product.id, product]));
const baselineById = new Map(baselineAuthority.records.map((row) => [row['Exact Product GID'], row]));
const text = (value) => value == null ? '' : String(value).trim();
const html = (value) => text(value).replace(/>\s+</g, '><').replace(/\s+/g, ' ');
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const protectedShape = (product) => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  onlineStoreUrl: product.onlineStoreUrl,
  productType: product.productType,
  vendor: product.vendor,
  tags: product.tags,
  status: product.status,
  templateSuffix: product.templateSuffix,
  createdAt: product.createdAt,
  publishedAt: product.publishedAt,
  category: product.category,
  collections: product.collections,
  variants: product.variants,
  media: product.media,
  metafields: product.metafields,
  resourcePublicationsV2: product.resourcePublicationsV2,
});
const planned = [];
const noops = [];
const isolated = [];
const rollback = [];
const baselines = [];
for (const row of eligible) {
  const id = row['Exact Product GID'];
  const product = byId.get(id);
  const baselineRow = baselineById.get(id);
  if (!product) {
    isolated.push({ id, state: 'SOURCE_CONFLICT', reasons: ['MISSING_RUNTIME_PRODUCT'] });
    continue;
  }
  if (!baselineRow?.['Proposed DescriptionHtml']) {
    isolated.push({ id, state: 'SOURCE_CONFLICT', reasons: ['MISSING_AUTHORIZED_PROPOSED_BASELINE'] });
    continue;
  }
  const authorityDrift = [];
  if (text(product.title) !== text(row['Final Product Title'])) authorityDrift.push('TITLE');
  if (text(product.vendor) !== text(row.Vendor)) authorityDrift.push('VENDOR');
  if (text(product.productType) !== text(row['Product Type'])) authorityDrift.push('PRODUCT_TYPE');
  if (text(product.status) !== text(row.Status)) authorityDrift.push('STATUS');
  if (product.variants.nodes.length !== Number(row['Variant Count'])) authorityDrift.push('VARIANT_COUNT');
  if (text(product.variants.nodes[0]?.sku) !== text(row['First SKU Anchor'])) authorityDrift.push('FIRST_SKU_ANCHOR');
  if (text(product.category?.id) !== text(row.Category)) authorityDrift.push('CATEGORY');
  const expectedSizes = text(row['Size Scope']).split(',').map((v) => v.trim()).filter(Boolean);
  const actualSizes = product.variants.nodes.map((variant) => variant.selectedOptions.find((option) => option.name === 'Size')?.value).filter(Boolean);
  if (JSON.stringify(actualSizes) !== JSON.stringify(expectedSizes)) authorityDrift.push('SIZE_SCOPE');
  if (authorityDrift.length) {
    isolated.push({ id, state: 'PROTECTED_DRIFT', reasons: authorityDrift });
    continue;
  }
  const current = {
    seoTitle: text(product.seo?.title),
    metaDescription: text(product.seo?.description),
    descriptionHtml: html(product.descriptionHtml),
  };
  const authorizedRuntimeBaseline = {
    seoTitle: text(row['Current SEO Title']),
    metaDescription: text(row['Current Meta Description']),
    descriptionHtml: html(baselineRow['Proposed DescriptionHtml']),
  };
  const target = {
    seoTitle: text(row['Final SEO Title']),
    metaDescription: text(row['Final Meta Description']),
    descriptionHtml: html(row['Final DescriptionHtml']),
  };
  const sourceConflicts = Object.keys(current).filter((field) => current[field] !== authorizedRuntimeBaseline[field] && current[field] !== target[field]);
  if (sourceConflicts.length) {
    isolated.push({ id, state: 'SOURCE_CONFLICT', reasons: sourceConflicts });
    continue;
  }
  const baseline = protectedShape(product);
  baselines.push({ id, protectedSha256: sha(baseline), protected: baseline });
  const exactCorrect = Object.keys(current).every((field) => current[field] === target[field]);
  if (exactCorrect) {
    noops.push({ id });
    continue;
  }
  planned.push({
    product: {
      id,
      descriptionHtml: row['Final DescriptionHtml'],
      seo: { title: row['Final SEO Title'], description: row['Final Meta Description'] },
    },
  });
  rollback.push({
    id,
    title: product.title,
    oldDescriptionHtml: product.descriptionHtml ?? '',
    oldSeoTitle: product.seo?.title ?? '',
    oldMetaDescription: product.seo?.description ?? '',
    targetDescriptionHtml: row['Final DescriptionHtml'],
    targetSeoTitle: row['Final SEO Title'],
    targetMetaDescription: row['Final Meta Description'],
  });
}
const write = (name, value) => writeFileSync(resolve(outDir, name), typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, 'utf8');
write('product-update.jsonl', planned.map((row) => JSON.stringify(row)).join('\n') + (planned.length ? '\n' : ''));
write('rollback.json', rollback);
write('rollback.jsonl', rollback.map((row) => JSON.stringify(row)).join('\n') + (rollback.length ? '\n' : ''));
write('rollback.csv', ['product_id,title,old_description_html,old_seo_title,old_meta_description,target_description_html,target_seo_title,target_meta_description', ...rollback.map((r) => [r.id,r.title,r.oldDescriptionHtml,r.oldSeoTitle,r.oldMetaDescription,r.targetDescriptionHtml,r.targetSeoTitle,r.targetMetaDescription].map(csv).join(','))].join('\n') + '\n');
write('protected-baseline.json', baselines);
write('isolated.json', isolated);
write('already-correct.json', noops);
const summary = {
  eligible: eligible.length,
  runtimeProducts: before.length,
  mutationPlanned: planned.length,
  alreadyCorrect: noops.length,
  isolated: isolated.length,
  sourceConflicts: isolated.filter((row) => row.state === 'SOURCE_CONFLICT').length,
  protectedDrift: isolated.filter((row) => row.state === 'PROTECTED_DRIFT').length,
  manifestSha256: sha(planned),
  rollbackSha256: sha(rollback),
  protectedBaselineSha256: sha(baselines),
};
write('summary.json', summary);
console.log(JSON.stringify(summary, null, 2));
