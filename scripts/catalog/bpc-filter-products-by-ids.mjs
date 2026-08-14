import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const ids = JSON.parse(readFileSync(resolve(arg('--ids')), 'utf8'));
const byId = new Map(products.map((product) => [product.id, product]));
const selected = ids.map((id) => byId.get(id));
if (selected.some((product) => !product)) throw new Error(`Missing ${selected.filter((product) => !product).length} requested products`);
const output = resolve(arg('--out'));
mkdirSync(dirname(output), { recursive: true });
const text = `${JSON.stringify(selected, null, 2)}\n`;
writeFileSync(output, text, 'utf8');
process.stdout.write(`${JSON.stringify({ products: selected.length, sha256: createHash('sha256').update(text).digest('hex') }, null, 2)}\n`);
