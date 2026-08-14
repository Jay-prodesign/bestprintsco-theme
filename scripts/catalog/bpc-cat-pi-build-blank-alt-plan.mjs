import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposal')), 'utf8'));
const mapping = JSON.parse(readFileSync(resolve(arg('--mapping')), 'utf8'));
const views = JSON.parse(readFileSync(resolve(arg('--views')), 'utf8'));
const outManifest = resolve(arg('--manifest-out'));
const outRollback = resolve(arg('--rollback-out'));
const outSummary = resolve(arg('--summary-out'));
const proposalById = new Map(proposals.map((row) => [row.productId, row]));
const viewByMediaId = new Map(mapping.map((row) => [row.mediaId, views[String(row.index)]]));

function compactDesign(value) {
  return value.split(/\s+/).slice(0, 7).join(' ');
}

const manifest = [];
const rollback = [];
for (const product of products) {
  const design = compactDesign(proposalById.get(product.id).designIdentifier);
  const mediaUpdates = [];
  for (const [index, media] of product.media.nodes.entries()) {
    const currentAlt = (media.alt || media.image?.altText || '').trim();
    if (currentAlt) continue;
    const view = index === 0 ? 'main product view' : viewByMediaId.get(media.id);
    if (!view) throw new Error(`Missing exact view classification for ${media.id}`);
    const alt = `${design} boots, ${view}`;
    if (alt.length > 125 || alt.split(/\s+/).length > 14) throw new Error(`Alt limit exceeded for ${media.id}: ${alt}`);
    mediaUpdates.push({ id: media.id, alt });
    rollback.push({ productId: product.id, mediaId: media.id, originalAlt: currentAlt, targetAlt: alt, viewEvidence: view });
  }
  if (mediaUpdates.length) manifest.push({ productId: product.id, media: mediaUpdates });
}
writeFileSync(outManifest, `${manifest.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
writeFileSync(outRollback, `${JSON.stringify(rollback, null, 2)}\n`, 'utf8');
const summary = { productsWithAltWrites: manifest.length, mediaAltWrites: rollback.length, remainingBlankMediaExpected: 0 };
writeFileSync(outSummary, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
