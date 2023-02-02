---
id: sql-drop-sink
title: DROP SINK
description: Remove a sink.
slug: /sql-drop-sink
---

Use the `DROP SINK` command to remove a [sink](sql-create-sink.md) if you no longer need to deliver data to the sink.

## Syntax

```sql
DROP SINK [ IF EXISTS ] [schema_name.]sink_name;
```


## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sink that you want to remove. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified sink in the default schema `public` will be removed.|
|*sink_name*                   |The name of the sink to remove.|



## Examples

This statement removes the sink `rw_sink` in the default schema `public` from the database:

```sql
DROP SINK rw_sink;
```


This statement removes the sink `rw_sink` in the schema `rw_schema` from the database:

```sql
DROP SINK IF EXISTS rw_schema.rw_sink;
```

## See also

[`CREATE SINK`](sql-create-sink.md) — Create a sink.