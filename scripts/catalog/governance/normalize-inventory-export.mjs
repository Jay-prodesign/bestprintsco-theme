import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { once } from 'node:events';

const [input, locationsInput, outDir] = process.argv.slice(2);
if (!input || !locationsInput || !outDir) throw new Error('usage: node normalize-inventory-export.mjs INVENTORY.jsonl LOCATIONS.json OUTPUT_DIR');

const paths = {
  items: `${outDir}/normalized-inventory-items.jsonl`,
  levels: `${outDir}/normalized-inventory-levels.jsonl`,
  locations: `${outDir}/normalized-locations.jsonl`,
};
const streams = Object.fromEntries(Object.entries(paths).map(([k,p]) => [k, createWriteStream(p, {encoding:'utf8', flags:'wx'})]));
const counts = {inventoryItems:0, variants:0, inventoryLevels:0, locations:0, fulfillmentServices:0, trackedItems:0, untrackedItems:0};
const variantIds = new Set(), locationIds = new Set(), serviceIds = new Set();

for await (const line of createInterface({input:createReadStream(input), crlfDelay:Infinity})) {
  const row = JSON.parse(line); const id = String(row.id || '');
  if (/gid:\/\/shopify\/(Customer|Order|DraftOrder|CustomerPaymentMethod)\//.test(id)) throw new Error('STOP: unexpected protected data type');
  if (id.includes('/InventoryItem/')) {
    counts.inventoryItems++; counts[row.tracked ? 'trackedItems' : 'untrackedItems']++;
    if (!streams.items.write(`${JSON.stringify(row)}\n`)) await once(streams.items, 'drain');
  } else if (id.includes('/ProductVariant/')) {
    counts.variants++; variantIds.add(id);
    if (!streams.items.write(`${JSON.stringify({recordType:'variantInventoryIdentity', ...row})}\n`)) await once(streams.items, 'drain');
  } else if (id.includes('/InventoryLevel/')) {
    counts.inventoryLevels++;
    const loc=row.location || {}; if (loc.id) locationIds.add(loc.id); if (loc.fulfillmentService?.id) serviceIds.add(loc.fulfillmentService.id);
    if (!streams.levels.write(`${JSON.stringify(row)}\n`)) await once(streams.levels, 'drain');
  }
}

const locations = JSON.parse(await readFile(locationsInput, 'utf8'));
for (const row of locations) {
  counts.locations++; locationIds.add(row.id); if (row.fulfillmentService?.id) serviceIds.add(row.fulfillmentService.id);
  if (!streams.locations.write(`${JSON.stringify(row)}\n`)) await once(streams.locations, 'drain');
}
counts.uniqueLocations=locationIds.size; counts.fulfillmentServices=serviceIds.size; counts.uniqueVariants=variantIds.size;
await Promise.all(Object.values(streams).map(s => new Promise((resolve,reject)=>s.end(resolve).on('error',reject))));

const artifacts=[];
for (const path of Object.values(paths)) {
  const sha=createHash('sha256'); for await (const chunk of createReadStream(path)) sha.update(chunk);
  artifacts.push({name:path.split(/[\\/]/).pop(),bytes:(await stat(path)).size,sha256:sha.digest('hex')});
}
console.log(JSON.stringify({result:'PASS',counts,artifacts}));
