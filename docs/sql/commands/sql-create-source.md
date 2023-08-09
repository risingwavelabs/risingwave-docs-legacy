---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command.
If you  choose to persist the data from the source in RisingWave, use the `CREATE TABLE` command with connector settings. See [CREATE TABLE](sql-create-table.md) for more details.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or data transformations.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
[schema_definition]
[ WITH (
    connector='connector_name',
    connector_parameter='value', ...)]
[FORMAT data_format ENCODE data_encode [ (
    message='message',
    schema.location='location', ...) ]
];
```

### schema_definition:
```sql
[col_name data_type [ AS generation_expression ]
[WATERMARK FOR col_name as generation_expression]]
```

:::note
To know when a data record is loaded to RisingWave, you can define a column that is generated based on the processing time (`<column_name> timestampz AS proctime()`) when creating the table or source.
:::

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
   rr.Stack(
      rr.Sequence(
         rr.Terminal('CREATE SOURCE'),
         rr.Optional(rr.Terminal('IF NOT EXISTS')),
         rr.NonTerminal('source_name', 'skip'),
      ),
      rr.Optional(rr.NonTerminal('schema_definition', 'skip')),
      rr.Sequence(
         rr.Terminal('WITH'),
         rr.Terminal('('),
         rr.Stack(
            rr.Stack(
               rr.Sequence(
                  rr.Terminal('connector'),
                  rr.Terminal('='),
                  rr.NonTerminal('connector_name', 'skip'),
                  rr.Terminal(','),
               ),
               rr.OneOrMore(
                  rr.Sequence(
                     rr.NonTerminal('connector_parameter', 'skip'),
                     rr.Terminal('='),
                     rr.NonTerminal('value', 'skip'),
                     rr.Terminal(','),
                  ),
               ),
            ),
            rr.Terminal(')'),
         ),
      ),
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
      rr.Stack(
         rr.Terminal(';'),
      ),
   )
);

<drawer SVG={svg} />

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

## Parameters

| Parameter| Description|
|-----------|-------------|
|*table_name*    |The name of the table. If a schema name is given (for example, `CREATE TABLE <schema>.<table> ...`), then the table is created in the specified schema. Otherwise it is created in the current schema.|
|*col_name*      |The name of a column.|
|*data_type*|The data type of a column. With the `struct` data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets ("<\>"). |
|*generation_expression*| The expression for the generated column. For details about generated columns, see [Generated columns](/sql/query-syntax/query-syntax-generated-columns.md).|
|**WITH** clause |Specify the connector settings here if trying to create a materialized source. See the [Data ingestion](/data-ingestion.md) page for the full list of supported source as well as links to specific connector pages detailing the syntax for each source. |
|Format and encode options |Specify the data format and the encoding format of the source data. To learn about the supported data formats, see [Data formats](sql-create-source.md#supported-formats). |

## Supported sources

Click a connector name to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

Data formats denoted with an M only support materialized sources, which require a primary key to be specified. Otherwise, both materialized and non-materialized sources are supported.

| Connector | Version | Format |
|---------|---------|---------|
|[Kafka](/create-source/create-source-kafka.md)|3.1.0 or later versions |[Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (M), [Debezium AVRO](#debezium-avro) (M), [DEBEZIUM_MONGO_JSON](#debezium-mongo-json) (M), [Maxwell JSON](#maxwell-json) (M), [Canal JSON](#canal-json) (M), [Upsert JSON](#upsert-json), [Upsert AVRO](#upsert-avro), [Bytes](#bytes)|
|[Redpanda](/create-source/create-source-redpanda.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf) |
|[Pulsar](/create-source/create-source-pulsar.md)| 2.8.0 or later versions|[Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (M), [Maxwell JSON](#maxwell-json) (M), [Canal JSON](#canal-json) (M)|
|[Astra Streaming](/guides/connector-astra-streaming.md)|Latest |[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|  
|[Kinesis](/create-source/create-source-kinesis.md)| Latest| [Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (M), [Maxwell JSON](#maxwell-json) (M), [Canal JSON](#canal-json) (M)|
|[PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md)| 10, 11, 12, 13, 14|[Debezium JSON](#debezium-json) (M)|
|[MySQL CDC](/guides/ingest-from-mysql-cdc.md)| 5.7, 8.0|[Debezium JSON](#debezium-json) (M)|
|[CDC via Kafka](/create-source/create-source-cdc.md)||[Debezium JSON](#debezium-json) (M), [Maxwell JSON](#maxwell-json) (M), [Canal JSON](#canal-json) (M)|
|[Amazon S3](/create-source/create-source-s3.md)| Latest |[JSON](#json), CSV| |
|[Load generator](/create-source/create-source-datagen.md)|Built-in|[JSON](#json)|
|Google Pub/Sub | | [Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (M), [Maxwell JSON](#maxwell-json) (M), [Canal JSON](#canal-json) (M) |

:::note
When a source is created, RisingWave does not ingest data immediately. RisingWave starts to process data when a materialized view is created based on the source.
:::

## Watermarks

RisingWave supports generating watermarks when creating a source. Watermarks are like markers or signals that track the progress of event time, allowing you to process events within their corresponding time windows. The [`WATERMARK`](/transform/watermarks.md) clause should be used within the `schema_definition`. For more information on how to create a watermark, see [Watermarks](/transform/watermarks.md).

We can generate the watermark as the latest timestamp observed in `order_time` minus 5 seconds. 

```sql
CREATE SOURCE s1 (
    product VARCHAR,
    price DOUBLE PRECISION
    order_time TIMESTAMP,
    WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH ( 
    connector = 'kafka',
    topic = 'test_topic',
    properties.bootstrap.server = 'message_queue:29092', 
    scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE JSON;
```

## Change Data Capture (CDC)

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert CDC data into Kafka topics.

For complete step-to-step guides about ingesting MySQL and PostgreSQL data using both approaches, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md).

## Supported formats

When creating a source, specify the data and encoding formats in the `FORMAT` and `ENCODE` section of the `CREATE SOURCE` or `CREATE TABLE` statement.

### Avro

For data in Avro format, you must specify a message and a schema file location. The schema file location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Avro, instead of a schema file location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry).

Note that the timestamp displayed in RisingWave may be different from the upstream system as timezone information is lost in Avro serialization.

:::info

For Avro data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE TABLE` statement.

:::

Syntax:

```sql
FORMAT PLAIN
ENCODE AVRO (
   message = 'main_message',
   schema.location = 'location' | schema.registry = 'schema_registry_url'
)
```

### JSON

RisingWave decodes JSON directly from external sources. When creating a source from streams in JSON, you need to define the schema of the source within the parentheses after the source name, and specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
FORMAT PLAIN
ENCODE JSON
```

### Protobuf

For data in Protobuf format, you must specify a message and a schema location. The schema location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Protobuf, instead of providing a schema location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry).

:::info

For protobuf data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE TABLE` statement.

:::

If you provide a file location, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

```shell
protoc -I=$include_path --include_imports --descriptor_set_out=schema.pb schema.proto
```

Syntax:

```sql
FORMAT PLAIN
ENCODE PROTOBUF (
   message = 'main_message',
   schema.location = 'location' | schema.registry = 'schema_registry_url'
)
```

### Debezium JSON

When creating a source from streams in Debezium JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Note that if you are ingesting data of type `timestamp` or `timestampz` in RisingWave, the upstream value must be in the range of `[1973-03-03 09:46:40, 5138-11-16 09:46:40] (UTC)`. The value may be parsed and ingested incorrectly without warning.

Syntax:

```sql
FORMAT DEBEZIUM
ENCODE JSON
```

### Debezium Mongo JSON

When loading data from MongoDB via Kafka topics in Debezium Mongo JSON format, the source table schema has a few limitations. The table schema must have the columns `_id` and `payload`, where `_id` comes from the MongoDB document's `id` and is the primary key, and `payload` is type `jsonb` and contains the rest of the document. If the document's `_id` is type `ObjectID`, then when creating the column in RisingWave, specify the type of `_id` as `varchar`. If the document's `_id` is of type `int32` or `int64`, specify the type of `_id` as `int` or `bigint` in RisingWave.

Syntax:

```sql
FORMAT DEBEZIUM_MONGO
ENCODE JSON
```

### Debezium AVRO

When creating a source from streams in with Debezium AVRO, the schema of the source does not need to be defined in the `CREATE TABLE` statement as it can be inferred from the `SCHEMA REGISTRY`. This means that the schema file location must be specified. The schema file location can be an actual Web location, which is in `http://...`, `https://...`, or `S3://...` format, or a Confluent Schema Registry. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry).

Syntax:

```sql
FORMAT DEBEZIUM
ENCODE AVRO (
   message = 'main_message',
   schema.location = 'location' | schema.registry = 'schema_registry_url'
)
```

### Maxwell JSON

When creating a source from streams in Maxwell JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
FORMAT MAXWELL
ENCODE JSON
```

### Canal JSON

RisingWave supports the TiCDC dialect of the Canal CDC format. When creating a source from streams in TiCDC, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
FORMAT CANAL
ENCODE JSON
```

### Upsert JSON

When consuming data in JSON from Kafka topics, the `FORMAT` and `ENCODE` sections need to be specified as `UPSERT` and `JSON` respectively. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

Syntax:

```sql
FORMAT UPSERT
ENCODE JSON
```

### Upsert AVRO

When consuming data in AVRO from Kafka topics, the `FORMAT` and `ENCODE` sections need to be specified as `UPSERT` and `AVRO` respectively. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

Syntax:

```sql
FORMAT UPSERT
ENCODE AVRO
```

### Bytes

RisingWave allows you to read data streams without decoding the data by using the `BYTES` row format. However, the table or source can have exactly one field of `BYTEA` data.

```sql
FORMAT PLAIN
ENCODE BYTES
```

## See also

- [`DROP SOURCE`](sql-drop-source.md) — Remove a source.
- [`SHOW CREATE SOURCE`](sql-show-create-source.md) — Show the SQL statement used to create a source.
