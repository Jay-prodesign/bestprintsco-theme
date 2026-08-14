import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const productsPath = resolve(arg('--products'));
const gatePath = resolve(arg('--gate'));
const outDir = resolve(arg('--out'));
const snapshotText = readFileSync(productsPath, 'utf8');
const products = JSON.parse(snapshotText);
const gate = JSON.parse(readFileSync(gatePath, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
if (gate.source?.snapshotSha256 !== sha256(snapshotText)) throw new Error('Content manifest blocked: gate snapshot hash mismatch');
for (const stage of ['identity', 'metafields']) if (gate.stages?.[stage]?.status !== 'PASS') throw new Error(`Content manifest blocked: ${stage}=${gate.stages?.[stage]?.status}`);
mkdirSync(outDir, { recursive: true });

const PROCESS_LINT = /\b(unsupported|not proven|unverified|exact family|family profile|evidence authorizes|intentionally omitted|claim-management|process language|v\d+(?:\.\d+)+)\b/i;
const PROHIBITED = /\b(thread count|fill|filled|cotton(?!\s+candy)|polyester|microfiber|silk|satin|comforter|duvet cover|pillowcases?|machine washable|hypoallergenic|premium|best|bestseller|popular|trending|guarantee|guaranteed)\b/i;
const normalize = (value) => String(value || '').replaceAll('&amp;', '&').replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, ' - ').replace(/\s+/g, ' ').trim();
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const write = (name, value) => {
  const text = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(resolve(outDir, name), text, 'utf8');
  return { file: name, sha256: sha256(text), bytes: Buffer.byteLength(text) };
};
const csv = (rows) => {
  const headers = Object.keys(rows[0] || { empty: '' });
  const quote = (value) => { const text = String(value ?? ''); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
  return `${headers.join(',')}\n${rows.map((row) => headers.map((header) => quote(row[header])).join(',')).join('\n')}\n`;
};
const designIdentifier = (product) => normalize(product.title)
  .replace(/\s*[-|:]\s*bedding set\s*$/i, '')
  .replace(/\s+printed bedding set\s*$/i, '')
  .replace(/\s+bedding set\s*$/i, '')
  .replace(/\s+bedding\s*$/i, '')
  .replace(/\s+/g, ' ')
  .trim();
function protectedSignature(product) {
  return sha256(JSON.stringify({ id: product.id, handle: product.handle, productType: product.productType, vendor: product.vendor, status: product.status, publishedAt: product.publishedAt, category: product.category, tags: product.tags, collections: product.collections.nodes, variants: product.variants.nodes, mediaIdentity: product.media.nodes.map((media) => ({ id: media.id, type: media.mediaContentType, status: media.status, imageId: media.image?.id || '', url: media.image?.url || '' })), metafields: product.metafields.nodes.filter((field) => !(field.namespace === 'global' && ['title_tag', 'description_tag'].includes(field.key))) }));
}
const proposals = [];
const exceptions = [];
for (const product of products) {
  const reasons = [];
  const variants = product.variants.nodes;
  const sizeValues = [...new Set(variants.flatMap((variant) => variant.selectedOptions.filter((option) => option.name === 'Size').map((option) => normalize(option.value))))];
  if (product.status !== 'ACTIVE' || !product.publishedAt) reasons.push('not ACTIVE and published');
  if (product.productType !== 'Bedding Set') reasons.push('product type mismatch');
  if (product.category?.id !== 'gid://shopify/TaxonomyCategory/hg-15-1-11') reasons.push('category mismatch');
  if (![3, 9, 12].includes(variants.length)) reasons.push('variant architecture mismatch');
  if (variants.some((variant) => !/^PP\./i.test(variant.sku || ''))) reasons.push('non-PP or blank SKU');
  if (!product.metafields.nodes.some((field) => field.namespace === 'bpc' && field.key === 'size_chart' && field.value === 'gid://shopify/Metaobject/194759524432')) reasons.push('required size chart mismatch');
  if (!product.media.nodes.length || product.media.nodes.some((media) => media.status !== 'READY')) reasons.push('media missing or not READY');
  const design = designIdentifier(product);
  if (design.length < 3) reasons.push('no safe design identifier in current authoritative title');
  const regionSet = new Set(sizeValues.map((value) => value.match(/^(US|AU|UK)\b/i)?.[1]?.toUpperCase()).filter(Boolean));
  const sizeSummary = regionSet.size ? `${[...regionSet].sort().join(', ')} regional size labels` : `${sizeValues.join(', ')} size labels`;
  const title = `${design} Printed Bedding Set`;
  const seoTitleCandidates = regionSet.size
    ? [`${design} Printed Bedding Set in Regional Sizes`, `${design} Bedding Set in Regional Sizes`, `${design} Bedding Set`]
    : [`${design} Printed Bedding Set in Three Sizes`, `${design} Bedding Set in Three Sizes`, `${design} Bedding Set`];
  const seoTitle = seoTitleCandidates.find((candidate) => candidate.length <= 70) || '';
  const descriptionHtml = `<p>${escapeHtml(design)} artwork is featured across this printed bedding set. Available options use ${escapeHtml(sizeSummary)}, with a size chart provided for dimension comparison.</p><ul><li>Printed bedding-set design</li><li>${escapeHtml(sizeSummary)}</li><li>Size chart with regional dimensions</li></ul><p>Compare the selected size label with the size chart before choosing your bedding set.</p>`;
  const metaCandidates = [
    `Shop the ${design} printed bedding set. Compare the available ${sizeSummary} with the product size chart before choosing.`,
    `${design} printed bedding set with ${sizeSummary}. Use the product size chart to compare dimensions before choosing.`,
    `${design} printed bedding set. Compare available size labels and regional dimensions with the product size chart before choosing.`,
  ];
  const seoDescription = metaCandidates.find((candidate) => candidate.length <= 160) || '';
  const customerText = `${title} ${seoTitle} ${seoDescription} ${descriptionHtml}`;
  if (title.length > 90) reasons.push('title exceeds 90 characters');
  if (!seoTitle || seoTitle.length > 70) reasons.push('SEO title exceeds 70 characters');
  if (!seoDescription || seoDescription.length > 160) reasons.push('SEO description exceeds 160 characters');
  if (PROCESS_LINT.test(customerText)) reasons.push('process/evidence language');
  if (PROHIBITED.test(customerText)) reasons.push('prohibited bedding claim');
  if (reasons.length) { exceptions.push({ productId: product.id, handle: product.handle, currentTitle: product.title, reasons }); continue; }
  const artwork = product.metafields.nodes.find((field) => field.namespace === 'custom' && field.key === 'artwork_family')?.value || '';
  const world = product.metafields.nodes.find((field) => field.namespace === 'custom' && field.key === 'design_world')?.value || '';
  proposals.push({ productId: product.id, handle: product.handle, designIdentifier: design, title, seoTitle, seoDescription, descriptionHtml, protectedBeforeSha256: protectedSignature(product), before: { title: product.title, seoTitle: product.seo?.title || '', seoDescription: product.seo?.description || '', descriptionHtml: product.descriptionHtml || '' }, metafieldDecision: { requiredSizeChart: 'PASS_EXISTING', artworkFamily: artwork ? 'PASS_EXISTING' : 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE', designWorld: world ? 'PASS_EXISTING' : 'NO_WRITE_VOCABULARY_AND_MEDIA_ACCEPTANCE_INCOMPLETE', reviews: 'APP_OWNED_NO_WRITE' }, tagDecision: 'NO_CHANGE_NO_EXACT_NEW_CONSUMER_RULE' });
}
const collisionValues = proposals.map((row) => row.title.toLowerCase()).filter((value, index, all) => all.indexOf(value) !== index);
const collisions = new Set(collisionValues);
const eligible = proposals.filter((row) => !collisions.has(row.title.toLowerCase()));
for (const row of proposals.filter((proposal) => collisions.has(proposal.title.toLowerCase()))) exceptions.push({ productId: row.productId, handle: row.handle, currentTitle: row.before.title, reasons: ['generated title collision'] });
const selected = eligible.filter((row) => row.before.title !== row.title || row.before.seoTitle !== row.seoTitle || row.before.seoDescription !== row.seoDescription || normalize(row.before.descriptionHtml) !== normalize(row.descriptionHtml));
const writes = selected.map((row) => ({ product: { id: row.productId, title: row.title, descriptionHtml: row.descriptionHtml, seo: { title: row.seoTitle, description: row.seoDescription } } }));
const prefixes = selected.map((row) => normalize(row.descriptionHtml.replace(/<[^>]*>/g, ' ')).toLowerCase().split(/\s+/).slice(0, 4).join(' '));
const summary = { taskId: 'BPC-CAT-PI-FAST-CORE-001', family: 'Bedding Set', productsRead: products.length, eligibleProducts: eligible.length, contentWritesRequired: writes.length, alreadyCorrectProducts: eligible.length - writes.length, exceptionProducts: exceptions.length, requiredSizeChartPass: products.filter((product) => product.metafields.nodes.some((field) => field.namespace === 'bpc' && field.key === 'size_chart' && field.value === 'gid://shopify/Metaobject/194759524432')).length, conditionalCustomExisting: products.filter((product) => product.metafields.nodes.some((field) => field.namespace === 'custom' && ['artwork_family', 'design_world'].includes(field.key) && field.value)).length, conditionalCustomNoWriteProducts: products.filter((product) => !product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'artwork_family' && field.value) || !product.metafields.nodes.some((field) => field.namespace === 'custom' && field.key === 'design_world' && field.value)).length, tagWritesRequired: 0, qa: { duplicateTitles: collisions.size, duplicateOpeningPrefixes: prefixes.length - new Set(prefixes).size, titleOver90: selected.filter((row) => row.title.length > 90).length, seoTitleOver70: selected.filter((row) => row.seoTitle.length > 70).length, seoDescriptionOver160: selected.filter((row) => row.seoDescription.length > 160).length, processLintFailures: selected.filter((row) => PROCESS_LINT.test(`${row.title} ${row.seoDescription} ${row.descriptionHtml}`)).length, prohibitedClaimFailures: selected.filter((row) => PROHIBITED.test(`${row.title} ${row.seoDescription} ${row.descriptionHtml}`)).length } };
summary.artifacts = [write('proposal.json', eligible), write('all-gids.json', eligible.map((row) => row.productId)), write('content-proposal.json', selected), write('content-gids.json', selected.map((row) => row.productId)), write('exceptions.json', exceptions), write('rollback.json', selected.map((row) => ({ productId: row.productId, handle: row.handle, protectedBeforeSha256: row.protectedBeforeSha256, ...row.before }))), write('rollback.csv', csv(selected.map((row) => ({ product_id: row.productId, handle: row.handle, protected_before_sha256: row.protectedBeforeSha256, original_title: row.before.title, original_seo_title: row.before.seoTitle, original_seo_description: row.before.seoDescription, original_description_html: row.before.descriptionHtml })))), write('product-update.jsonl', `${writes.map((row) => JSON.stringify(row)).join('\n')}\n`)];
write('summary.json', summary);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (exceptions.length || Object.values(summary.qa).some((value) => value !== 0)) process.exitCode = 2;
