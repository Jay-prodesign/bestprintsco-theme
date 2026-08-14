import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const arg = (name, fallback = '') => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};
const STORE = process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com';
const manifestPath = resolve(arg('--manifest'));
const mutationPath = resolve(arg('--mutation'));
const payloadName = arg('--payload');
const errorField = arg('--error-field', 'userErrors');
const outDir = resolve(arg('--out'));
if (!manifestPath || !mutationPath || !payloadName || !outDir) throw new Error('--manifest, --mutation, --payload and --out are required');
mkdirSync(outDir, { recursive: true });
const manifest = readFileSync(manifestPath, 'utf8').trimEnd();
const mutation = readFileSync(mutationPath, 'utf8').trim();
const manifestLines = manifest ? manifest.split(/\r?\n/) : [];
if (!manifestLines.length) throw new Error('Manifest is empty');
for (const [index, line] of manifestLines.entries()) {
  try { JSON.parse(line); } catch (error) { throw new Error(`Invalid JSONL line ${index}: ${error.message}`); }
}

const env = {
  ...process.env,
  SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
  SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:BPC-CAT-PI-FAST-CORE-001|i:root',
};
function sha256(text) { return createHash('sha256').update(text).digest('hex'); }
function execGraphql(query, variables = {}, allowMutations = false, label = 'operation') {
  const key = sha256(query + JSON.stringify(variables)).slice(0, 12);
  const queryFile = join(outDir, `_${label}-${key}.graphql`);
  const variablesFile = join(outDir, `_${label}-${key}.json`);
  const resultFile = join(outDir, `_${label}-${key}-result.json`);
  writeFileSync(queryFile, query, 'utf8');
  writeFileSync(variablesFile, JSON.stringify(variables), 'utf8');
  const args = ['store', 'execute', '--store', STORE, '--query-file', queryFile, '--variable-file', variablesFile, '--output-file', resultFile, '--json'];
  if (allowMutations) args.push('--allow-mutations');
  const run = spawnSync('shopify', args, { env, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20, shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error(`Shopify CLI failed (${run.status}) for ${label}\n${run.stdout}\n${run.stderr}`);
  const result = JSON.parse(readFileSync(resultFile, 'utf8'));
  if (result.errors?.length) throw new Error(`${label} top-level errors: ${JSON.stringify(result.errors)}`);
  return result;
}

const stagedQuery = `mutation StageBulkVariables($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}`;
const stage = execGraphql(stagedQuery, { input: [{ resource: 'BULK_MUTATION_VARIABLES', filename: basename(manifestPath), mimeType: 'text/jsonl', httpMethod: 'POST' }] }, true, 'stage').stagedUploadsCreate;
if (stage.userErrors?.length || stage.stagedTargets?.length !== 1) throw new Error(`Staging failed: ${JSON.stringify(stage)}`);
const target = stage.stagedTargets[0];
const form = new FormData();
for (const parameter of target.parameters) form.append(parameter.name, parameter.value);
form.append('file', new Blob([`${manifest}\n`], { type: 'text/jsonl' }), basename(manifestPath));
const upload = await fetch(target.url, { method: 'POST', body: form });
if (!upload.ok) throw new Error(`Staged upload failed (${upload.status}): ${(await upload.text()).slice(0, 1000)}`);
const stagedUploadPath = target.parameters.find((parameter) => parameter.name === 'key')?.value;
if (!stagedUploadPath) throw new Error('Staged upload key is missing');

const runQuery = `mutation RunBulkMutation($mutation: String!, $stagedUploadPath: String!) {
  bulkOperationRunMutation(mutation: $mutation, stagedUploadPath: $stagedUploadPath) {
    bulkOperation { id status type createdAt }
    userErrors { field message }
  }
}`;
const start = execGraphql(runQuery, { mutation, stagedUploadPath }, true, 'run').bulkOperationRunMutation;
if (start.userErrors?.length || !start.bulkOperation?.id) throw new Error(`Bulk start failed: ${JSON.stringify(start)}`);
const operationId = start.bulkOperation.id;
const pollQuery = `query BulkMutationStatus($id: ID!) {
  node(id: $id) {
    ... on BulkOperation { id status type errorCode objectCount rootObjectCount fileSize url partialDataUrl createdAt completedAt }
  }
}`;
let operation;
for (let attempt = 0; attempt < 180; attempt++) {
  operation = execGraphql(pollQuery, { id: operationId }, false, 'poll').node;
  process.stderr.write(`Bulk ${operationId} ${operation.status} ${operation.objectCount || 0}/${manifestLines.length}\n`);
  if (['COMPLETED', 'FAILED', 'CANCELED', 'EXPIRED'].includes(operation.status)) break;
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 2000));
}
if (!operation || operation.status !== 'COMPLETED' || !operation.url) throw new Error(`Bulk operation did not complete: ${JSON.stringify(operation)}`);
const resultResponse = await fetch(operation.url);
if (!resultResponse.ok) throw new Error(`Result download failed (${resultResponse.status})`);
const resultText = await resultResponse.text();
writeFileSync(join(outDir, 'result.jsonl'), resultText, 'utf8');
const rows = resultText.trim() ? resultText.trim().split(/\r?\n/).map((line, index) => ({ index, value: JSON.parse(line) })) : [];
const errors = [];
for (const row of rows) {
  const payload = row.value.data?.[payloadName] ?? row.value[payloadName];
  const rowErrors = payload?.[errorField] || row.value.errors || [];
  if (!payload || rowErrors.length) errors.push({ line: row.value.__lineNumber ?? row.index, errors: rowErrors.length ? rowErrors : [{ message: 'Missing mutation payload' }], result: row.value });
}
const failedLines = [...new Set(errors.map((entry) => Number(entry.line)).filter((line) => Number.isInteger(line) && line >= 0 && line < manifestLines.length))];
const retry = failedLines.map((line) => manifestLines[line]).join('\n');
if (retry) writeFileSync(join(outDir, 'retry.jsonl'), `${retry}\n`, 'utf8');
const summary = {
  store: STORE,
  operationId,
  status: operation.status,
  manifest: basename(manifestPath),
  manifestRecords: manifestLines.length,
  manifestSha256: sha256(`${manifest}\n`),
  resultRecords: rows.length,
  topLevelErrorCode: operation.errorCode || null,
  rowErrorCount: errors.length,
  failedManifestLines: failedLines,
  retryManifestRecords: failedLines.length,
  createdAt: operation.createdAt,
  completedAt: operation.completedAt,
};
writeFileSync(join(outDir, 'errors.json'), `${JSON.stringify(errors, null, 2)}\n`, 'utf8');
writeFileSync(join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (errors.length) process.exitCode = 2;
