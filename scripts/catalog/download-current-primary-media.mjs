import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const exceptions = JSON.parse(readFileSync(resolve(arg('--exceptions')), 'utf8'));
const output = resolve(arg('--out'));
mkdirSync(output, { recursive: true });
const exceptionIds = new Set(exceptions.map((row) => row.productId));
const rows = [];
for (const [index, product] of products.filter((row) => exceptionIds.has(row.id)).entries()) {
  const media = product.media.nodes[0];
  const response = await fetch(media.image.url);
  if (!response.ok) throw new Error(`Download failed ${response.status} for ${product.id}`);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const filename = `${String(index + 1).padStart(2, '0')}-${product.legacyResourceId}.${extension}`;
  writeFileSync(join(output, filename), Buffer.from(await response.arrayBuffer()));
  rows.push({ index: index + 1, productId: product.id, handle: product.handle, currentTitle: product.title, filename, mediaId: media.id });
}
writeFileSync(join(output, 'mapping.json'), `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ downloaded: rows.length, output }, null, 2)}\n`);
