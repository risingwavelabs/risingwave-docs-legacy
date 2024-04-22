---
id: sink-to-doris
title: Sink data from RisingWave to Apache Doris
description: Sink data from RisingWave to Apache Doris.
slug: /sink-to-doris
---

This guide describes how to sink data from RisingWave to Apache Doris. Apache Doris is an open-source real-time data warehouse suitable for online analytical processing (OLAP). For more information, see [Apache Doris](https://doris.apache.org).

## Prerequisites 

- Ensure that RisingWave can access the network where the Doris backend and frontend are located. For more details, see [Synchronize Data Through External Table](https://doris.apache.org/docs/dev/data-operate/import/import-scenes/external-table-load/).

- Ensure you have an upstream materialized view or source that you can sink data from. For more details, see [CREATE SOURCE](/sql/commands/sql-create-source.md) or [CREATE MATERIALIZED VIEW](/sql/commands/sql-create-mv.md).

- Ensure that for `struct` elements, the name and type are the same in Doris and RisingWave. If they are not the same, the values will be set to `NULL` or to default values. For more details on the `struct` data type, see [Struct](/sql/data-types/data-type-struct.md).

## Syntax 

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='doris',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
| `type`          | Required. Specify if the sink should be `upsert` or `append-only`. If creating an `upsert` sink, the table you are sinking to needs to have a `UNIQUE KEY`. |
| `doris.url`     | Required. The connection port for the frontend of Doris. This is not the MySQL connection port. |
| `doris.username`| Required. The user name of the Doris user. |
| `doris.password`| Required. The password associated with the Doris user. |
| `doris.database`| Required. The Doris database you want to sink data to. |
| `doris.table`   | Required. The Doris table you want to sink data to. |
| `force_append_only`| Optional. If `true`, forces the sink to be `append-only`, even if it cannot be. |
| `primary_key`   | Optional. The primary keys of the sink. Use ',' to delimit the primary key columns. |

## Examples

### Create an append-only sink

To create an `append-only` sink, set `type = 'append-only'` in the `CREATE SINK` query. 

```sql
CREATE SINK doris_sink FROM mv1
WITH (
    connector = 'doris',
    type = 'append-only',
    doris.url = 'http://fe:8030',
    doris.user = 'xxxx',
    doris.password = 'xxxx',
    doris.database = 'demo',
    doris.table='demo_bhv_table',
    force_append_only='true'
);
```

### Create an upsert sink

To create an `upsert` sink, set `type = 'upsert'` in the `CREATE SINK` query. The Doris table must have a `UNIQUE KEY` when creating an `upsert` sink.

```sql
CREATE SINK doris_sink FROM mv1 
WITH (
    connector = 'doris',
    type = 'upsert',
    doris.url = 'http://fe:8030',
    doris.user = 'xxxx',
    doris.password = 'xxxx',
    doris.database = 'demo',
    doris.table='demo_bhv_table',
    primary_key = 'user_id'
);
```

## Data type mapping

The following table shows the corresponding data types between RisingWave and Doris that should be specified when creating a sink. For details on native RisingWave data types, see [Overview of data types](/sql/sql-data-types.md).

In regards to `decimal` types, RisingWave will round to the nearest decimal place to ensure that its precision matches that of Doris. Ensure that the length of decimal types being imported into Doris does not exceed Doris's decimal length. Otherwise, it will fail to import.

| Doris type | RisingWave type |
|------------|-----------------|
|BOOLEAN | BOOLEAN |
|SMALLINT | SMALLINT |
|INT | INTEGER |
|BIGINT | BIGINT |
|FLOAT | REAL |
|DOUBLE | DOUBLE |
|DECIMAL | DECIMAL |
|DATE | DATE |
|STRING, VARCHAR | VARCHAR |
|No support | TIME |
|DATETIME | TIMESTAMP WITHOUT TIME ZONE |
|No support | TIMESTAMP WITH TIME ZONE |
|No support | INTERVAL |
|STRUCT | STRUCT |
|ARRAY | ARRAY |
|No support | BYTEA |
|JSONB | JSONB |
|BIGINT | SERIAL |

:::note

Previously, when inserting data into the Apache Doris sink, an error would be reported if the values were "nan (not a number)", "inf (infinity)", or "-inf (-infinity)". However, we have now made a change to the behavior. If a decimal value is out of bounds or represents "inf", "-inf", or "nan", we will insert null values. Please note this modification to how these special values are handled.

:::