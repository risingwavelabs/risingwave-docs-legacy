---
id: ingest-from-iceberg
title: Ingest data from Apache Iceberg
description: Ingest data from Apache Iceberg into RisingWave.
slug: /ingest-from-iceberg
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-iceberg/" />
</head>

This guide describes how to batch ingest data from Apache Iceberg to RisingWave using the Iceberg source in RisingWave. Apache Iceberg is a table format designed to support huge tables. For more information, see [Apache Iceberg](https://iceberg.apache.org).

:::note Beta feature
The Iceberg source connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
WITH (
   connector='iceberg',
   connector_parameter='value', ...
);
```

:::note
You don’t need to specify the column name for the Iceberg source, as RisingWave can derive it from the Iceberg table metadata directly. Use [`DESCRIBE`](/sql/commands/sql-describe.md) statement to view the column names and data types.
:::

## Parameters

|Field|Notes|
|---|---|
| type            | Required. Allowed values: `appendonly` and `upsert`. |
| s3.endpoint     | Optional. Endpoint of the S3. <ul><li>For MinIO object store backend, it should be `http://${MINIO_HOST}:${MINIO_PORT}`. </li><li>For AWS S3, refer to [S3](https://docs.aws.amazon.com/general/latest/gr/s3.html). </li></ul> |
| s3.region       | Optional. The region where the S3 bucket is hosted. Either `s3.endpoint` or `s3.region` must be specified.|
| s3.access.key   | Required. Access key of the S3 compatible object store.|
| s3.secret.key   | Required. Secret key of the S3 compatible object store.|
| database.name   | Required. Name of the database that you want to ingest data from.|
| table.name      | Required. Name of the table that you want to ingest data from.|
| catalog.name    | Conditional. The name of the Iceberg catalog. It can be omitted for storage catalog but required for other catalogs.|
| catalog.type    | Optional. The catalog type used in this table. Currently, the supported values are `storage`, `rest`, `hive` and `jdbc`. If not specified, `storage` is used. For details, see [Catalogs](#catalogs).|
| warehouse.path  | Conditional. The path of the Iceberg warehouse. Currently, only S3-compatible object storage systems, such as AWS S3 and MinIO, are supported. It's required if the `catalog.type` is not `rest`.|
| catalog.url     | Conditional. The URL of the catalog. It is required when `catalog.type` is not `storage`. |

## Data type mapping

RisingWave converts data types from Iceberg to RisingWave according to the following data type mapping table.

| Iceberg Type | RisingWave Type |
| --- | --- |
| boolean | boolean |
| integer | int |
| long | bigint |
| float | real |
| double | double |
| string | varchar |
| date | date |
| timestamptz | timestamptz |
| timestamp | timestamp |
| decimal | decimal |

## Catalogs

Iceberg supports these types of catalogs:

- Storage catalog: The Storage catalog stores all metadata in the underlying file system, such as Hadoop or S3. Currently, we only support S3 as the underlying file system.

- REST catalog: RisingWave supports the [REST catalog](https://iceberg.apache.org/concepts/catalog/#decoupling-using-the-rest-catalog), which acts as a proxy to other catalogs like Hive, JDBC, and Nessie catalog. This is the recommended approach to use RisingWave with Iceberg tables.

- Hive catalog: RisingWave supports the Hive catalog. You need to set `catalog.type` to `hive` to use it. See the full example in this [configuration file](https://github.com/risingwavelabs/risingwave/blob/main/integration_tests/iceberg-sink2/docker/hive/config.ini).

- Jdbc catalog: RisingWave supports the [JDBC catalog](https://iceberg.apache.org/docs/latest/jdbc/#configurations). See the full example in this [configuration file](https://github.com/risingwavelabs/risingwave/blob/main/integration_tests/iceberg-sink2/docker/jdbc/config.ini).

## Time travel

Our Iceberg source provides time travel capabilities, allowing you to query data from a specific point in time or version, rather than just the current state of the data. You can achieve this by specifying a timestamp or a version identifier.

Here is the syntax for specifying a system time. The timestamp here should be in a format like `YYYY-MM-DD HH:MM:SS` or a UNIX timestamp in seconds.

```sql
FOR SYSTEM_TIME AS OF [STRING | NUMBER];
```

Here is the syntax for specifying a system version:

```sql
FOR SYSTEM_VERSION AS OF [SNAPSHOT_ID];
```

Here are some examples:

```sql
-- Querying data using a timestamp
SELECT * FROM s FOR SYSTEM_TIME AS OF '2100-01-01 00:00:00+00:00';
SELECT * FROM s FOR SYSTEM_TIME AS OF 4102444800;

-- Querying data using a version identifier
SELECT * FROM s FOR SYSTEM_VERSION AS OF 3023402865675048688;
```

## Examples

Firstly, create an append-only Iceberg table, see [Append-only sink from upsert source](/guides/sink-to-iceberg.md#append-only-sink-from-upsert-source) for details.

Secondly, create an Iceberg source:

```sql
CREATE SOURCE iceberg_source 
WITH (
    connector = 'iceberg',
    warehouse.path = 's3a://my-iceberg-bucket/path/to/warehouse,
    s3.endpoint = 'https://s3.ap-southeast-1.amazonaws.com',
    s3.access.key = '${ACCESS_KEY}',
    s3.secret.key = '${SECRET_KEY},
    catalog.name='demo',
    database.name='dev',
    table.name='table'
);
```

Then, you can query the Iceberg source:

```sql
SELECT * FROM iceberg_source;
```
