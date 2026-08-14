import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const arg = (name, fallback = '') => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};
const beforePath = resolve(arg('--before'));
const outDir = resolve(arg('--out'));
const visualOverridesPath = arg('--visual-overrides');
if (!beforePath || !outDir) throw new Error('--before and --out are required');
mkdirSync(outDir, { recursive: true });
const products = JSON.parse(readFileSync(beforePath, 'utf8'));
const visualOverrides = visualOverridesPath ? JSON.parse(readFileSync(resolve(visualOverridesPath), 'utf8')) : {};

const FAMILY = 'Vegan Leather Boots';
const CUSTOMER_FAMILY = "Women's Printed Boots";
const SIZE_CHART = 'gid://shopify/Metaobject/194755723344';
const PROCESS_LINT = /\b(unsupported|not proven|unverified|exact family|family profile|evidence authorizes|intentionally omitted|claim-management|process language|v\d+(?:\.\d+)+)\b/i;
const UNSAFE = /\b(vegan|leather|combat|waterproof|water-resistant|comfortable|comfort|durable|durability|non-slip|slip-resistant|premium|best|bestseller|popular|trending|guarantee|guaranteed)\b/i;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value || '')
    .replaceAll('&amp;', '&')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(value) {
  return normalize(String(value || '').replace(/<[^>]*>/g, ' '));
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function designIdentifier(product) {
  if (visualOverrides[product.id]) {
    return { value: normalize(visualOverrides[product.id]), source: 'current primary media visual agreement review', error: '' };
  }
  const styles = [...new Set(product.variants.nodes.flatMap((variant) => variant.selectedOptions.filter((option) => option.name === 'Style').map((option) => normalize(option.value))).filter(Boolean))];
  if (styles.length > 1) return { value: '', source: 'variant Style option', error: 'multiple Style values' };
  let value = styles[0] || normalize(product.title);
  value = value
    .replace(/[-_]+/g, ' ')
    .replace(/\b(?:best\s*prints\s*co|cute sneakers|happy monday store)\b/gi, ' ')
    .replace(/\b(?:custom|personalized)\b/gi, ' ')
    .replace(/\b(?:women(?:'s|s)?|ladies|men(?:'s|s)?)\b/gi, ' ')
    .replace(/\b(?:vegan\s+leather|faux\s+leather|leather|combat|printed)\b/gi, ' ')
    .replace(/\b(?:ankle\s+)?boots?\b/gi, ' ')
    .replace(/\b(?:shoes?|footwear)\b/gi, ' ')
    .replace(/\b(?:us|eu)\s*\d+(?:\s*[-–]\s*\d+)?\b/gi, ' ')
    .replace(/\s*[|/:]+\s*/g, ' - ')
    .replace(/(?:\s+-\s*){2,}/g, ' - ')
    .replace(/^[\s,;|:/-]+|[\s,;|:/-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (value.length > 54) {
    const shortened = value.slice(0, 54).replace(/\s+\S*$/, '').replace(/[\s,;|:/-]+$/g, '');
    if (shortened.length >= 12) value = shortened;
  }
  return { value, source: styles[0] ? 'constant live variant Style option' : 'current live product title', error: '' };
}

function protectedSignature(product) {
  return sha256(JSON.stringify({
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
    metafields: product.metafields.nodes,
    publications: product.resourcePublicationsV2.nodes,
  }));
}

function csv(rows) {
  const headers = Object.keys(rows[0] || { empty: '' });
  const quote = (value) => {
    const text = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value);
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${headers.join(',')}\n${rows.map((row) => headers.map((header) => quote(row[header])).join(',')).join('\n')}\n`;
}

function write(name, value) {
  const path = resolve(outDir, name);
  mkdirSync(dirname(path), { recursive: true });
  const text = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(path, text, 'utf8');
  return { file: name, bytes: Buffer.byteLength(text), sha256: sha256(text) };
}

const proposals = [];
const exceptions = [];
for (const product of products) {
  const reasons = [];
  if (product.status !== 'ACTIVE' || !product.publishedAt) reasons.push('not ACTIVE and published');
  if (product.productType !== FAMILY) reasons.push('product type mismatch');
  if (product.variants.nodes.length !== 10) reasons.push('variant count is not 10');
  if (product.variants.nodes.some((variant) => !/^PP\./i.test(variant.sku || ''))) reasons.push('non-PP or blank SKU');
  const sizeChart = product.metafields.nodes.find((metafield) => metafield.namespace === 'bpc' && metafield.key === 'size_chart');
  if (sizeChart?.value !== SIZE_CHART) reasons.push('size-chart reference mismatch');
  if (!product.media.nodes.length || !product.media.nodes[0].id || product.media.nodes[0].status !== 'READY') reasons.push('primary media missing or not READY');
  const design = designIdentifier(product);
  if (design.error) reasons.push(design.error);
  if (design.value.length < 3) reasons.push('no usable exact design identifier');
  if (UNSAFE.test(design.value) || PROCESS_LINT.test(design.value)) reasons.push('design identifier contains prohibited customer-language token');
  const title = `${design.value} ${CUSTOMER_FAMILY}`.replace(/\s+/g, ' ').trim();
  const seoTitle = title;
  const descriptionHtml = `<p>${escapeHtml(title)} bring the ${escapeHtml(design.value)} theme to a printed boot silhouette. The result is a focused, artwork-led pair that lets the design set the tone.</p><p>Ten women's size options are available, covering US 5–12 / EU 35–44. Use the size chart on this page to compare measurements before choosing your size.</p>`;
  const seoDescription = `View ${design.value} women's printed boots in US sizes 5–12 / EU 35–44. Check the size chart before choosing your pair.`;
  const customerText = `${title} ${stripHtml(descriptionHtml)} ${seoTitle} ${seoDescription}`;
  if (title.length > 90) reasons.push('title exceeds 90 characters');
  if (seoTitle.length > 70) reasons.push('SEO title exceeds 70 characters');
  if (seoDescription.length > 160) reasons.push('SEO description exceeds 160 characters');
  if (UNSAFE.test(customerText)) reasons.push('generated customer text contains prohibited claim token');
  if (PROCESS_LINT.test(customerText)) reasons.push('generated customer text contains process/evidence language');
  if (reasons.length) {
    exceptions.push({ productId: product.id, handle: product.handle, currentTitle: product.title, reasons });
    continue;
  }
  const primary = product.media.nodes[0];
  proposals.push({
    productId: product.id,
    handle: product.handle,
    designIdentifier: design.value,
    designSource: design.source,
    title,
    seoTitle,
    seoDescription,
    descriptionHtml,
    primaryMediaId: primary.id,
    primaryAlt: title,
    protectedBeforeSha256: protectedSignature(product),
    before: {
      title: product.title,
      seoTitle: product.seo?.title || '',
      seoDescription: product.seo?.description || '',
      descriptionHtml: product.descriptionHtml || '',
      primaryAlt: primary.alt || primary.image?.altText || '',
    },
    metafieldDecision: {
      requiredSizeChart: 'PASS_EXISTING',
      artworkFamily: 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE',
      designWorld: 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE',
      reviews: 'APP_OWNED_NO_WRITE',
    },
    tagDecision: 'NO_CHANGE_NO_EXACT_NEW_CONSUMER_RULE',
  });
}

const duplicateTitles = new Map();
for (const proposal of proposals) {
  const key = proposal.title.toLowerCase();
  duplicateTitles.set(key, [...(duplicateTitles.get(key) || []), proposal.productId]);
}
const duplicateIds = new Set([...duplicateTitles.values()].filter((ids) => ids.length > 1).flat());
const eligible = proposals.filter((proposal) => !duplicateIds.has(proposal.productId));
for (const proposal of proposals.filter((row) => duplicateIds.has(row.productId))) {
  exceptions.push({ productId: proposal.productId, handle: proposal.handle, currentTitle: proposal.before.title, reasons: ['generated title collision requires exact design disambiguation'] });
}

const productManifest = eligible
  .filter((proposal) => proposal.before.title !== proposal.title || proposal.before.seoTitle !== proposal.seoTitle || proposal.before.seoDescription !== proposal.seoDescription || normalize(proposal.before.descriptionHtml) !== normalize(proposal.descriptionHtml))
  .map((proposal) => ({ product: { id: proposal.productId, title: proposal.title, descriptionHtml: proposal.descriptionHtml, seo: { title: proposal.seoTitle, description: proposal.seoDescription } } }));
const altManifest = eligible
  .filter((proposal) => proposal.before.primaryAlt !== proposal.primaryAlt)
  .map((proposal) => ({ productId: proposal.productId, media: [{ id: proposal.primaryMediaId, alt: proposal.primaryAlt }] }));

const exactDuplicate = (values) => values.length !== new Set(values.map((value) => value.toLowerCase())).size;
const summary = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  family: FAMILY,
  engine: 'BPC-PI-ENGINE-v0.3.0',
  engineSha256: '31bd93028217581eae61a38249104b9d92c4aa54d5f0e9e0cba0c1de0124109a',
  productsRead: products.length,
  eligibleProducts: eligible.length,
  exceptionProducts: exceptions.length,
  productWritesRequired: productManifest.length,
  primaryAltWritesRequired: altManifest.length,
  requiredSizeChartPass: products.filter((product) => product.metafields.nodes.some((metafield) => metafield.namespace === 'bpc' && metafield.key === 'size_chart' && metafield.value === SIZE_CHART)).length,
  appOwnedReviewFieldsNoWrite: products.length,
  optionalArtworkMetafieldNoWrite: products.length,
  optionalDesignWorldMetafieldNoWrite: products.length,
  tagWritesRequired: 0,
  qa: {
    duplicateSelectedTitles: exactDuplicate(eligible.map((row) => row.title)),
    duplicateSelectedSeoTitles: exactDuplicate(eligible.map((row) => row.seoTitle)),
    duplicateSelectedSeoDescriptions: exactDuplicate(eligible.map((row) => row.seoDescription)),
    customerLanguageLintFailures: eligible.filter((row) => PROCESS_LINT.test(`${row.title} ${row.descriptionHtml} ${row.seoTitle} ${row.seoDescription}`)).length,
    prohibitedClaimTokenFailures: eligible.filter((row) => UNSAFE.test(`${row.title} ${row.descriptionHtml} ${row.seoTitle} ${row.seoDescription}`)).length,
    titleOver90: eligible.filter((row) => row.title.length > 90).length,
    seoTitleOver70: eligible.filter((row) => row.seoTitle.length > 70).length,
    seoDescriptionOver160: eligible.filter((row) => row.seoDescription.length > 160).length,
  },
};

const artifacts = [];
artifacts.push(write('proposal.json', eligible));
artifacts.push(write('exceptions.json', exceptions));
artifacts.push(write('rollback.json', eligible.map((row) => ({ productId: row.productId, handle: row.handle, protectedBeforeSha256: row.protectedBeforeSha256, ...row.before }))));
artifacts.push(write('rollback.csv', csv(eligible.map((row) => ({
  product_id: row.productId,
  handle: row.handle,
  protected_before_sha256: row.protectedBeforeSha256,
  original_title: row.before.title,
  original_seo_title: row.before.seoTitle,
  original_seo_description: row.before.seoDescription,
  original_description_html: row.before.descriptionHtml,
  primary_media_id: row.primaryMediaId,
  original_primary_alt: row.before.primaryAlt,
})))));
artifacts.push(write('product-update.jsonl', `${productManifest.map((row) => JSON.stringify(row)).join('\n')}\n`));
artifacts.push(write('primary-alt-update.jsonl', `${altManifest.map((row) => JSON.stringify(row)).join('\n')}\n`));
summary.artifacts = artifacts;
write('summary.json', summary);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
