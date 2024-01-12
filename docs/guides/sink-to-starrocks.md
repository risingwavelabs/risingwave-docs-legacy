---
id: sink-to-starrocks
title: Sink data from RisingWave to StarRocks
description: Sink data from RisingWave to StarRocks.
slug: /sink-to-starrocks 
---

This guide describes how to sink data from RisingWave to StarRocks.

StarRocks is an open-source, massively parallel processing (MPP) database. For details on how to get started with StarRocks, see the [Quick start](https://docs.starrocks.io/docs/quick_start/) guide.

The StarRocks stream load does not support sinking `struct` and `json` types.

## Prerequisites

Before sinking data from RisingWave to StarRocks, please ensure the following:

- The StarRocks database you want to sink to is accessible from RisingWave.
- Ensure you have an upstream materialized view or source in RisingWave that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='starrocks',
   connector_parameter = 'value', ...
);
```

## Parameters

All parameters are required unless specified otherwise.

| Parameter names | Description |
| --------------- | ---------------------------------------------------------------------- |
| starrocks.host  | The StarRocks host address. |
| starrocks.mysqlport | The address that connects to the MySQL client of the frontend. By default, this will be `9030`.|
| starrocks.httpport | The http port for data import. By default, this will be `8030`. |
| starrocks.user | The user name used to access the StarRocks database. |
| starrocks.password | The password associated with the user. |
| starrocks.database | The StarRocks database the target table is located in. |
| starrocks.table | The StarRocks table you want to sink data to. |
| type | Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li><li> `upsert`: Output data as a chagelog stream. The corresponding primary key in StarRocks must be set. </li></ul> |
| force_append_only | If `true`, forces the sink to be `append-only`, even if it cannot be. |
| primary_key | Required if `type` is `upsert`. The primary key of the downstream table. 

## Examples

Assume we have a materialized view, `bhv_mv`.

```sql
CREATE SINK bhv_starrocks_sink
FROM bhv_mv WITH (
    connector = 'starrocks',
    type = 'append-only',
    starrocks.host = 'starrocks-fe',
    starrocks.mysqlport = '9030',
    starrocks.httpport = '8030',
    starrocks.user = 'users',
    starrocks.password = '123456',
    starrocks.database = 'demo',
    starrocks.table = 'demo_bhv_table',
    force_append_only='true'
);
```

## Data type mapping

The following table shows the corresponding data type in RisingWave that should be specified when creating a sink. For details on native RisingWave data types, see [Overview of data types](/sql/sql-data-types.md).

| StarRocks type | RisingWave type |
|----------------|-----------------|
| BOOLEAN | BOOLEAN |
| SMALLINT | SMALLINT |
| INT | INTEGER |
| BIGINT | BIGINT |
| FLOAT | REAL |
| DOUBLE | DOUBLE |
| DECIMAL | DECIMAL |
| DATE | DATE |
| VARCHAR | VARCHAR |
| No support | TIME |
| DATETIME | TIMESTAMP WITHOUT TIME ZONE |
| No support | TIMESTAMP WITH TIME ZONE（Can be converted to timestamp in RisingWave then sinked into StarRocks ）|
| No support | INTERVAL |
| No support | STRUCT |
| ARRAY | ARRAY |
| No support | BYTEA |
| No support | JSONB |
| BIGINT | SERIAL |