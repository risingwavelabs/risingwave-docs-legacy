---
id: sql-create-sink
title: CREATE SINK
description: Create a sink.
slug: /sql-create-sink
---

Use the `CREATE SINK` command to create a sink. A sink is an external target where you can send data processed in RisingWave. You can create a sink from a materialized source, a materialized view, or a table.


## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='connector_name',
   field_nake = 'value', ...
);
```

## Supported sinks

Click a sink name to see the SQL syntax, options, and sample statement of sinking data from RisingWave to the sink.

 * [Kafka](../../guides/create-sink-kafka.md) (3.1.0 or later versions)
 * JDBC-available databases
   * MySQL
   * PostgreSQL


## See also

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

