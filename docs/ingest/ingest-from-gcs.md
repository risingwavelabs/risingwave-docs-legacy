---
id: ingest-from-gcs
title: Ingest data from Google Cloud Storage
description: Ingest data from Google Cloud Storage into RisingWave using a SQL command.
slug: /ingest-from-gcs
---

Use the SQL statement below to connect RisingWave to a Google Cloud Storage source.

The GCS connector does not guarantee the sequential reading of files or complete file reading.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
schema_definition
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
|gcs.credential|Optional. The base64 encoded credential key. If this field is not specified, ADC (application default credentials) will be used. |
|gcs.service_account|Optional. The service account of the target GCS source. If `gcs.credential` or ADC is not specified, the credentials will be derived from the service account.|
|match_pattern| Conditional. This field is used to find object keys in the bucket that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported. |

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Supported data format: `PLAIN`. |
|*data_encode*| Supported data encodes: `CSV`, `JSON`. |
|*without_header*| Whether the first line is header. Accepted values: `'true'`, `'false'`. Default: `'true'`.|
|*delimiter*| How RisingWave splits contents. For `JSON` encode, the delimiter is `\n`. |

## Examples

Here is an example of connecting RisingWave to a GCS source to read data.

```sql
CREATE TABLE s(
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
    delimiter = '\n'
);
```