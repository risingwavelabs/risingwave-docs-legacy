---
id: sql-show-create-view
title: SHOW CREATE VIEW
description: Show the query used to create the specified view. 
slug: /sql-show-create-view
---

Use the `SHOW CREATE VIEW` command to see what query was used to create the specified view. 

## Syntax

```sql
SHOW CREATE VIEW view_name;
```

## Parameters
 |Parameter    | Description|
|---------------|------------|
|*view_name* |The view to show the query of.|

## Example

```sql
CREATE VIEW v1 AS SELECT id FROM taxi_trips;
SHOW CREATE VIEW v1;
```

Here is the result.
```
   Name    |                 Create Sql                  
-----------+---------------------------------------------
 public.v1 | CREATE VIEW v1 AS SELECT id FROM taxi_trips
(1 row)
```

## Related topics

[SHOW CREATE MATERIALIZED VIEW](sql-show-create-mv.md)