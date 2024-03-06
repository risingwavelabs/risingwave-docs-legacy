---
id: formats-and-encoding
title: Formats and encoding
slug: /formats-and-encoding
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/formats-and-encoding/" />
</head>

When creating a source, you need to specify the data and encoding formats in the `FORMAT` and `ENCODE` section of the `CREATE SOURCE` or `CREATE TABLE` statement. This topic gives an introfuction to the `FORMAT` and `ENCODE` parameters. For the complete list of formats we support, see [Supported sources and formats](/ingest/supported-sources-and-formats.md)

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