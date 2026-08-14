import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const before = JSON.parse(readFileSync(resolve(arg('--before')), 'utf8'));
const after = JSON.parse(readFileSync(resolve(arg('--after')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const output = resolve(arg('--out'));
const byId = (rows) => new Map(rows.map((row) => [row.id || row.productId, row]));
const beforeById = byId(before);
const afterById = byId(after);
const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function protectedState(product) {
  return {
    id: product.id,
    handle: product.handle,
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
  };
}
const normalizeHtml = (value) => String(value || '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
const rows = proposals.map((proposal) => {
  const oldProduct = beforeById.get(proposal.productId);
  const newProduct = afterById.get(proposal.productId);
  if (!oldProduct || !newProduct) throw new Error(`Missing before/after product ${proposal.productId}`);
  return {
    productId: proposal.productId,
    titlePass: newProduct.title === proposal.title,
    seoTitlePass: (newProduct.seo?.title || newProduct.title) === proposal.seoTitle,
    seoDescriptionPass: (newProduct.seo?.description || '') === proposal.seoDescription,
    descriptionPass: normalizeHtml(newProduct.descriptionHtml) === normalizeHtml(proposal.descriptionHtml),
    protectedPass: sha256(protectedState(oldProduct)) === sha256(protectedState(newProduct)),
  };
});
const failures = rows.filter((row) => Object.entries(row).some(([key, value]) => key !== 'productId' && value !== true));
const summary = {
  productsValidated: rows.length,
  titleCorrect: rows.filter((row) => row.titlePass).length,
  seoTitleCorrect: rows.filter((row) => row.seoTitlePass).length,
  seoDescriptionCorrect: rows.filter((row) => row.seoDescriptionPass).length,
  descriptionCorrect: rows.filter((row) => row.descriptionPass).length,
  protectedUnchanged: rows.filter((row) => row.protectedPass).length,
  failedProducts: failures.length,
};
writeFileSync(output, `${JSON.stringify({ summary, failures }, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (failures.length) process.exitCode = 2;
