import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const productsPath = resolve(arg('--products'));
const gatePath = resolve(arg('--gate'));
const outDir = resolve(arg('--out'));
const products = JSON.parse(readFileSync(productsPath, 'utf8'));
const gate = JSON.parse(readFileSync(gatePath, 'utf8'));
const terminal = new Set(['PASS', 'NO_WRITE_WITH_REASON', 'APP_OWNED_NO_WRITE', 'NO_CHANGE_WITH_REASON']);
for (const prerequisite of ['identity', 'metafields']) {
  if (!terminal.has(gate.stages?.[prerequisite]?.status)) throw new Error(`Content manifest blocked: ${prerequisite} gate is ${gate.stages?.[prerequisite]?.status || 'MISSING'}`);
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const snapshotText = readFileSync(productsPath, 'utf8');
if (gate.source?.snapshotSha256 !== sha256(snapshotText)) throw new Error('Content manifest blocked: gate snapshot hash mismatch');
mkdirSync(outDir, { recursive: true });

const PROCESS_LINT = /\b(unsupported|not proven|unverified|exact family|family profile|evidence authorizes|intentionally omitted|claim-management|process language|v\d+(?:\.\d+)+)\b/i;
const PROHIBITED = /\b(ergonomic|perfect[- ]?fit|premium|best|bestseller|popular|trending|guarantee|guaranteed|waterproof|water-resistant|durable|comfort|comfortable)\b/i;
const normalize = (value) => String(value || '').replaceAll('&amp;', '&').replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, ' - ').replace(/\s+/g, ' ').trim();
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const csv = (rows) => {
  const headers = Object.keys(rows[0] || { empty: '' });
  const quote = (value) => {
    const text = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value);
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${headers.join(',')}\n${rows.map((row) => headers.map((header) => quote(row[header])).join(',')).join('\n')}\n`;
};
const write = (name, value) => {
  const target = resolve(outDir, name);
  mkdirSync(dirname(target), { recursive: true });
  const text = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(target, text, 'utf8');
  return { file: name, sha256: sha256(text), bytes: Buffer.byteLength(text) };
};
function designIdentifier(product) {
  return normalize(product.title)
    .replace(/\s*[-|:]\s*backpack\s*$/i, '')
    .replace(/\s+printed backpack(?:\s+in\s+three\s+sizes)?\s*$/i, '')
    .replace(/\s+backpack\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function protectedSignature(product) {
  return sha256(JSON.stringify({
    id: product.id,
    handle: product.handle,
    productType: product.productType,
    vendor: product.vendor,
    status: product.status,
    publishedAt: product.publishedAt,
    category: product.category,
    tags: product.tags,
    collections: product.collections.nodes,
    variants: product.variants.nodes,
    mediaIdentity: product.media.nodes.map((media) => ({ id: media.id, type: media.mediaContentType, status: media.status, imageId: media.image?.id || '', url: media.image?.url || '' })),
    metafields: product.metafields.nodes.filter((field) => !(field.namespace === 'global' && ['title_tag', 'description_tag'].includes(field.key))),
  }));
}

const proposals = [];
const exceptions = [];
for (const product of products) {
  const reasons = [];
  const variants = product.variants.nodes;
  const sizes = [...new Set(variants.flatMap((variant) => variant.selectedOptions.filter((option) => option.name === 'Size').map((option) => normalize(option.value))))];
  if (product.status !== 'ACTIVE' || !product.publishedAt) reasons.push('not ACTIVE and published');
  if (product.productType !== 'Backpack') reasons.push('product type mismatch');
  if (product.category?.id !== 'gid://shopify/TaxonomyCategory/lb-1') reasons.push('category mismatch');
  if (variants.length !== 3 || sizes.length !== 3) reasons.push('three-option family fingerprint mismatch');
  if (variants.some((variant) => !/^PP\./i.test(variant.sku || ''))) reasons.push('non-PP or blank SKU');
  if (!product.media.nodes.length || product.media.nodes.some((media) => media.status !== 'READY')) reasons.push('media missing or not READY');
  const design = designIdentifier(product);
  if (design.length < 3) reasons.push('no safe design identifier in current authoritative title');
  const existingArtwork = product.metafields.nodes.find((field) => field.namespace === 'custom' && field.key === 'artwork_family')?.value || '';
  const existingWorld = product.metafields.nodes.find((field) => field.namespace === 'custom' && field.key === 'design_world')?.value || '';
  const alreadyMaterialized = Boolean(product.seo?.title && product.seo?.description && existingArtwork && existingWorld);
  if (reasons.length) {
    exceptions.push({ productId: product.id, handle: product.handle, currentTitle: product.title, reasons });
    continue;
  }
  if (alreadyMaterialized) {
    proposals.push({ productId: product.id, handle: product.handle, designIdentifier: design, alreadyCorrect: true, title: product.title, seoTitle: product.seo.title, seoDescription: product.seo.description, descriptionHtml: product.descriptionHtml, before: { title: product.title, seoTitle: product.seo.title, seoDescription: product.seo.description, descriptionHtml: product.descriptionHtml }, protectedBeforeSha256: protectedSignature(product), metafieldDecision: { artworkFamily: 'PASS_EXISTING', designWorld: 'PASS_EXISTING', reviews: 'APP_OWNED_NO_WRITE' }, tagDecision: 'NO_CHANGE_NO_EXACT_NEW_CONSUMER_RULE' });
    continue;
  }
  const title = `${design} Printed Backpack`;
  const seoTitle = `${design} Printed Backpack in Three Sizes`;
  const descriptionHtml = `<p>${escapeHtml(design)} artwork is featured across this printed backpack. It is available in three listed size options, with adjustable shoulder straps and a two-compartment layout.</p><ul><li>Adult, Youth and Child option labels</li><li>Adjustable shoulder straps</li><li>Padded mesh back</li><li>Main compartment and front utility pocket</li><li>Made to order</li></ul><p>Check the option label and product images before selecting your backpack.</p>`;
  const seoDescriptionCandidates = [
    `Shop the ${design} printed backpack in three listed sizes, with adjustable shoulder straps, a padded mesh back and two storage compartments.`,
    `Shop the ${design} printed backpack with three size options, adjustable straps, a padded mesh back and two compartments.`,
    `${design} backpack with three size options, adjustable straps, a padded mesh back and two storage compartments.`,
  ];
  const seoDescription = seoDescriptionCandidates.find((candidate) => candidate.length <= 160) || '';
  const customerText = `${title} ${seoTitle} ${seoDescription} ${descriptionHtml}`;
  if (title.length > 90) reasons.push('title exceeds 90 characters');
  if (seoTitle.length > 70) reasons.push('SEO title exceeds 70 characters');
  if (!seoDescription || seoDescription.length > 160) reasons.push('SEO description exceeds 160 characters');
  if (PROCESS_LINT.test(customerText)) reasons.push('process/evidence language');
  if (PROHIBITED.test(customerText)) reasons.push('prohibited claim token');
  if (reasons.length) {
    exceptions.push({ productId: product.id, handle: product.handle, currentTitle: product.title, reasons });
    continue;
  }
  proposals.push({
    productId: product.id,
    handle: product.handle,
    designIdentifier: design,
    alreadyCorrect: false,
    title,
    seoTitle,
    seoDescription,
    descriptionHtml,
    protectedBeforeSha256: protectedSignature(product),
    before: { title: product.title, seoTitle: product.seo?.title || '', seoDescription: product.seo?.description || '', descriptionHtml: product.descriptionHtml || '' },
    metafieldDecision: { artworkFamily: existingArtwork ? 'PASS_EXISTING' : 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE', designWorld: existingWorld ? 'PASS_EXISTING' : 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE', reviews: 'APP_OWNED_NO_WRITE' },
    tagDecision: 'NO_CHANGE_NO_EXACT_NEW_CONSUMER_RULE',
  });
}

const duplicateDesigns = new Set(proposals.map((row) => row.designIdentifier.toLowerCase()).filter((value, index, all) => all.indexOf(value) !== index));
const eligible = proposals.filter((row) => !duplicateDesigns.has(row.designIdentifier.toLowerCase()));
for (const row of proposals.filter((proposal) => duplicateDesigns.has(proposal.designIdentifier.toLowerCase()))) exceptions.push({ productId: row.productId, handle: row.handle, currentTitle: row.before.title, reasons: ['design/title collision'] });
const writes = eligible.filter((row) => !row.alreadyCorrect).map((row) => ({ product: { id: row.productId, title: row.title, descriptionHtml: row.descriptionHtml, seo: { title: row.seoTitle, description: row.seoDescription } } }));
const selected = eligible.filter((row) => !row.alreadyCorrect);
const normalizedPrefix = (html) => normalize(html.replace(/<[^>]*>/g, ' ')).toLowerCase().split(/\s+/).slice(0, 4).join(' ');
const prefixes = selected.map((row) => normalizedPrefix(row.descriptionHtml));
const summary = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  family: 'Backpack',
  engine: 'BPC-PI-ENGINE-v0.3.0',
  productsRead: products.length,
  eligibleProducts: eligible.length,
  alreadyCorrectProducts: eligible.filter((row) => row.alreadyCorrect).length,
  contentWritesRequired: writes.length,
  exceptionProducts: exceptions.length,
  metafieldGate: { requiredFields: 0, existingArtworkFamily: products.filter((product) => product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'artwork_family' && field.value)).length, existingDesignWorld: products.filter((product) => product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'design_world' && field.value)).length, conditionalNoWriteProducts: products.filter((product) => !product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'artwork_family' && field.value) || !product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'design_world' && field.value)).length, appOwnedReviewNoWrite: products.length },
  tagWritesRequired: 0,
  qa: { duplicateDesigns: duplicateDesigns.size, duplicateOpeningPrefixes: prefixes.length - new Set(prefixes).size, titleOver90: selected.filter((row) => row.title.length > 90).length, seoTitleOver70: selected.filter((row) => row.seoTitle.length > 70).length, seoDescriptionOver160: selected.filter((row) => row.seoDescription.length > 160).length, processLintFailures: selected.filter((row) => PROCESS_LINT.test(`${row.title} ${row.seoTitle} ${row.seoDescription} ${row.descriptionHtml}`)).length, prohibitedClaimFailures: selected.filter((row) => PROHIBITED.test(`${row.title} ${row.seoTitle} ${row.seoDescription} ${row.descriptionHtml}`)).length },
};
summary.artifacts = [
  write('proposal.json', eligible),
  write('all-gids.json', eligible.map((row) => row.productId)),
  write('content-proposal.json', selected),
  write('content-gids.json', selected.map((row) => row.productId)),
  write('exceptions.json', exceptions),
  write('rollback.json', selected.map((row) => ({ productId: row.productId, handle: row.handle, protectedBeforeSha256: row.protectedBeforeSha256, ...row.before }))),
  write('rollback.csv', csv(selected.map((row) => ({ product_id: row.productId, handle: row.handle, protected_before_sha256: row.protectedBeforeSha256, original_title: row.before.title, original_seo_title: row.before.seoTitle, original_seo_description: row.before.seoDescription, original_description_html: row.before.descriptionHtml })))),
  write('product-update.jsonl', `${writes.map((row) => JSON.stringify(row)).join('\n')}\n`),
];
write('summary.json', summary);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (exceptions.length || Object.values(summary.qa).some((value) => value !== 0)) process.exitCode = 2;
