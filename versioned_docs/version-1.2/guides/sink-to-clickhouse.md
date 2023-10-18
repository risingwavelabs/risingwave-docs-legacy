---
id: sink-to-clickhouse
title: Sink data from RisingWave to ClickHouse
description: Sink data from RisingWave to ClickHouse.
slug: /sink-to-clickhouse 
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-clickhouse/" />
</head>

This guide describes how to sink data from RisingWave to ClickHouse using the ClickHouse sink connector in RisingWave.

ClickHouse® is a high-performance, column-oriented SQL database management system (DBMS) for online analytical processing (OLAP). For more information about ClickHouse, see [ClickHouse official website](https://clickhouse.com).

:::caution Experimental feature
The ClickHouse sink connector in RisingWave is currently an experimental feature. Its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.
:::

## Prerequisites

- Ensure you already have a ClickHouse table that you can sink data to.
  For additional guidance on creating a table and setting up ClickHouse, refer to this [quick start guide](https://clickhouse.com/docs/en/getting-started/quick-start).

- Ensure you have an upstream materialized view or source that you can sink data from.

:::note
We highly recommend using the ReplacingMergeTree engine in ClickHouse. This is because it addresses the potential problem of duplicate writes in ClickHouse during RisingWave recovery when primary keys can be duplicated.
:::

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='clickhouse',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names       | Description |
| --------------------- | ---------------------------------------------------------------------- |
| `type`                | Required. Specify if the sink should be `upsert` or `append-only`. If creating an `upsert` sink, see the [Overview](data-delivery.md) on when to define the primary key.|
| `primary_key`          | Optional. A string of a list of column names, separated by commas, that specifies the primary key of the ClickHouse sink.|
| `clickhouse.url`        | Required. Address of the ClickHouse server that you want to sink data to. Format: `ip:port`.|
| `clickhouse.user`       | Required. User name for accessing the ClickHouse server. |
| `clickhouse.password`   | Required. Password for accessing the ClickHouse server.|
| `clickhouse.database`  | Required. Name of the ClickHouse database that you want to sink data to.|
| `clickhouse.table`      | Required. Name of the ClickHouse table that you want to sink dat to.|

:::note

ClickHouse does not recommend using the `upsert`(`update` and `delete`) feature as it may result in significant performance degradation.

:::

## Examples

This section includes several examples that you can use if you want to quickly experiment with sinking data to ClickHouse.

### Create an ClickHouse table (if you do not already have one)

For example, let's consider creating a basic ClickHouse table with the primary key as `seq_id` and the ENGINE set to `ReplacingMergeTree`. It's important to emphasize that without using `ReplacingMergeTree` or other deduplication techniques, there is a significant risk of duplicate writes to ClickHouse.

Note that only S3-compatible object store is supported, such as AWS S3 or MinIO.

```sql
CREATE TABLE demo_test(
    seq_id Int32,
    user_id Int32,
    user_name String
) ENGINE = ReplacingMergeTree
PRIMARY KEY (seq_id);
```

### Create an upstream materialized view or source

The following query creates an append-only source. For more details on creating a source, see [`CREATE SOURCE`](/sql/commands/sql-create-source.md) .

```sql
CREATE SOURCE s1_source (
    seq_id integer,
    user_id integer,
    user_name varchar)
WITH (
    connector ='datagen',
    fields.seq_id.kind ='sequence',
    fields.seq_id.start ='1',
    fields.seq_id.end ='10000000',
    fields.user_id.kind ='random',
    fields.user_id.min ='1',
    fields.user_id.max ='10000000',
    fields.user_name.kind ='random',
    fields.user_name.length ='10',
    datagen.rows.per.second ='20000'
 ) FORMAT PLAIN ENCODE JSON;
```

Another option is to create an upsert table, which supports in-place updates. For more details on creating a table, see [`CREATE TABLE`](/sql/commands/sql-create-table.md) .

```sql
CREATE TABLE s1_table (
    seq_id integer,
    user_id integer,
    user_name varchar)
WITH (
    connector ='datagen',
    fields.seq_id.kind ='sequence',
    fields.seq_id.start ='1',
    fields.seq_id.end ='10000000',
    fields.user_id.kind ='random',
    fields.user_id.min ='1',
    fields.user_id.max ='10000000',
    fields.user_name.kind ='random',
    fields.user_name.length ='10',
    datagen.rows.per.second ='20000'
 ) FORMAT PLAIN ENCODE JSON;
```

### Append-only sink from append-only source

If you have an append-only source and want to create an append-only sink, set `type = append-only` in the `CREATE SINK` SQL query.

```sql
CREATE SINK s1_sink FROM s1_source
WITH (
    connector = 'clickhouse',
    type = 'append-only',
    clickhouse.url = '${CLICKHOUSE_URL}',
    clickhouse.user = '${CLICKHOUSE_USER}',
    clickhouse.password = '${CLICKHOUSE_PASSWORD}',
    clickhouse.database = 'default',
    clickhouse.table='demo_test'
);
```

### Append-only sink from upsert source

If you have an upsert source and want to create an append-only sink, set `type = append-only` and `force_append_only = true`. This will ignore delete messages in the upstream, and to turn upstream update messages into insert messages.

```sql
CREATE SINKs1_sink FROM s1_source
WITH (
    connector = 'clickhouse',
    type = 'append-only',
    clickhouse.url = '${CLICKHOUSE_URL}',
    clickhouse.user = '${CLICKHOUSE_USER}',
    clickhouse.password = '${CLICKHOUSE_PASSWORD}',
    clickhouse.database = 'default',
    clickhouse.table='demo_test'
);
```

### Upsert sink from upsert source

If you have an upsert source and want to create an upsert sink, set `type = upsert`. When the sink type is upsert, be sure to set the `primary_key` field to specify the primary key of the downstream ClickHouse table.

```sql
CREATE SINK s1_sink FROM s1_table
WITH (
    connector = 'clickhouse',
    type = 'upsert',
    primary_key = 'seq_id',
    clickhouse.url = '${CLICKHOUSE_URL}',
    clickhouse.user = '${CLICKHOUSE_USER}',
    clickhouse.password = '${CLICKHOUSE_PASSWORD}',
    clickhouse.database = 'default',
    clickhouse.table='demo_test'
);
```
