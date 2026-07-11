param(
  [Parameter(Mandatory = $true)][string]$OutputDirectory,
  [string]$Store = 'cute-sneakers.myshopify.com',
  [int]$PageSize = 75
)

$ErrorActionPreference = 'Stop'
if ($PageSize -lt 1 -or $PageSize -gt 250) { throw 'PageSize must be between 1 and 250.' }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$resolvedOutput = (Resolve-Path $OutputDirectory).Path

function Invoke-ReadOnlyShopifyQuery {
  param([Parameter(Mandatory = $true)][string]$Query, [hashtable]$Variables = @{})
  $queryPath = Join-Path $resolvedOutput '_current_query.graphql'
  $variablePath = Join-Path $resolvedOutput '_current_variables.json'
  $resultPath = Join-Path $resolvedOutput '_current_result.json'
  $errorPath = Join-Path $resolvedOutput '_current_error.log'
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($queryPath, $Query, $utf8NoBom)
  [System.IO.File]::WriteAllText($variablePath, ($Variables | ConvertTo-Json -Compress -Depth 10), $utf8NoBom)
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & shopify store execute --store $Store --query-file $queryPath --variable-file $variablePath --output-file $resultPath --json 2>$errorPath
  $exitCode = $LASTEXITCODE
  $ErrorActionPreference = $previousPreference
  if ($exitCode -ne 0) {
    $diagnostic = Get-Content -Raw -Path $errorPath -ErrorAction SilentlyContinue
    throw "Shopify read query failed with exit code $exitCode. $diagnostic"
  }
  $raw = Get-Content -Raw -Path $resultPath
  $result = $raw | ConvertFrom-Json
  if ($result.errors) { throw ($result.errors | ConvertTo-Json -Depth 20) }
  return $result
}

$shopQuery = @'
query InventoryCounts {
  shop { name myshopifyDomain primaryDomain { url } }
  productsCount { count precision }
  collectionsCount { count precision }
}
'@

$productQuery = @'
query ProductsPage($first: Int!, $after: String) {
  products(first: $first, after: $after, sortKey: ID) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle onlineStoreUrl title descriptionHtml
      seo { title description }
      productType vendor tags status templateSuffix createdAt updatedAt publishedAt
      collections(first: 50) { pageInfo { hasNextPage } nodes { id handle title } }
      variants(first: 100) {
        pageInfo { hasNextPage }
        nodes {
          id title sku barcode price compareAtPrice inventoryPolicy
          selectedOptions { name value }
          inventoryItem { id }
          media(first: 10) { pageInfo { hasNextPage } nodes { id } }
        }
      }
      media(first: 50) {
        pageInfo { hasNextPage }
        nodes {
          id mediaContentType alt status
          ... on MediaImage { image { id url width height altText } }
        }
      }
    }
  }
}
'@

$collectionQuery = @'
query CollectionsPage($first: Int!, $after: String) {
  collections(first: $first, after: $after, sortKey: ID) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title descriptionHtml updatedAt sortOrder templateSuffix
      seo { title description }
      image { id url altText width height }
      productsCount { count precision }
      ruleSet { appliedDisjunctively rules { column relation condition } }
    }
  }
}
'@

$identity = Invoke-ReadOnlyShopifyQuery -Query $shopQuery
$products = [System.Collections.Generic.List[object]]::new()
$variants = [System.Collections.Generic.List[object]]::new()
$media = [System.Collections.Generic.List[object]]::new()
$after = $null
$page = 0
do {
  $page++
  $result = Invoke-ReadOnlyShopifyQuery -Query $productQuery -Variables @{ first = $PageSize; after = $after }
  foreach ($product in $result.products.nodes) {
    if ($product.collections.pageInfo.hasNextPage -or $product.variants.pageInfo.hasNextPage -or $product.media.pageInfo.hasNextPage) {
      throw "Nested pagination limit exceeded for product $($product.id); refusing an incomplete snapshot."
    }
    $products.Add([pscustomobject]@{
      product_id = $product.id; handle = $product.handle; public_url = $product.onlineStoreUrl
      title = $product.title; description_html = $product.descriptionHtml
      seo_title = $product.seo.title; seo_description = $product.seo.description
      product_type = $product.productType; vendor = $product.vendor
      tags_json = ($product.tags | ConvertTo-Json -Compress); status = $product.status
      template_suffix = $product.templateSuffix
      collection_ids_json = (@($product.collections.nodes | ForEach-Object { $_.id }) | ConvertTo-Json -Compress)
      collection_names_json = (@($product.collections.nodes | ForEach-Object { $_.title }) | ConvertTo-Json -Compress)
      created_at = $product.createdAt; updated_at = $product.updatedAt; published_at = $product.publishedAt
    })
    foreach ($variant in $product.variants.nodes) {
      if ($variant.media.pageInfo.hasNextPage) { throw "Variant media pagination limit exceeded for $($variant.id)." }
      $variants.Add([pscustomobject]@{
        product_id = $product.id; handle = $product.handle; variant_id = $variant.id
        variant_title = $variant.title
        selected_options_json = ($variant.selectedOptions | ConvertTo-Json -Compress -Depth 10)
        sku = $variant.sku; barcode = $variant.barcode; inventory_item_id = $variant.inventoryItem.id
        price = $variant.price; compare_at_price = $variant.compareAtPrice
        inventory_policy = $variant.inventoryPolicy
        assigned_media_ids_json = (@($variant.media.nodes | ForEach-Object { $_.id }) | ConvertTo-Json -Compress)
      })
    }
    $position = 0
    foreach ($item in $product.media.nodes) {
      $position++
      $media.Add([pscustomobject]@{
        product_id = $product.id; handle = $product.handle; media_id = $item.id
        file_id = $item.image.id; position = $position; media_type = $item.mediaContentType
        url = $item.image.url
        alt_text = $(if ($null -ne $item.image) { $item.image.altText } else { $item.alt })
        width = $item.image.width; height = $item.image.height; status = $item.status
      })
    }
  }
  Write-Host "Products page ${page}: $($products.Count) products accumulated"
  $after = $result.products.pageInfo.endCursor
} while ($result.products.pageInfo.hasNextPage)

