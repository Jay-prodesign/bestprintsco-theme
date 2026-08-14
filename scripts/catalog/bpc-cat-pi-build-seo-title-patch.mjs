import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const outDir = resolve(arg('--out'));
mkdirSync(outDir, { recursive: true });
const byId = new Map(products.map((product) => [product.id, product]));
const rows = [];
const rollback = [];
for (const proposal of proposals) {
  const product = byId.get(proposal.productId);
  if (!product) throw new Error(`Missing current product ${proposal.productId}`);
  const current = product.seo?.title || '';
  const currentDescription = product.seo?.description || '';
  if (current === proposal.seoTitle && currentDescription === proposal.seoDescription) continue;
  rows.push({ product: { id: proposal.productId, seo: { title: proposal.seoTitle, description: proposal.seoDescription } } });
  rollback.push({ productId: proposal.productId, handle: product.handle, originalSeoTitle: current, originalSeoDescription: currentDescription, fallbackTitle: product.title, targetSeoTitle: proposal.seoTitle, targetSeoDescription: proposal.seoDescription });
}
const text = `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
writeFileSync(resolve(outDir, 'seo-title-update.jsonl'), text, 'utf8');
writeFileSync(resolve(outDir, 'rollback.json'), `${JSON.stringify(rollback, null, 2)}\n`, 'utf8');
const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
writeFileSync(resolve(outDir, 'rollback.csv'), `product_id,handle,original_seo_title,original_seo_description,fallback_title,target_seo_title,target_seo_description\n${rollback.map((row) => [row.productId,row.handle,row.originalSeoTitle,row.originalSeoDescription,row.fallbackTitle,row.targetSeoTitle,row.targetSeoDescription].map(quote).join(',')).join('\n')}\n`, 'utf8');
const summary = { records: rows.length, manifestSha256: createHash('sha256').update(text).digest('hex') };
writeFileSync(resolve(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
