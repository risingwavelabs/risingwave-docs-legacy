---
id: sql-describe
title: DESCRIBE
description: Get information about the columns in a table, source, or materialized view.
slug: /sql-describe
---

Use the `DESCRIBE` command to view columns in the specified table, source, or materialized view.

`DESCRIBE` is a shortcut for [`SHOW COLUMNS`](sql-show-columns.md).

:::tip

`DESCRIBE` also lists the indexes on a table or materialized view, whereas `SHOW COLUMNS` doesn't.

:::


## Syntax

```sql
DESCRIBE table_name;
```
## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*               |The table, source, or materialized view whose columns will be listed.|


## Example

This statement shows the columns and indexes of the "t1" table:
```sql
DESCRIBE t1;
```
```
 Name |   Type    
------+-----------
 col1 | Int32
 col2 | Int32
 idx1 | index(col2)
(3 rows)
```
