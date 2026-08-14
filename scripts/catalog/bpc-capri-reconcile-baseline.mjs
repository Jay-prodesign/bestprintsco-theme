import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
for (const key of ['authority', 'live', 'nowrite', 'nowrite-prior', 'out']) {
  if (!args[key]) throw new Error(`--${key} is required`);
}
const read = (key) => JSON.parse(readFileSync(resolve(args[key]), 'utf8'));
const authority = read('authority');
const live = read('live');
const noWrite = read('nowrite');
const noWritePrior = read('nowrite-prior');
const sha = (value) => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const canonicalHtml = (value) => String(value ?? '')
  .replace(/\r\n?/g, '\n')
  .trim()
  .replace(/>\s+</g, '><')
  .replace(/\s+/g, ' ');
const eligible = authority.records.filter((row) =>
  row['Title Gate'] === 'PASS' &&
  row['Description/SEO Disposition'] === 'PREP_PASS — RUNTIME_WRITE_PENDING' &&
  String(row['Description/SEO Gate']).startsWith('PASS')
);
if (eligible.length !== 68 || live.length !== 68 || noWrite.length !== 4 || noWritePrior.length !== 4) {
  throw new Error(JSON.stringify({ eligible: eligible.length, live: live.length, noWrite: noWrite.length, noWritePrior: noWritePrior.length }));
}
const byId = new Map(live.map((product) => [product.id, product]));
const rows = eligible.map((row) => {
  const id = row['Exact Product GID'];
  const product = byId.get(id);
  if (!product) throw new Error(`Missing live product ${id}`);
  const liveRaw = String(product.descriptionHtml ?? '');
  const proposedRaw = String(row['Proposed DescriptionHtml'] ?? '');
  const finalRaw = String(row['Final DescriptionHtml'] ?? '');
  const liveNormalized = canonicalHtml(liveRaw);
  const proposedNormalized = canonicalHtml(proposedRaw);
  const finalNormalized = canonicalHtml(finalRaw);
  const exactProposed = liveRaw === proposedRaw;
  const exactFinal = liveRaw === finalRaw;
  const normalizedProposed = liveNormalized === proposedNormalized;
  const normalizedFinal = liveNormalized === finalNormalized;
  const classification = normalizedProposed ? 'A_EXPECTED_INTERIM' : normalizedFinal ? 'B_ALREADY_FINAL' : 'C_TRUE_SOURCE_CONFLICT';
  return {
    id,
    title: product.title,
    classification,
    exactProposed,
    exactFinal,
    normalizedProposed,
    normalizedFinal,
    liveRawSha256: sha(liveRaw),
    proposedRawSha256: sha(proposedRaw),
    finalRawSha256: sha(finalRaw),
    liveNormalizedSha256: sha(liveNormalized),
    proposedNormalizedSha256: sha(proposedNormalized),
    finalNormalizedSha256: sha(finalNormalized),
    liveLength: liveRaw.length,
    proposedLength: proposedRaw.length,
    finalLength: finalRaw.length,
    livePreview: liveRaw.slice(0, 180),
    proposedPreview: proposedRaw.slice(0, 180),
    finalPreview: finalRaw.slice(0, 180),
  };
});
const groups = Object.fromEntries(['A_EXPECTED_INTERIM','B_ALREADY_FINAL','C_TRUE_SOURCE_CONFLICT'].map((name) => [name, rows.filter((row) => row.classification === name).map((row) => row.id)]));
const deterministicSamples = [...rows]
  .sort((a, b) => sha(`BPC-CAT-PI-FAST-CORE-001|${a.id}`).localeCompare(sha(`BPC-CAT-PI-FAST-CORE-001|${b.id}`)))
  .slice(0, 5);
const priorById = new Map(noWritePrior.map((product) => [product.id, product]));
const noWriteUntouched = noWrite.filter((product) => sha(product) === sha(priorById.get(product.id))).map((product) => product.id);
const result = {
  taskId: 'BPC-CAT-PI-FAST-CORE-001',
  method: {
    exact: 'UTF-8 JSON string value equality after GraphQL/Sheets decoding; no trimming or rewriting.',
    normalized: 'CRLF/CR to LF; trim outer whitespace; collapse whitespace between tags; collapse remaining whitespace runs to one ASCII space.',
    decisionOrder: ['A if normalized LIVE == Proposed DescriptionHtml', 'B else if normalized LIVE == Final DescriptionHtml', 'C otherwise'],
  },
  counts: {
    read: live.length,
    A_EXPECTED_INTERIM: groups.A_EXPECTED_INTERIM.length,
    B_ALREADY_FINAL: groups.B_ALREADY_FINAL.length,
    C_TRUE_SOURCE_CONFLICT: groups.C_TRUE_SOURCE_CONFLICT.length,
    exactProposed: rows.filter((row) => row.exactProposed).length,
    exactFinal: rows.filter((row) => row.exactFinal).length,
    normalizedProposed: rows.filter((row) => row.normalizedProposed).length,
    normalizedFinal: rows.filter((row) => row.normalizedFinal).length,
    noWriteUntouched: noWriteUntouched.length,
    mutationCount: 0,
  },
  groups,
  noWriteUntouched,
  deterministicSamples,
  hashes: {
    authoritySha256: sha(authority),
    eligibleGidsSha256: sha(eligible.map((row) => row['Exact Product GID'])),
    liveProductsSha256: sha(live),
    liveNormalizedMapSha256: sha(rows.map((row) => [row.id, row.liveNormalizedSha256])),
    proposedNormalizedMapSha256: sha(rows.map((row) => [row.id, row.proposedNormalizedSha256])),
    finalNormalizedMapSha256: sha(rows.map((row) => [row.id, row.finalNormalizedSha256])),
    classificationSha256: sha(rows.map((row) => [row.id, row.classification])),
    noWriteCurrentSha256: sha(noWrite),
    noWritePriorSha256: sha(noWritePrior),
  },
};
if (noWriteUntouched.length !== 4) throw new Error(JSON.stringify(result, null, 2));
writeFileSync(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ counts: result.counts, hashes: result.hashes, samples: deterministicSamples }, null, 2));
