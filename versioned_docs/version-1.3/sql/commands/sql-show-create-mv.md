---
id: sql-show-create-mv
title: SHOW CREATE MATERIALIZED VIEW
description: Show the query used to create the specified materialized view. 
slug: /sql-show-create-mv
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-create-mv/" />
</head>

Use the `SHOW CREATE MATERIALIZED VIEW` command to see what query was used to create the specified materialized view. 

## Syntax

```sql
SHOW CREATE MATERIALIZED VIEW mv_name;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW CREATE MATERIALIZED VIEW'),
        rr.NonTerminal('mv_name', 'skip'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />


## Parameters
 |Parameter    | Description|
|---------------|------------|
|*mv_name* |The materialized view to show the query of.|

## Example

```sql
CREATE MATERIALIZED VIEW v1 AS SELECT id FROM taxi_trips;
SHOW CREATE MATERIALIZED VIEW v1;
```

Here is the result.
```
   Name    |                 Create Sql                  
-----------+---------------------------------------------
 public.v1 | CREATE MATERIALIZED VIEW v1 AS SELECT id FROM taxi_trips
(1 row)
```

## Related topics

[SHOW CREATE VIEW](sql-show-create-view.md)

[SHOW CREATE TABLE](sql-show-create-table.md)