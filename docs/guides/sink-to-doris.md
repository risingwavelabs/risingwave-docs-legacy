---
id: sink-to-doris
title: Sink data from RisingWave to Apache Doris
description: Sink data from RisingWave to Apache Doris.
slug: /sink-to-doris
---

This guide describes how to sink data from RisingWave to Apache Doris. Apache Doris is an open-source real-time data warehouse suitable for online analytical processing (OLAP). For more information, see [Apache Doris](https://doris.apache.org).

## Prerequisites 

- Ensure that RisingWave can access the network where the Doris BE and FE are located. For more details, see [Synchronize Data Through External Table](https://doris.apache.org/docs/dev/data-operate/import/import-scenes/external-table-load/).

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
| `doris.url`     | Required. The connection port for FE. This is not the MySQL connection port. |
| `doris.username`| Optional. The user name of the Doris user. |
| `doris.password`| Optional. The password associated with the Doris user. |
| `doris.database`| Optional. The Doris database you want to sink data to. |
| `doris.table`   | Optional. The Doris table you want to sink data to. |
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