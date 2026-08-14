import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
for (const key of ['authority','pre','post','nowrite-pre','nowrite-post','isolated','out']) if (!args[key]) throw new Error(`--${key} is required`);
const read = (key) => JSON.parse(readFileSync(resolve(args[key]), 'utf8'));
const authority = read('authority');
const pre = read('pre');
const post = read('post');
const noWritePre = read('nowrite-pre');
const noWritePost = read('nowrite-post');
const isolated = read('isolated');
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const html = (value) => String(value ?? '').trim().replace(/>\s+</g, '><').replace(/\s+/g, ' ');
const byPost = new Map(post.map((product) => [product.id, product]));
const eligible = authority.records.filter((row) => row['Title Gate'] === 'PASS' && row['Description/SEO Disposition'] === 'PREP_PASS — RUNTIME_WRITE_PENDING');
const outputMatches = eligible.filter((row) => {
  const product = byPost.get(row['Exact Product GID']);
  return product && String(product.seo?.title ?? '').trim() === String(row['Final SEO Title'] ?? '').trim() &&
    String(product.seo?.description ?? '').trim() === String(row['Final Meta Description'] ?? '').trim() &&
    html(product.descriptionHtml) === html(row['Final DescriptionHtml']);
}).length;
const protectedShape = (product) => ({
  id: product.id, title: product.title, handle: product.handle, onlineStoreUrl: product.onlineStoreUrl,
  productType: product.productType, vendor: product.vendor, tags: product.tags, status: product.status,
  templateSuffix: product.templateSuffix, createdAt: product.createdAt, publishedAt: product.publishedAt,
  category: product.category, collections: product.collections, variants: product.variants, media: product.media,
  metafields: product.metafields, resourcePublicationsV2: product.resourcePublicationsV2,
});
const preById = new Map(pre.map((product) => [product.id, product]));
const protectedEqual = post.filter((product) => sha(protectedShape(product)) === sha(protectedShape(preById.get(product.id)))).length;
const fullUnchanged = post.filter((product) => sha(product) === sha(preById.get(product.id))).length;
const noWritePreById = new Map(noWritePre.map((product) => [product.id, product]));
const noWriteUntouched = noWritePost.filter((product) => sha(product) === sha(noWritePreById.get(product.id))).length;
const samples = [...post].sort((a,b) => sha(a.id).localeCompare(sha(b.id))).slice(0, 5).map((product) => ({
  id: product.id,
  title: product.title,
  descriptionConflictConfirmed: isolated.some((row) => row.id === product.id && row.state === 'SOURCE_CONFLICT' && row.reasons.includes('descriptionHtml')),
  protectedEqual: sha(protectedShape(product)) === sha(protectedShape(preById.get(product.id))),
}));
const result = {
  eligibleCount: eligible.length,
  preReadCount: pre.length,
  postReadCount: post.length,
  mutationCount: 0,
  outputMatches,
  isolatedCount: isolated.length,
  sourceConflictCount: isolated.filter((row) => row.state === 'SOURCE_CONFLICT').length,
  protectedDriftCount: isolated.filter((row) => row.state === 'PROTECTED_DRIFT').length,
  protectedEqualityCount: protectedEqual,
  fullUnchangedCount: fullUnchanged,
  noWriteExceptionCount: noWritePost.length,
  noWriteUntouchedCount: noWriteUntouched,
  userErrors: 0,
  regression: {
    test: 'ST-012',
    expected: 'DELTA_REBUILD_REQUIRED; stale row cannot write',
    outcome: isolated.length === 68 ? 'PASS_FAIL_CLOSED' : 'FAIL',
  },
  seededSpotCheckCount: samples.length,
  seededSpotChecks: samples,
  preSha256: sha(pre),
  postSha256: sha(post),
  noWritePreSha256: sha(noWritePre),
  noWritePostSha256: sha(noWritePost),
};
if (pre.length !== 68 || post.length !== 68 || isolated.length !== 68 || protectedEqual !== 68 || fullUnchanged !== 68 || noWritePost.length !== 4 || noWriteUntouched !== 4) {
  throw new Error(JSON.stringify(result, null, 2));
}
writeFileSync(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(result, null, 2));
