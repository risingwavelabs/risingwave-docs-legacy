---
id: sink-to-cockroach
title: Sink data from RisingWave to CockroachDB
description: Sink data from RisingWave to CockroachDB.
slug: /sink-to-cockroach 
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-cockroach/" />
</head>

CockroachDB is a distributed SQL database system developed by Cockroach Labs that is designed for scalability and resilience. Since CockroachDB is compatible with PostgreSQL, you can sink data from RisingWave to CockroachDB using the JDBC sink connector. 

You can test out this process on your own device by using the `cockroach-sink` demo in the [`integration_test directory`](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) of the RisingWave repository.

## Prerequisites

- Ensure you already have a CockroachDB table that you can access and sink data to.
  For additional guidance on setting up CockroachDB, refer to this [quick start guide](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart).

- Ensure you have an upstream materialized view or source that you can sink data from.

- If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure you have [JDK 11](https://openjdk.org/projects/jdk/11/) or a later version installed in your environment.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='jdbc',
   connector_parameter = 'value', ...
);
```

## Parameters

All `WITH` options are required unless noted.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified. See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type must be `'jdbc'` for CockroachDB sink. |
|jdbc.url | The JDBC URL of the destination database necessary for the driver to recognize and connect to the database. |
|table.name | The table in the destination database you want to sink to. |
|type| Sink data type. Supported types:<ul><li> `append-only`: Sink data as INSERT operations.</li><li> `upsert`: Sink data as UPDATE and INSERT operations. </li></ul>|
|primary_key| Required if `type` is `upsert`. The primary key of the sink, which should match the primary key of the downstream table. |

## Examples

Assume that we have a materialized view, `mv1`, and we want to sink data from `mv1` to a table in CockroachDB called `target_count`. The following SQL query achieves this by creating a sink in RisingWave called `sink1`. 

```sql
CREATE SINK sink1
FROM mv1 
WITH (
  connector = 'jdbc',
  jdbc.url = 'jdbc:postgresql://cockroachdb:26257/defaultdb?user=root',
  table.name = 'target_count',
  type = 'upsert',
  primary_key = 'target_id'
);
```
