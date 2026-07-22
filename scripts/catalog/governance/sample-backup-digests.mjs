import crypto from 'node:crypto';
import fs from 'node:fs';
import readline from 'node:readline';

const [root, idsCsv] = process.argv.slice(2);
if (!root || !idsCsv) throw new Error('usage: node sample-backup-digests.mjs ROOT ID[,ID...]');
const ids = new Set(idsCsv.split(',').filter(Boolean));

async function rows(file, predicate) {
  const result = [];
  const lines = readline.createInterface({ input: fs.createReadStream(`${root}/${file}`) });
  for await (const line of lines) {
    if (!line) continue;
    const row = JSON.parse(line);
    if (predicate(row)) result.push(row);
  }
  return result;
}

const by = (array, key) => new Map(array.map((row) => [row[key], row]));
const group = (array, key) => {
  const result = new Map();
  for (const row of array) {
    const values = result.get(row[key]) || [];
    values.push(row);
    result.set(row[key], values);
  }
  return result;
};
const sortCanonical = (array) => array.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

const products = await rows('normalized-products.jsonl', (row) => ids.has(row.id));
const variants = await rows('normalized-variants.jsonl', (row) => ids.has(row.__parentId));
const inventoryItemIds = new Set(variants.map((row) => row.inventoryItem?.id).filter(Boolean));
const media = await rows('normalized-media.jsonl', (row) => ids.has(row.__parentId));
const collections = await rows('normalized-collectionMemberships.jsonl', (row) => ids.has(row.__parentId));
const metafields = await rows('normalized-metafields.jsonl', (row) => ids.has(row.__parentId));
const publications = await rows('shopify-publications-5696739410000.jsonl', (row) => ids.has(row.__parentId));
const inventoryItems = await rows('normalized-inventory-items.jsonl', (row) => inventoryItemIds.has(row.id));
const inventoryLevels = await rows('normalized-inventory-levels.jsonl', (row) => inventoryItemIds.has(row.__parentId));

const variantsByProduct = group(variants, '__parentId');
const mediaByProduct = group(media, '__parentId');
const collectionsByProduct = group(collections, '__parentId');
const metafieldsByProduct = group(metafields, '__parentId');
const publicationsByProduct = group(publications, '__parentId');
const inventoryItemById = by(inventoryItems, 'id');
const inventoryLevelsByItem = group(inventoryLevels, '__parentId');

function canonicalLocation(location) {
  return {
    id: location.id,
    legacyResourceId: String(location.legacyResourceId),
    name: location.name,
    isActive: location.isActive,
    deactivatedAt: location.deactivatedAt ?? null,
    fulfillsOnlineOrders: location.fulfillsOnlineOrders,
    isFulfillmentService: location.isFulfillmentService,
    fulfillmentService: location.fulfillmentService ? {
      id: location.fulfillmentService.id,
      handle: location.fulfillmentService.handle,
      serviceName: location.fulfillmentService.serviceName,
      type: location.fulfillmentService.type,
      inventoryManagement: location.fulfillmentService.inventoryManagement,
      requiresShippingMethod: location.fulfillmentService.requiresShippingMethod,
      trackingSupport: location.fulfillmentService.trackingSupport,
    } : null,
  };
}

function canonicalLevel(level) {
  return {
    id: level.id,
    quantities: sortCanonical(level.quantities.map(({ name, quantity }) => ({ name, quantity }))),
    location: canonicalLocation(level.location),
  };
}

function canonicalInventoryItem(variant) {
  const core = variant.inventoryItem || {};
  const supplemental = inventoryItemById.get(core.id) || {};
  return {
    id: core.id,
    legacyResourceId: String(supplemental.legacyResourceId),
    sku: supplemental.sku ?? variant.sku ?? null,
    tracked: supplemental.tracked,
    requiresShipping: supplemental.requiresShipping,
    unitCost: core.unitCost ? { amount: String(core.unitCost.amount), currencyCode: core.unitCost.currencyCode } : null,
    measurement: core.measurement ? {
      weight: core.measurement.weight ? { value: Number(core.measurement.weight.value), unit: core.measurement.weight.unit } : null,
    } : null,
    inventoryLevels: sortCanonical((inventoryLevelsByItem.get(core.id) || []).map(canonicalLevel)),
  };
}

