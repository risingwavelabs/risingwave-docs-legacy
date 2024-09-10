---
id: sink-to-azure-blob
title: Sink data from RisingWave to Azure Blob
description: Sink data from RisingWave to Azure Blob.
slug: /sink-to-azure-blob
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-azure-blob/" />
</head>

This guide describes how to sink data from RisingWave to Azure Blob using the Azblob connector in RisingWave.

[Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/) is Microsoft's object storage solution that allows you to store and manage massive amounts of unstructured data.

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='azblob',
   connector_parameter = 'value', ...
);
```

## Parameters

|Parameter names|Description|
|-|-|
|azblob.container_name|Required. The name of the Azure Blob Storage container.|
|azblob.path|Required. The directory where the sink file is located.|
|azblob.credentials.account_name|Optional. The Azure Storage account name for authentication.|
|azblob.credentials.account_key|Optional. The access key for the Azure Storage account.|
|azblob.endpoint_url|Required. The URL endpoint for the Azure Blob Storage service.|
|type|Required. Defines the type of the sink. Options include `append-only` or `upsert`.|

## Example

```sql
CREATE SINK azblob_sink AS SELECT v1
FROM t 
WITH (
    connector='azblob',
    azblob.path = 'test_sink/',
    azblob.container_name = '<container_name>',
    azblob.credentials.account_name = '<account_name>',
    azblob.credentials.account_key = '<account_key>',
    azblob.endpoint_url = '<endpoint_url>',
    type = 'append-only',
)FORMAT PLAIN ENCODE PARQUET(force_append_only=true);
```

For more information about encode `Parquet`, see [Sink data in parquet format](/data-delivery.md#sink-data-in-parquet-format).
