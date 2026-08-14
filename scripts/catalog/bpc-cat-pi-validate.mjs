import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const before = JSON.parse(readFileSync(resolve(arg('--before')), 'utf8'));
const after = JSON.parse(readFileSync(resolve(arg('--after')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const output = resolve(arg('--out'));
const rollbackAfterPath = process.argv.includes('--rollback-detection-after') ? resolve(arg('--rollback-detection-after')) : '';
const rollbackAfter = rollbackAfterPath ? JSON.parse(readFileSync(rollbackAfterPath, 'utf8')) : [];
const blankAltPlanPath = process.argv.includes('--blank-alt-plan') ? resolve(arg('--blank-alt-plan')) : '';
const blankAltPlan = blankAltPlanPath ? JSON.parse(readFileSync(blankAltPlanPath, 'utf8')) : [];
const phase = process.argv.includes('--phase') ? arg('--phase') : 'final';
const blankAltTargetByMediaId = new Map(blankAltPlan.map((row) => [row.mediaId, row.targetAlt]));
const beforeById = new Map(before.map((row) => [row.id, row]));
const afterById = new Map(after.map((row) => [row.id, row]));
const rollbackAfterById = new Map(rollbackAfter.map((row) => [row.id, row]));

function sha256(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function protectedState(product) {
  return {
    id: product.id,
    handle: product.handle,
    productType: product.productType,
    vendor: product.vendor,
    status: product.status,
    templateSuffix: product.templateSuffix,
    category: product.category,
    tags: product.tags,
    collections: product.collections.nodes,
    variants: product.variants.nodes,
    mediaIdentity: product.media.nodes.map((media) => ({ id: media.id, type: media.mediaContentType, status: media.status, imageId: media.image?.id || '', url: media.image?.url || '' })),
    metafields: product.metafields.nodes.filter((metafield) => !(metafield.namespace === 'global' && ['title_tag', 'description_tag'].includes(metafield.key))),
    publications: product.resourcePublicationsV2.nodes,
  };
}

const rows = [];
for (const proposal of proposals) {
  const oldProduct = beforeById.get(proposal.productId);
  const newProduct = afterById.get(proposal.productId);
  if (!oldProduct || !newProduct) throw new Error(`Missing before/after product ${proposal.productId}`);
  const primary = newProduct.media.nodes.find((media) => media.id === proposal.primaryMediaId);
  const intermediate = rollbackAfterById.get(proposal.productId);
  const rolledBack = Boolean(intermediate) && JSON.stringify(oldProduct.collections.nodes.map((collection) => collection.id).sort()) !== JSON.stringify(intermediate.collections.nodes.map((collection) => collection.id).sort());
  const expectedTitle = rolledBack ? proposal.before.title : proposal.title;
  const expectedSeoTitle = rolledBack ? proposal.before.seoTitle : proposal.seoTitle;
  const expectedSeoDescription = rolledBack ? proposal.before.seoDescription : proposal.seoDescription;
  const expectedDescription = rolledBack ? proposal.before.descriptionHtml : proposal.descriptionHtml;
  const expectedAlt = phase === 'content' ? proposal.before.primaryAlt : (rolledBack ? proposal.before.primaryAlt : proposal.primaryAlt);
  const expectedMediaAlts = oldProduct.media.nodes.map((media, index) => {
    if (blankAltTargetByMediaId.has(media.id)) return blankAltTargetByMediaId.get(media.id);
    if (index === 0) return expectedAlt;
    return media.alt || media.image?.altText || '';
  });
  const actualMediaAlts = newProduct.media.nodes.map((media) => media.alt || media.image?.altText || '');
  rows.push({
    productId: proposal.productId,
    rolledBack,
    titlePass: newProduct.title === expectedTitle,
    seoTitlePass: rolledBack ? (newProduct.seo?.title || '') === expectedSeoTitle : (newProduct.seo?.title || newProduct.title) === expectedSeoTitle,
    seoDescriptionPass: (newProduct.seo?.description || '') === expectedSeoDescription,
    descriptionPass: newProduct.descriptionHtml === expectedDescription,
    primaryAltPass: (primary?.alt || primary?.image?.altText || '') === expectedMediaAlts[0],
    protectedPass: sha256(protectedState(oldProduct)) === sha256(protectedState(newProduct)),
    secondaryAltPass: JSON.stringify(expectedMediaAlts.slice(1)) === JSON.stringify(actualMediaAlts.slice(1)),
  });
}
const failures = rows.filter((row) => !row.titlePass || !row.seoTitlePass || !row.seoDescriptionPass || !row.descriptionPass || !row.primaryAltPass || !row.protectedPass || !row.secondaryAltPass);
const summary = {
  productsValidated: rows.length,
  completedProducts: rows.filter((row) => !row.rolledBack).length,
  rolledBackDependencyProducts: rows.filter((row) => row.rolledBack).length,
  titleCorrect: rows.filter((row) => row.titlePass).length,
  seoTitleCorrect: rows.filter((row) => row.seoTitlePass).length,
  seoDescriptionCorrect: rows.filter((row) => row.seoDescriptionPass).length,
  descriptionCorrect: rows.filter((row) => row.descriptionPass).length,
  primaryAltCorrect: rows.filter((row) => row.primaryAltPass).length,
  protectedUnchanged: rows.filter((row) => row.protectedPass).length,
  secondaryAltUnchanged: rows.filter((row) => row.secondaryAltPass).length,
  failedProducts: failures.length,
  blankSecondaryMediaAlt: after.reduce((count, product) => count + product.media.nodes.slice(1).filter((media) => !(media.alt || media.image?.altText || '').trim()).length, 0),
  totalMedia: after.reduce((count, product) => count + product.media.nodes.length, 0),
};
writeFileSync(output, `${JSON.stringify({ summary, failures }, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (failures.length) process.exitCode = 2;
