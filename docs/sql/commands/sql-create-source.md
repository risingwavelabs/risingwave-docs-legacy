---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command. When creating a source, you can choose to persist the data from the source in RisingWave by adding `MATERIALIZED` in between `CREATE` and `SOURCE` (that is, `CREATE MATERIALIZED SOURCE`). 

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name 
[schema_definition]
WITH (
   connector='connector_name',
   field_name='value', ...
)
ROW FORMAT data_format 
[MESSAGE 'message']
[ROW SCHEMA LOCATION 'location'];
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

## Supported sources

Click a connector name to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

| Connector | Version | Format | Materialized? | Limitations |
|---------|---------|---------|---------|---------|
|[Kafka](/create-source/create-source-kafka.md)|3.1.0 or later versions	|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[Redpanda](/create-source/create-source-redpanda.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|Materialized & non-materialized| |
|[Pulsar](/create-source/create-source-pulsar.md)|	2.8.0 or later versions|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[Astra Streaming](/guides/connector-astra-streaming.md)|	|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[Kinesis](/create-source/create-source-kinesis.md)|	Latest|	[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[PostgreSQL CDC](/create-source/create-source-cdc.md)|	10, 11, 12, 13, 14|[Debezium JSON](#debezium-json), [Maxwell JSON](#maxwell-json)|	Materialized only|	Must have primary key|
|[MySQL CDC](/create-source/create-source-cdc.md)|	5.7, 8.0|[Debezium JSON](#debezium-json)|	Materialized only|	Must have primary key|
|[Load generator](/create-source/create-source-datagen.md)|Built-in|[JSON](#json)|Materialized only||

:::note
When a source is created, RisingWave does not ingest data immediately. RisingWave starts to process data when a materialized view is created based on the source.
:::

## Supported formats

When creating a source, specify the format in the `ROW FORMAT` section of the `CREATE SOURCE` or `CREATE MATERIALIZED SOURCE` statement.

### Avro

For data in Avro format, you must specify a message and a schema file location. The schema file location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Avro, instead of a schema file location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry). 

:::info

For Avro data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE MATERIALIZED SOURCE` statement.

:::

Syntax:
```sql
ROW FORMAT AVRO 
MESSAGE 'main_message' 
ROW SCHEMA LOCATION [ 'location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ]
```

### JSON

RisingWave decodes JSON directly from external sources. When creating a source from streams in JSON, you need to define the schema of the source within the parentheses after the source name, and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema. 

Syntax:
```sql
ROW FORMAT JSON
```


### Protobuf

For data in Protobuf format, you must specify a message and a schema location. The schema location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Protobuf, instead of providing a schema location, you can provide a Confluent Schema Regsitry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/create-source/create-source-kafka.md#read-schemas-from-schema-registry).

:::info

For protobuf data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE MATERIALIZED SOURCE`statement.

:::

If you provide a file location, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

```shell
protoc -I=$include_path --include_imports --descriptor_set_out=schema.pb schema.proto
```

Syntax:
```sql
ROW FORMAT AVRO 
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

When creating a source from streams in Maxwell JSON, you can define the schema of the source within the parentheses after the source name ((`schema_definition` in the syntax), and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:
```sql
ROW FORMAT MAXWELL
```
