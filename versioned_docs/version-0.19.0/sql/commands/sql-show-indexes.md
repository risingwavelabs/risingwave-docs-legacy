---
id: sql-show-indexes
title: SHOW INDEXES
description: Show existing indexes from a particular table.
slug: /sql-show-indexes
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-indexes/" />
</head>

Use the `SHOW INDEXES` command to view indexes from a particular table.

## Syntax

```sql
SHOW INDEXES FROM table_name;
```

## Parameters
|Parameter   | Description           |
|---------------------------|-----------------------|
|*table_name* |The table from which indexes will be displayed. |

## Example

We can create a table `t3` and an index `idx1` on `t3`.

```sql
CREATE TABLE IF NOT EXISTS t3 (
    v1 int, 
    v2 int, 
    v3 int);

CREATE INDEX idx1 ON t3 (v1,v2);
```

Next, we can use the `SHOW INDEXES` command on `t3` to see existing indexes.

```sql
SHOW INDEXES FROM t3;
```

```
 Name | On |      Key       | Include | Distributed By 
------+----+----------------+---------+----------------
 idx1 | t3 | v1 ASC, v2 ASC | v3      | v1, v2
(1 row)
```

## Related topics

[CREATE INDEX](../commands/sql-create-index.md)