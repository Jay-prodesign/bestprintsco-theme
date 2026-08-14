import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const proposals = JSON.parse(readFileSync(resolve(arg('--proposals')), 'utf8'));
const collections = JSON.parse(readFileSync(resolve(arg('--collections')), 'utf8')).filter((collection) => collection.ruleSet);
const output = resolve(arg('--out'));
mkdirSync(output, { recursive: true });
const byId = new Map(products.map((product) => [product.id, product]));

const norm = (value) => String(value ?? '').toLocaleLowerCase('en-US');
function textMatch(values, relation, condition) {
  const needle = norm(condition);
  if (relation === 'CONTAINS') return values.some((value) => norm(value).includes(needle));
  if (relation === 'NOT_CONTAINS') return values.every((value) => !norm(value).includes(needle));
  if (relation === 'EQUALS') return values.some((value) => norm(value) === needle);
  throw new Error(`Unsupported text relation ${relation}`);
}
function matchesRule(product, title, rule) {
  if (rule.column === 'TITLE') return textMatch([title], rule.relation, rule.condition);
  if (rule.column === 'TYPE') return textMatch([product.productType], rule.relation, rule.condition);
  if (rule.column === 'TAG') return textMatch(product.tags, rule.relation, rule.condition);
  if (rule.column === 'VARIANT_TITLE') return textMatch(product.variants.nodes.map((variant) => variant.title), rule.relation, rule.condition);
  if (rule.column === 'VARIANT_PRICE' && rule.relation === 'LESS_THAN') return product.variants.nodes.some((variant) => Number(variant.price) < Number(rule.condition));
  throw new Error(`Unsupported collection rule ${rule.column}:${rule.relation}`);
}
function matchesCollection(product, title, collection) {
  const values = collection.ruleSet.rules.map((rule) => matchesRule(product, title, rule));
  return collection.ruleSet.appliedDisjunctively ? values.some(Boolean) : values.every(Boolean);
}

const safe = [];
const blocked = [];
const evaluatorMismatches = [];
for (const proposal of proposals) {
  const product = byId.get(proposal.productId);
  if (!product) throw new Error(`Missing source product ${proposal.productId}`);
  const currentIds = new Set(product.collections.nodes.map((collection) => collection.id));
  const changes = [];
  for (const collection of collections) {
    const beforeEvaluated = matchesCollection(product, product.title, collection);
    const afterEvaluated = matchesCollection(product, proposal.title, collection);
    const currentMember = currentIds.has(collection.id);
    if (beforeEvaluated !== currentMember) evaluatorMismatches.push({ productId: product.id, collectionId: collection.id, collectionTitle: collection.title, currentMember, beforeEvaluated });
    if (afterEvaluated !== currentMember) changes.push({ collectionId: collection.id, collectionTitle: collection.title, currentMember, afterEvaluated });
  }
  if (changes.length) blocked.push({ productId: product.id, handle: product.handle, currentTitle: product.title, proposedTitle: proposal.title, changes });
  else safe.push(product);
}
const safeText = `${JSON.stringify(safe, null, 2)}\n`;
writeFileSync(resolve(output, 'safe-products.json'), safeText, 'utf8');
writeFileSync(resolve(output, 'safe-gids.json'), `${JSON.stringify(safe.map((product) => product.id), null, 2)}\n`, 'utf8');
writeFileSync(resolve(output, 'blocked.json'), `${JSON.stringify(blocked, null, 2)}\n`, 'utf8');
writeFileSync(resolve(output, 'evaluator-mismatches.json'), `${JSON.stringify(evaluatorMismatches, null, 2)}\n`, 'utf8');
const summary = { proposals: proposals.length, safe: safe.length, blocked: blocked.length, evaluatorMismatches: evaluatorMismatches.length, safeProductsSha256: createHash('sha256').update(safeText).digest('hex') };
writeFileSync(resolve(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
