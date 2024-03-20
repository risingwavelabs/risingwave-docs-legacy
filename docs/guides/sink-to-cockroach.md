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

## Syntax and Parameters

Since CockroachDB is PostgreSQL-compatible, the syntax and parameters are the same as creating a PostgreSQL sink. For the syntax and parameters, see [Create a sink](/guides/sink-to-postgres.md#create-a-sink​). 

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

## Data type mapping

| RisingWave Data Type | CockroachDB Data Type|
|--------------------- |--------------------- |
|boolean               | BOOL                 |
|smallint              | INT2                 |
|integer               | INT4                 |
|bigint                | INT                  |
|numeric               | DECIMAL              |
|real                  | REAL                 |
|double precision      | DOUBLE PRECISION     |
|varchar               | STRING               |
|bytea                 | BYTES                |
|date                  | DATE                 |
|time without time zone| TIME                 |
|timestamp without time zone| TIMESTAMP        |
|timestamp with time zone| TIMESTAMPTZ        |
|interval              | INTERVAL             |
|JSONB                 | JSONB                |
|array                 | ARRAY                |
|struct                | unsupported          |

:::note

Only one-dimensional arrays in RisingWave can be sinked to PostgreSQL.

For array type, we only support `smallint`, `integer`, `bigint`, `real`, `double precision`, and `varchar` type now.

:::
