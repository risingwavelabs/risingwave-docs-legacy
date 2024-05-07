---
 id: sink-to-redis
 title: Sink data from RisingWave to Redis
 description: Sink data from RisingWave to Redis.
 slug: /sink-to-redis
---

This guide describes how to sink data from RisingWave to Redis.

[Redis](https://redis.io) is an open-source, in-memory data structure store, often referred to as a data structure server. RisingWave sinks data to Redis in the form of strings storing key-value pairs in the specified format (`JSON` or `TEMPLATE`), so a primary key must always be provided.

You can test out this process on your own device by using the `redis-sink` demo in the [`integration_test directory`](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) of the RisingWave repository.

## Prerequisites

Before sinking data from RisingWave to Redis, please ensure the following:

- The Redis database you want to sink to is accessible from RisingWave.
- Ensure you have an upstream materialized view or source in RisingWave that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='redis',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode [ (
    format_parameter = 'value' ) ]
;
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
|redis.url | Required. The address of the Redis database. |
|primary_key| Required. The primary keys of the sink. If necessary, use ',' to delimit the primary key columns. |

## Sink parameters

| Field | Notes |
| --------------- | ---------------------------------------------------------------------- |
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `UPSERT`: Output data as a changelog stream. </li></ul>|
|data_encode| Data encoding. Supported encodings:  <ul><li>`JSON`:<ul><li>`date`: number of days since the Common Era (CE).</li></ul><ul><li>`interval`: `P<years>Y<months>M<days>DT<hours>H<minutes>M<seconds>S` format string.</li></ul><ul><li>`time without time zone`: number of milliseconds past the last midnight.</li></ul><ul><li>`timestamp`: number of milliseconds since the Epoch.</li></ul></li><li>`TEMPLATE`: converts data to the string specified by `key_format`/`value_format`.</li></ul> |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|
|key_format| Required if `data_encode` is `TEMPLATE`. Specify the format for the key as a string. |
|value_format| Required if `data_encode` is `TEMPLATE`. Specify the format for the value as a string. |

## Example

Assume we create a materialized view, `bhv_mv`, from a source.

```sql
CREATE MATERIALIZED VIEW bhv_mv AS
SELECT
    user_id,
    target_id,
    event_timestamp
FROM
    source_1;
```

We can sink data from `bhv_mv` to Redis by creating a sink. Here, `data_encode` is `JSON`.

```sql
CREATE SINK redis_sink
FROM bhv_mv WITH (
    connector = 'redis',
    primary_key = 'user_id',
    redis.url= 'redis://127.0.0.1:6379/'
) FORMAT PLAIN ENCODE JSON (
    force_append_only='true'
);
```

We can sink data from `bhv_mv` to Redis by creating a sink. Here, `data_encode` is `TEMPLATE`, so `key_format` and `value_format` must be defined.

```sql
CREATE SINK redis_sink_2
FROM bhv_mv WITH (
    primary_key = 'user_id',
    connector = 'redis',
    redis.url= 'redis://127.0.0.1:6379/',
) FORMAT PLAIN ENCODE TEMPLATE (
    force_append_only='true',
    key_format = 'UserID:{user_id}',
    value_format = 'TargetID:{target_id},EventTimestamp{event_timestamp}'
);
```
