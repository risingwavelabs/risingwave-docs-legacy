---
id: sql-show-create-index
title: SHOW CREATE INDEX
description: Show the query used to create the specified index. 
slug: /sql-show-create-index
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-create-index/" />
</head>

Use the `SHOW CREATE INDEX` command to see what query was used to create the specified index. 

## Syntax

```sql
SHOW CREATE INDEX index_name;
```

## Parameters
|Parameter    | Description|
|---------------|------------|
|*index_name* |The index to show the query of.|

## Example

We can create a table `t3` and an index `idx1` on `t3`.

```sql
CREATE TABLE IF NOT EXISTS t3 (
    v1 int, 
    v2 int, 
    v3 int);

CREATE INDEX idx1 ON t3 (v1,v2);
```

Next, we can use the `SHOW CREATE INDEX` command on `idx1` to see the query used.

```sql
SHOW CREATE INDEX idx1;
```

```
    Name     |           Create Sql            
-------------+---------------------------------
 public.idx1 | CREATE INDEX idx1 ON t3(v1, v2)
(1 row)
```

## Related topics

[CREATE INDEX](sql-create-index.md)