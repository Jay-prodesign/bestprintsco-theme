import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
for (const key of ['authority', 'baseline-authority', 'pre', 'post', 'nowrite-pre', 'nowrite-post', 'plan-summary', 'bulk-summary', 'out']) {
  if (!args[key]) throw new Error(`--${key} is required`);
}
const read = (key) => JSON.parse(readFileSync(resolve(args[key]), 'utf8'));
const authority = read('authority');
const baselineAuthority = read('baseline-authority');
const pre = read('pre');
const post = read('post');
const noWritePre = read('nowrite-pre');
const noWritePost = read('nowrite-post');
const plan = read('plan-summary');
const bulk = read('bulk-summary');
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalizedHtml = (value) => String(value ?? '').replace(/\r\n?/g, '\n').trim().replace(/>\s+</g, '><').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
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
  metafields: {
    ...product.metafields,
    nodes: product.metafields.nodes.filter((field) => !(field.namespace === 'global' && ['title_tag', 'description_tag'].includes(field.key))),
  },
  resourcePublicationsV2: product.resourcePublicationsV2,
});
const eligible = authority.records.filter((row) =>
  row['Title Gate'] === 'PASS' &&
  row['Description/SEO Disposition'] === 'PREP_PASS — RUNTIME_WRITE_PENDING' &&
  String(row['Description/SEO Gate']).startsWith('PASS')
);
const baselineById = new Map(baselineAuthority.records.map((row) => [row['Exact Product GID'], row]));
const preById = new Map(pre.map((product) => [product.id, product]));
const postById = new Map(post.map((product) => [product.id, product]));
const rows = eligible.map((row) => {
  const id = row['Exact Product GID'];
  const before = preById.get(id);
  const after = postById.get(id);
  const baseline = baselineById.get(id);
  if (!before || !after || !baseline) throw new Error(`Missing authority/pre/post row for ${id}`);
  return {
    id,
    proposedPrecheck: normalizedHtml(before.descriptionHtml) === normalizedHtml(baseline['Proposed DescriptionHtml']),
    finalDescription: normalizedHtml(after.descriptionHtml) === normalizedHtml(row['Final DescriptionHtml']),
    finalSeoTitle: String(after.seo?.title ?? '') === String(row['Final SEO Title'] ?? ''),
    finalMetaDescription: String(after.seo?.description ?? '') === String(row['Final Meta Description'] ?? ''),
    protectedEquality: sha(protectedShape(before)) === sha(protectedShape(after)),
  };
});
const noWritePreById = new Map(noWritePre.map((product) => [product.id, product]));
const noWriteRows = noWritePost.map((product) => ({
  id: product.id,
  untouched: sha(product) === sha(noWritePreById.get(product.id)),
}));
const failures = rows.filter((row) => Object.entries(row).some(([key, value]) => key !== 'id' && value !== true));
const result = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  counts: {
    eligible: eligible.length,
    preRead: pre.length,
    postRead: post.length,
    proposedPrecheck: rows.filter((row) => row.proposedPrecheck).length,
    finalDescription: rows.filter((row) => row.finalDescription).length,
    finalSeoTitle: rows.filter((row) => row.finalSeoTitle).length,
    finalMetaDescription: rows.filter((row) => row.finalMetaDescription).length,
    protectedEquality: rows.filter((row) => row.protectedEquality).length,
    failedProducts: failures.length,
    noWriteUntouched: noWriteRows.filter((row) => row.untouched).length,
    mutationCount: bulk.manifestRecords,
    rowErrorCount: bulk.rowErrorCount,
    retryManifestRecords: bulk.retryManifestRecords,
  },
  bulkOperationId: bulk.operationId,
  regression: {
    test: 'ST-012',
    outcome: plan.isolated === 0 && rows.every((row) => row.proposedPrecheck) ? 'PASS_AUTHORIZED_BASELINE' : 'FAIL',
  },
  failures,
  noWriteRows,
  hashes: {
    preSha256: sha(pre),
    postSha256: sha(post),
    protectedPreSha256: sha(pre.map(protectedShape)),
    protectedPostSha256: sha(post.map(protectedShape)),
    finalOutputMapSha256: sha(rows.map((row) => [row.id, row.finalDescription, row.finalSeoTitle, row.finalMetaDescription])),
    noWritePreSha256: sha(noWritePre),
    noWritePostSha256: sha(noWritePost),
    validationSha256: sha(rows),
  },
};
if (eligible.length !== 68 || pre.length !== 68 || post.length !== 68 || failures.length || noWriteRows.length !== 4 || noWriteRows.some((row) => !row.untouched) || bulk.status !== 'COMPLETED' || bulk.manifestRecords !== 68 || bulk.rowErrorCount || bulk.retryManifestRecords || result.regression.outcome !== 'PASS_AUTHORIZED_BASELINE') {
  throw new Error(JSON.stringify(result, null, 2));
}
writeFileSync(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(result, null, 2));
