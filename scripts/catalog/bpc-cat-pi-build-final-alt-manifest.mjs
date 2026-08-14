import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const gateArg = process.argv.includes('--gate') ? arg('--gate') : '';
if (!gateArg) throw new Error('--gate is required; final-title alt generation cannot precede identity, metafield, content and tag gates');
const gatePath = resolve(gateArg);
const gate = JSON.parse(readFileSync(gatePath, 'utf8'));
const terminal = new Set(['PASS', 'NO_WRITE_WITH_REASON', 'APP_OWNED_NO_WRITE', 'NO_CHANGE_WITH_REASON']);
for (const prerequisite of ['identity', 'metafields', 'content', 'tags']) {
  if (!terminal.has(gate.stages?.[prerequisite]?.status)) {
    throw new Error(`Alt manifest blocked: ${prerequisite} gate is ${gate.stages?.[prerequisite]?.status || 'MISSING'}`);
  }
}
const productsSha256 = createHash('sha256').update(readFileSync(resolve(arg('--products')), 'utf8')).digest('hex');
if (gate.source?.snapshotSha256 !== productsSha256) throw new Error('Alt manifest blocked: gate snapshot hash does not match --products');
const proposalPath = process.argv.includes('--proposal') ? arg('--proposal') : '';
const proposals = proposalPath
  ? JSON.parse(readFileSync(resolve(proposalPath), 'utf8'))
  : products.map((product) => ({ productId: product.id, title: product.title }));
const manifestOut = resolve(arg('--manifest-out'));
const rollbackOut = resolve(arg('--rollback-out'));
const csvOut = resolve(arg('--rollback-csv-out'));
const summaryOut = resolve(arg('--summary-out'));
for (const file of [manifestOut, rollbackOut, csvOut, summaryOut]) mkdirSync(dirname(file), { recursive: true });
const proposalById = new Map(proposals.map((proposal) => [proposal.productId, proposal]));
const manifest = [];
const rollback = [];

for (const product of products) {
  const proposal = proposalById.get(product.id);
  if (!proposal) throw new Error(`Missing proposal for ${product.id}`);
  const mediaUpdates = [];
  for (const [index, media] of product.media.nodes.entries()) {
    const currentAlt = (media.alt || media.image?.altText || '').trim();
    const targetAlt = index === 0 ? proposal.title : (currentAlt || `${proposal.title} - product image ${index + 1}`);
    if (targetAlt.length > 125) throw new Error(`Alt exceeds 125 characters for ${media.id}`);
    if (targetAlt === currentAlt) continue;
    mediaUpdates.push({ id: media.id, alt: targetAlt });
    rollback.push({ productId: product.id, handle: product.handle, productTitle: proposal.title, mediaId: media.id, mediaPosition: index + 1, originalAlt: currentAlt, targetAlt, evidence: index === 0 ? 'final approved product title' : 'exact media identity and product media ordinal; no unverified view claim' });
  }
  if (mediaUpdates.length) manifest.push({ productId: product.id, media: mediaUpdates });
}
const manifestText = `${manifest.map((row) => JSON.stringify(row)).join('\n')}\n`;
writeFileSync(manifestOut, manifestText, 'utf8');
writeFileSync(rollbackOut, `${JSON.stringify(rollback, null, 2)}\n`, 'utf8');
const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
writeFileSync(csvOut, `product_id,handle,product_title,media_id,media_position,original_alt,target_alt,evidence\n${rollback.map((row) => [row.productId,row.handle,row.productTitle,row.mediaId,row.mediaPosition,row.originalAlt,row.targetAlt,row.evidence].map(quote).join(',')).join('\n')}\n`, 'utf8');
const summary = { productsWithAltWrites: manifest.length, mediaAltWrites: rollback.length, primaryAltWrites: rollback.filter((row) => row.mediaPosition === 1).length, blankSecondaryAltWrites: rollback.filter((row) => row.mediaPosition > 1 && !row.originalAlt).length, gateLedgerSha256: gate.ledgerSha256, snapshotSha256: gate.source.snapshotSha256, manifestSha256: createHash('sha256').update(manifestText).digest('hex') };
writeFileSync(summaryOut, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
