import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const seedIds = new Set(JSON.parse(readFileSync(resolve(arg('--seed-ids')), 'utf8')));
const output = resolve(arg('--out'));
mkdirSync(dirname(output), { recursive: true });
const sizeChart = 'gid://shopify/Metaobject/194755723344';
const selected = products.filter((product) =>
  !seedIds.has(product.id) &&
  product.status === 'ACTIVE' &&
  Boolean(product.publishedAt) &&
  product.productType === 'Vegan Leather Boots' &&
  product.variants.nodes.length === 10 &&
  product.variants.nodes.every((variant) => /^PP\./i.test(variant.sku || '')) &&
  product.metafields.nodes.some((field) => field.namespace === 'bpc' && field.key === 'size_chart' && field.value === sizeChart) &&
  product.media.nodes.length > 0 &&
  product.media.nodes[0].status === 'READY'
);
const text = `${JSON.stringify(selected, null, 2)}\n`;
writeFileSync(output, text, 'utf8');
process.stdout.write(`${JSON.stringify({ selected: selected.length, sha256: createHash('sha256').update(text).digest('hex') }, null, 2)}\n`);
