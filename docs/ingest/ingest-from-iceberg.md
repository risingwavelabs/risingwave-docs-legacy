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
| catalog.type    | Optional. The catalog type used in this table. Currently, the supported values are `storage`, `rest`, `hive`, `jdbc`, and `glue`. If not specified, `storage` is used. For details, see [Catalogs](#catalogs).|
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

    ```sql title="Examples"
    create source source_demo_storage
    with (
        connector = 'iceberg',
        catalog.type = 'storage',
        warehouse.path = 's3://icebergdata/demo',
        s3.endpoint = 'http://minio-0:9301',
        s3.access.key = 'xxxxxxxxxx',
        s3.secret.key = 'xxxxxxxxxx',
        s3.region = 'ap-southeast-1',
        database.name = 's1',
        table.name = 't1'
    );
    ```

- REST catalog: RisingWave supports the [REST catalog](https://iceberg.apache.org/concepts/catalog/#decoupling-using-the-rest-catalog), which acts as a proxy to other catalogs like Hive, JDBC, and Nessie catalog. This is the recommended approach to use RisingWave with Iceberg tables. 

  ```sql title="Examples"
  create source source_demo_rest
  with (
      connector = 'iceberg',
      s3.endpoint = 'http://minio-0:9301',
      s3.access.key = 'xxxxxxxxxx',
      s3.secret.key = 'xxxxxxxxxx',
      s3.region = 'ap-southeast-1',
      catalog.type = 'rest',
      catalog.name = 'demo',
      catalog.uri = 'http://rest:8181',
      warehouse.path = 's3://icebergdata/demo',
      database.name = 's1',
      table.name = 't1'
  );
  ```

- Hive catalog: RisingWave supports the Hive catalog. You need to set `catalog.type` to `hive` to use it. 

    ```sql title="Examples"
    create source source_demo_hive
    with (
        connector = 'iceberg',
        catalog.type = 'hive',
        catalog.uri = 'thrift://metastore:9083',
        warehouse.path = 's3://icebergdata/demo',
        s3.endpoint = 'http://minio-0:9301',
        s3.access.key = 'xxxxxxxxxx',
        s3.secret.key = 'xxxxxxxxxx',
        s3.region = 'ap-southeast-1',
        catalog.name = 'demo',
        database.name = 's1',
        table.name = 't1'
    );
    ```

- Jdbc catalog: RisingWave supports the [JDBC catalog](https://iceberg.apache.org/docs/latest/jdbc/#configurations). 

    ```sql title="Examples"
    create source source_demo_jdbc
    with (
        connector = 'iceberg',
        warehouse.path = 's3://icebergdata/demo',
        s3.endpoint = 'http://minio-0:9301',
        s3.access.key = 'xxxxxxxxxx',
        s3.secret.key = 'xxxxxxxxxx',
        s3.region = 'ap-southeast-1',
        catalog.name = 'demo',
        catalog.type = 'jdbc',
        catalog.uri = 'jdbc:postgresql://postgres:5432/iceberg',
        catalog.jdbc.user = 'admin',
        catalog.jdbc.password = '123456',
        database.name = 's1',
        table.name = 't1'
    );
    ```

- Glue Catalog: RisingWave supports the Glue catalog. You should use AWS S3 if you use the Glue catalog. Below are example codes for using this catalog:

  ```sql title="Examples"
  create source source_test
  with (
      connector = 'iceberg',
      catalog.type = 'glue',
      warehouse.path = 's3://my-iceberg-bucket/test',
      s3.access.key = 'xxxxxxxxxx',
      s3.secret.key = 'xxxxxxxxxx',
      s3.region = 'ap-southeast-2',
      database.name='test_db',
      table.name='test_table'
  );
  ```

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

## System tables

We currently support system tables [`rw_iceberg_files` and `rw_iceberg_snapshots`](/sql/system-catalogs/rw_catalog.md#available-risingwave-catalogs). `rw_iceberg_files` contains the current files of the Iceberg source or table. Here is a simple example:

```sql title="Read Iceberg files"
 SELECT * FROM rw_iceberg_files;
```
```
 source_id | schema_name |        source_name         | content |                                                      file_path                                                       | file_format | record_count | file_size_in_bytes | equality_ids | sort_order_id
-----------+-------------+----------------------------+---------+----------------------------------------------------------------------------------------------------------------------+-------------+--------------+--------------------+--------------+---------------
         1 | public      | source_merge_on_read_table |       0 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-1-dcbf00a2-8722-4cd8-9d77-15880e334488-00001.parquet         | parquet     |            1 |                951 |              |             0
         1 | public      | source_merge_on_read_table |       0 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-0-0d0f5a54-b4b1-431d-8574-e13fc410296f-00001.parquet         | parquet     |            1 |                907 |              |             0
         1 | public      | source_merge_on_read_table |       0 | s3a://hummock001/demo_db/merge_on_read_table/data/00001-1-0d0f5a54-b4b1-431d-8574-e13fc410296f-00001.parquet         | parquet     |            1 |                935 |              |             0
         1 | public      | source_merge_on_read_table |       0 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-0-66d3b597-a132-4e04-a40a-02972edcff24-00001.parquet         | parquet     |            1 |                907 |              |             0
         1 | public      | source_merge_on_read_table |       1 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-1-dcbf00a2-8722-4cd8-9d77-15880e334488-00001-deletes.parquet | parquet     |            1 |               1467 |              |
         1 | public      | source_merge_on_read_table |       0 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-0-6acaf4d1-512c-42b7-9a76-e81fc8c8ca8f-00004.parquet         | parquet     |            1 |               1690 |              |
         1 | public      | source_merge_on_read_table |       2 | s3a://hummock001/demo_db/merge_on_read_table/data/00000-0-6e0c500e-6a8f-4252-863c-7c3d6ac20264-00048-eq-del.parquet  | parquet     |            1 |                721 | {1}          |
(7 rows)
```

`rw_iceberg_snapshots` contains all Iceberg snapshots in RisingWave. Based on it, you can read a specific snapshot by a time travel query. For example, you can use the following query to read these snapshots:

```sql title="Read all Iceberg snapshots"
SELECT * FROM rw_iceberg_snapshots;
```
```
 source_id | schema_name |source_name| sequence_number |     snapshot_id     |         timestamp_ms          |                                                        manifest_list                                      |                                                                                                                                                                                                                    summary
-----------+-------------+-----------------------------+-----------------+---------------------+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         1 | public      | t         |               1 | 4476030648521181855 | 2024-04-03 08:54:22.488+00:00 | s3a://hummock001/demo_db/t/metadata/snap-4476030648521181855-1-f06c9623-1ae5-4646-b117-b765d4154221.avro  | {"added-data-files": "2", "added-files-size": "1814", "added-records": "2", "changed-partition-count": "1", "operation": "append", "spark.app.id": "local-1712134455383", "total-data-files": "2", "total-delete-files": "0", "total-equality-deletes": "0", "total-files-size": "1814", "total-position-deletes": "0", "total-records": "2"}
         1 | public      | t         |               2 | 3368332126703695368 | 2024-04-03 08:54:36.795+00:00 | s3a://hummock001/demo_db/t/metadata/snap-3368332126703695368-1-3de95014-9e9e-4704-8ea3-44449525638a.avro  | {"added-data-files": "2", "added-files-size": "1842", "added-records": "2", "changed-partition-count": "1", "operation": "append", "spark.app.id": "local-1712134465484", "total-data-files": "4", "total-delete-files": "0", "total-equality-deletes": "0", "total-files-size": "3656", "total-position-deletes": "0", "total-records": "4"}
         1 | public      | t         |               3 | 8015994742063949347 | 2024-04-07 02:46:38.913+00:00 | s3a://hummock001/demo_db/t/metadata/snap-8015994742063949347-1-f31760cb-5df9-452a-938e-01eec7105e94.avro  | {"changed-partition-count": "1", "deleted-data-files": "1", "deleted-records": "1", "operation": "delete", "removed-files-size": "907", "spark.app.id": "local-1712457982197", "total-data-files": "3", "total-delete-files": "0", "total-equality-deletes": "0", "total-files-size": "2749", "total-position-deletes": "0", "total-records": "3"}
         1 | public      | t         |               4 | 4642583001850518920 | 2024-04-07 02:47:05.171+00:00 | s3a://hummock001/demo_db/t/metadata/snap-4642583001850518920-1-57d9b426-e584-4185-9b7e-eab890f20589.avro  | {"added-data-files": "1", "added-delete-files": "1", "added-files-size": "2418", "added-position-delete-files": "1", "added-position-deletes": "1", "added-records": "1", "changed-partition-count": "1", "operation": "overwrite", "spark.app.id": "local-1712458005806", "total-data-files": "4", "total-delete-files": "1", "total-equality-deletes": "0", "total-files-size": "5167", "total-position-deletes": "1", "total-records": "4"}
```

```sql title="Read a specific snapshot"
SELECT * FROM t FOR SYSTEM_VERSION AS OF 4476030648521181855;
SELECT * FROM t FOR SYSTEM_TIME AS OF '2024-04-03 08:54:22.488+00:00';
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

Then, you can query the Iceberg source by using a batch query:

```sql
SELECT * FROM iceberg_source;
```

Typically, you can use CTAS (CREATE TABLE AS SELECT) to load historical Iceberg table data into a RisingWave table:

```sql
CREATE TABLE t AS SELECT * FROM iceberg_source;
```

Furthermore, if you have a Kafka upstream on the Iceberg table, you can use `SINK INTO TABLE` to ingest data from Kafka to the RisingWave table:

```sql
CREATE SINK s INTO TABLE t AS SELECT * FROM kafka_source;
```
