import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STORE = process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com';
const MODE = process.argv.includes('--mutate') ? 'mutate' : 'plan';
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : join(process.cwd(), 'data', 'shopify', 'raw', new Date().toISOString().replace(/[:.]/g, '-'), 'CATALOG-NORMALIZATION-001');
const PAGE = 100;
mkdirSync(OUT, { recursive: true });

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function writeJson(name, value) {
  const text = JSON.stringify(value, null, 2);
  writeFileSync(join(OUT, name), text);
  return { file: name, bytes: Buffer.byteLength(text), sha256: sha256(text) };
}

function writeJsonl(name, rows) {
  const text = rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
  writeFileSync(join(OUT, name), text);
  return { file: name, bytes: Buffer.byteLength(text), sha256: sha256(text), records: rows.length };
}

function writeCsv(name, rows) {
  const headers = Object.keys(rows[0] || { empty: '' });
  const esc = (v) => {
    if (v == null) return '';
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const text = [headers.join(','), ...rows.map((row) => headers.map((h) => esc(row[h])).join(','))].join('\n') + '\n';
  writeFileSync(join(OUT, name), text);
  return { file: name, bytes: Buffer.byteLength(text), sha256: sha256(text), records: rows.length };
}

function execGraphql(query, variables = {}, allowMutations = false) {
  const qPath = join(OUT, '_query.graphql');
  const vPath = join(OUT, '_variables.json');
  const oPath = join(OUT, '_result.json');
  writeFileSync(qPath, query, { encoding: 'utf8' });
  writeFileSync(vPath, JSON.stringify(variables), { encoding: 'utf8' });
  const env = {
    ...process.env,
    SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
    SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:catalog-normalization|i:root',
  };
  const args = ['store', 'execute', '--store', STORE, '--query-file', qPath, '--variable-file', vPath, '--output-file', oPath, '--json'];
  if (allowMutations) args.push('--allow-mutations');
  const run = spawnSync('shopify', args, { env, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20, shell: process.platform === 'win32' });
  if (run.status !== 0) {
    throw new Error(`shopify store execute failed (${run.status}) ${run.error ? run.error.message : ''}\nSTDOUT:\n${run.stdout}\nSTDERR:\n${run.stderr}`);
  }
  const raw = readFileSync(oPath, 'utf8');
  const result = JSON.parse(raw);
  if (result.errors) throw new Error(JSON.stringify(result.errors, null, 2));
  return result;
}

const scopesQuery = `query CurrentAuthenticatedApp {
  appInstallation { app { title } accessScopes { handle } }
}`;

const shopQuery = `query ShopCounts {
  shop { name myshopifyDomain primaryDomain { url } }
  productsCount { count precision }
  collectionsCount { count precision }
}`;

const productsQuery = `query ProductsPage($first: Int!, $after: String) {
  products(first: $first, after: $after, sortKey: ID) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title productType status vendor tags templateSuffix updatedAt publishedAt
      category { id name fullName isLeaf }
      collections(first: 50) { pageInfo { hasNextPage } nodes { id handle title } }
      variants(first: 100) {
        pageInfo { hasNextPage }
        nodes {
          id title sku barcode price compareAtPrice inventoryQuantity inventoryPolicy
          selectedOptions { name value }
        }
      }
      media(first: 50) {
        pageInfo { hasNextPage }
        nodes {
          id mediaContentType alt status
          ... on MediaImage { image { id url width height altText } }
        }
      }
      resourcePublicationsV2(first: 20) {
        pageInfo { hasNextPage }
        nodes { isPublished publication { id name } }
      }
    }
  }
}`;

const collectionsQuery = `query CollectionsPage($first: Int!, $after: String) {
  collections(first: $first, after: $after, sortKey: ID) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title descriptionHtml updatedAt sortOrder templateSuffix
      seo { title description }
      image { id url altText width height }
      productsCount { count precision }
      ruleSet { appliedDisjunctively rules { column relation condition } }
    }
  }
}`;

const menusQuery = `query MenusPage($first: Int!, $after: String) {
  menus(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title
      items { id title type url resourceId items { id title type url resourceId items { id title type url resourceId } } }
    }
  }
}`;

function flattenProduct(p) {
  return {
    productGid: p.id,
    handle: p.handle,
    title: p.title,
    productType: p.productType || '',
    categoryId: p.category?.id || '',
    categoryFullName: p.category?.fullName || '',
    status: p.status,
    tags: p.tags || [],
    vendor: p.vendor,
    collectionMemberships: (p.collections?.nodes || []).map((c) => ({ id: c.id, handle: c.handle, title: c.title })),
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
    templateSuffix: p.templateSuffix || '',
    updatedAt: p.updatedAt,
    publishedAt: p.publishedAt,
  };
}

function keyText(p) {
  const variantText = (p.variants || []).slice(0, 12).map((v) => `${v.title} ${(v.selectedOptions || []).map((o) => `${o.name}:${o.value}`).join(' ')}`).join(' ');
  const collections = (p.collectionMemberships || []).map((c) => `${c.handle} ${c.title}`).join(' ');
  return `${p.title} ${p.handle} ${p.productType} ${variantText} ${collections}`.toLowerCase();
}

function classifyFamily(p) {
  const t = keyText(p);
  const kids = /\b(kid|kids|kid's|child|children|youth|toddler)\b/.test(t);
  const womens = /\b(women|women's|womens|ladies)\b/.test(t);
  const mens = /\b(men|men's|mens)\b/.test(t);
  const adult = !kids || womens || mens;
  const pick = (family, confidence = 'high') => ({ family, confidence, evidence: confidence });
  if (kids && /hoodie/.test(t)) return pick('Kids Hoodies');
  if (/\bhoodie|hooded sweatshirt/.test(t)) return pick('Hoodies');
  if (/hooded blanket|wearable blanket/.test(t)) return pick('Hooded Blankets');
  if (/bedding set|duvet|bed set|comforter/.test(t)) return pick('Bedding Sets');
  if (/car seat cover|seat covers/.test(t)) return pick('Car Seat Covers');
  if (/tote bag/.test(t)) return pick('Tote Bags');
  if (/\bbag\b|bags/.test(t)) return pick('Bags');
  if (/boot/.test(t)) return pick('Printed Boots');
  if (kids && /running shoe/.test(t)) return pick('Kids Running Shoes');
  if (/running shoe/.test(t)) return pick('Running Shoes');
  if (kids && /high top/.test(t)) return pick('Kids High Top Shoes');
  if (/high top/.test(t)) return pick('High Top Shoes');
  if (kids && /low top/.test(t)) return pick('Kids Low Top Shoes');
  if (/low top/.test(t)) return pick('Low Top Shoes');
  if (kids && /(slip-on|slip on|casual shoe|sneaker|shoe)/.test(t)) return pick('Kids Shoes');
  if (/(slip-on|slip on|casual shoe)/.test(t)) return pick('Slip-On Shoes');
  if (/\bshoe|sneaker/.test(t)) return pick('Shoes');
  if (/t-shirt|tee shirt|\btee\b/.test(t)) return pick(kids ? 'Kids T-Shirts' : 'T-Shirts');
  if (/legging/.test(t)) return pick('Leggings');
  if (/pillow/.test(t)) return pick('Pillows');
  return { family: 'Ambiguous', confidence: 'low', evidence: 'no deterministic title/variant/collection pattern' };
}

const GENERIC_TYPES = new Set(['', 'shoes', 'footwear', 'clothing', 'apparel', 'home & living', 'home', 'accessories', 'bags']);

function dominant(values) {
  const counts = new Map();
  for (const v of values.filter(Boolean)) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || ['', 0];
}

function protectedSignature(p) {
  return JSON.stringify({
    id: p.productGid, handle: p.handle, title: p.title, status: p.status, tags: p.tags,
    vendor: p.vendor, templateSuffix: p.templateSuffix, variants: p.variants,
    media: p.media, publications: p.publications,
  });
}

async function main() {
  const startedAt = new Date().toISOString();
  const scopes = execGraphql(scopesQuery);
  const grantedScopes = scopes.appInstallation.accessScopes.map((s) => s.handle).sort();
  const required = ['read_products', 'write_products', 'read_inventory', 'read_publications'];
  const missing = required.filter((s) => !grantedScopes.includes(s));
  if (missing.length) throw new Error(`Missing required scopes: ${missing.join(', ')}`);

  const shop = execGraphql(shopQuery);
  const products = [];
  let after = null;
  let productPage = 0;
  do {
    productPage++;
    const result = execGraphql(productsQuery, { first: PAGE, after });
    for (const node of result.products.nodes) {
      if (node.collections.pageInfo.hasNextPage || node.variants.pageInfo.hasNextPage || node.media.pageInfo.hasNextPage || node.resourcePublicationsV2.pageInfo.hasNextPage) {
        throw new Error(`Incomplete nested snapshot for ${node.handle}`);
      }
      products.push(flattenProduct(node));
    }
    after = result.products.pageInfo.endCursor;
    console.error(`snapshot products page ${productPage}: ${products.length}`);
  } while (products.length && products.length < (shop.productsCount.count || Infinity) && after);

  const collections = [];
  after = null;
  do {
    const result = execGraphql(collectionsQuery, { first: PAGE, after });
    collections.push(...result.collections.nodes);
    after = result.collections.pageInfo.endCursor;
  } while (after);

  const menus = [];
  after = null;
  do {
    const result = execGraphql(menusQuery, { first: PAGE, after });
    menus.push(...result.menus.nodes);
    after = result.menus.pageInfo.endCursor;
  } while (after);

  if (products.length !== shop.productsCount.count) throw new Error(`Product count mismatch: expected ${shop.productsCount.count}, got ${products.length}`);
  if (collections.length !== shop.collectionsCount.count) throw new Error(`Collection count mismatch: expected ${shop.collectionsCount.count}, got ${collections.length}`);

  const classified = products.map((p) => ({ ...p, ...classifyFamily(p), protectedBefore: protectedSignature(p) }));
  const byFamily = new Map();
  for (const p of classified) {
    if (!byFamily.has(p.family)) byFamily.set(p.family, []);
    byFamily.get(p.family).push(p);
  }

  const mapping = [];
  for (const [family, rows] of byFamily.entries()) {
    const nonGenericTypes = rows.map((p) => p.productType).filter((v) => !GENERIC_TYPES.has(String(v || '').toLowerCase()));
    const [type, typeCount] = dominant(nonGenericTypes.length ? nonGenericTypes : rows.map((p) => p.productType));
    const categoryKeys = rows.map((p) => p.categoryId && `${p.categoryId}|||${p.categoryFullName}`);
    const [categoryKey, categoryCount] = dominant(categoryKeys);
    const [categoryId, categoryFullName] = categoryKey ? categoryKey.split('|||') : ['', ''];
    mapping.push({ family, productCount: rows.length, targetProductType: type || family, typeEvidenceCount: typeCount, targetCategoryId: categoryId || '', targetCategoryFullName: categoryFullName || '', categoryEvidenceCount: categoryCount });
  }

  const mappingByFamily = new Map(mapping.map((m) => [m.family, m]));
  const plan = [];
  const unresolved = [];
  const auditRows = [];
  for (const p of classified) {
    const m = mappingByFamily.get(p.family);
    const missingType = !p.productType;
    const missingCategory = !p.categoryId;
    const genericType = GENERIC_TYPES.has(String(p.productType || '').toLowerCase());
    const conflict = Boolean(m?.targetCategoryId && p.categoryId && p.categoryId !== m.targetCategoryId);
    const typeConflict = Boolean(m?.targetProductType && p.productType && p.productType !== m.targetProductType && genericType);
    let issue = 'Correct and complete';
    if (p.family === 'Ambiguous' || p.confidence !== 'high') issue = 'Ambiguous and requires review';
    else if (missingType && missingCategory) issue = 'Missing both';
    else if (missingType) issue = 'Missing Product Type';
    else if (missingCategory) issue = 'Missing Shopify category';
    else if (genericType) issue = 'Overly generic Product Type';
    else if (conflict) issue = 'Product Type and Shopify category conflict';
    const row = {
      productGid: p.productGid, handle: p.handle, title: p.title, currentProductType: p.productType,
      currentCategoryId: p.categoryId, currentCategoryFullName: p.categoryFullName,
      family: p.family, issue, targetProductType: m?.targetProductType || '',
      targetCategoryId: m?.targetCategoryId || '', targetCategoryFullName: m?.targetCategoryFullName || '',
      confidence: p.confidence,
    };
    auditRows.push(row);
    const canChange = p.family !== 'Ambiguous' && p.confidence === 'high' && m?.targetProductType && m?.targetCategoryId &&
      (missingType || missingCategory || genericType || conflict || typeConflict);
    if (canChange) {
      plan.push({
        id: p.productGid, handle: p.handle, family: p.family, issue,
        before: { productType: p.productType, categoryId: p.categoryId, categoryFullName: p.categoryFullName, protected: p.protectedBefore },
        after: { productType: m.targetProductType, categoryId: m.targetCategoryId, categoryFullName: m.targetCategoryFullName },
      });
    } else if (issue !== 'Correct and complete') {
      unresolved.push({ ...row, reason: canChange ? '' : 'not enough deterministic evidence or no dominant target category/type' });
    }
  }

  const beforeManifest = [];
  beforeManifest.push(writeJsonl('before-products.jsonl', products));
  beforeManifest.push(writeJson('before-collections.json', collections));
  beforeManifest.push(writeJson('before-navigation.json', menus));
  beforeManifest.push(writeCsv('product-classification-audit.csv', auditRows));
  beforeManifest.push(writeJson('classification-mapping.json', mapping.sort((a, b) => a.family.localeCompare(b.family))));
  beforeManifest.push(writeJson('planned-product-updates.json', plan));
  beforeManifest.push(writeJson('unresolved-products.json', unresolved));

  const mutationLog = [];
  if (MODE === 'mutate') {
    const batchSize = 10;
    for (let start = 0; start < plan.length; start += batchSize) {
      const batch = plan.slice(start, start + batchSize);
      const varDefs = batch.map((_, i) => `$p${i}: ProductUpdateInput!`).join(', ');
      const fields = batch.map((_, i) => `u${i}: productUpdate(product: $p${i}) { product { id handle productType category { id fullName } } userErrors { field message } }`).join('\n');
      const mutation = `mutation UpdateProductClassificationBatch(${varDefs}) { ${fields} }`;
      const vars = Object.fromEntries(batch.map((change, i) => [`p${i}`, { id: change.id, productType: change.after.productType, category: change.after.categoryId }]));
      const result = execGraphql(mutation, vars, true);
      for (let i = 0; i < batch.length; i++) {
        const change = batch[i];
        const payload = result[`u${i}`];
        if (payload.userErrors?.length) throw new Error(`Mutation failed for ${change.handle}: ${JSON.stringify(payload.userErrors)}`);
        if (payload.product.id !== change.id || payload.product.handle !== change.handle) throw new Error(`ID/handle mismatch after mutation for ${change.handle}`);
        mutationLog.push({ handle: change.handle, id: change.id, family: change.family, issue: change.issue, productType: payload.product.productType, categoryId: payload.product.category?.id || '', categoryFullName: payload.product.category?.fullName || '' });
      }
      console.error(`mutated ${mutationLog.length}/${plan.length}`);
    }
  }

  const afterProducts = MODE === 'mutate' ? [] : products;
  if (MODE === 'mutate') {
    after = null;
    do {
      const result = execGraphql(productsQuery, { first: PAGE, after });
      afterProducts.push(...result.products.nodes.map(flattenProduct));
      after = result.products.pageInfo.endCursor;
    } while (after);
  }

  const afterById = new Map(afterProducts.map((p) => [p.productGid, p]));
  const protectedDiffs = [];
  const changedReadback = [];
  if (MODE === 'mutate') {
    for (const change of plan) {
      const afterP = afterById.get(change.id);
      if (!afterP) throw new Error(`Changed product missing from after snapshot: ${change.handle}`);
      if (protectedSignature(afterP) !== change.before.protected) protectedDiffs.push({ handle: change.handle, id: change.id });
      changedReadback.push({
        handle: afterP.handle, id: afterP.productGid,
        expectedProductType: change.after.productType, actualProductType: afterP.productType,
        expectedCategoryId: change.after.categoryId, actualCategoryId: afterP.categoryId,
        passed: afterP.productType === change.after.productType && afterP.categoryId === change.after.categoryId,
      });
    }
  }
  if (protectedDiffs.length) throw new Error(`Protected field diffs detected: ${JSON.stringify(protectedDiffs.slice(0, 20))}`);
  if (changedReadback.some((r) => !r.passed)) throw new Error(`Classification readback failures detected.`);

  const summary = {
    taskId: 'CATALOG-NORMALIZATION-001',
    mode: MODE,
    store: STORE,
    startedAt,
    completedAt: new Date().toISOString(),
    authenticatedApp: scopes.appInstallation.app.title,
    grantedScopes,
    productCount: products.length,
    collectionCount: collections.length,
    menuCount: menus.length,
    correctUntouched: auditRows.filter((r) => r.issue === 'Correct and complete').length,
    plannedProductUpdates: plan.length,
    productsChanged: MODE === 'mutate' ? mutationLog.length : 0,
    unresolvedCount: unresolved.length,
    issueCounts: Object.fromEntries(Object.entries(auditRows.reduce((acc, r) => ((acc[r.issue] = (acc[r.issue] || 0) + 1), acc), {})).sort()),
    familyCounts: Object.fromEntries(Object.entries(auditRows.reduce((acc, r) => ((acc[r.family] = (acc[r.family] || 0) + 1), acc), {})).sort()),
    protectedFieldComparison: protectedDiffs.length === 0 ? 'passed' : 'failed',
    collectionsChanged: [],
    navigationChanged: [],
    files: beforeManifest,
  };
  writeJson('mutation-log.json', mutationLog);
  writeJson('changed-product-readback.json', changedReadback);
  writeJson('summary.json', summary);
  writeJson('manifest.json', { ...summary, directory: OUT, directoryHash: sha256(JSON.stringify(beforeManifest)) });
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
