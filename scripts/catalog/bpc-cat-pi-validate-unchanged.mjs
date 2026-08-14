import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const before = JSON.parse(readFileSync(resolve(arg('--before')), 'utf8'));
const after = JSON.parse(readFileSync(resolve(arg('--after')), 'utf8'));
const output = resolve(arg('--out'));
const afterById = new Map(after.map((product) => [product.id, product]));
const normalize = (product) => ({
  id: product.id,
  handle: product.handle,
  title: product.title,
  descriptionHtml: String(product.descriptionHtml || '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(),
  seo: product.seo,
  productType: product.productType,
  vendor: product.vendor,
  status: product.status,
  publishedAt: product.publishedAt,
  templateSuffix: product.templateSuffix,
  category: product.category,
  tags: product.tags,
  collections: product.collections.nodes,
  variants: product.variants.nodes,
  media: product.media.nodes,
  metafields: product.metafields.nodes.filter((field) => !(field.namespace === 'global' && ['title_tag', 'description_tag'].includes(field.key))),
});
const hash = (product) => createHash('sha256').update(JSON.stringify(normalize(product))).digest('hex');
const rows = before.map((oldProduct) => {
  const newProduct = afterById.get(oldProduct.id);
  if (!newProduct) return { productId: oldProduct.id, unchanged: false, reason: 'MISSING_AFTER' };
  return { productId: oldProduct.id, unchanged: hash(oldProduct) === hash(newProduct), beforeSha256: hash(oldProduct), afterSha256: hash(newProduct) };
});
const failures = rows.filter((row) => !row.unchanged);
const result = { summary: { productsValidated: rows.length, unchanged: rows.length - failures.length, failures: failures.length }, failures };
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(result.summary, null, 2)}\n`);
if (failures.length) process.exitCode = 2;
