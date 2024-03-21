---
id: format-and-encode-parameters
title: FORMAT and ENCODE parameters
slug: /formats-and-encode-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/formats-and-encode-parameters/" />
</head>

When creating a source or table using a connector, you need to specify the `FORMAT` and `ENCODE` section of the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) or [`CREATE TABLE`](/sql/commands/sql-create-source.md) statement. This topic provides an overview of the formats and encoding options. For the complete list of formats we support, see [Supported sources and formats](/ingest/supported-sources-and-formats.md)

```sql title="An example of creating a source"
CREATE SOURCE src_user WITH (
    connector = 'kafka',
    topic = 'sr_pb_test',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
)
FORMAT PLAIN ENCODE PROTOBUF(
    schema.registry = 'http://message_queue:8081',
    message = 'test.User');
```

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


:::note
Please make a distinction between the parameters set in FORMAT and ENCODE options and that set in the `WITH` clause. Set them in the right place and do not misuse them.
:::
