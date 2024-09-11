---
id: supported-sources-and-formats
title: Supported sources and formats
slug: /supported-sources-and-formats
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/supported-sources-and-formats/" />
</head>

## Supported sources

Below is the complete list of connectors supported by RisingWave. Click a connector name to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

:::note

To ingest data in formats marked with "T", you need to create tables (with connector settings). Otherwise, you can create either sources or tables (with connector settings).

:::

| Connector | Version | Format |
|---------|---------|---------|
|[Kafka](/ingest/ingest-from-kafka.md)|3.1.0 or later versions |[Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (T), [Debezium AVRO](#debezium-avro) (T), [DEBEZIUM_MONGO_JSON](#debezium-mongo-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T), [Upsert JSON](#upsert-json) (T), [Upsert AVRO](#upsert-avro) (T), [Bytes](#bytes)|
|[Redpanda](/ingest/ingest-from-redpanda.md)|Latest|[Avro](#avro), [JSON](#json), [protobuf](#protobuf) |
|[Pulsar](/ingest/ingest-from-pulsar.md)| 2.8.0 or later versions|[Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T)|
|[Astra Streaming](/guides/connector-astra-streaming.md)|Latest |[Avro](#avro), [JSON](#json), [protobuf](#protobuf)|  
|[Kinesis](/ingest/ingest-from-kinesis.md)| Latest| [Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T)|
|[PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md)| 10, 11, 12, 13, 14|[Debezium JSON](#debezium-json) (T)|
|[MySQL CDC](/guides/ingest-from-mysql-cdc.md)| 5.7, 8.0|[Debezium JSON](#debezium-json) (T)|
|[CDC via Kafka](/ingest/ingest-from-cdc.md)||[Debezium JSON](#debezium-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T)|
|[Amazon S3](/ingest/ingest-from-s3.md)| Latest |[JSON](#json), CSV| |
|[Load generator](/ingest/ingest-from-datagen.md)|Built-in|[JSON](#json)|
|[Google Pub/Sub](/ingest/ingest-from-google-pubsub.md) | | [Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T) |
|[Google Cloud Storage](/ingest/ingest-from-gcs.md) | [JSON](#json)|

:::note
When a source is created, RisingWave does not ingest data immediately. RisingWave starts to process data when a materialized view is created based on the source.
:::

## Supported formats

When creating a source, you need to specify the data and encoding formats in the `FORMAT` and `ENCODE` section of the `CREATE SOURCE` or `CREATE TABLE` statement. Below is the complete list of the supported formats in RisingWave.

### Avro

For data in Avro format, you must specify a message and a schema registry. For Kafka data in Avro, you need to provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-schema-registry).

`schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Optionally, you can define a `schema.registry.name.strategy` if `schema.registry` is set. Accepted options include `topic_name_strategy`, `record_name_strategy`, and `topic_record_name_strategy`. If either `record_name_strategy` or `topic_record_name_strategy` is used, the `key.message` field must also be defined. For additional details on name strategy, see [Subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#subject-name-strategy).

:::info Public Preview
`schema.registry.name.strategy` is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

Note that the timestamp displayed in RisingWave may be different from the upstream system as timezone information is lost in Avro serialization.

:::info

For Avro data, you cannot specify the schema in the `schema_definition` section of a `CREATE SOURCE` or `CREATE TABLE` statement.

:::

Syntax:

```sql
FORMAT PLAIN
ENCODE AVRO (
   message = 'main_message',
   schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.name.strategy = 'topic_name_strategy'],
   [key.message = 'test_key']
)
```

In addition, you can use the option `map.handling.mode` to ingest AVRO map type into JSONB. For example:

```sql
FORMAT [ DEBEZIUM | UPSERT | PLAIN ] ENCODE AVRO (
	map.handling.mode = 'jsonb'
)
```

Note that the value types can only be: `null`, `boolean`, `int`, `string`, or `map`/`record`/`array` with these types.

### Debezium AVRO

When creating a source from streams in with Debezium AVRO, the schema of the source does not need to be defined in the `CREATE TABLE` statement as it can be inferred from the `SCHEMA REGISTRY`. This means that the schema file location must be specified. The schema file location can be an actual Web location, which is in `http://...`, `https://...`, or `S3://...` format, or a Confluent Schema Registry. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-schema-registry).

`schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Optionally, you can define a `schema.registry.name.strategy` if `schema.registry` is set. Accepted options include `topic_name_strategy`, `record_name_strategy`, and `topic_record_name_strategy`. If either `record_name_strategy` or `topic_record_name_strategy` is used, the `key.message` field must also be defined. For additional details on name strategy, see the [Subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#subject-name-strategy) in the Confluent documentation.

`ignore_key` can be used to ignore the key part of given messages. By default, it is `false`. If set to `true`, only the payload part of the message will be consumed. In this case, the payload must not be empty and tombstone messages cannot be handled.

:::info Public Preview
`schema.registry.name.strategy` is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::



Syntax:

```sql
FORMAT DEBEZIUM
ENCODE AVRO (
   message = 'main_message',
   schema.location = 'location' | schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.name.strategy = 'topic_name_strategy'],
   [key.message = 'test_key'],
   [ignore_key = 'true | false']
)
```

### Upsert AVRO

When consuming data in AVRO from Kafka topics, the `FORMAT` and `ENCODE` sections need to be specified as `UPSERT` and `AVRO` respectively. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

`schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Optionally, you can define a `schema.registry.name.strategy` if `schema.registry` is set. Accepted options include `topic_name_strategy`, `record_name_strategy`, and `topic_record_name_strategy`. If either `record_name_strategy` or `topic_record_name_strategy` is used, the `key.message` field must also be defined. For additional details on name strategy, see [Subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#subject-name-strategy).

:::info Public Preview
`schema.registry.name.strategy` is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

Syntax:

```sql
FORMAT UPSERT
ENCODE AVRO (
   message = 'main_message',
   schema.location = 'location' | schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.name.strategy = 'topic_name_strategy'],
   [key.message = 'test_key']
)
```

### JSON

RisingWave decodes JSON directly from external sources. When creating a source from streams in JSON, you can define the schema of the source within the parentheses after the source name or specify a `schema.registry`. Specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

`schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Syntax:

```sql
FORMAT PLAIN 
ENCODE JSON [ (
   schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.username = 'username'],
   [schema.registry.password = 'password']
   ) ]
```

### Canal JSON

RisingWave supports the TiCDC dialect of the Canal CDC format. When creating a source from streams in TiCDC, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` section. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
FORMAT CANAL
ENCODE JSON
```

### Debezium JSON

When creating a source from streams in Debezium JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Note that if you are ingesting data of type `timestamp` or `timestamptz` in RisingWave, the upstream value must be in the range of `[1973-03-03 09:46:40, 5138-11-16 09:46:40] (UTC)`. The value may be parsed and ingested incorrectly without warning.

`ignore_key` can be used to ignore the key part of given messages. By default, it is `false`. If set to `true`, only the payload part of the message will be consumed. In this case, the payload must not be empty and tombstone messages cannot be handled.

Syntax:

```sql
FORMAT DEBEZIUM
ENCODE JSON [ (
   [ ignore_key = 'true | false ' ]
) ]
```

### Debezium Mongo JSON

When loading data from MongoDB via Kafka topics in Debezium Mongo JSON format, the source table schema has a few limitations. The table schema must have the columns `_id` and `payload`, where `_id` comes from the MongoDB document's `id` and is the primary key, and `payload` is type `jsonb` and contains the rest of the document. If the document's `_id` is type `ObjectID`, then when creating the column in RisingWave, specify the type of `_id` as `varchar`. If the document's `_id` is of type `int32` or `int64`, specify the type of `_id` as `int` or `bigint` in RisingWave.

Syntax:

```sql
FORMAT DEBEZIUM_MONGO
ENCODE JSON
```

### Maxwell JSON

When creating a source from streams in Maxwell JSON, you can define the schema of the source within the parentheses after the source name (`schema_definition` in the syntax), and specify the data and encoding formats in the `FORMAT` and `ENCODE` sections. You can directly reference data fields in the JSON payload by their names as column names in the schema.

Syntax:

```sql
FORMAT MAXWELL
ENCODE JSON
```

### Upsert JSON

When consuming data in JSON from Kafka topics, the `FORMAT` and `ENCODE` sections need to be specified as `UPSERT` and `JSON` respectively. RisingWave will be aware that the source message contains key fields as primary columns, as well as the Kafka message value field. If the value field of the message is not null, the row will be updated if the message key is not empty and already exists in the database table, or inserted if the message key is not empty but does not exist yet in the database table. If the value field is null, the row will be deleted.

You can define the schema of the source within the parentheses after the source name or specify a `schema.registry`. `schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Syntax:

```sql
FORMAT UPSERT
ENCODE JSON [ (
   schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.username = 'username'],
   [schema.registry.password = 'password']
   ) ]
```

### Protobuf

For data in protobuf format, you must specify a message (fully qualified by package path) and a schema location. The schema location can be an actual Web location that is in `http://...`, `https://...`, or `S3://...` format. For Kafka data in protobuf, instead of providing a schema location, you can provide a Confluent Schema Registry that RisingWave can get the schema from. For more details about using Schema Registry for Kafka data, see [Read schema from Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-schema-registry).

`schema.registry` can accept multiple addresses. RisingWave will send requests to all URLs and return the first successful result.

Optionally, you can define a `schema.registry.name.strategy` if `schema.registry` is set. Accepted options include `topic_name_strategy`, `record_name_strategy`, and `topic_record_name_strategy`. If either `record_name_strategy` or `topic_record_name_strategy` is used, the `key.message` field must also be defined. For additional details on name strategy, see [Subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#subject-name-strategy).

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

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
   message = 'com.example.MyMessage',
   schema.location = 'location' | schema.registry = 'schema_registry_url [, ...]',
   [schema.registry.name.strategy = 'topic_name_strategy'],
   [key.message = 'test_key']
)
```

For more information on supported protobuf types, refer to [Supported protobuf types](/docs/sql/data-types/protobuf-types.md).

### Bytes

RisingWave allows you to read data streams without decoding the data by using the `BYTES` row format. However, the table or source can have exactly one field of `BYTEA` data.

```sql
FORMAT PLAIN
ENCODE BYTES
```

## General parameters for supported formats

Here are some notes regarding parameters that can be applied to multiple formats supported by our systems.

### `timestamptz.handling.mode`

The `timestamptz.handling.mode` parameter controls the input format for timestamptz values. It accepts the following values:

- `micro`: The input number will be interpreted as the number of microseconds since 1970-01-01T00:00:00Z in UTC.
- `milli`: The input number will be interpreted as the number of milliseconds since 1970-01-01T00:00:00Z in UTC.
- `guess_number_unit`: This has been the default setting and restricts the range of timestamptz values to [1973-03-03 09:46:40, 5138-11-16 09:46:40) in UTC.
- `utc_string`: This format is the least ambiguous and can usually be correctly inferred without needing explicit specification.
- `utc_without_suffix`: Allows the user to indicate that a naive timestamp is in UTC, rather than local time.

You can set this parameter when using the `format plain | upsert | debezium encode json` command, but not when using `format debezium_mongo | canal | maxwell encode json`.