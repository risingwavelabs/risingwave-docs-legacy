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

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW CREATE VIEW'),
        rr.NonTerminal('view_name', 'skip'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />


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

[SHOW CREATE TABLE](sql-show-create-table.md)