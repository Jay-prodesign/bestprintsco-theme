import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const before = JSON.parse(readFileSync(resolve(arg('--before')), 'utf8'));
const after = JSON.parse(readFileSync(resolve(arg('--after')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const altRollback = JSON.parse(readFileSync(resolve(arg('--alt-rollback')), 'utf8'));
const output = resolve(arg('--out'));
const beforeById = new Map(before.map((row) => [row.id, row]));
const afterById = new Map(after.map((row) => [row.id, row]));
const altTargetByMediaId = new Map(altRollback.map((row) => [row.mediaId, row.targetAlt]));
const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalizeHtml = (value) => String(value || '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
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
    mediaIdentity: product.media.nodes.map((media) => ({ id: media.id, type: media.mediaContentType, status: media.status, imageId: media.image?.id || '', url: media.image?.url || '' })),
    metafields: product.metafields.nodes.filter((field) => !(field.namespace === 'global' && ['title_tag', 'description_tag'].includes(field.key))),
  };
}
const rows = proposals.map((proposal) => {
  const oldProduct = beforeById.get(proposal.productId);
  const newProduct = afterById.get(proposal.productId);
  if (!oldProduct || !newProduct) throw new Error(`Missing before/after product ${proposal.productId}`);
  const oldAltById = new Map(oldProduct.media.nodes.map((media) => [media.id, media.alt || media.image?.altText || '']));
  const expectedAlts = newProduct.media.nodes.map((media) => altTargetByMediaId.get(media.id) ?? oldAltById.get(media.id) ?? '');
  const actualAlts = newProduct.media.nodes.map((media) => media.alt || media.image?.altText || '');
  return {
    productId: proposal.productId,
    titlePass: newProduct.title === proposal.title,
    seoTitlePass: (newProduct.seo?.title || newProduct.title) === proposal.seoTitle,
    seoDescriptionPass: (newProduct.seo?.description || '') === proposal.seoDescription,
    descriptionPass: normalizeHtml(newProduct.descriptionHtml) === normalizeHtml(proposal.descriptionHtml),
    mediaAltPass: JSON.stringify(actualAlts) === JSON.stringify(expectedAlts),
    blankMediaAlt: actualAlts.filter((alt) => !String(alt).trim()).length,
    protectedPass: sha256(protectedState(oldProduct)) === sha256(protectedState(newProduct)),
  };
});
const failures = rows.filter((row) => !row.titlePass || !row.seoTitlePass || !row.seoDescriptionPass || !row.descriptionPass || !row.mediaAltPass || row.blankMediaAlt || !row.protectedPass);
const summary = {
  productsValidated: rows.length,
  variantsValidated: after.reduce((count, product) => count + product.variants.nodes.length, 0),
  mediaValidated: after.reduce((count, product) => count + product.media.nodes.length, 0),
  titleCorrect: rows.filter((row) => row.titlePass).length,
  seoTitleCorrect: rows.filter((row) => row.seoTitlePass).length,
  seoDescriptionCorrect: rows.filter((row) => row.seoDescriptionPass).length,
  descriptionCorrect: rows.filter((row) => row.descriptionPass).length,
  mediaAltCorrect: rows.filter((row) => row.mediaAltPass).length,
  blankMediaAlt: rows.reduce((count, row) => count + row.blankMediaAlt, 0),
  protectedUnchanged: rows.filter((row) => row.protectedPass).length,
  failedProducts: failures.length,
};
writeFileSync(output, `${JSON.stringify({ summary, failures }, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (failures.length) process.exitCode = 2;
