import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const argv = process.argv.slice(2);
const command = argv[0];
const arg = (name, fallback = '') => {
  const index = argv.indexOf(name);
  return index === -1 ? fallback : argv[index + 1];
};
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const readJson = (path) => JSON.parse(readFileSync(resolve(path), 'utf8'));
const writeJson = (path, value) => {
  const target = resolve(path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const terminal = new Set(['PASS', 'NO_WRITE_WITH_REASON', 'APP_OWNED_NO_WRITE', 'NO_CHANGE_WITH_REASON']);
const order = ['identity', 'metafields', 'content', 'tags', 'alt', 'final'];

function fingerprintProduct(product) {
  return sha256(JSON.stringify({
    id: product.id,
    handle: product.handle,
    title: product.title,
    descriptionHtml: product.descriptionHtml,
    seo: product.seo,
    productType: product.productType,
    vendor: product.vendor,
    status: product.status,
    publishedAt: product.publishedAt,
    category: product.category,
    tags: product.tags,
    variants: product.variants?.nodes || [],
    media: product.media?.nodes || [],
    metafields: product.metafields?.nodes || [],
    collections: product.collections?.nodes || [],
  }));
}

function init() {
  const snapshotArg = arg('--snapshot');
  const configArg = arg('--config');
  const outputArg = arg('--out');
  if (!snapshotArg || !configArg || !outputArg) throw new Error('init requires --snapshot, --config and --out');
  const snapshotPath = resolve(snapshotArg);
  const configPath = resolve(configArg);
  const outputPath = resolve(outputArg);
  const snapshotText = readFileSync(snapshotPath, 'utf8');
  const products = JSON.parse(snapshotText);
  const config = readJson(configPath);
  const skuRegex = config.selector?.skuPattern ? new RegExp(config.selector.skuPattern, 'i') : null;
  const allowedCategories = new Set(config.selector?.categoryIds || []);
  const productRows = products.map((product) => {
    const identityReasons = [];
    if (product.status !== 'ACTIVE' || !product.publishedAt) identityReasons.push('NOT_ACTIVE_PUBLISHED');
    if (config.selector?.productType && product.productType !== config.selector.productType) identityReasons.push('PRODUCT_TYPE_MISMATCH');
    if (allowedCategories.size && !allowedCategories.has(product.category?.id || '')) identityReasons.push('CATEGORY_MISMATCH');
    const variants = product.variants?.nodes || [];
    if (config.selector?.variantCounts && !config.selector.variantCounts.includes(variants.length)) identityReasons.push('VARIANT_COUNT_MISMATCH');
    if (skuRegex && variants.some((variant) => !skuRegex.test(variant.sku || ''))) identityReasons.push('SKU_PATTERN_MISMATCH');
    const metafieldRows = [];
    for (const required of config.requiredMetafields || []) {
      const current = (product.metafields?.nodes || []).find((item) => item.namespace === required.namespace && item.key === required.key);
      metafieldRows.push({
        field: `${required.namespace}.${required.key}`,
        status: current?.value === required.expectedValue ? 'PASS' : 'BLOCKED',
        currentValue: current?.value || '',
        expectedValue: required.expectedValue,
        reason: current?.value === required.expectedValue ? 'EXACT_EXISTING_VALUE' : (required.failureReason || 'REQUIRED_VALUE_MISMATCH'),
      });
    }
    for (const conditional of config.conditionalMetafields || []) {
      const current = (product.metafields?.nodes || []).find((item) => item.namespace === conditional.namespace && item.key === conditional.key);
      metafieldRows.push({
        field: `${conditional.namespace}.${conditional.key}`,
        status: current?.value ? 'PASS' : 'NO_WRITE_WITH_REASON',
        currentValue: current?.value || '',
        expectedValue: '',
        reason: current?.value ? 'EXISTING_VALUE_PRESERVED' : conditional.noWriteReason,
      });
    }
    for (const appOwned of config.appOwnedMetafields || []) {
      const current = (product.metafields?.nodes || []).find((item) => item.namespace === appOwned.namespace && item.key === appOwned.key);
      metafieldRows.push({
        field: `${appOwned.namespace}.${appOwned.key}`,
        status: 'APP_OWNED_NO_WRITE',
        currentValue: current?.value || '',
        expectedValue: '',
        reason: appOwned.reason || 'APP_OWNED',
      });
    }
    return {
      productId: product.id,
      handle: product.handle,
      snapshotFingerprint: fingerprintProduct(product),
      identity: { status: identityReasons.length ? 'NO_WRITE_WITH_REASON' : 'PASS', reasons: identityReasons },
      metafields: metafieldRows,
    };
  });
  const metafieldPass = productRows.every((row) => row.metafields.every((field) => terminal.has(field.status)));
  const identityPass = productRows.every((row) => row.identity.status === 'PASS');
  const ledger = {
    schema: 'BPC-CAT-PI-STAGE-LEDGER-v1',
    taskId: config.taskId || 'BPC-CAT-PI-FAST-CORE-001',
    family: config.family,
    createdAt: new Date().toISOString(),
    source: { snapshotPath, snapshotSha256: sha256(snapshotText), products: products.length },
    config: { path: configPath, sha256: sha256(readFileSync(configPath, 'utf8')) },
    stages: {
      identity: { status: identityPass ? 'PASS' : 'BLOCKED', evidence: 'per-product exact selector gate; blocked rows must be removed into the exception scope before mutation' },
      metafields: { status: metafieldPass ? 'PASS' : 'BLOCKED', evidence: 'per-field PASS/NO_WRITE/APP_OWNED decisions' },
      content: { status: 'PENDING' },
      tags: { status: 'PENDING' },
      alt: { status: 'PENDING' },
      final: { status: 'PENDING' },
    },
    products: productRows,
  };
  ledger.ledgerSha256 = sha256(JSON.stringify({ ...ledger, ledgerSha256: undefined }));
  writeJson(outputPath, ledger);
  process.stdout.write(`${JSON.stringify({ family: ledger.family, products: products.length, stages: ledger.stages, ledgerSha256: ledger.ledgerSha256 }, null, 2)}\n`);
}

function seal() {
  const ledgerArg = arg('--ledger');
  const stage = arg('--stage');
  const status = arg('--status', 'PASS');
  const evidencePath = arg('--evidence');
  if (!ledgerArg || !order.includes(stage) || !terminal.has(status)) throw new Error('seal requires --ledger, a valid --stage and terminal --status');
  const ledgerPath = resolve(ledgerArg);
  const ledger = readJson(ledgerPath);
  const stageIndex = order.indexOf(stage);
  for (const prerequisite of order.slice(0, stageIndex)) {
    if (!terminal.has(ledger.stages[prerequisite]?.status)) throw new Error(`Cannot seal ${stage}; prerequisite ${prerequisite} is ${ledger.stages[prerequisite]?.status || 'MISSING'}`);
  }
  const evidence = evidencePath ? readFileSync(resolve(evidencePath), 'utf8') : '';
  ledger.stages[stage] = {
    status,
    sealedAt: new Date().toISOString(),
    evidencePath: evidencePath ? resolve(evidencePath) : '',
    evidenceSha256: evidence ? sha256(evidence) : '',
    reason: arg('--reason'),
    operationId: arg('--operation-id'),
  };
  ledger.ledgerSha256 = sha256(JSON.stringify({ ...ledger, ledgerSha256: undefined }));
  writeJson(ledgerPath, ledger);
  process.stdout.write(`${JSON.stringify({ stage, ...ledger.stages[stage], ledgerSha256: ledger.ledgerSha256 }, null, 2)}\n`);
}

function check() {
  const ledgerArg = arg('--ledger');
  const before = arg('--before');
  if (!ledgerArg) throw new Error('check requires --ledger');
  const ledger = readJson(resolve(ledgerArg));
  const stageIndex = order.indexOf(before);
  if (stageIndex < 0) throw new Error('check requires valid --before stage');
  const failures = order.slice(0, stageIndex).filter((stage) => !terminal.has(ledger.stages[stage]?.status));
  if (failures.length) throw new Error(`Stage gate failed before ${before}: ${failures.map((stage) => `${stage}=${ledger.stages[stage]?.status || 'MISSING'}`).join(', ')}`);
  process.stdout.write(`${JSON.stringify({ family: ledger.family, before, pass: true, prerequisites: order.slice(0, stageIndex).map((stage) => ({ stage, status: ledger.stages[stage].status })), snapshotSha256: ledger.source.snapshotSha256, ledgerSha256: ledger.ledgerSha256 }, null, 2)}\n`);
}

if (command === 'init') init();
else if (command === 'seal') seal();
else if (command === 'check') check();
else throw new Error('Usage: bpc-cat-pi-stage-ledger.mjs <init|seal|check> ...');
