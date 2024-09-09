---
 id: ingest-from-azure-blob
 title: Ingest data from Azure Blob
 description: Describes how to ingest data from Azure Blob Storage.
 slug: /ingest-from-azure-blob
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-azure-blob/" />
</head>

[Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/), provided by Microsoft Azure, allows you to store and manage large amounts of unstructured data.

Use the SQL statement below to connect RisingWave to Azure Blob Storage using Azblob connector. Note that the Azblob connector does not guarantee the sequential reading of files or complete file reading.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
schema_definition
[INCLUDE { file | offset } [AS <column_name>]]
WITH (
   connector = 'azblob',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode (
   without_header = 'true' | 'false',
   delimiter = 'delimiter'
); 
```

**schema_definition**:

```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

### Connector parameters

|Field|Notes|
|---|---|
|azblob.container_name |Required. The name of the container the data source is stored in. |
|azblob.credentials.account_name|Optional. The name of the Azure Blob Storage account. |
|azblob.credentials.account_key|Optional. The account key for the Azure Blob Storage account.|
|azblob.endpoint_url|Required. The URL of the Azure Blob Storage service endpoint.|
|match_pattern|Conditional. Set to find object keys in `azblob.container_name` that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported.|
|compression_format|Optional. Specifies the compression format of the file being read. When set to `gzip` or `gz`, the file reader reads all files with the `.gz` suffix; when set to `None` or not defined, the file reader will automatically read and decompress `.gz` and `.gzip` files.|

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Supported data format: `PLAIN`. |
|*data_encode*| Supported data encodes: `CSV`, `JSON`, `PARQUET`. |
|*without_header*| This field is only for `CSV` encode, and it indicates whether the first line is header. Accepted values: `'true'`, `'false'`. Default: `'true'`.|
|*delimiter*| How RisingWave splits contents. For `JSON` encode, the delimiter is `\n`; for `CSV` encode, the delimiter can be one of `,`, `;`, `E'\t'`. |

### Additional columns

|Field|Notes|
|---|---|
|*file*| Optional. The column contains the file name where current record comes from. |
|*offset*| Optional. The column contains the corresponding bytes offset (record offset for parquet files) where current message begins|

## Examples

Here are examples of connecting RisingWave to the Azblob source to read data from individual streams.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="csv" label="CSV" default>

```sql
CREATE SOURCE s(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 'azblob',
    azblob.container_name = 'xxx',
    azblob.credentials.account_name = 'xxx',
    azblob.credentials.account_key = 'xxx',
    azblob.endpoint_url = 'xxx',
) FORMAT PLAIN ENCODE CSV (
    without_header = 'true',
    delimiter = ',' -- set delimiter = E'\t' for tab-separated files
); 
```

</TabItem>

<TabItem value="json" label="JSON" default>

```sql
CREATE SOURCE s1( 
    id int,
    name TEXT,
    age int,
    mark int,
)
WITH (
    connector = 'azblob',
    azblob.container_name = 'xxx',
    azblob.credentials.account_name = 'xxx',
    azblob.credentials.account_key = 'xxx',
    azblob.endpoint_url = 'xxx',
    match_pattern = '%Ring%*.ndjson',
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

<TabItem value="parquet" label="PARQUET" default>

```sql
CREATE SOURCE s2(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 'azblob',
    azblob.container_name = 'xxx',
    azblob.credentials.account_name = 'xxx',
    azblob.credentials.account_key = 'xxx',
    azblob.endpoint_url = 'xxx',
    match_pattern = '*.parquet',
) FORMAT PLAIN ENCODE PARQUET;
```

</TabItem>
</Tabs>