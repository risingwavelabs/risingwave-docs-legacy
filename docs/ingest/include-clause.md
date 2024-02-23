---
id: include-clause
title: `INCLUDE` clause
description: Use the `INCLUDE` clause when creating a table or source to ingest fields not included in the payload.
slug: /include-clause
---

This topic describes how to use the `INCLUDE` clause when creating a table or source with an external connector to extract fields not included in the payload as separate columns. The payload refers to the actual content or information carried by a message, event, or record, defined in the schema when creating a source or table.

## Syntax

To add additional columns, use the `INCLUDE` clause.

```sql
INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]
```

If `<column_name>` is not specified, a default one will be generated in the format `_rw_{connector}_{col}`, where `connector` is the name of the source connector used (Kafka, Pulsar, Kinesis, etc.), and `col` is the type of column being generated (key, offset, timestamp, etc.). For instance, if an offset column is added to a Kafka source, the default column name would be `_rw_kafka_offset`.

This clause should be included in your `CREATE SOURCE` or `CREATE TABLE` command after the schema is defined.

```sql
CREATE { SOURCE | TABLE } name [(
    schema_definition )]
[INCLUDE ... [AS ...]]
WITH ( ... )
FORMAT data_format ENCODE data_encode (
    ...
);
```

## Supported connectors

The `INCLUDE` clause can be used with the following source connectors.

### Kafka

When ingesting data from Kafka, the following additional fields can be included.

| Allowed Components | Default Type                               | Note                                              |
|--------------------|--------------------------------------------|---------------------------------------------------|
| key                | `bytea`                                    | Can be overwritten by `ENCODE` and `KEY ENCODE`.  |
| timestamp          | `timestamp with time zone` (i64 in millis) | Refer to `CreateTime` rather than `LogAppendTime`.|
| partition          | `varchar`                                  | The partition the message is from.                |
| offset             | `varchar`                                  | The offset in the partition.                      |
| headers            | `struct<varchar, bytea>[]`                 | Key-value pairs along with the message.           |

In the case of headers, there are two ways to define it.

You can choose to generate headers with type `List[Struct<Varchar, Bytea>]`, which can be difficult to interpret in SQL.

```sql
INCLUDE header [AS kafka_header]
```

Or you can generate a type `bytea` header, where the column content will be specified as the value associated with the specified key, `header_col`. In this case, the generated column name will have the format `_rw_kafka_header_{header col name}_{col type}`, where `col type` is the data type of the header column.

```sql
INCLUDE header 'header_col' [AS kafka_header]
```

### Kinesis

When ingesting data from Kinesis, here are some things to note when including the following fields.

| Allowed Components | Default Type                             | Note                                                                             |
|--------------------|------------------------------------------|----------------------------------------------------------------------------------|
| key                | `bytea`                                  | Can be overwritten by `encode` and `key encode`.                                 |
| timestamp          | `timestamp with time zone`               | See the `approximate_arrival_timestamp` field at [Struct aws_sdk_kinesis::types::Record](https://docs.rs/aws-sdk-kinesis/latest/aws_sdk_kinesis/types/struct.Record.html).                                  |
| partition          | `varchar`                                | The partition the message is from.                                               |
| offset             | `varchar`                                | The offset in the partition, which corresponds to Kinesis sequence numbers.      |

For more components, see [Struct aws_sdk_kinesis::types::Record](https://docs.rs/aws-sdk-kinesis/latest/aws_sdk_kinesis/types/struct.Record.html).

### Pulsar

When ingesting data from Pulsar, here are some things to note when including the following fields.

| Allowed Components | Default Type | Note                                                                                      |
|--------------------|--------------|-------------------------------------------------------------------------------------------|
| key                | `bytea`      | Can be overwritten by `ENCODE` and `KEY ENCODE`.                                          |
| partition          | `varchar`    | The partition the message is from.                                                        |
| offset             | `varchar`    | The offset in the partition.                                                              |

For more components, see [Struct pulsar::message::proto::MessageMetadata](https://docs.rs/pulsar/latest/pulsar/message/proto/struct.MessageMetadata.html).

### S3 and GCS

When ingesting data from AWS S3 or GCS, the following additional fields can be included.

| Allowed Components | Default Type | Note                              |
|--------------------|--------------|-----------------------------------|
| file               | `varchar`    | The file the record is from.      |
| offset             | `varchar`    | The offset in the file.           |

## Examples

Here we create a table, `additional_columns`, that ingests data from a Kafka broker. Aside from the `a` column, which is part of the message payload, the additional fields `key`, `partition`, `offset`, `timestamp`, and `header`, are also added to the table.

```sql
CREATE TABLE additional_columns (
  a int 
)
INCLUDE key AS key_col
INCLUDE partition AS partition_col
INCLUDE offset AS offset_col
INCLUDE timestamp AS timestamp_col
INCLUDE header AS header_col
WITH (
	connector = 'kafka',
  properties.bootstrap.server = 'message_queue:29092',
	topic = 'kafka_additional_columns')
FORMAT PLAIN ENCODE JSON;
```