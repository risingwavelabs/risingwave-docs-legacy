---
id: format-and-encode-parameters
title: FORMAT and ENCODE parameters
slug: /formats-and-encode-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/formats-and-encode-parameters/" />
</head>

When creating a source or table using a connector, you need to specify the `FORMAT` and `ENCODE` section of the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) or [`CREATE TABLE`](/sql/commands/sql-create-source.md) statement. This topic provides an overview of the formats and encoding options.

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

Below is a table of all possible combinations of `FORMAT` and `ENCODE`. Not all sources support all combinations.
For what combinations are supported by a source, consult its individual page.

## `FORMAT`

The `FORMAT` parameter is about how RisingWave recognize `INSERT`/`UPDATE`/`DELETE` operations from the upstream.


### `PLAIN`

No specific data format. The key part of a message is ignored. The value part will be decoded as a new (i.e. `INSERT`) row according to the `ENCODE` specified.
This is sometimes known as append-only.

This is the only `FORMAT` that can be used with both `CREATE SOURCE` and `CREATE TABLE`. All `FORMAT`s below require `CREATE TABLE`.

### `UPSERT`

The key part of a message will be treated as primary key and overwrite (`UPDATE` or `INSERT`, hence the name) previous rows with the same key in RisingWave. An empty value part would be treated as a `DELETE` operation for the corresponding key. A nonempty value part will be decoded according to the `ENCODE` specified.

To ensure UPSERT correctness, data in UPSERT format from the message queue can only be imported into RisingWave using `CREATE TABLE`.

### `DEBEZIUM`

