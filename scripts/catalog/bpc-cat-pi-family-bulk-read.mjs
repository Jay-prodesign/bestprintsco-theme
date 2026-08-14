import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const arg = (name, fallback = '') => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};
const STORE = process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com';
const family = arg('--family');
const outDir = resolve(arg('--out'));
const resumeOperationId = arg('--operation-id');
if (!family || !outDir) throw new Error('--family and --out are required');
mkdirSync(outDir, { recursive: true });
const env = {
  ...process.env,
  SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
  SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:BPC-CAT-PI-FAST-CORE-001|i:root',
};
function sha256(text) { return createHash('sha256').update(text).digest('hex'); }
function execGraphql(query, variables = {}, allowMutations = false, label = 'operation') {
  const key = sha256(query + JSON.stringify(variables)).slice(0, 12);
  const queryFile = join(outDir, `_${label}-${key}.graphql`);
  const variablesFile = join(outDir, `_${label}-${key}.json`);
  const resultFile = join(outDir, `_${label}-${key}-result.json`);
  writeFileSync(queryFile, query, 'utf8');
  writeFileSync(variablesFile, JSON.stringify(variables), 'utf8');
  const args = ['store', 'execute', '--store', STORE, '--query-file', queryFile, '--variable-file', variablesFile, '--output-file', resultFile, '--json'];
  if (allowMutations) args.push('--allow-mutations');
  const run = spawnSync('shopify', args, { env, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20, shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error(`Shopify CLI failed (${run.status}) for ${label}\n${run.stdout}\n${run.stderr}`);
  const result = JSON.parse(readFileSync(resultFile, 'utf8'));
  if (result.errors?.length) throw new Error(`${label} top-level errors: ${JSON.stringify(result.errors)}`);
  return result;
}

const escapedFamily = family.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
const bulkQuery = `{
  products(query: "status:active AND published_status:published AND product_type:'${escapedFamily}'", sortKey: ID) {
    edges { node {
      id legacyResourceId handle onlineStoreUrl title descriptionHtml
      seo { title description }
      productType vendor tags status templateSuffix createdAt updatedAt publishedAt
      category { id name fullName isLeaf }
      collections { edges { node { id handle title } } }
      variants { edges { node {
        id legacyResourceId title sku barcode price compareAtPrice inventoryPolicy inventoryQuantity
        selectedOptions { name value }
        inventoryItem { id tracked requiresShipping unitCost { amount currencyCode } measurement { weight { value unit } } }
      } } }
      media { edges { node {
        id mediaContentType alt status
        ... on MediaImage { image { id url width height altText } }
      } } }
      metafields { edges { node { id namespace key type value updatedAt definition { id name } } } }
    } }
  }
}`;
const startQuery = `mutation StartFamilyBulkRead($query: String!) {
  bulkOperationRunQuery(query: $query) { bulkOperation { id status type createdAt } userErrors { field message } }
}`;
let operationId = resumeOperationId;
if (!operationId) {
  const started = execGraphql(startQuery, { query: bulkQuery }, true, 'start').bulkOperationRunQuery;
  if (started.userErrors?.length || !started.bulkOperation?.id) throw new Error(`Bulk query start failed: ${JSON.stringify(started)}`);
  operationId = started.bulkOperation.id;
}
const pollQuery = `query BulkReadStatus($id: ID!) { node(id: $id) { ... on BulkOperation { id status type errorCode objectCount rootObjectCount fileSize url partialDataUrl createdAt completedAt } } }`;
let operation;
for (let attempt = 0; attempt < 300; attempt++) {
  operation = execGraphql(pollQuery, { id: operationId }, false, 'poll').node;
  process.stderr.write(`Family bulk read ${operationId} ${operation.status} roots=${operation.rootObjectCount || 0} objects=${operation.objectCount || 0}\n`);
  if (['COMPLETED', 'FAILED', 'CANCELED', 'EXPIRED'].includes(operation.status)) break;
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 2000));
}
if (!operation || operation.status !== 'COMPLETED' || !operation.url) throw new Error(`Family bulk read failed: ${JSON.stringify(operation)}`);
const response = await fetch(operation.url);
if (!response.ok) throw new Error(`Family result download failed (${response.status})`);
const rawText = await response.text();
writeFileSync(join(outDir, 'raw-result.jsonl'), rawText, 'utf8');
const lines = rawText.trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
const products = lines.filter((row) => /^gid:\/\/shopify\/Product\/\d+$/.test(row.id || '') && !row.__parentId);
const byId = new Map(products.map((product) => [product.id, product]));
for (const product of products) {
  product.collections = { pageInfo: { hasNextPage: false }, nodes: [] };
  product.variants = { pageInfo: { hasNextPage: false }, nodes: [] };
  product.media = { pageInfo: { hasNextPage: false }, nodes: [] };
  product.metafields = { pageInfo: { hasNextPage: false }, nodes: [] };
  product.resourcePublicationsV2 = { pageInfo: { hasNextPage: false }, nodes: [] };
}
for (const row of lines.filter((item) => item.__parentId)) {
  const product = byId.get(row.__parentId);
  if (!product) continue;
  const child = { ...row };
  delete child.__parentId;
  if (/^gid:\/\/shopify\/Collection\//.test(child.id || '')) product.collections.nodes.push(child);
  else if (/^gid:\/\/shopify\/ProductVariant\//.test(child.id || '')) product.variants.nodes.push(child);
  else if (/^gid:\/\/shopify\/Metafield\//.test(child.id || '')) product.metafields.nodes.push(child);
  else if (child.mediaContentType) product.media.nodes.push(child);
  else throw new Error(`Unrecognized child row: ${JSON.stringify(child).slice(0, 500)}`);
}
products.sort((a, b) => BigInt(a.legacyResourceId) < BigInt(b.legacyResourceId) ? -1 : 1);
writeFileSync(join(outDir, 'products-family.json'), `${JSON.stringify(products, null, 2)}\n`, 'utf8');
const summary = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  family,
  operationId,
  status: operation.status,
  products: products.length,
  variants: products.reduce((count, product) => count + product.variants.nodes.length, 0),
  media: products.reduce((count, product) => count + product.media.nodes.length, 0),
  metafields: products.reduce((count, product) => count + product.metafields.nodes.length, 0),
  rawRecords: lines.length,
  rawSha256: sha256(rawText),
  completedAt: operation.completedAt,
};
writeFileSync(join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
