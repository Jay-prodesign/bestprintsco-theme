import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const store = process.env.SHOPIFY_STORE || 'cute-sneakers.myshopify.com';
const outDir = resolve(process.argv[2] || join('tmp', 'BPC-CAT-PI-FAST-CORE-001', 'capri-identity'));
mkdirSync(outDir, { recursive: true });

const query = 'query ShopIdentity { shop { id name myshopifyDomain primaryDomain { host url } } }';
const key = createHash('sha256').update(`${store}\n${query}`).digest('hex').slice(0, 12);
const queryFile = join(outDir, `_query-${key}.graphql`);
const outputFile = join(outDir, `shop-identity-${key}.json`);
writeFileSync(queryFile, `${query}\n`, 'utf8');

const run = spawnSync(
  'shopify',
  ['store', 'execute', '--store', store, '--query-file', queryFile, '--output-file', outputFile, '--json'],
  {
    env: {
      ...process.env,
      SHOPIFY_CLI_AGENT_INFO: 'n:codex|v:1|p:openai',
      SHOPIFY_CLI_AGENT_IDS: 's:bestprintsco|r:BPC-CAT-PI-FAST-CORE-001|i:root',
    },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
    shell: process.platform === 'win32',
  },
);
if (run.status !== 0) throw new Error(`shopify store execute failed (${run.status})\n${run.stdout}\n${run.stderr}`);
const result = JSON.parse(readFileSync(outputFile, 'utf8'));
if (result.errors?.length) throw new Error(JSON.stringify(result.errors, null, 2));
const shop = result.data?.shop || result.shop;
if (!shop?.id || !shop?.name || !shop?.myshopifyDomain) throw new Error('Incomplete shop identity response');
console.log(JSON.stringify({ storeArgument: store, shop, evidenceFile: outputFile }, null, 2));
