---
id: sql-show-create-view
title: SHOW CREATE VIEW
description: See the query used to create the specified view. 
slug: /sql-show-create-view
---

Use the `SHOW CREATE VIEW` command to see what query was used to create the specified view. 

## Syntax

```sql
SHOW CREATE [MATERIALIZED] VIEW mv_name;
```

## Parameters
 |Parameter    | Description|
|---------------|------------|
|*mv_name* |The view or materialized view to show the query of.|

## Example

```sql
CREATE VIEW v1 AS SELECT id FROM taxi_trips;
SHOW CREATE VIEW v1;
```

The following will be shown.
```
   Name    |                 Create Sql                  
-----------+---------------------------------------------
 public.v1 | CREATE VIEW v1 AS SELECT id FROM taxi_trips
(1 row)
```