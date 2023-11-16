---
id: sink-to-delta-lake
title: Sink data from RisingWave to Delta Lake
description: Sink data from RisingWave to Delta Lake.
slug: /sink-to-delta-lake
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-delta-lake/" />
</head>

This guide describes how to sink data from RisingWave to Delta Lake. Delta Lake is an open-source storage framework designed to allow you to build a Lakehouse architecture with another compute engine. For more information, see [Delta Lake](https://delta.io).

## Prerequisites

- Ensure you already have an Delta Lake table that you can sink data to. For additional guidance on creating a table and setting up Delta Lake, refer to this [quickstart guide](https://docs.delta.io/latest/quick-start.html#create-a-table).

- Ensure you have an upstream materialized view or source that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='deltalake',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
| type            | Required. Currently, only `append-only` is supported. |
| location        | Required. The file path that the Delta Lake table is reading data from, as specified when creating the Delta Lake table. |
| s3.endpoint     | Required. Endpoint of the S3. <ul><li>For MinIO object store backend, it should be <http://${MINIO_HOST}:${MINIO_PORT>}. </li><li>For AWS S3, refer to [S3](https://docs.aws.amazon.com/general/latest/gr/s3.html) </li></ul> |
| s3.access.key   | Required. Access key of the S3 compatible object store.|
| s3.secret.key   | Required. Secret key of the S3 compatible object store.|

## Example

Here is a step-by-step example on how you can sink data from RisingWave to Delta Lake.

### Create a Delta Lake table

In a `spark-sql` shell, create a Delta table. For more information, see the [Delta Lake quickstart](https://docs.delta.io/latest/quick-start.html#create-a-table).

For example, the following `spark-sql` command creates a Delta Lake table in AWS S3. The table is in an S3 bucket named `my-delta-lake-bucket` in region `ap-southeast-1` and under the path `path/to/table`. Before running the following command to create a Delta Lake table, create an empty directory `path/to/table`. The full URL of the table location is `s3://my-delta-lake-bucket/path/to/table`.

Note that only S3-compatible object store is supported, such as AWS S3 or MinIO.

```terminal
spark-sql --packages io.delta:delta-core_2.12:2.2.0,org.apache.hadoop:hadoop-aws:3.3.2\
    --conf 'spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension' \
    --conf 'spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog' \
    --conf 'spark.hadoop.fs.s3a.access.key=${ACCESS_KEY}' \
    --conf 'spark.hadoop.fs.s3a.secret.key=${SECRET_KEY}' \
    --conf 'spark.hadoop.fs.s3a.endpoint=https://s3.ap-southeast-1.amazonaws.com' \
    --conf 'spark.hadoop.fs.s3a.path.style.access=true' \
    --e "create table delta.\`s3a://my-delta-lake-bucket/path/to/table\`(id int, name string) using delta"
```

### Create an upstream materialized view or source

The following query creates a source using the built-in load generator, which creates mock data. For more details, see [CREATE SOURCE](/sql/commands/sql-create-source.md) and [Generate test data](/ingest/ingest-from-datagen.md). You can transform the data using additional SQL queries if needed.

```sql
CREATE SOURCE s1_source (id int, name varchar)
WITH (
     connector = 'datagen',
     fields.id.kind = 'sequence',
     fields.id.start = '1',
     fields.id.end = '10000',
     fields.name.kind = 'random',
     fields.name.length = '10',
     datagen.rows.per.second = '200'
 ) FORMAT PLAIN ENCODE JSON;
```

You can also choose to create an upsert table, which supports in-place updates. For more details on creating a table, see [CREATE TABLE](/sql/commands/sql-create-table.md).

```sql
CREATE TABLE s1_table (id int, name varchar)
WITH (
    connector = 'datagen',
    fields.id.kind = 'sequence',
    fields.id.start = '1',
    fields.id.end = '10000',
    fields.name.kind = 'random',
    fields.name.length = '10',
    datagen.rows.per.second = '200'
) FORMAT UPSERT ENCODE JSON;
```

### Create a sink

#### Append-only sink from append-only source

If you have an `append-only` source and want to create an `append-only` sink, set `type = append-only` in the `CREATE SINK` query.

```sql
CREATE SINK s1_sink FROM s1_source
WITH (
    connector = 'deltalake',
    type = 'append-only',
    location = 's3a://my-delta-lake-bucket/path/to/table',
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY}'
);
```

#### Append-only sink from upsert table

If you have a table or source that is not of type `append-only` and want to create an `append-only` sink, set `type = append-only` and set `force_append_only = true` in the `CREATE SINK` query.

```sql
CREATE SINK s1_sink FROM s1_table
WITH (
    connector = 'deltalake',
    type = 'append-only',
    force_append_only = 'true',
    location = 's3a://my-delta-lake-bucket/path/to/table',
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY}'
);
```

### Query data in Delta Lake

To ensure that data is flushed to the sink, use the `FLUSH` command in RisingWave.

The following query checks the total number of records sinked to the Delta Lake table using `spark-sql`.

```terminal
spark-sql --packages io.delta:delta-core_2.12:2.2.0,org.apache.hadoop:hadoop-aws:3.3.2\
    --conf 'spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension' \
    --conf 'spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog' \
    --conf 'spark.hadoop.fs.s3a.access.key=${ACCESS_KEY}' \
    --conf 'spark.hadoop.fs.s3a.secret.key=${SECRET_KEY}' \
    --conf 'spark.hadoop.fs.s3a.endpoint=https://s3.ap-southeast-1.amazonaws.com' \
    --conf 'spark.hadoop.fs.s3a.path.style.access=true' \
    --e "select count(*) from delta.\`s3a://my-delta-lake-bucket/path/to/table\`"
```
