import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const before = JSON.parse(readFileSync(resolve(arg('--before')), 'utf8'));
const after = JSON.parse(readFileSync(resolve(arg('--after')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const outProduct = resolve(arg('--product-out'));
const outAlt = resolve(arg('--alt-out'));
const outSummary = resolve(arg('--summary-out'));
const beforeById = new Map(before.map((row) => [row.id, row]));
const afterById = new Map(after.map((row) => [row.id, row]));

const changed = proposals.filter((proposal) => {
  const oldIds = beforeById.get(proposal.productId).collections.nodes.map((collection) => collection.id).sort();
  const newIds = afterById.get(proposal.productId).collections.nodes.map((collection) => collection.id).sort();
  return JSON.stringify(oldIds) !== JSON.stringify(newIds);
});
const productLines = changed.map((proposal) => ({
  product: {
    id: proposal.productId,
    title: proposal.before.title,
    descriptionHtml: proposal.before.descriptionHtml,
    seo: { title: proposal.before.seoTitle || null, description: proposal.before.seoDescription || null },
  },
}));
const altLines = changed.map((proposal) => ({
  productId: proposal.productId,
  media: [{ id: proposal.primaryMediaId, alt: proposal.before.primaryAlt || '' }],
}));
writeFileSync(outProduct, `${productLines.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
writeFileSync(outAlt, `${altLines.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
const summary = { rollbackProducts: changed.length, reason: 'automatic collection membership changed after title update; protected collection rule scope not authorized' };
writeFileSync(outSummary, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
