import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const output = resolve(arg('--out'));
mkdirSync(output, { recursive: true });
const rows = [];
for (const product of products) {
  for (const [mediaIndex, media] of product.media.nodes.entries()) {
    if (mediaIndex === 0 || (media.alt || media.image?.altText || '').trim() || !media.image?.url) continue;
    const index = rows.length + 1;
    const response = await fetch(media.image.url);
    if (!response.ok) throw new Error(`Download failed ${response.status} for ${media.id}`);
    const type = response.headers.get('content-type') || 'image/jpeg';
    const extension = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const filename = `${String(index).padStart(2, '0')}-${product.legacyResourceId}-${mediaIndex + 1}.${extension}`;
    writeFileSync(join(output, filename), Buffer.from(await response.arrayBuffer()));
    rows.push({ index, productId: product.id, currentTitle: product.title, mediaId: media.id, mediaIndex: mediaIndex + 1, filename });
  }
}
writeFileSync(join(output, 'mapping.json'), `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ downloaded: rows.length, output }, null, 2)}\n`);
