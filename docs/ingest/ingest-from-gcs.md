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
|gcs.credential|Optional. The base64 encoded credential key. This key should be obtained from the Google Cloud Storage service account JSON file. To get this JSON file and encode it with base64, you can run the following command: <code>cat ~/Downloads/rwc-byoc-test-464bdd851bce.json &#124; base64 -b 0 &#124; pbcopy</code>, and then paste the output as the value for this parameter. If this field is not specified, ADC (application default credentials) will be used. |
|gcs.service_account|Optional. The service account of the target GCS source. If `gcs.credential` or ADC is not specified, the credentials will be derived from the service account.|
|match_pattern| Conditional. This field is used to find object keys in the bucket that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported. |
|compression_format|Optional. This field specifies the compression format of the file being read. You can define `compression_format` in the `CREATE TABLE` statement. When set to `gzip` or `gz`, the file reader reads all files with the .gz suffix. When set to `None` or not defined, the file reader will automatically read and decompress .gz and .gzip files.|

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Supported data format: `PLAIN`. |
|*data_encode*| Supported data encodes: `CSV`, `JSON`. |
|*without_header*| Whether the first line is header. Accepted values: `'true'`, `'false'`. Default: `'true'`.|
|*delimiter*| How RisingWave splits contents. For `JSON` encode, the delimiter is `\n`. |

## Loading order of GCS files

The GCS connector does not guarantee the sequential reading of files.

For example, RisingWave reads file F1 to offset O1 and crashes. After RisingWave rebuilds the task queue, it is not guaranteed the next task is reading file F1.

## Examples

Here is an example of connecting RisingWave to a GCS source to read data.

```sql
CREATE TABLE s(
    id int,
    name varchar,
    age int, 
    primary key(id)
) 
WITH (
    connector = 'gcs',
    gcs.bucket_name = 'example-bucket',
    gcs.credential = 'xxxxx'
) FORMAT PLAIN ENCODE JSON (
    without_header = 'true',
    delimiter = '\n'
);
```