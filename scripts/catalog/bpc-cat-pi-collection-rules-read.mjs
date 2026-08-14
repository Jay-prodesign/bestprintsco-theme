import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
const products = JSON.parse(readFileSync(resolve(arg('--products')), 'utf8'));
const output = resolve(arg('--out'));
mkdirSync(output, { recursive: true });
const ids = [...new Set(products.flatMap((product) => product.collections.nodes.map((collection) => collection.id)))];
const query = `query ExactCollectionRules($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Collection { id title handle ruleSet { appliedDisjunctively rules { column relation condition } } }
  }
}`;
const queryFile = join(output, '_query.graphql');
const variablesFile = join(output, '_variables.json');
const resultFile = join(output, '_result.json');
writeFileSync(queryFile, query, 'utf8');
writeFileSync(variablesFile, JSON.stringify({ ids }), 'utf8');
const env = { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai', SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:BPC-CAT-PI-FAST-CORE-001|i:root' };
const run = spawnSync('shopify', ['store', 'execute', '--store', process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com', '--query-file', queryFile, '--variable-file', variablesFile, '--output-file', resultFile, '--json'], { env, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20, shell: process.platform === 'win32' });
if (run.status !== 0) throw new Error(`Shopify CLI failed (${run.status})\n${run.stdout}\n${run.stderr}`);
const result = JSON.parse(readFileSync(resultFile, 'utf8'));
if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
if (result.nodes.length !== ids.length || result.nodes.some((node) => !node)) throw new Error('Collection rule read cardinality mismatch');
writeFileSync(join(output, 'collection-rules.json'), `${JSON.stringify(result.nodes, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ collections: result.nodes.length, automated: result.nodes.filter((node) => node.ruleSet).length, manual: result.nodes.filter((node) => !node.ruleSet).length }, null, 2)}\n`);
