import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { once } from 'node:events';

const [input, outPrefix] = process.argv.slice(2);
if (!input || !outPrefix) throw new Error('usage: node normalize-bulk-export.mjs INPUT.jsonl OUTPUT_PREFIX');
const kinds = ['products','variants','media','metafields','collectionMemberships','other'];
const streams = Object.fromEntries(kinds.map(k => [k, createWriteStream(`${outPrefix}-${k}.jsonl`, {encoding:'utf8', flags:'wx'})]));
const counts = Object.fromEntries(kinds.map(k => [k, 0]));
counts.options = 0;
const sensitive = [];
for await (const line of createInterface({input:createReadStream(input), crlfDelay:Infinity})) {
  const row = JSON.parse(line); const id = String(row.id || '');
  if (/gid:\/\/shopify\/(Customer|Order|DraftOrder|CustomerPaymentMethod)\//.test(id)) sensitive.push(id.split('/')[3]);
  let kind = 'other';
  if (id.includes('/Product/')) { kind='products'; counts.options += row.options?.length || 0; }
  else if (id.includes('/ProductVariant/')) kind='variants';
  else if (/\/(MediaImage|Video|ExternalVideo|Model3d)\//.test(id)) kind='media';
  else if (id.includes('/Metafield/')) kind='metafields';
  else if (id.includes('/Collection/')) kind='collectionMemberships';
  counts[kind]++;
  if (!streams[kind].write(`${JSON.stringify(row)}\n`)) await once(streams[kind], 'drain');
}
await Promise.all(Object.values(streams).map(s => new Promise((resolve,reject)=>s.end(resolve).on('error',reject))));
if (sensitive.length) throw new Error(`STOP: unexpected protected data types: ${[...new Set(sensitive)].join(',')}`);
const artifacts=[];
for (const kind of kinds) {
  const path=`${outPrefix}-${kind}.jsonl`; const bytes=(await stat(path)).size;
  const sha=createHash('sha256'); for await (const chunk of createReadStream(path)) sha.update(chunk);
  artifacts.push({name:path.split(/[\\/]/).pop(),bytes,sha256:sha.digest('hex')});
}
console.log(JSON.stringify({result:'PASS',counts,artifacts}));
