---
id: formats-and-encoding
title: Formats and encoding
slug: /formats-and-encoding
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/formats-and-encoding/" />
</head>

This topic will tell you more detailed information about sources, including: 

   - The concept of a source.
   - The difference between a source and a table in RisingWave.
   - The types of sources that RisingWave supports.
   - The formats and encoding options of sources.

## Source

When ingesting data into RisingWave, you need to use sources. A source is a resource that RisingWave can read data from.






### Supported sources and formats

For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources).





Common upstream data sources for RisingWave include:

- **Message Queues** like Apache Kafka, Apache Pulsar, Redpanda, etc.;
- **Change Data Capture (CDC) databases** like MySQL, PostgreSQL, MongoDB, etc.;
- **Storage systems** like AWS S3.

### Message Queues

RisingWave supports ingesting data from message queues like Apache Kafka, Apache Pulsar, Redpanda, AWS Kinesis, etc., in various formats including Avro, Protobuf, JSON, CSV, Bytes, etc. For a comprehensive list, please refer to the [documentation](https://docs.risingwave.com/docs/current/sql-create-source/#supported-sources). For example:

```sql
CREATE SOURCE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
) FORMAT PLAIN ENCODE JSON;
```

The configuration of message queues and the starting consumption position are specified through parameters in the `WITH` clause. Different connectors have different set of parameters.

The `FORMAT` parameter represents the organization format of the data and includes the following options:

- `PLAIN`: No specific data format, and data in this format can be imported into RisingWave using `CREATE SOURCE` and `CREATE TABLE`.
- `UPSERT`: UPSERT format, where messages consumed from the message queue will perform UPSERT in RisingWave based on the primary key. To ensure UPSERT correctness, data in UPSERT format from the message queue can only be imported into RisingWave using `CREATE TABLE`.
- `DEBEZIUM`, `MAXWELL`, `CANAL`, `DEBEZIUM_MONGO`: Mainstream Change Data Capture (CDC) formats, where messages consumed from the message queue will be processed and imported into RisingWave according to the corresponding CDC format's specification. To ensure CDC correctness, data in CDC format from the message queue can only be imported into RisingWave using `CREATE TABLE`.

The `ENCODE` parameter represents the data encoding and includes the following options:

- `JSON`: Data serialized in JSON format in the message queue, compatible with all `FORMAT` options.
- `AVRO`: Data serialized in AVRO format in the message queue, compatible with all `FORMAT` options.
- `Protobuf`: Data serialized in Protobuf format in the message queue, compatible with `FORMAT PLAIN / UPSERT / CANAL`.
- `CSV`: Data serialized in CSV format in the message queue, compatible with `FORMAT PLAIN`.
- `Bytes`: Data exists in the message queue in raw bytes format, compatible with `FORMAT PLAIN`.

In addition, RisingWave also supports specifying a schema registry for parsing data from the message queue. For example:

```sql
CREATE TABLE IF NOT EXISTS table_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
) FORMAT PLAIN ENCODE AVRO (
   schema.registry = 'http://127.0.0.1:8081'
);
```

When the `schema.registry` is specified, users no longer need to define columns for tables or sources in the DDL. RisingWave will automatically deduce the correct schema through the  `shcema.registry`. It is worth noting that users can still explicitly specify the primary key in the DDL: `CREATE TABLE t1 (PRIMARY KEY(id))`. For UPSERT and CDC formatted data, the primary key is, by default, the key of the message in the message queue.

### Change Data Capture (CDC)

RisingWave supports ingesting Change Data Capture (CDC) from upstream databases through two main methods:

1. RisingWave consumes CDC data from message queues. RisingWave supports mainstream CDC formats such as `DEBEZIUM`, `MAXWELL`, `CANAL`, etc., transmitted via message queues like Apache Kafka, Apache Pulsar, into RisingWave. Both OLTP databases (TiDB, MySQL, PostgreSQL, Oracle, etc.) and NoSQL databases (MongoDB, etc.) can transfer data to RisingWave using this approach.
2. RisingWave directly connects to upstream databases for data ingestion. Currently, RisingWave supports direct CDC data ingestion from MySQL and PostgreSQL.

Here is the example of method 1, CDC ingestion via message queues:

```sql
CREATE TABLE IF NOT EXISTS mq_cdc
WITH (
   connector='kafka',
   topic='cdc_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest'
) FORMAT DEBEZIUM ENCODE AVRO (
   schema.registry = 'http://127.0.0.1:8081'
);
```

Here is the example of method 2, direct MySQL CDC ingestion:

```sql
CREATE TABLE orders (
   order_id int,
   price decimal,
   PRIMARY KEY (order_id)
) WITH (
 connector = 'mysql-cdc',
 hostname = '127.0.0.1',
 port = '3306',
 username = 'root',
 password = '123456',
 database.name = 'mydb',
 table.name = 'orders',
);
```

Method 1 is suitable for users who have already established standard CDC pipelines via message queues, while Method 2 is suitable for users who haven't implemented CDC via message queues or prefer a simplified architecture. Regardless of the chosen method for loading CDC data, RisingWave ensures the correct import of full and incremental data from the source table.

It is worth noting that RisingWave is actively expanding the functionality and performance of direct CDC connectors. We plan to support more databases and advanced features such as full data backfill resumption, multi-table transactions, and more in the future.

### **Storage System**

RisingWave supports ingesting data from upstream storage systems, notably S3 and S3-compatible systems. For example,

```sql
CREATE TABLE s(
    id int,
    name varchar,
    age int,
    primary key(id)
) 
WITH (
    connector = 's3_v2',
    s3.region_name = 'ap-southeast-2',
    s3.bucket_name = 'example-s3-source',
    s3.credentials.access = 'xxxxx',
    s3.credentials.secret = 'xxxxx'
) FORMAT PLAIN ENCODE CSV (
    without_header = 'true',
    delimiter = ','
);
```

Currently, data with CSV and JSON encoding can be imported from a specified bucket in S3. In the future, RisingWave will extend its support to import data from a wider range of upstream storage systems.

### **DML Import**

In addition to streaming data from various upstream sources as mentioned above, RisingWave's tables also support data insertion using PostgreSQL's Data Manipulation Language (DML). Users can use `INSERT INTO ...` to insert data into RisingWave tables or explore bulk insertion using PostgreSQL-compatible bulk import tools. It is important to note that as RisingWave is a streaming database, streaming data import is the recommended method for data ingestion. DML data import serves as a supplementary method, primarily suitable for data corrections and scenarios involving infrequent bulk imports.

## Sink

Common downstream systems supported by RisingWave include:

- **Message queues**, such as Apache Kafka, Apache Pulsar, Redpanda, etc.
- **Databases**, such as MySQL, PostgreSQL, TiDB, Apache Doris, Starrocks, ClickHouse, etc.
- **Data lakes**, such as Apache Iceberg, Delta Lake, etc.
- **Other systems**, such as Elasticsearch, Cassandra, Redis, etc.

For the complete list, please refer to the [documentation](https://docs.risingwave.com/docs/current/data-delivery/).

Users can export data from RisingWave to downstream systems using the `CREATE SINK` command. Similar to SOURCE, users can specify the data format (`FORMAT`) and encoding (`ENCODE`) for the SINK.

The options for `FORMAT` are:

- `PLAIN`: No specific data format; it depends on the supported formats of the downstream system.
- `UPSERT`: UPSERT format, exporting data as a UPSERT stream with primary keys.
- `DEBEZIUM`: CDC format, exporting data in the CDC format of DEBEZIUM.

The options for `ENCODE` are:

- `JSON`: Export data using JSON serialization.
- `AVRO`: Export data using AVRO serialization; currently, it is only supported with the UPSERT format.

Different downstream systems have varying support for `FORMAT` and `ENCODE`. For systems like databases and data lakes with explicit data models, when using `CREATE SINK`, there is no need to specify `FORMAT` and `ENCODE` separately. RisingWave will export data based on the downstream system's data model. However, for message queues, users can optionally specify `FORMAT` and `ENCODE` as needed.

RisingWave supports `CREATE SINK FROM MV/SOURCE/TABLE` to directly export materialized views and table data. It also supports `CREATE SINK AS <query>` to select and transform data before the export.

### `CREATE SINK FROM`

You can use `CREATE SINK FROM` to sink data from an existing materialized view or table.

```sql
CREATE SINK sink1 FROM mv_or_table 
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test'
)
FORMAT PLAIN ENCODE JSON;
```

### `CREATE SINK AS`

You can use `CREATE SINK AS` to sink data from a query.

```sql
CREATE SINK sink2 AS 
SELECT 
   avg(distance) as avg_distance, 
   avg(duration) as avg_duration 
FROM taxi_trips
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test'
)
FORMAT PLAIN ENCODE JSON;
```

It is worth noting that different downstream systems have various configurable options with `CREATE SINK`. For detailed information, please refer to the [documentation](https://docs.risingwave.com/docs/current/data-delivery/).