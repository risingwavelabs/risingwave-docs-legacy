---
id: sink-to-delta-lake
title: Sink data from RisingWave to Delta Lake
description: Sink data from RisingWave to Delta Lake.
slug: /sink-to-delta-lake
---

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
| type            | Required. Specify if the sink should be `upsert` or `append-only`. If creating an `upsert` sink, see the [Overview](data-delivery.md) on when to define the primary key.|
| location        | Required. The file path that the Delta Lake table is reading data from, as specified when creating the Delta Lake table. |
| s3.endpoint     | Required. Endpoint of the S3. <ul><li>For MinIO object store backend, it should be <http://${MINIO_HOST}:${MINIO_PORT>}. </li><li>For AWS S3, refer to [S3](https://docs.aws.amazon.com/general/latest/gr/s3.html) </li></ul> |
| s3.access.key   | Access key of the S3 compatible object store.|
| s3.secret.key   | Secret key of the S3 compatible object store.|

## Example

Here is a step-by-step example on how you can sink data from RisingWave to Delta Lake.

### Launch RisingWave

Start a RisingWave cluster with MinIO. The MinIO endpoint is <http://localhost:9301>.

```terminal
./risedev d ci-iceberg-test
```

### Create a storage bucket in MinIO

Create a bucket named `deltalake` in the MinIO portal, found at <http://localhost:9400>.

### Create a Delta Lake table

Download the [Spark 3.3.1 distribution](https://archive.apache.org/dist/spark/spark-3.3.1/) and launch a Spark SQL shell.

```terminal
./spark-3.3.1-bin-hadoop3/bin/spark-sql --packages io.delta:delta-core_2.12:2.2.0,org.apache.hadoop:hadoop-aws:3.3.2 \
--conf 'spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension' \
--conf 'spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog' \
--conf 'spark.hadoop.fs.s3a.access.key=hummockadmin' \
--conf 'spark.hadoop.fs.s3a.secret.key=hummockadmin' \
--conf 'spark.hadoop.fs.s3a.endpoint=http://localhost:9301' \
--conf 'spark.hadoop.fs.s3a.path.style.access=true' 
```

In Spark SQL shell, create a Delta table. For more information, see the [DeltaLake quickstart](https://docs.delta.io/latest/quick-start.html#create-a-table).

```sql
CREATE TABLE delta.`s3a://deltalake/delta`(id int, name string) USING delta
```

### Create a source

The following query creates a source using the built-in load generator, which creates mock data. For more details, see [CREATE SOURCE](/sql/commands/sql-create-source.md) and [Generate test data](/create-source/create-source-datagen.md). You can transform the data further if you need using additional SQL queries.

```sql
CREATE SOURCE s1 (id int, name varchar)
WITH (
     connector = 'datagen',
     fields.id.kind = 'sequence',
     fields.id.start = '1',
     fields.id.end = '10000',
     fields.name.kind = 'random',
     fields.name.length = '10',
     datagen.rows.per.second = '200'
 ) ROW FORMAT JSON;
```

### Create a sink

The following query creates an append-only sink to sink data from the source `s1` in RisingWave to the Delta Lake table previously created. 

```sql
CREATE SINK delta_lake_sink FROM s1
WITH (
    connector = 'deltalake',
    type = 'append-only',
    location = 's3a://deltalake/delta',
    s3.access.key = 'hummockadmin',
    s3.secret.key = 'hummockadmin',
    s3.endpoint = 'http://localhost:9301'
);
```

### Query data in Delta Lake

To ensure that data is flushed to the sink, use the `FLUSH` command in RisingWave.

In the Spark SQL shell, query from the table created to check that the sink was successfully created.

```sql
SELECT * FROM delta.`s3a://deltalake/delta` LIMIT 10;
```