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

## Parameters

All Kafka WITH options are required if sinking to Kafka. `jdbc_url` and `table.name` options are required if sinking to a JDBC-available database.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified.See [SELECT](../commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type. Currently, only `‘kafka’` and `‘jdbc’` are supported. If there is a particular sink you are interested in, see the [Integrations Overview](../../rw-integration-summary.md) page for a full list of connectors and integrations we are working on. |
|properties.bootstrap.server|Address of the Kafka broker. Format: `‘ip:port’`. If there are multiple brokers, separate them with commas. |
|topic|Address of the Kafka topic. One sink can only correspond to one topic.|
|jdbc.url| The JDBC URL of the destination database necessary for the driver to recognize and connect to the database.|
|table.name| The table in the destination database you want to sink to.|
|format|Data format. Allowed formats:<ul><li> `append_only`: Output data with insert operations.</li><li> `debezium`: Output change data capture (CDC) log in Debezium format.</li></ul>|
|force_append_only| If `true`, forces the sink to be `append_only`, even if it cannot be.| 

## Supported sinks




## See also

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

