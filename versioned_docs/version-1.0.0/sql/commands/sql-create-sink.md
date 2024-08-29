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
   connector='connector_name',
   connector_parameter = 'value', ...
);
```


## Supported sinks

Click a sink name to see the SQL syntax, options, and sample statement of sinking data from RisingWave to the sink.

 * [Kafka](/guides/create-sink-kafka.md) (Supports versions 3.1.0 or later)
 * JDBC-available databases
   * [MySQL](/guides/sink-to-mysql.md) (Supports versions 5.7 and 8.0.x)
   * [PostgreSQL](/guides/sink-to-postgres.md)
   * [TiDB](/guides/sink-to-tidb.md)
 * [Apache Iceberg](/guides/sink-to-iceberg.md)


## See also

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

[`SHOW CREATE SINK`](sql-show-create-sink.md) — Show the SQL statement used to create a sink.


:::note

Timestamptz values are stored in UTC.

When sinking downstream, timestamptz is represented as a string in the format `2023-11-11 18:30:09.453000`.

:::