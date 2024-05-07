---
id: sql-create-sink
title: CREATE SINK
description: Create a sink.
slug: /sql-create-sink

---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-sink/" />
</head>

Use the `CREATE SINK` command to create a sink. A sink is an external target where you can send data processed in RisingWave. You can create a sink from a materialized source, a materialized view, or a table.



## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='kafka',
   properties.bootstrap.server='broker_address',
   topic='topic_address',
   format='format'
);
```

## Parameters

All `WITH` options are required.

|Parameter or clause| Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified.See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type. Currently, only `‘kafka’` is supported. If there is a particular sink you are interested in, go to the [Integrations Overview](rw-integration-summary.md) page to see the full list of connectors and integrations we are working on. |
|properties.bootstrap.server|Address of the Kafka broker. Format: `‘ip:port’`. If there are multiple brokers, separate them with commas. |
|topic|Address of the Kafka topic. One sink can only correspond to one topic.|
|format	| Data format. Allowed formats:<ul><li> `append_only`: Output data with insert operations.</li><li> `debezium`: Output change data capture (CDC) log in Debezium format.</li></ul>|

## Examples

Create a sink by selecting an entire materialized view.
```sql
CREATE SINK sink1 FROM mv1 
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test',
   format='append_only'
)
```

Create a sink by selecting the average `distance` and `duration` from `taxi_trips`.

The schema of `taxi_trips` is like this:
```sql
{
  "id": VARCHAR,
  "distance": DOUBLE PRECISION,
  "duration": DOUBLE PRECISION,
  "fare": DOUBLE PRECISION
}
```
The table may look like this:
```
 id | distance | duration |   city   
----+----------+----------+----------
  1 |       16 |       23 | Dallas
  2 |       23 |        9 | New York
  3 |        6 |       15 | Chicago
  4 |        9 |       35 | New York
```

```sql
CREATE SINK sink2 AS 
SELECT 
   avg(distance) as avg_distance, 
   avg(duration) as avg_duration 
FROM taxi_trips
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test',
   format='append_only'
)


```



:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::


## See also

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

