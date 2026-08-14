import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const input = resolve(process.argv[2] || 'tmp/BPC-CAT-PI-FAST-CORE-001/capri-frozen-manifest.json');
const outDir = resolve(process.argv[3] || 'tmp/BPC-CAT-PI-FAST-CORE-001/capri-runtime');
const source = JSON.parse(readFileSync(input, 'utf8'));
const eligible = source.records.filter((row) =>
  row['Title Gate'] === 'PASS' &&
  row['Description/SEO Disposition'] === 'PREP_PASS — RUNTIME_WRITE_PENDING' &&
  String(row['Description/SEO Gate']).startsWith('PASS')
);
const noWrite = source.records.filter((row) => row['Description/SEO Disposition'] === 'NO_WRITE_EVIDENCE_EXHAUSTED');
if (source.total !== 72 || eligible.length !== 68 || noWrite.length !== 4) {
  throw new Error(JSON.stringify({ total: source.total, eligible: eligible.length, noWrite: noWrite.length }));
}
for (const row of eligible) {
  for (const field of ['Exact Product GID', 'Final SEO Title', 'Final Meta Description', 'Final DescriptionHtml']) {
    if (!row[field]) throw new Error(`Missing ${field} for ${row['Exact Product GID']}`);
  }
}
mkdirSync(outDir, { recursive: true });
const write = (name, data) => {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const path = resolve(outDir, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, 'utf8');
  return { path, count: Array.isArray(data) ? data.length : undefined, sha256: createHash('sha256').update(text).digest('hex') };
};
const result = {
  eligibleIds: write('eligible-68-gids.json', eligible.map((row) => row['Exact Product GID'])),
  noWriteIds: write('no-write-4-gids.json', noWrite.map((row) => row['Exact Product GID'])),
  frozenEligible: write('eligible-68-frozen.json', eligible),
  frozenNoWrite: write('no-write-4-frozen.json', noWrite),
};
console.log(JSON.stringify(result, null, 2));
