---
id: sql-comment-on
title: COMMENT ON
description: Add comments on tables or columns
slug: /sql-comment-on
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-comment-on/" />
</head>

You can use the `COMMENT ON` command to add comments on tables or columns in RisingWave. Comments are stored as metadata of tables or columns.

If you want to remove an existing comment on a table or column, rewrite the current comment with `NULL`.

## Syntax

```sql
COMMENT ON <object_type> <relation_name>.<object_name> IS <comment>
```

## Parameters

|Parameter| Notes|
|---------|-----------------------|
|*object_type* | Type of the object that you want to add comments to. Allowed values: `TABLE`, `COLUMN`.|
|*relation_name.object_name*| Name of the object that you want to add comments to. For columns, you also need to specify the table name.|
|*comment*| Comment that you want to add.|

## Examples

Add a comment on a table:

```sql
COMMENT ON TABLE t1 IS 'table to store traffic data';
```

Add a comment to a column:

```sql
COMMENT ON COLUMN t1.v1 IS 'column for the duration of the trip';
```

Remove the comment on a table:

```sql
COMMENT ON table t1 IS NULL;
```

After a comment is added to a table or column, you can display it in these ways:

1. Using the `rw_description` table:

```sql
SELECT * FROM rw_description;
------
 objoid | classoid | objsubid |             description             
--------+----------+----------+-------------------------------------
   1001 |       41 |          | table to store traffic data
   1001 |       41 |        1 | column for the duration of the trip
   1001 |       41 |        2 | 
   1001 |       41 |        0 | 
```

2. Using the `SHOW COLUMNS` or `DESCRIBE` command:

```sql
SHOW COLUMNS FROM t1;
```

```sql
DESCRIBE t1;
```

## Related topics

- [`DESCRIBE``](/sql/commands/sql-describe.md)
