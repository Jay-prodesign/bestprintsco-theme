import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STORE = 'cute-sneakers.myshopify.com';
const MODE = process.argv.includes('--mutate') ? 'mutate' : 'plan';
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : join(process.cwd(), 'data', 'shopify', 'proposals', 'CATALOG-NORMALIZATION-001-CORRECTION');
mkdirSync(OUT, { recursive: true });

const priorDir = join(process.cwd(), 'data', 'shopify', 'proposals', 'CATALOG-NORMALIZATION-001');
const mutationLog = JSON.parse(readFileSync(join(priorDir, 'mutation-log.json'), 'utf8'));
const rollback = JSON.parse(readFileSync(join(priorDir, 'rollback-product-classification.json'), 'utf8'));
const rollbackById = new Map(rollback.map((r) => [r.id, r]));

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}
function writeJson(name, value) {
  const text = JSON.stringify(value, null, 2);
  writeFileSync(join(OUT, name), text);
  return { file: name, bytes: Buffer.byteLength(text), sha256: sha256(text) };
}
function execGraphql(query, variables = {}, allowMutations = false) {
  const qPath = join(OUT, '_query.graphql');
  const vPath = join(OUT, '_variables.json');
  const oPath = join(OUT, '_result.json');
  writeFileSync(qPath, query);
  writeFileSync(vPath, JSON.stringify(variables));
  const env = {
    ...process.env,
    SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
    SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:catalog-normalization-correction|i:root',
  };
  const args = ['store', 'execute', '--store', STORE, '--query-file', qPath, '--variable-file', vPath, '--output-file', oPath, '--json'];
  if (allowMutations) args.push('--allow-mutations');
  const run = spawnSync('shopify', args, { env, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20, shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error(`shopify failed ${run.status}\n${run.stdout}\n${run.stderr}`);
  const result = JSON.parse(readFileSync(oPath, 'utf8'));
  if (result.errors) throw new Error(JSON.stringify(result.errors, null, 2));
  return result;
}

const productQuery = `query ProductNodes($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id handle title productType status vendor tags templateSuffix updatedAt publishedAt
      category { id name fullName isLeaf }
      collections(first: 50) { nodes { id handle title } }
      variants(first: 100) {
        nodes { id title sku barcode price compareAtPrice inventoryQuantity inventoryPolicy selectedOptions { name value } }
      }
      media(first: 20) { nodes { id mediaContentType alt status ... on MediaImage { image { id url width height altText } } } }
      resourcePublicationsV2(first: 20) { nodes { isPublished publication { id name } } }
    }
  }
}`;

const updateMutation = `mutation UpdateClassification($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id handle productType category { id fullName } }
    userErrors { field message }
  }
}`;

function flatten(p) {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    productType: p.productType || '',
    categoryId: p.category?.id || '',
    categoryFullName: p.category?.fullName || '',
    status: p.status,
    vendor: p.vendor,
    tags: p.tags || [],
    templateSuffix: p.templateSuffix || '',
    publishedAt: p.publishedAt || '',
    collections: (p.collections?.nodes || []).map((c) => ({ id: c.id, handle: c.handle, title: c.title })),
    variants: (p.variants?.nodes || []).map((v) => ({
      id: v.id, title: v.title, sku: v.sku, barcode: v.barcode, price: v.price,
      compareAtPrice: v.compareAtPrice, inventoryQuantity: v.inventoryQuantity,
      inventoryPolicy: v.inventoryPolicy, selectedOptions: v.selectedOptions,
    })),
    media: (p.media?.nodes || []).map((m) => ({
      id: m.id, type: m.mediaContentType, alt: m.alt || m.image?.altText || '',
      status: m.status, imageId: m.image?.id || '', url: m.image?.url || '',
      width: m.image?.width || null, height: m.image?.height || null,
    })),
    publications: (p.resourcePublicationsV2?.nodes || []).map((n) => ({ publicationId: n.publication.id, name: n.publication.name, isPublished: n.isPublished })),
  };
}
function protectedSig(p) {
  return JSON.stringify({
    id: p.id, handle: p.handle, title: p.title, status: p.status, vendor: p.vendor, tags: p.tags,
    templateSuffix: p.templateSuffix, publishedAt: p.publishedAt, variants: p.variants, media: p.media, publications: p.publications,
  });
}
function text(p) {
  return `${p.title} ${p.handle} ${p.productType} ${p.collections.map((c) => `${c.handle} ${c.title}`).join(' ')} ${p.variants.map((v) => `${v.title} ${(v.selectedOptions || []).map((o) => `${o.name}:${o.value}`).join(' ')}`).join(' ')}`.toLowerCase();
}
function physicalEvidenceText(p) {
  return `${p.title} ${p.handle} ${p.variants.map((v) => `${v.title} ${(v.selectedOptions || []).map((o) => `${o.name}:${o.value}`).join(' ')}`).join(' ')}`.toLowerCase();
}
function isKids(p) {
  return /\b(kid|kids|kid's|child|children|youth|toddler)\b/.test(text(p));
}
function bagFamily(p, previous) {
  const s = physicalEvidenceText(p);
  if (/drawstring bag/.test(s)) return ['Drawstring Bag', previous?.restoreCategoryId || null, ''];
  if (/crossbody/.test(s)) return ['Crossbody Bag', previous?.restoreCategoryId || null, ''];
  if (/saddle bag/.test(s)) return ['Saddle Bag', previous?.restoreCategoryId || null, ''];
  if (/travel bag/.test(s)) return ['Travel Bag', previous?.restoreCategoryId || 'gid://shopify/TaxonomyCategory/lb-6', 'Luggage & Bags > Duffel Bags'];
  if (/tote/.test(s)) return ['Leather Tote Bags', 'gid://shopify/TaxonomyCategory/lb-11', 'Luggage & Bags > Tote Bags'];
  if (/handbag|hand bag/.test(s)) return ['Handbag', previous?.restoreCategoryId || null, ''];
  if (/backpack/.test(s)) return ['Backpack', 'gid://shopify/TaxonomyCategory/lb-1', 'Luggage & Bags > Backpacks'];
  return null;
}
function targetFor(p, prior) {
  const s = text(p);
  const previous = rollbackById.get(p.id);
  const restore = previous ? {
    productType: previous.restoreProductType || '',
    category: previous.restoreCategoryId || null,
    reason: 'restore previous values',
    action: 'restore',
  } : null;

  if (prior.family === 'Kids Running Shoes' || (isKids(p) && /running shoe/.test(s))) {
    return { productType: 'Kids Running Shoes', category: 'gid://shopify/TaxonomyCategory/aa-8-11-5', reason: 'kids running shoe evidence from title/variants; closest valid Baby & Children’s footwear category available in live taxonomy evidence', action: 'correct' };
  }
  if (prior.family === 'Kids High Top Shoes' || (isKids(p) && /high top/.test(s))) {
    return { productType: 'Kids High Top Shoes', category: 'gid://shopify/TaxonomyCategory/aa-8-11-5', reason: 'kids high-top shoe evidence from title/variants', action: 'correct' };
  }
  if (prior.family === 'Kids Low Top Shoes' || (isKids(p) && /low top/.test(s))) {
    return { productType: 'Kids Low Top Shoes', category: 'gid://shopify/TaxonomyCategory/aa-8-11-5', reason: 'kids low-top shoe evidence from title/variants', action: 'correct' };
  }
  if (prior.family === 'Kids Shoes' || (isKids(p) && /\bshoe|sneaker/.test(s))) {
    if (/slip|casual shoe/.test(s)) return { productType: 'Kids Slip-On Shoes', category: 'gid://shopify/TaxonomyCategory/aa-8-11-5', reason: 'kids casual/slip-on shoe evidence; closest valid children sneakers category available', action: 'correct' };
    return { productType: 'Kids Shoes', category: 'gid://shopify/TaxonomyCategory/aa-8-11-5', reason: 'kids shoe evidence; closest valid children sneakers category available', action: 'correct' };
  }
  if (prior.family === 'Bags') {
    const b = bagFamily(p, previous);
    if (b) return { productType: b[0], category: b[1] || null, reason: `verified bag form: ${b[0]}`, action: 'correct' };
    return restore ? { ...restore, reason: 'ambiguous broad bag; restoring previous values' } : null;
  }
  if (prior.family === 'Tote Bags') {
    const b = bagFamily(p, previous);
    if (b?.[0] === 'Leather Tote Bags') return { productType: 'Leather Tote Bags', category: 'gid://shopify/TaxonomyCategory/lb-11', reason: 'verified tote bag from title/variants', action: 'correct' };
    return restore ? { ...restore, reason: 'not conclusively tote; restoring previous values' } : null;
  }
  if (prior.family === 'Printed Boots') {
    if (/boot/.test(s)) {
      if (/vegan leather|leather boot|womens leather|mens leather/.test(s)) return { productType: 'Vegan Leather Boots', category: 'gid://shopify/TaxonomyCategory/aa-8-3', reason: 'boots with existing leather/vegan leather product evidence', action: 'keep' };
      return restore ? { ...restore, reason: 'boots evidence present but vegan leather material not verified; restoring previous values' } : null;
    }
  }
  return null;
}

const scopedIds = mutationLog.map((m) => m.id);
const live = [];
for (let i = 0; i < scopedIds.length; i += 100) {
  const result = execGraphql(productQuery, { ids: scopedIds.slice(i, i + 100) });
  live.push(...result.nodes.filter(Boolean).map(flatten));
  console.error(`fetched ${live.length}/${scopedIds.length}`);
}
const liveById = new Map(live.map((p) => [p.id, p]));
const priorById = new Map(mutationLog.map((m) => [m.id, m]));
const corrections = [];
const unchanged = [];
const unresolved = [];
for (const prior of mutationLog) {
  const p = liveById.get(prior.id);
  if (!p) throw new Error(`Missing live product ${prior.handle}`);
  const target = targetFor(p, prior);
  if (!target) {
    unresolved.push({ id: p.id, handle: p.handle, family: prior.family, currentProductType: p.productType, currentCategoryId: p.categoryId, reason: 'no correction rule matched' });
    continue;
  }
  const targetCategory = target.category || p.categoryId;
  if (p.productType === target.productType && p.categoryId === targetCategory) {
    unchanged.push({ id: p.id, handle: p.handle, family: prior.family, productType: p.productType, categoryId: p.categoryId, categoryFullName: p.categoryFullName, reason: target.reason });
  } else {
    corrections.push({
      id: p.id,
      handle: p.handle,
      title: p.title,
      family: prior.family,
      liveBefore: { productType: p.productType, categoryId: p.categoryId, categoryFullName: p.categoryFullName, protected: protectedSig(p) },
      previousBatchBefore: rollbackById.get(p.id) || null,
      target: { productType: target.productType, categoryId: targetCategory, reason: target.reason, action: target.action },
    });
  }
}

const applied = [];
if (MODE === 'mutate') {
  for (const c of corrections) {
    const result = execGraphql(updateMutation, { product: { id: c.id, productType: c.target.productType, category: c.target.categoryId } }, true);
    const payload = result.productUpdate;
    if (payload.userErrors?.length) throw new Error(`Mutation failed ${c.handle}: ${JSON.stringify(payload.userErrors)}`);
    if (payload.product.id !== c.id || payload.product.handle !== c.handle) throw new Error(`ID/handle mismatch ${c.handle}`);
    applied.push({ handle: c.handle, id: c.id, family: c.family, productType: payload.product.productType, categoryId: payload.product.category?.id || '', categoryFullName: payload.product.category?.fullName || '', reason: c.target.reason });
    console.error(`corrected ${applied.length}/${corrections.length}: ${c.handle}`);
  }
}

const after = [];
if (MODE === 'mutate') {
  for (let i = 0; i < corrections.length; i += 100) {
    const ids = corrections.slice(i, i + 100).map((c) => c.id);
    const result = execGraphql(productQuery, { ids });
    after.push(...result.nodes.filter(Boolean).map(flatten));
  }
}
const afterById = new Map(after.map((p) => [p.id, p]));
const protectedDiffs = [];
const readback = [];
if (MODE === 'mutate') {
  for (const c of corrections) {
    const p = afterById.get(c.id);
    if (!p) throw new Error(`Missing after product ${c.handle}`);
    if (protectedSig(p) !== c.liveBefore.protected) protectedDiffs.push({ id: c.id, handle: c.handle });
    readback.push({ handle: p.handle, id: p.id, expectedProductType: c.target.productType, actualProductType: p.productType, expectedCategoryId: c.target.categoryId, actualCategoryId: p.categoryId, passed: p.productType === c.target.productType && p.categoryId === c.target.categoryId });
  }
  if (protectedDiffs.length) throw new Error(`Protected field differences: ${JSON.stringify(protectedDiffs.slice(0, 20))}`);
  if (readback.some((r) => !r.passed)) throw new Error('Readback mismatch');
}

const countBy = (rows, key) => rows.reduce((a, r) => ((a[r[key]] = (a[r[key]] || 0) + 1), a), {});
const summary = {
  taskId: 'CATALOG-NORMALIZATION-001-CORRECTION',
  mode: MODE,
  scopedProductsRechecked: mutationLog.length,
  incorrectRecordsFound: corrections.length,
  productsCorrected: MODE === 'mutate' ? applied.length : 0,
  productsLeftUnchangedAfterVerification: unchanged.length,
  unresolvedRecords: unresolved.length,
  correctionsByFamily: countBy(corrections, 'family'),
  protectedFieldComparison: protectedDiffs.length === 0 ? 'passed' : 'failed',
};
writeJson('live-before-scoped-products.json', live);
writeJson('planned-corrections.json', corrections);
writeJson('unchanged-after-verification.json', unchanged);
writeJson('unresolved-correction-review.json', unresolved);
writeJson('applied-corrections.json', applied);
writeJson('correction-readback.json', readback);
writeJson('rollback-correction.json', corrections.map((c) => ({ id: c.id, handle: c.handle, restoreProductType: c.liveBefore.productType, restoreCategoryId: c.liveBefore.categoryId })));
writeJson('summary.json', summary);
console.log(JSON.stringify(summary, null, 2));
