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
|[Kafka](/ingest/ingest-from-kafka.md)|3.1.0 or later versions |[Avro](#avro), [JSON](#json), [protobuf](#protobuf), [Debezium JSON](#debezium-json) (T), [Debezium AVRO](#debezium-avro) (T), [DEBEZIUM_MONGO_JSON](#debezium-mongo-json) (T), [Maxwell JSON](#maxwell-json) (T), [Canal JSON](#canal-json) (T), [Upsert JSON](#upsert-json), [Upsert AVRO](#upsert-avro), [Bytes](#bytes)|
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