function canonicalVariant(variant) {
  return {
    id: variant.id,
    position: variant.position,
    title: variant.title,
    sku: variant.sku ?? null,
    barcode: variant.barcode ?? null,
    price: String(variant.price),
    compareAtPrice: variant.compareAtPrice == null ? null : String(variant.compareAtPrice),
    taxable: variant.taxable,
    inventoryPolicy: variant.inventoryPolicy,
    inventoryQuantity: variant.inventoryQuantity,
    selectedOptions: variant.selectedOptions.map(({ name, value }) => ({ name, value })),
    inventoryItem: canonicalInventoryItem(variant),
  };
}

function canonicalProduct(product) {
  const productId = product.id;
  return {
    id: productId,
    legacyResourceId: String(product.legacyResourceId),
    title: product.title,
    handle: product.handle,
    status: product.status,
    vendor: product.vendor,
    productType: product.productType,
    category: product.category ? { id: product.category.id, fullName: product.category.fullName } : null,
    tags: [...product.tags].sort(),
    seo: { title: product.seo?.title ?? null, description: product.seo?.description ?? null },
    featuredMedia: product.featuredMedia ? { id: product.featuredMedia.id } : null,
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      position: option.position,
      optionValues: option.optionValues.map(({ id, name }) => ({ id, name })),
    })).sort((a, b) => a.position - b.position),
    variants: (variantsByProduct.get(productId) || []).map(canonicalVariant).sort((a, b) => a.position - b.position),
    media: (mediaByProduct.get(productId) || []).map(({ id, mediaContentType, alt }) => ({ id, mediaContentType, alt: alt ?? '' })),
    collections: sortCanonical((collectionsByProduct.get(productId) || []).map(({ id }) => ({ id }))),
    resourcePublications: sortCanonical((publicationsByProduct.get(productId) || []).map((row) => ({
      isPublished: row.isPublished,
      publication: { id: row.publication.id },
      publishDate: row.publishDate ?? null,
    }))),
    metafields: sortCanonical((metafieldsByProduct.get(productId) || []).map(({ id, namespace, key, type, value }) => ({ id, namespace, key, type, value }))),
  };
}

const output = products.map((product) => {
  const canonical = canonicalProduct(product);
  const digest = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
  return {
    id: product.id,
    handle: product.handle,
    sha256: digest(canonical),
    sectionSha256: {
      product: digest({
        id: canonical.id,
        legacyResourceId: canonical.legacyResourceId,
        title: canonical.title,
        handle: canonical.handle,
        status: canonical.status,
        vendor: canonical.vendor,
        productType: canonical.productType,
        category: canonical.category,
        tags: canonical.tags,
        seo: canonical.seo,
        featuredMedia: canonical.featuredMedia,
        options: canonical.options,
      }),
      variantsInventory: digest(canonical.variants),
      media: digest(canonical.media),
      collections: digest(canonical.collections),
      publications: digest(canonical.resourcePublications),
      publicationIds: digest(canonical.resourcePublications.map((row) => row.publication.id)),
      publicationStates: digest(canonical.resourcePublications.map((row) => ({ id: row.publication.id, isPublished: row.isPublished }))),
      publicationDates: digest(canonical.resourcePublications.map((row) => ({ id: row.publication.id, publishDate: row.publishDate }))),
      metafields: digest(canonical.metafields),
    },
    publicationComponents: {
      ids: canonical.resourcePublications.map((row) => row.publication.id),
      states: canonical.resourcePublications.map((row) => ({ id: row.publication.id, isPublished: row.isPublished })),
      dates: canonical.resourcePublications.map((row) => ({ id: row.publication.id, publishDate: row.publishDate })),
    },
    counts: {
      variants: canonical.variants.length,
      media: canonical.media.length,
      collections: canonical.collections.length,
      publications: canonical.resourcePublications.length,
      metafields: canonical.metafields.length,
      inventoryLevels: canonical.variants.reduce((total, variant) => total + variant.inventoryItem.inventoryLevels.length, 0),
    },
  };
});

console.log(JSON.stringify(output));
