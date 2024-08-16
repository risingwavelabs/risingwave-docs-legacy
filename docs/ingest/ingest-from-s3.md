---
id: ingest-from-s3
title: Ingest data from S3 buckets
description: Ingest data from S3 buckets
slug: /ingest-from-s3
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-s3/" />
</head>

Use the SQL statement below to connect RisingWave to an Amazon S3 source. RisingWave supports both CSV and ndjson file formats.

The S3 connector does not guarantee the sequential reading of files or complete file reading.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
schema_definition
[INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]]
WITH (
   connector='s3_v2',
   connector_parameter='value', ...
)
FORMAT data_format ENCODE data_encode (
   without_header = 'true' | 'false',
   delimiter = 'delimiter'
); 
```

:::info
For CSV data, specify the delimiter in the `delimiter` option in `ENCODE properties`.
:::

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Stack(
        rr.Sequence(
            rr.Terminal('CREATE SOURCE'),
            rr.Optional(rr.Terminal('IF NOT EXISTS')),
            rr.NonTerminal('source_name', 'skip')
        ),
        rr.NonTerminal('schema_definition', 'skip'),
        rr.Sequence(
            rr.Terminal('FORMAT'),
            rr.NonTerminal('format', 'skip')
        ),
        rr.Sequence(
            rr.Terminal('ENCODE'),
            rr.NonTerminal('encode', 'skip'),
            rr.Optional(
                rr.Sequence(
                rr.Terminal('('),
                rr.NonTerminal('encode_parameter', 'skip'),
                rr.Terminal(')'),
                ),
            ),
        ),
        rr.Sequence(
            rr.Terminal('WITH'),
            rr.Terminal('('),
            rr.Stack(
                rr.Stack(
                    rr.Sequence(
                        rr.Terminal('connector'),
                        rr.Terminal('='),
                        rr.Terminal('\'s3_v2\''),
                        rr.Terminal(','),
                    ),
                    rr.OneOrMore(
                        rr.Sequence(
                            rr.NonTerminal('connector_parameter', 'skip'),
                            rr.Terminal('='),
                            rr.Terminal('\''),
                            rr.NonTerminal('value', 'skip'),
                            rr.Terminal('\''),
                            rr.Terminal(','),
                        ),
                    ),
                ),
                rr.Terminal(')'),
            ),
        ),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />

**schema_definition**:

```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

## Parameters

