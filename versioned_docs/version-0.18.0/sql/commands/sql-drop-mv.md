---
id: sql-drop-mv
title: DROP MATERIALIZED VIEW
description: Remove a materialized view.
slug: /sql-drop-mv
---

Use the `DROP MATERIALIZED VIEW` command to remove a materialized view from the database.

Before you can remove a materialzied view, you must remove all its dependent materialzied views.

## Syntax

```sql
DROP MATERIALIZED VIEW [ IF EXISTS ] [schema_name.]mv_name;
```


## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |Specify the name of a schema to remove the materialized view in that schema. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified materialized view in the default schema "public" will be removed.|
|*mv_name*                       |The name of the materialized view to remove. You can use [`SHOW MATERIALIZED VIEWS`](sql-show-mv.md) to get a list of all available materialized views.|



## Examples

This statement removes the "ad_ctr_5min" materialized view in the default schema ("public") from the database:

```sql
DROP MATERIALIZED VIEW ad_ctr_5min;
```

This statement removes the "ad_ctr_5min" materialized view in the "rw_schema" schema from the database:

```sql
DROP MATERIALIZED VIEW IF EXISTS rw_schema.ad_ctr_5min;
```
