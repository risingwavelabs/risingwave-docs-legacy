---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---

Sources are resources that RisingWave can read data from. Use `CREATE SOURCE` to establish the connection to a source. After a connection is established, RisingWave will be able to read data from the source.


## Supported sources

Click a connector name to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

| Connector | Version | Format | Materialized? | Limitations |
|---------|---------|---------|---------|---------|
|[Kafka](../create-source/create-source-kafka-redpanda.md)|3.1.0 or later versions	|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[Redpanda](../create-source/create-source-kafka-redpanda.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|Materialized & non-materialized| |
|[Pulsar](../create-source/create-source-pulsar.md)|	2.8.0 or later versions|[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[Kinesis](../create-source/create-source-kinesis.md)|	Latest|	[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|	Materialized & non-materialized| |
|[PostgreSQL CDC](../create-source/create-source-cdc.md)|	10, 11, 12, 13, 14|[Debezium JSON](#debezium-json)|	Materialized only|	Must have primary key|
|[MySQL CDC](../create-source/create-source-cdc.md)|	5.7, 8.0|[Debezium JSON](#debezium-json)|	Materialized only|	Must have primary key|
|[Load generator](../create-source/create-source-datagen.md)|Built-in|[JSON](#json)|Materialized only||

:::note
When the connection to a source is established, RisingWave does not ingest data immediately. Only after a materialized view is created based on the source, RisingWave starts to process data.
:::

## Supported formats

When creating a source, specify the format in the `ROW FORMAT` section of the `CREATE SOURCE` statement.

### Avro

For data in Avro format, you must specify a message and the schema. You can specify the schema by providing a Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Avro, instead of providing a schema location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](../create-source/create-source-kafka-redpanda.md#read-schemas-from-schema-registry).

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

For data in Protobuf format, you must specify a message and the schema. You can specify the schema by providing a Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in Protobuf, instead of providing a schema location, you can provide a Confluent Schema Regsitry that RisingWave can get the schema from.

If you specify the schema by providing a location, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

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

When creating a source from streams in Debezium JSON, you need to define the schema of the source within the parentheses after the source name, and specify the format in the `ROW FORMAT` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:
```sql
ROW FORMAT DEBEZIUM_JSON
```