|Field|Notes|
|---|---|
|connector|Required. Support the `s3_v2` (recommended) connector only. [Learn more about `s3_v2`](#s3_v2-connector).|
|s3.region_name |Required. The service region.|
|s3.bucket_name |Required. The name of the bucket the data source is stored in. |
|s3.credentials.access|Required. This field indicates the access key ID of AWS. |
|s3.credentials.secret|Required. This field indicates the secret access key of AWS.|
|s3.endpoint_url| Conditional. The host URL for an S3-compatible object storage server. This allows users to use a different server instead of the standard S3 server. |
|compression_format|Optional. This field specifies the compression format of the file being read. You can define `compression_format` in the `CREATE TABLE` statement. When set to `gzip` or `gz`, the file reader reads all files with the .gz suffix. When set to `None` or not defined, the file reader will automatically read and decompress .gz and .gzip files.|
|match_pattern| Conditional. This field is used to find object keys in `s3.bucket_name` that match the given pattern. Standard Unix-style [glob](https://en.wikipedia.org/wiki/Glob_(programming)) syntax is supported. |

:::note
Empty cells in CSV files will be parsed to `NULL`.
:::

|Field|Notes|
|---|---|
|*data_format*| Supported data format: `PLAIN`. |
|*data_encode*| Supported data encodes: `CSV`, `JSON`, `PARQUET`. |
|*without_header*| This field is only for `CSV` encode, and it indicates whether the first line is header. Accepted values: `'true'`, `'false'`. Default: `'true'`.|
|*delimiter*| How RisingWave splits contents. For `JSON` encode, the delimiter is `\n`. |

### `s3_v2` connector

:::note BETA FEATURE

The `s3_v2` connector is currently in Beta. Please contact us if you encounter any issues or have feedback.

:::

:::note DEPRECATED S3 Connector

We have deprecated the legacy S3 Connector due to poor scalability and potential timeouts when dealing with a large number of files.
While this decision forbids the creation of new stream jobs using the deprecate connector, existing streaming jobs will not be impacted and can continue to run as usual.

:::

The `s3_v2` connector is designed to address the scalability and performance limitations of the `s3` connector by implementing a more efficient listing and fetching mechanism. If you want to explore the technical details of this new approach, refer to [the design document](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0076-refined-s3-source.md).

## Examples

Here are examples of connecting RisingWave to an S3 source to read data from individual streams.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="csv" label="CSV" default>

```sql
CREATE TABLE s(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 's3_v2',
    s3.region_name = 'ap-southeast-2',
    s3.bucket_name = 'example-s3-source',
    s3.credentials.access = 'xxxxx',
    s3.credentials.secret = 'xxxxx'
) FORMAT PLAIN ENCODE CSV (
    without_header = 'true',
    delimiter = ',' -- set delimiter = E'\t' for tab-separated files
);
```

</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE TABLE s3( 
    id int,
    name TEXT,
    age int,
    mark int,
)
WITH (
    connector = 's3_v2',
    match_pattern = '%Ring%*.ndjson',
    s3.region_name = 'ap-southeast-2',
    s3.bucket_name = 'example-s3-source',
    s3.credentials.access = 'xxxxx',
    s3.credentials.secret = 'xxxxx',
    s3.endpoint_url = 'https://s3.us-east-1.amazonaws.com'
) FORMAT PLAIN ENCODE JSON;
```
</TabItem>

<TabItem value="parquet" label="PARQUET" default>

```sql
CREATE TABLE s(
    id int,
    name varchar,
    age int
) 
WITH (
    connector = 's3_v2',
    match_pattern = '*.parquet',
    s3.region_name = 'ap-southeast-2',
    s3.bucket_name = 'example-s3-source',
    s3.credentials.access = 'xxxxx',
    s3.credentials.secret = 'xxxxx'
) FORMAT PLAIN ENCODE PARQUET;
```

</TabItem>
</Tabs>

## Important considerations

### Object filtering in S3 buckets

RisingWave has a prefix argument designed for filtering objects in the S3 bucket. It relies on [Apache Opendal](https://github.com/apache/incubator-opendal) whose prefix filter implementation is expected to be released soon.


### Handle new files in the bucket

RisingWave automatically ingests new files added to the bucket. However, it does not detect updates to a file if a file is deleted and a new file with the same name is added simultaneously. Additionally, RisingWave will ignore file deletions.

### Read data from the source

You need to create a materialized view from the source or create a table with the S3 connector to read the data. Here are some examples:

```sql
-- Create a materialized view from the source
CREATE SOURCE s3_source WITH ( connector = 's3_v2', ... );
CREATE MATERIALIZED VIEW mv AS SELECT * FROM s3_source;

-- Create a table with the S3 connector
CREATE TABLE s3_table ( ... ) WITH ( connector = 's3_v2', ... );
```

To view the progress of the source, you can also read the source directly
```sql
-- Create a materialized view from the source
CREATE SOURCE s3_source WITH ( connector = 's3_v2', ... );
SELECT count(*) from s3_source;
```


### Read Parquet files from S3

You can use the table function `file_scan()` to read Parquet files from S3, either a single file or a directory of Parquet files.


```sql title="Function signature"
file_scan(file_format, storage_type, s3_region, s3_access_key, s3_secret_key, file_location_or_directory)
```

:::note
When reading a directory of Parquet files, the schema will be based on the first Parquet file listed. Please ensure that all Parquet files in the directory have the same schema.
:::

For example, assume you have a Parquet file named `sales_data.parquet` that stores a company's sales data, containing the following fields:

- `product_id`: Product ID

- `sales_date`: Sales date

- `quantity`: Sales quantity

- `revenue`: Sales revenue

You can use the following SQL statement to read this Parquet file:

```sql title="Read a single Parquet file"
SELECT
  product_id,
  sales_date,
  quantity,
  revenue
FROM file_scan(
  'parquet',
  's3',
  'ap-southeast-2',
  'xxxxxxxxxx',
  'yyyyyyyy',
  's3://your-bucket/path/to/sales_data.parquet'
);

----RESULT
product_id |  sales_date  | quantity | revenue
------------+-------------+----------+----------
         12 | 2023-04-01   |       50 |   1000.00
         12 | 2023-04-02   |       30 |    600.00
         15 | 2023-04-01   |       20 |    400.00
(3 rows)
```

If you have several such Parquet files, you can also read by their file directory:

```sql title="Read a directory of Parquet files"
SELECT
  product_id,
  sales_date,
  quantity,
  revenue
FROM file_scan(
  'parquet',
  's3',
  'ap-southeast-2',
  'xxxxxxxxxx',
  'yyyyyyyy',
  's3://your-bucket/path/to/sales_data_file_directory/'
);

----RESULT
product_id |  sales_date  | quantity | revenue
------------+-------------+----------+----------
         12 | 2023-04-01   |       50 |   1000.00
         12 | 2023-04-02   |       30 |    600.00
         15 | 2023-04-01   |       20 |    400.00
         15 | 2023-04-03   |       40 |    800.00
         18 | 2023-04-02   |       25 |    500.00
         18 | 2023-04-04   |       35 |    700.00
(6 rows)
```

### Handle unexpected file types or poorly formatted files

RisingWave will attempt to interpret and parse files, regardless of their type, as CSV or ndjson, based on the specified rules. Warnings will be reported for parts of the file that cannot be parsed, but the source part will not fail. Poorly formatted parts of a file will be discarded.
