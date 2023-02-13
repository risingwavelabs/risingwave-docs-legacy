---
id: sql-drop-table
title: DROP TABLE
description: Remove a table.
slug: /sql-drop-table
---

Use the `DROP TABLE` command to remove a table from the database.

Before you can remove a table, you must remove all its dependent objects (indexes, materialized views, etc.).

## Syntax

```sql
DROP TABLE [ IF EXISTS ] [schema_name.]table_name;
```


## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|*schema*                   |Specify the name of a schema to remove the table in that schema. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified source in the default schema "public" will be removed.|
|*table*                    |The name of the table to remove. You can use [`SHOW TABLES`](sql-show-tables.md) to get a list of all available tables.|



## Examples

This statement removes the "taxi_trips" table in the default schema ("public") from the database:

```sql
DROP TABLE taxi_trips;
```

This statement removes the "taxi_trips" table in the "rw_schema" schema from the database:

```sql
DROP TABLE IF EXISTS rw_schema.taxi_trips;
```
