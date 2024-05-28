---
id: sink-to-iceberg
title: Sink data from RisingWave to Apache Iceberg
description: Sink data from RisingWave to Apache Iceberg.
slug: /sink-to-iceberg
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-iceberg/" />
</head>

This guide describes how to sink data from RisingWave to Apache Iceberg using the Iceberg sink connector in RisingWave. Apache Iceberg is a table format designed to support huge tables. For more information, see [Apache Iceberg](https://iceberg.apache.org).

:::caution Beta feature
The Iceberg sink connector in RisingWave is currently in Beta. Please use with caution as stability issues may still occur. Its functionality may evolve based on feedback. Please report any issues encountered to our team.
:::

## Prerequisites

- Ensure you already have an Iceberg table that you can sink data to.
  For additional guidance on creating a table and setting up Iceberg, refer to this [quickstart guide](https://iceberg.apache.org/spark-quickstart/) on creating an Iceberg table.

- Ensure you have an upstream materialized view or source that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='iceberg',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
| type            | Required. Allowed values: `appendonly` and `upsert`. |
| force_append_only| Optional. If `true`, forces the sink to be `append-only`, even if it cannot be. |
| s3.endpoint     | Optional. Endpoint of the S3. <ul><li>For MinIO object store backend, it should be `http://${MINIO_HOST}:${MINIO_PORT}`. </li><li>For AWS S3, refer to [S3](https://docs.aws.amazon.com/general/latest/gr/s3.html) </li></ul> |
| s3.region       | Optional. The region where the S3 bucket is hosted. Either `s3.endpoint` or `s3.region` must be specified.|
| s3.access.key   | Required. Access key of the S3 compatible object store.|
| s3.secret.key   | Required. Secret key of the S3 compatible object store.|
| database.name   | Required. The database of the target Iceberg table.|
| table.name      | Required. The name of the target Iceberg table.|
| catalog.type    | Optional. The catalog type used in this table. Currently, the supported values are `storage` and `rest`. If not specified, `storage` is used. For details, see [Catalogs](#catalogs).|
| warehouse.path  | Conditional. The path of the Iceberg warehouse. Currently, only S3-compatible object storage systems, such as AWS S3 and MinIO, are supported. It's required if the `catalog.type` is  `storage`.|
| catalog.uri     | Conditional. The URL of the catalog. It is required when `catalog.type` is `rest`. |
| primary_key     | The primary key for an upsert sink. It is only appliable to the upsert mode. |

## Data type mapping

RisingWave converts risingwave data types from/to Iceberg according to the following data type mapping table:

|RisingWave Type| Iceberg Type|
|---------------|-------------|
| boolean       | boolean     |
| int           | integer     |
| bigint        | long        |
| real          | float       |
| double        | double      |
| varchar       | string      |
| date          | date        |
| timestamptz   | timestamptz |
| timestamp     | timestamp   |

## Catalogs

Iceberg supports two types of catalogs:

- Storage catalog: The Storage catalog stores all metadata in the underlying file system, such as Hadoop or S3. Currently, we only support S3 as the underlying file system.
- REST catalog: RisingWave supports the [REST catalog](https://iceberg.apache.org/concepts/catalog/#decoupling-using-the-rest-catalog), which acts as a proxy to other catalogs like Hive, JDBC, and Nessie catalog. This is the recommended approach to use RisingWave with Iceberg tables.

## Iceberg table format

Currently, RisingWave only supports Iceberg tables in format v2.

## Examples

This section includes several examples that you can use if you want to quickly experiment with sinking data to Iceberg.

### Create an Iceberg table (if you do not already have one)

For example, the following `spark-sql` command creates an Iceberg table named `table` under the database `dev` in AWS S3. The table is in an S3 bucket named `my-iceberg-bucket` in region `ap-southeast-1` and under the path `path/to/warehouse`. The table has the property `format-version=2`, so it supports the upsert option. There should be a folder named `s3://my-iceberg-bucket/path/to/warehouse/dev/table/metadata`.

Note that only S3-compatible object store is supported, such as AWS S3 or MinIO.

```terminal
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-3.4_2.12:1.3.1,org.apache.hadoop:hadoop-aws:3.3.2\
    --conf spark.sql.catalog.demo=org.apache.iceberg.spark.SparkCatalog \
    --conf spark.sql.catalog.demo.type=hadoop \
    --conf spark.sql.catalog.demo.warehouse=s3a://my-iceberg-bucket/path/to/warehouse \
    --conf spark.sql.catalog.demo.hadoop.fs.s3a.endpoint=https://s3.ap-southeast-1.amazonaws.com \
    --conf spark.sql.catalog.demo.hadoop.fs.s3a.path.style.access=true \
    --conf spark.sql.catalog.demo.hadoop.fs.s3a.access.key=${ACCESS_KEY} \
    --conf spark.sql.catalog.demo.hadoop.fs.s3a.secret.key=${SECRET_KEY} \
    --conf spark.sql.defaultCatalog=demo \
    --e "drop table if exists demo.dev.`table`;

CREATE TABLE demo.dev.`table`
(
  seq_id bigint, 
  user_id bigint,
  user_name string
) TBLPROPERTIES ('format-version'='2')";
```

### Create an upstream materialized view or source

The following query creates an append-only source. For more details on creating a source, see [`CREATE SOURCE`](/sql/commands/sql-create-source.md) .

```sql
CREATE SOURCE s1_source (
     seq_id bigint, 
     user_id bigint,
     user_name varchar)
WITH (                    
     connector = 'datagen',
     fields.seq_id.kind = 'sequence',
     fields.seq_id.start = '1',
     fields.seq_id.end = '10000000',
     fields.user_id.kind = 'random',
     fields.user_id.min = '1',
     fields.user_id.max = '10000000',
     fields.user_name.kind = 'random',
     fields.user_name.length = '10',
     datagen.rows.per.second = '20000'
 ) FORMAT PLAIN ENCODE JSON;
```

Another option is to create an upsert table, which supports in-place updates. For more details on creating a table, see [`CREATE TABLE`](/sql/commands/sql-create-table.md) .

```sql
CREATE TABLE s1_table (
     seq_id bigint, 
     user_id bigint,
     user_name varchar)
WITH (                    
     connector = 'datagen',
     fields.seq_id.kind = 'sequence',
     fields.seq_id.start = '1',
     fields.seq_id.end = '10000000',
     fields.user_id.kind = 'random',
     fields.user_id.min = '1',
     fields.user_id.max = '10000000',
     fields.user_name.kind = 'random',
     fields.user_name.length = '10',
     datagen.rows.per.second = '20000'
 ) FORMAT PLAIN ENCODE JSON;
```

### Append-only sink from append-only source

If you have an append-only source and want to create an append-only sink, set `type = append-only` in the `CREATE SINK` SQL query.

```sql
CREATE SINK s1_sink FROM s1_source
WITH (
    connector = 'iceberg',
    type = 'append-only',
    warehouse.path = 's3a://my-iceberg-bucket/path/to/warehouse,
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY},
    database.name='dev',
    table.name='table'
);
```

### Append-only sink from upsert source

If you have an upsert source and want to create an append-only sink, set `type = append-only` and `force_append_only = true`. This will ignore delete messages in the upstream, and to turn upstream update messages into insert messages.

```sql
CREATE SINK s1_sink FROM s1_table
WITH (
    connector = 'iceberg',
    type = 'append-only',
    force_append_only = 'true',
    warehouse.path = 's3a://my-iceberg-bucket/path/to/warehouse,
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY},
    database.name='dev',
    table.name='table'
);
```

### Upsert sink from upsert source

In RisingWave, you can directly sink data as upserts into Iceberg tables.

```sql
CREATE SINK s1_sink FROM s1_table
WITH (
    connector = 'iceberg',
    warehouse.path = 's3a://my-iceberg-bucket/path/to/warehouse,
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY},
    database.name='dev',
    table.name='table',
    primary_key='seq_id'
);
```
