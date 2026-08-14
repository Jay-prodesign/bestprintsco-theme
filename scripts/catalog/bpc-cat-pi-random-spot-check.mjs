import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name, fallback = '') => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const sampleSize = Number(arg('--sample-size', '5'));
const seed = arg('--seed');
const familyPhrase = arg('--family-phrase').toLowerCase();
const output = resolve(arg('--out'));
if (!seed || !familyPhrase || !Number.isInteger(sampleSize) || sampleSize < 1) throw new Error('--seed, --family-phrase and positive --sample-size are required');
const score = (id) => createHash('sha256').update(`${seed}:${id}`).digest('hex');
const selected = [...products].sort((a, b) => score(a.id).localeCompare(score(b.id))).slice(0, Math.min(sampleSize, products.length));
const PROCESS_LINT = /\b(unsupported|not proven|unverified|exact family|family profile|evidence authorizes|intentionally omitted|claim-management|process language|v\d+(?:\.\d+)+)\b/i;
const rows = selected.map((product) => {
  const mediaAlts = product.media.nodes.map((media) => media.alt || media.image?.altText || '');
  const customerText = `${product.title} ${product.seo?.title || ''} ${product.seo?.description || ''} ${product.descriptionHtml || ''}`;
  return {
    productId: product.id,
    handle: product.handle,
    onlineStoreUrl: product.onlineStoreUrl,
    title: product.title,
    seoTitle: product.seo?.title || '',
    seoDescription: product.seo?.description || '',
    familyPhrasePass: product.title.toLowerCase().includes(familyPhrase),
    seoPresentPass: Boolean(product.seo?.title && product.seo?.description),
    descriptionPresentPass: Boolean(product.descriptionHtml),
    processLintPass: !PROCESS_LINT.test(customerText),
    primaryAltMatchesTitle: mediaAlts[0] === product.title,
    blankMediaAlt: mediaAlts.filter((alt) => !alt.trim()).length,
    variantCount: product.variants.nodes.length,
    skuCount: product.variants.nodes.filter((variant) => variant.sku).length,
  };
});
const failures = rows.filter((row) => !row.familyPhrasePass || !row.seoPresentPass || !row.descriptionPresentPass || !row.processLintPass || !row.primaryAltMatchesTitle || row.blankMediaAlt || row.skuCount !== row.variantCount);
const result = { seed, sampleSize: rows.length, pass: failures.length === 0, rows, failures };
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ seed, sampleSize: rows.length, pass: result.pass, failures: failures.length, urls: rows.map((row) => row.onlineStoreUrl) }, null, 2)}\n`);
if (failures.length) process.exitCode = 2;
