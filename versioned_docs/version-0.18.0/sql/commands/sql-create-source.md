---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-source/" />
</head>

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command.
If you  choose to persist the data from the source in RisingWave, use the `CREATE TABLE` command with connector settings. See [CREATE TABLE](sql-create-table.md) for more details.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name 
[schema_definition]
WITH (
   connector='connector_name',
   connector_parameter='value', ...
)
ROW FORMAT data_format 
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION [ 'location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ] ];
```

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
      rr.Stack(
         rr.Sequence(
            rr.Terminal('ROW FORMAT'),
            rr.NonTerminal('data_format', 'skip'),
         ),
         rr.Optional(
            rr.Sequence(
               rr.Terminal('MESSAGE'),
               rr.NonTerminal('message', 'skip'),
            ),
         ),
         rr.Optional(
            rr.Sequence(
               rr.Terminal('ROW SCHEMA LOCATION'),
               rr.Choice(1,
                  rr.Terminal('location'),
                  rr.Sequence(
                     rr.Terminal('CONFLUENT SCHEMA REGISTRY'),
                     rr.NonTerminal('schema_registry_url', 'skip'),
                  ),
               ),
            ),
         ),
         rr.Terminal(';'),
      ),
   )
);

<drawer SVG={svg} />

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

## Supported sources and formats

## Supported sources

Click a connector name to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

| Connector | Version | Format | Materialized? | Limitations |
|---------|---------|---------|---------|---------|
|[Kafka](/create-source/create-source-kafka.md)|3.1.0 or later versions |[Avro](#avro), [JSON](#json), [protobuf](#protobuf)| Materialized & non-materialized| |
|[Redpanda](/create-source/create-source-redpanda.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|Materialized & non-materialized| |
|[Pulsar](/create-source/create-source-pulsar.md)| 2.8.0 or later versions|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)| Materialized & non-materialized| |
|[Astra Streaming](/guides/connector-astra-streaming.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)| Materialized & non-materialized| |
|[Kinesis](/create-source/create-source-kinesis.md)| Latest| [Avro](#avro), [JSON](#json), [protobuf](#protobuf)| Materialized & non-materialized| |
|[PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md)| 10, 11, 12, 13, 14|[Debezium JSON](#debezium-json)| Materialized only| Must have primary key|
|[MySQL CDC](/guides/ingest-from-mysql-cdc.md)| 5.7, 8.0|[Debezium JSON](#debezium-json)| Materialized only| Must have primary key|
|[CDC via Kafka](/create-source/create-source-cdc.md)||[Debezium JSON](#debezium-json), [Maxwell JSON](#maxwell-json), [Canal JSON](#canal-json)| Materialized only | Must have primary key|
|[Amazon S3](/create-source/create-source-s3.md)| Latest |CSV| |
|[Load generator](/create-source/create-source-datagen.md)|Built-in|[JSON](#json)|Materialized only||

:::note
When a source is created, RisingWave does not ingest data immediately. RisingWave starts to process data when a materialized view is created based on the source.
:::

## Change Data Capture (CDC)

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert CDC data into Kafka topics.

For complete step-to-step guides about ingesting MySQL and PostgreSQL data using both approaches, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md).

## Supported formats

When creating a source, specify the format in the `ROW FORMAT` section of the `CREATE SOURCE` or `CREATE TABLE` statement.

### Avro

For data in Avro format, you must specify a message and a schema file location. The schema file location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Avro, instead of a schema file location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry).

Note that the timestamp displayed in RisingWave may be different from the upstream system as timezone information is lost in Avro serialization.

:::info

For Avro data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE TABLE` statement.

:::

Syntax:

```sql
ROW FORMAT AVRO 
MESSAGE 'main_message' 
ROW SCHEMA LOCATION { 'location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' }
```

### JSON

RisingWave decodes JSON directly from external sources. When creating a source from streams in JSON, you need to define the schema of the source within the parentheses after the source name, and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
ROW FORMAT JSON
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
ROW FORMAT PROTOBUF 
MESSAGE 'main_message' 
ROW SCHEMA LOCATION [ 'location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ]
```

### Debezium JSON

When creating a source from streams in Debezium JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
ROW FORMAT DEBEZIUM_JSON
```

### Maxwell JSON

When creating a source from streams in Maxwell JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
ROW FORMAT MAXWELL
```

### Canal JSON

RisingWave supports the TiCDC dialect of the Canal CDC format. When creating a source from streams in TiCDC, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
ROW FORMAT CANAL_JSON
```

### Upsert JSON

When consuming data in JSON from Kafka topics, the data format needs to be specified as `UPSERT_JSON`. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

Syntax:

```sql
ROW FORMAT UPSERT_JSON
```

### Upsert AVRO

When consuming data in Avro from Kafka topics, the data format needs to be specified as `UPSERT_AVRO`. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

Syntax:

```sql
ROW FORMAT UPSERT_AVRO
```