$collections = [System.Collections.Generic.List[object]]::new()
$after = $null
do {
  $result = Invoke-ReadOnlyShopifyQuery -Query $collectionQuery -Variables @{ first = $PageSize; after = $after }
  foreach ($collection in $result.collections.nodes) {
    $collections.Add([pscustomobject]@{
      collection_id = $collection.id; handle = $collection.handle
      url = "https://bestprintsco.com/collections/$($collection.handle)"; title = $collection.title
      description_html = $collection.descriptionHtml; seo_title = $collection.seo.title
      seo_description = $collection.seo.description
      image_json = ($collection.image | ConvertTo-Json -Compress -Depth 10)
      collection_type = $(if ($null -eq $collection.ruleSet) { 'MANUAL' } else { 'AUTOMATED' })
      automated_rules_json = ($collection.ruleSet | ConvertTo-Json -Compress -Depth 20)
      product_count = $collection.productsCount.count
      product_count_precision = $collection.productsCount.precision
      sort_order = $collection.sortOrder; template_suffix = $collection.templateSuffix
      updated_at = $collection.updatedAt
    })
  }
  $after = $result.collections.pageInfo.endCursor
} while ($result.collections.pageInfo.hasNextPage)

$files = [ordered]@{
  'products_baseline.csv' = $products; 'variants_baseline.csv' = $variants
  'media_baseline.csv' = $media; 'collections_baseline.csv' = $collections
}
foreach ($entry in $files.GetEnumerator()) {
  $entry.Value | Export-Csv -Path (Join-Path $resolvedOutput $entry.Key) -NoTypeInformation -Encoding utf8
}
$manifest = foreach ($entry in $files.GetEnumerator()) {
  $path = Join-Path $resolvedOutput $entry.Key
  [pscustomobject]@{
    filename = $entry.Key; record_count = $entry.Value.Count
    sha256 = (Get-FileHash -Algorithm SHA256 -Path $path).Hash.ToLowerInvariant()
    creation_time_utc = (Get-Date).ToUniversalTime().ToString('o'); store = $identity.shop.myshopifyDomain
    purpose = 'DISC-101 immutable read-only catalog inventory'
    restore_method = 'Reference-only baseline; this script performs no mutation or restore.'
  }
}
$manifest | Export-Csv -Path (Join-Path $resolvedOutput 'backup_manifest.csv') -NoTypeInformation -Encoding utf8
$summary = [ordered]@{
  created_at_utc = (Get-Date).ToUniversalTime().ToString('o'); store_name = $identity.shop.name
  store_domain = $identity.shop.myshopifyDomain; primary_domain = $identity.shop.primaryDomain.url
  expected_product_count = $identity.productsCount.count
  expected_product_count_precision = $identity.productsCount.precision; exported_product_count = $products.Count
  exported_variant_count = $variants.Count; exported_media_count = $media.Count
  expected_collection_count = $identity.collectionsCount.count
  expected_collection_count_precision = $identity.collectionsCount.precision
  exported_collection_count = $collections.Count; mutation_permission_used = $false
}
$summary | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $resolvedOutput 'inventory_summary.json') -Encoding utf8
if ($products.Count -ne $identity.productsCount.count) { throw "Product count mismatch." }
if ($collections.Count -ne $identity.collectionsCount.count) { throw "Collection count mismatch." }
Remove-Item -Force -LiteralPath (Join-Path $resolvedOutput '_current_query.graphql'), (Join-Path $resolvedOutput '_current_variables.json'), (Join-Path $resolvedOutput '_current_result.json'), (Join-Path $resolvedOutput '_current_error.log') -ErrorAction SilentlyContinue
Write-Host "Read-only export complete: $resolvedOutput"
Write-Host ($summary | ConvertTo-Json -Compress)
