import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const STORE = process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com';
const arg = (name, fallback = '') => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};
const idsFile = arg('--ids');
const batchSize = Number(arg('--batch-size', '20'));
const outDir = resolve(arg('--out', join('tmp', 'BPC-CAT-PI-FAST-CORE-001')));
if (!idsFile) throw new Error('--ids is required');
if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 50) throw new Error('--batch-size must be an integer from 1 to 50');
const ids = JSON.parse(readFileSync(resolve(idsFile), 'utf8'));
if (!Array.isArray(ids) || !ids.length || ids.some((id) => !/^gid:\/\/shopify\/Product\/\d+$/.test(id))) {
  throw new Error('Expected a non-empty JSON array of exact Shopify Product GIDs');
}
if (new Set(ids).size !== ids.length) throw new Error('Duplicate Product GID in input');
mkdirSync(outDir, { recursive: true });

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function writeJson(name, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(join(outDir, name), text, 'utf8');
  return { file: name, records: Array.isArray(value) ? value.length : 1, bytes: Buffer.byteLength(text), sha256: sha256(text) };
}

function execGraphql(query, variables = {}) {
  const stamp = createHash('sha256').update(query + JSON.stringify(variables)).digest('hex').slice(0, 12);
  const queryPath = join(outDir, `_query-${stamp}.graphql`);
  const variablePath = join(outDir, `_variables-${stamp}.json`);
  const resultPath = join(outDir, `_result-${stamp}.json`);
  if (existsSync(resultPath)) {
    const cached = JSON.parse(readFileSync(resultPath, 'utf8'));
    if (cached.errors?.length) throw new Error(JSON.stringify(cached.errors, null, 2));
    return cached;
  }
  writeFileSync(queryPath, query, 'utf8');
  writeFileSync(variablePath, JSON.stringify(variables), 'utf8');
  const env = {
    ...process.env,
    SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
    SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:BPC-CAT-PI-FAST-CORE-001|i:root',
  };
  const run = spawnSync('shopify', ['store', 'execute', '--store', STORE, '--query-file', queryPath, '--variable-file', variablePath, '--output-file', resultPath, '--json'], {
    env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100,
    shell: process.platform === 'win32',
  });
  if (run.status !== 0) throw new Error(`shopify store execute failed (${run.status})\n${run.stdout}\n${run.stderr}`);
  const result = JSON.parse(readFileSync(resultPath, 'utf8'));
  if (result.errors?.length) throw new Error(JSON.stringify(result.errors, null, 2));
  return result;
}

const definitionsQuery = `query ProductMetafieldDefinitions($first: Int!, $after: String) {
  metafieldDefinitions(first: $first, after: $after, ownerType: PRODUCT) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id namespace key name description type { name }
      access { admin storefront }
      validations { name value }
      useAsCollectionCondition
    }
  }
}`;

const productQuery = `query ExactProductNodes($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id legacyResourceId handle onlineStoreUrl title descriptionHtml
      seo { title description }
      productType vendor tags status templateSuffix createdAt updatedAt publishedAt
      category { id name fullName isLeaf }
      collections(first: 100) { pageInfo { hasNextPage } nodes { id handle title } }
      variants(first: 100) {
        pageInfo { hasNextPage }
        nodes {
          id legacyResourceId title sku barcode price compareAtPrice inventoryPolicy inventoryQuantity
          selectedOptions { name value }
          inventoryItem { id tracked requiresShipping unitCost { amount currencyCode } measurement { weight { value unit } } }
        }
      }
      media(first: 100) {
        pageInfo { hasNextPage }
        nodes {
          id mediaContentType alt status
          ... on MediaImage { image { id url width height altText } }
        }
      }
      metafields(first: 100) {
        pageInfo { hasNextPage }
        nodes { id namespace key type value updatedAt definition { id name } }
      }
      resourcePublicationsV2(first: 50) {
        pageInfo { hasNextPage }
        nodes { isPublished publishDate publication { id name } }
      }
    }
  }
}`;

const definitions = [];
let after = null;
do {
  const page = execGraphql(definitionsQuery, { first: 100, after }).metafieldDefinitions;
  definitions.push(...page.nodes);
  after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
} while (after);

const products = [];
for (let index = 0; index < ids.length; index += batchSize) {
  const batch = ids.slice(index, index + batchSize);
  const nodes = execGraphql(productQuery, { ids: batch }).nodes;
  if (nodes.length !== batch.length || nodes.some((node) => !node)) throw new Error(`Missing product node in batch beginning ${batch[0]}`);
  for (const product of nodes) {
    if (product.collections.pageInfo.hasNextPage || product.variants.pageInfo.hasNextPage || product.media.pageInfo.hasNextPage || product.metafields.pageInfo.hasNextPage || product.resourcePublicationsV2.pageInfo.hasNextPage) {
      throw new Error(`Nested pagination exceeded for ${product.id}`);
    }
    products.push(product);
  }
  process.stderr.write(`Fetched ${products.length}/${ids.length}\n`);
}

const ordered = ids.map((id) => products.find((product) => product.id === id));
const artifactIndex = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  store: STORE,
  capturedAt: new Date().toISOString(),
  requestedProductCount: ids.length,
  returnedProductCount: ordered.length,
  productIdsSha256: sha256(`${JSON.stringify(ids)}\n`),
  artifacts: [writeJson('metafield-definitions.json', definitions), writeJson('products-before.json', ordered)],
};
writeJson('artifact-index.json', artifactIndex);
process.stdout.write(`${JSON.stringify(artifactIndex, null, 2)}\n`);
