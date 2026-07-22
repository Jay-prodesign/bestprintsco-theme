import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const [beforePath, afterPath, rollbackPath] = process.argv.slice(2);
if (!beforePath || !afterPath || !rollbackPath) throw new Error('usage: node verify-recovery-fixture.mjs BEFORE AFTER ROLLBACK');
const load = async (p) => JSON.parse(await readFile(p, 'utf8'));
const [before, after, rollback] = await Promise.all([load(beforePath), load(afterPath), load(rollbackPath)]);
for (const doc of [before, after, rollback]) assert.equal(doc.schemaVersion, '1.0.0');
assert.equal(before.kind, 'BEFORE'); assert.equal(after.kind, 'AFTER'); assert.equal(rollback.kind, 'ROLLBACK');
assert.deepEqual(rollback.records, before.records, 'rollback must deterministically reproduce the complete before records');
const protectedFields = ['id','handle','status','variants','options','media','collections','publications','inventory'];
for (const [i, prior] of before.records.entries()) for (const field of protectedFields) assert.deepEqual(after.records[i]?.[field], prior[field], `protected field changed: records[${i}].${field}`);
const canonical = (v) => JSON.stringify(v, Object.keys(v).sort());
console.log(JSON.stringify({result:'PASS',records:before.records.length,rollbackSha256:createHash('sha256').update(canonical(rollback)).digest('hex')}));