A popular Change Data Capture (CDC) format. Both key and value part will be processed based on [Debezium](https://debezium.io/)'s convention.

To ensure CDC correctness, data in CDC format from the message queue can only be imported into RisingWave using `CREATE TABLE`.

### `DEBEZIUM_MONGO`

Similar to `DEBEZIUM` but the format details are slightly different when upstream is MongoDB.

### `MAXWELL`

Another Change Data Capture (CDC) format.

### `CANAL`

Another Change Data Capture (CDC) format.

## `ENCODE`

The `ENCODE` parameter is about how RisingWave recognize columns of different data types from the encoded bytes.

### `JSON`

The simpliest form is to define the source or table columns in SQL:
```sql
CREATE SOURCE my_events (
  event_id   int,
  name       varchar,
  started_at timestamptz)
WITH (...)
FORMAT PLAIN ENCODE JSON;
```

Caveats:
* SQL identifiers are folded to lowercase by default. If your field names in JSON use camelCase, you need to double quote them in SQL as in `"startedAt" timestamptz`.
* Fields in SQL but not in JSON would be filled as `NULL`, with a warning message produced by the compute node.
* Fields in JSON but not in SQL would be ignored.

Acceptable Data Type Mappings:
|JSON  |example JSON value      |RisingWave                  |
|-     |-                       |-                           |
|bool  |`true`                  |bool                        |
|number|`17`                    |smallint                    |
|number|`17`                    |int                         |
|string|`"9007199254740992"`    |bigint                      |
|string|`"0.3"`                 |decimal                     |
|number|`17.5`                  |real                        |
|number|`17.5`                  |double                      |
|string|`"foo"`                 |varchar                     |
|array |`[17, 19, 22]`          |`int[]`                     |
|object|`{"sub":...,"Foo":...}` |`struct<sub ..., "Foo" ...>`|
|any   |`[19, true, {"a":"b"}]` |jsonb                       |
|string|`"\\xdeadbeef"`         |bytea                       |
|string|`"2006-01-02T22:03:04Z"`|timestamptz                 |
|string|`"2006-01-02 15:03:04"` |timestamp                   |
|string|`"2006-01-02"`          |date                        |
|string|`"15:04:05"`            |time                        |
|string|`"P3Y6M4DT12H30M5S"`    |interval                    |

Note this is only the recommended setup rather than all tolerated cases. Just to name a few of them:
* `number` to `bigint`: integers larger than `9007199254740991` can be lossy in JSON.
* `string` to `double`: for `"NaN"`/`"-Infinity"` because they are not valid JSON `number`s.
* `number` to `timestamptz`: see `timestamptz.handling.mode` below.

Parameters accepted when using this encoding:
| `timestamptz.handling.mode`                        | Optional. When absent, accept `string` with timezone suffix (commonly `Z`) as shown above.          |
| `timestamptz.handling.mode = 'micro'`              | Interpret the input `number` as microseconds since `1970-01-01 00:00:00 UTC`.                       |
| `timestamptz.handling.mode = 'milli'`              | Interpret the input `number` as milliseconds since `1970-01-01 00:00:00 UTC`.                       |
| `timestamptz.handling.mode = 'utc_without_suffix'` | Accept `string` format `"2006-01-02 22:03:04"` without timezone suffix `Z` and assume it is in UTC. |

Additional note:

If an input field is double-encoded like the following:
```json
{
  "event_id": 483,
  "name": "foo",
  "detail": "{\"user\":\"rwc\",\"level\":7}"
}
```
The `detail` field shall not be ingested as `struct` or `jsonb`. Ingest it as `varchar` and do another JSON parsing before using it:
```sql
  detail::jsonb ->> 'rwc'
```

Similarly, if a conversion from `number`/`string` to your desired data type is not listed above, it is always possible to ingest `int`/`varchar` first
and do custom conversion within SQL:
```
  date_as_int + date '1970-01-01'     -- to convert from int (days since 1970) to date
  to_date(date_as_str, 'DD Mon YYYY') -- to convert from string "05 Dec 2000" to date
  decode(bytes_as_str, 'base64')      -- to convert from string "MTIzAAE=" to bytea
```

### `AVRO`

This option has to be used with schema registry, so that messages written with different writer schemas can be resolved to the provided reader schema.
Also because the reader schema is already provided, the SQL column names and data types will be derived from it.
```sql
CREATE SOURCE my_events WITH (...)
FORMAT PLAIN ENCODE AVRO (
  schema.registry = 'http://127.0.0.1:8081',
  schema.registry.username = 'foo',
  schema.registry.password = 'bar');
```

Column data types will be derived from avro data types as follows:
|Avro                  |example schema                                                               |RisingWave                   |
|-                     |-                                                                            |-                            |
|bool                  |`"bool"`                                                                     |bool                         |
|N/A                   |N/A                                                                          |smallint                     |
|int                   |`"int"`                                                                      |int                          |
|long                  |`"long"`                                                                     |bigint                       |
|decimal               |`{"type":"bytes","logicalType":"decimal","precision":...}`                   |decimal                      |
|float                 |`"float"`                                                                    |real                         |
|double                |`"double"`                                                                   |double                       |
|string                |`"string"`                                                                   |varchar                      |
|bytes                 |`"bytes"`                                                                    |bytea                        |
|record                |`{"type":"record","name":"Ignored","fields":[{"name":"sub","type":...},...]}`|`struct<sub ..., second ...>`|
|array                 |`{"type":"array","items":"int"}`                                             |`int[]`                      |
|union                 |`["null", T]`                                                                |T                            |
|union                 |`["null", A, B]`                                                             |N/A                          |
|map                   |`{"type":"map","values":"int"}`                                              |jsonb                        |
|fixed                 |`{"type":"fixed","name":"Ignored","size":12}`                                |bytea                        |
|enum                  |`{"type":"enum","name":"Ignored","symbols":["Red","Yellow","Green"]}`        |varchar                      |
|uuid                  |`{"type":"string","logicalType":"uuid"}`                                     |varchar                      |
|timestamp-micros      |`{"type":"long","logicalType":"timestamp-micros"}`                           |timestamptz                  |
|timestamp-millis      |`{"type":"long","logicalType":"timestamp-millis"}`                           |timestamptz                  |
|local-timestamp-micros|`{"type":"long","logicalType":"local-timestamp-micros"}`                     |timestamp                    |
|local-timestamp-millis|`{"type":"long","logicalType":"local-timestamp-millis"}`                     |timestamp                    |
|date                  |`{"type":"int","logicalType":"date"}`                                        |date                         |
|time-micros           |`{"type":"long","logicalType":"time-micros"}`                                |time                         |
|time-millis           |`{"type":"int","logicalType":"time-millis"}`                                 |time                         |
|duration              |`{"type":"fixed","name":"Ignored","size":12,"logicalType":"duration"}`       |interval                     |

Caveats:`
* SQL identifiers are folded to lowercase by default. If your field names in Avro use camelCase, you need to double quote them in SQL.
  For example `select ("structField")."innerField" from t;`.
* Support of `map` is currently limited. See `map.handling.mode` below.

Parameters accepted when using this encoding:
| `schema.registry` ||
| `schema.registry.username` ||
| `schema.registry.password` ||
| `schema.registry.name.strategy = 'topic_name_strategy'`        | Optional and the default. |
| `schema.registry.name.strategy = 'record_name_strategy'`       |  |
| `schema.registry.name.strategy = 'topic_record_name_strategy'` |  |
| `message` |  |
| `key.message` |  |
| `map.handling.mode = 'jsonb'`        | Optionally enables a workaround. |

### `PROTOBUF`

There are two ways to provide the protobuf definition: via schema registry, or a precompiled descriptor set file.
The SQL column names and data types will be derived in both cases.

To use schema registry:
```sql
CREATE SOURCE my_events WITH (...)
FORMAT PLAIN ENCODE PROTOBUF (
  message = 'com.example.MyMessage',
  schema.registry = 'http://127.0.0.1:8081',
  schema.registry.username = 'foo',
  schema.registry.password = 'bar');
```

To use a precompiled descriptor set file:
```bash
protoc -I=$include_path --include_imports --descriptor_set_out=schema_desc.binpb schema.proto
```
Then
```sql
CREATE SOURCE my_events WITH (...)
FORMAT PLAIN ENCODE PROTOBUF (
  message = 'com.example.MyMessage',
  schema.location = 'http://127.0.0.1:8000/path/to/schema_desc.binpb');
```

Column data types will be derived from protobuf data types as follows:
|Protobuf                   |example field definition                                                     |RisingWave                         |
|-                          |-                                                                            |-                                  |
|bool                       |`bool`                                                                       |bool                               |
|N/A                        |N/A                                                                          |smallint                           |
|int32/sint32/sfixed32      |`int32`                                                                      |int                                |
|uint32/fixed32             |`uint32`                                                                     |bigint                             |
|int64/sint64/sfixed64      |`int64`                                                                      |bigint                             |
|uint64/fixed64             |`uint64`                                                                     |decimal                            |
|N/A                        |N/A                                                                          |decimal                            |
|float                      |`float`                                                                      |real                               |
|double                     |`double`                                                                     |double                             |
|string                     |`string`                                                                     |varchar                            |
|bytes                      |`bytes`                                                                      |bytea                              |
|message                    |`Inner` with `message Inner { A sub = 1; B second = 2; }`                    |`struct<sub A, second B>`          |
|repeated                   |`repeated int`                                                               |`int[]`                            |
|map                        |`map<string, Project>`                                                       |N/A                                |
|enum                       |`Corpus` with `enum Corpus { CORPUS_UNSPECIFIED = 0; CORPUS_UNIVERSAL = 1; }`|varchar                            |
|N/A                        |N/A                                                                          |timestamptz                        |
|N/A                        |N/A                                                                          |timestamp                          |
|N/A                        |N/A                                                                          |date                               |
|N/A                        |N/A                                                                          |time                               |
|N/A                        |N/A                                                                          |interval                           |
|google.protobuf.Timestamp  |`google.protobuf.Timestamp`                                                  |`struct<seconds bigint, nanos int>`|
|google.protobuf.Duration   |`google.protobuf.Duration`                                                   |`struct<seconds bigint, nanos int>`|
|google.protobuf.Int32Value |`google.protobuf.Int32Value`                                                 |`struct<value int>`                |
|google.protobuf.StringValue|`google.protobuf.StringValue`                                                |`struct<value varchar>`            |
|google.protobuf.Any        |`google.protobuf.Any`                                                        |                                   |
|google.protobuf.Value      |`google.protobuf.Value`                                                      |N/A                                |
|google.protobuf.Struct     |`google.protobuf.Struct`                                                     |N/A                                |
|google.protobuf.ListValue  |`google.protobuf.ListValue`                                                  |N/A                                |

Fields within `oneof` are flattened out as if they were not wrapped


### `CSV`

### `BYTES`


