---
id: sql-drop-index
title: DROP INDEX
description: Remove an index.
slug: /sql-drop-index
---

Use the `DROP INDEX` command to remove an index from a table or a materialized view.

## Syntax

```sql
DROP INDEX [ schema_name.]index_name;
```


## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the index that you want to remove. <br /> You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified index in the default schema "public" will be removed.|
|*index_name*                    |The name of the index to remove. <br/> You can use [`DESCRIBE`](sql-describe.md) to show the indexes of a table.|



## Examples

This statement removes the "id_index" index from the "taxi_trips" table in the default schema ("public"):

```sql
DROP INDEX id_index;
```

This statement removes the "ad_id_index" index from the "ad_ctr_5min" materialized view in the "rw_schema" schema:

```sql
DROP INDEX rw_schema.id_index;
```

## See also

[`CREATE INDEX`](sql-create-index.md) — Construct an index on a table or a materialized view to speed up queries.