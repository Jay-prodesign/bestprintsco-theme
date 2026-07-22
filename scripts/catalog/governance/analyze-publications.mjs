import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
const [path] = process.argv.slice(2); if (!path) throw new Error('usage: node analyze-publications.mjs FILE.jsonl');
const status=new Map(); const rows=[];
for await (const line of createInterface({input:createReadStream(path),crlfDelay:Infinity})) {
  const row=JSON.parse(line);
  if (String(row.id||'').includes('/Product/')) status.set(row.id,row.status);
  else rows.push(row);
}
let activePublished=0, publicationLinks=0;
for (const row of rows) { publicationLinks++; if (status.get(row.__parentId)==='ACTIVE' && row.isPublished && row.publication?.name==='Online Store') activePublished++; }
const active=[...status.values()].filter(v=>v==='ACTIVE').length;
console.log(JSON.stringify({result:'PASS',products:status.size,active,activeOnlineStorePublished:activePublished,activeOnlineStoreUnpublished:active-activePublished,publicationLinks}));
