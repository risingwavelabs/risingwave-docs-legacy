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
| starrocks.query_port | The port to the MySQL server of the StarRocks frontend. |
| starrocks.http_port | The port to the HTTP server of the StarRocks frontend.|
| starrocks.user | The user name used to access the StarRocks database. |
| starrocks.password | The password associated with the user. |
| starrocks.database | The StarRocks database where the target table is located |
| starrocks.table | The StarRocks table you want to sink data to. |
| starrocks.partial_update | Optional. If you set the value to "true", the partial update optimization feature of StarRocks will be enabled. This feature enhances ingestion performance in scenarios where there is a need to update a large number of rows with only a small number of columns. You can learn more about this feature in the [partial update optimization](https://docs.starrocks.io/docs/sql-reference/sql-statements/data-manipulation/UPDATE/#partial-updates-in-column-mode-since-v31) section of the StarRocks documentation.|
| type | Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li><li> `upsert`: Output data as a chagelog stream. In StarRocks, Primary Key table must be selected. </li></ul> |
| force_append_only | If `true`, forces the sink to be `append-only`, even if it cannot be. |
| primary_key | Required if `type` is `upsert`. The primary key of the downstream table. |

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
| JSON | STRUCT |
| ARRAY | ARRAY |
| No support | BYTEA |
| JSON | JSONB |
| BIGINT | SERIAL |

:::note

Previously, when inserting data into a StarRocks sink, an error would be reported if the values were "nan (not a number)", "inf (infinity)", or "-inf (-infinity)". However, we have made a change to the behavior. If a decimal value is out of bounds or represents "inf", "-inf", or "nan", we will insert null values. 

In addition, with the recent updates in StarRocks, we have modified the calibration logic for decimal values. 

Previously, we had to make precision adjustments to match StarRocks' specified precision. For example, if we had a value like `1.123456` and StarRocks had a precision of 3, we would convert it to `1.123`. However, the latest versions of StarRocks now automatically handle this conversion, eliminating the need for manual adjustments. 

we have also removed the previous logic for checking the maximum number of bits before insertion. There is no longer a need to perform a pre-insertion check on the number of bits and report errors. If a value exceeds the maximum number of supported bits, it cannot be inserted into the downstream system.

:::