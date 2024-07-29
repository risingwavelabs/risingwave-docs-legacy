---
id: protobuf-types
slug: /protobuf-types
description: An overview of the supported protobuf types and their corresponding RisingWave types.
title: Supported protobuf types
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/protobuf-types/" />
</head>

RisingWave supports a variety of protobuf data types, which are converted to equivalent types in RisingWave. This page provides an overview of the supported protobuf types and their corresponding RisingWave types.

## Conversion

RisingWave converts [well-known types](https://protobuf.dev/reference/protobuf/google.protobuf/) from the protobuf library to specific types in RisingWave. The conversion is as follows:

Protobuf type | RisingWave type
-- | --
any | JSONB
double | double precision
float | real
int32 | int
int64 | bigint
uint32 | bigint
uint64 | decimal
sint32 | int
sint64 | bigint
fixed32 | bigint
fixed64 | decimal
sfixed32 | int
sfixed64 | bigint
bool | boolean
string | varchar
bytes | bytea
enum | varchar
message | struct. See details in [Nested messages](#nested-messages).
repeated | array
map | Not supported
google.protobuf.Struct | Not supported
google.protobuf.Timestamp | `struct<seconds bigint, nanos int>`
google.protobuf.Duration | `struct<seconds bigint, nanos int>`
google.protobuf.Any | `struct<type_url varchar, value bytea>`
google.protobuf.Int32Value | `struct<value int>`
google.protobuf.StringValue | `struct<value varchar>`

### Nested messages

The nested fields are transformed into columns within a struct type. For example, a Protobuf message with the following structure:

```
message NestedMessage {
  int32 id = 1;
  string name = 2;
}
```

Will be converted to `struct<id int, name varchar>` in RisingWave.

## Related topics

- [CREATE SOURCE](/docs/sql/commands/sql-create-source.md)