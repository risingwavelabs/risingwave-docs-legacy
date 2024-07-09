---
id: sink-to-sqlserver
title: Sink data from RisingWave to SQL Server
description: Sink data from RisingWave to SQL Server.
slug: /sink-to-sqlserver
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-sqlserver/" />
</head>

This guide describes how to sink data from RisingWave to Microsoft SQL Server.

You can test out this process on your own device by using the `sqlserver_sink.slt` demo in the [`integration_test directory`](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) of the RisingWave repository.

## Prerequisites

Before sinking data from RisingWave to SQL Server, please ensure the following:

- The SQL Server table you want to sink to is accessible from RisingWave.
- You have an upstream materialized view or table in RisingWave that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='sqlserver',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
| type | Required. Allowed values: `append-only` and `upsert`. |
| force_append_only | Optional. If `true`, forces the sink to be `append-only`, even if it cannot be. |
| primary_key | Conditional. The primary keys of the sink. Use ',' to delimit the primary key columns. Primary keys are required for `upsert` sinks. |
| sqlserver.host | Required. The SQL Server host. |
| sqlserver.port | Required. The SQL Server port. |
| sqlserver.user | Required. The user for SQL Server access. |
| sqlserver.password | Required. The password for SQL Server access. |
| sqlserver.database | Required. The SQL Server database you want to sink to. |
| sqlserver.table | Required. The SQL Server table you want to sink to. |

## Data type mapping

The following table shows the corresponding data types between RisingWave and SQL Server that should be specified when creating a sink. For details on native RisingWave data types, see [Overview of data types](/sql/sql-data-types.md).

| SQL Server type | RisingWave type |
|------------|-----------------|
|bit | boolean |
|smallint | smallint |
|int | integer |
|bigint | bigint |
|float(24) | real |
|float(53) | double |
|decimal | decimal |
|date | date |
|nvarchar | varchar |
|time | time |
|datetime2 | time without time zone |
|bigint | timestamp without time zone |
|No support | interval |
|No support | struct |
|No support | array |
|varbinary | bytea |
|No support | jsonb |
|No support | serial |