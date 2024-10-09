---
id: sql-create-sink
title: CREATE SINK
description: Create a sink.
slug: /sql-create-sink
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-sink/" />
</head>

Use the `CREATE SINK` command to create a sink. A sink is an external target where you can send data processed in RisingWave. You can create a sink from a table or a materialized view.

If your goal is to create an append-only sink, you can use the emit-on-window-close policy when creating the materialized view that you want to sink data from. For details about the policy, see [Emit on window close](/transform/emit-on-window-close.md).

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector = 'connector_name',
   connector_parameter = 'value',
   [ snapshot = 'true' | 'false' ],...
)
[ FORMAT data_format ENCODE data_encode [ (
    format_parameter = 'value'
) ] ];
```

## Parameters

| Parameter| Description|
|-----------|-------------|
|*sink_name*    |The name of the sink.|
|*col_name*      |The name of the column.|
|*sink_from*      |Specify the direct data source for output. It can be a materialized view or a table.|
|*select_query*      |Specify the data to be output to the sink.|
|*snapshot*| Optional. Currently, to modify the definition or query of an existing sink, you need to drop and re-create the sink, but this approach generates excessive duplicates due to the mandatory backfilling. To avoid this, you can set the parameter to `false` to skip the backfilling phase and transmit only incremental changes. This option is only applicable when using the `CREATE SINK FROM` syntax, not `CREATE SINK AS` syntax. The default value is `true`. |
|**WITH** clause |Specify the connector settings here if trying to store all the sink data. See [Supported sinks](#supported-sinks) for the full list of supported sink as well as links to specific connector pages detailing the syntax for each sink. |
|**FORMAT** and **ENCODE** options | Optional. Specify the data format and the encoding format of the sink data. It is only used for Kafka, Kinesis, Pulsar, and Redis sinks. |

:::note
Please distinguish between the parameters set in the FORMAT and ENCODE options and those set in the WITH clause. Ensure that you place them correctly and avoid any misuse.
:::

## Supported sinks

Click a sink name to see the SQL syntax, options, and sample statement of sinking data from RisingWave to the sink.

* [Apache Doris](/guides/sink-to-doris.md)
* [Apache Iceberg](/guides/sink-to-iceberg.md)
* [AWS Kinesis](/guides/sink-to-aws-kinesis.md)
* [Cassandra or ScyllaDB](/guides/sink-to-cassandra.md)
* [ClickHouse](/guides/sink-to-clickhouse.md)
* [CockroachDB](/guides/sink-to-cockroach.md)
* [Delta Lake](/guides/sink-to-delta-lake.md)
* [Elasticsearch](/guides/sink-to-elasticsearch.md)
* [Google BigQuery](/guides/sink-to-bigquery.md)
* [Kafka](/guides/create-sink-kafka.md) (Supports versions 3.1.0 or later)
* [MySQL](/guides/sink-to-mysql.md) (Supports versions 5.7 and 8.0.x)
* [NATS](/guides/sink-to-nats.md)
* [PostgreSQL](/guides/sink-to-postgres.md)
* [Pulsar](/guides/sink-to-pulsar.md)
* [Redis](/guides/sink-to-redis.md)
* [StarRocks](/guides/sink-to-starrocks.md)
* [TiDB](/guides/sink-to-tidb.md)


## See also

- [`Overview of data delivery`](/data-delivery.md)
- [`DROP SINK`](sql-drop-sink.md) — Remove a sink.
- [`SHOW CREATE SINK`](sql-show-create-sink.md) — Show the SQL statement used to create a sink.
- [`CREATE SINK INTO`](sql-create-sink-into.md) — Create a sink into RisingWave's table.

:::note

Timestamptz values are stored in UTC.

When sinking downstream, the representation of timestamptz is configurable. By default, it is in the format `2023-11-11T18:30:09.453000Z`.

:::
