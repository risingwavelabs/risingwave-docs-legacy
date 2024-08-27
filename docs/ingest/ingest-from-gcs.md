---
id: ingest-from-gcs
title: Ingest data from Google Cloud Storage
description: Ingest data from Google Cloud Storage into RisingWave using a SQL command.
slug: /ingest-from-gcs
---

Use the SQL statement below to connect RisingWave to a Google Cloud Storage source.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
schema_definition
[INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]]
WITH (
   connector = 'gcs',
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
|gcs.bucket_name |Required. The name of the bucket the data source is stored in. |
|gcs.credential|Optional. The base64 encoded credential key. This key is obtained from the GCS service account key JSON file, and should be encoded with base64. To get this JSON file, refer to the [guides of GCS documentation](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console).  To encode it with base64, run the following command: <code>cat ~/Downloads/rwc-byoc-test-464bdd851bce.json &#124; base64 -b 0 &#124; pbcopy</code>, and then paste the output as the value for this parameter. If this field is not specified, ADC (application default credentials) will be used. |
|gcs.service_account|Optional. The service account of the target GCS source. If `gcs.credential` or ADC is not specified, the credentials will be derived from the service account.|
|match_pattern| Conditional. This field is used to find object keys in the bucket that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported. |
|compression_format|Optional. This field specifies the compression format of the file being read. You can define `compression_format` in the `CREATE TABLE` statement. When set to `gzip` or `gz`, the file reader reads all files with the .gz suffix. When set to `None` or not defined, the file reader will automatically read and decompress .gz and .gzip files.|
|match_pattern| Conditional. This field is used to find object keys in `gcs.bucket_name` that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported. |

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Supported data format: `PLAIN`. |
|*data_encode*| Supported data encodes: `CSV`, `JSON`, `PARQUET`. |
|*without_header*| This field is only for `CSV` encode, and it indicates whether the first line is header. Accepted values: `'true'`, `'false'`. Default: `'true'`.|
|*delimiter*| How RisingWave splits contents. For `JSON` encode, the delimiter is `\n`. |

## Loading order of GCS files

The GCS connector does not guarantee the sequential reading of files.

For example, RisingWave reads file F1 to offset O1 and crashes. After RisingWave rebuilds the task queue, it is not guaranteed the next task is reading file F1.

## Examples

Here are examples of connecting RisingWave to an GCS source to read data from individual streams.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="csv" label="CSV" default>

```sql
CREATE TABLE t(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 'gcs',
    gcs.bucket_name = 'example-bucket',
    gcs.credential = 'xxxxx'
) FORMAT PLAIN ENCODE JSON (
    without_header = 'true',
    delimiter = ',' -- set delimiter = E'\t' for tab-separated files
);
```

</TabItem>

<TabItem value="json" label="JSON" default>

```sql
CREATE TABLE t( 
    id int,
    name TEXT,
    age int,
    mark int,
)
WITH (
    connector = 'gcs',
    gcs.bucket_name = 'example-bucket',
    gcs.credential = 'xxxxx'
    match_pattern = '%Ring%*.ndjson',
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

<TabItem value="parquet" label="PARQUET" default>

```sql
CREATE TABLE t(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 'gcs',
    gcs.bucket_name = 'example-bucket',
    gcs.credential = 'xxxxx'
    match_pattern = '*.parquet',
) FORMAT PLAIN ENCODE PARQUET;
```

</TabItem>
</Tabs>