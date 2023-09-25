---
id: sql-describe
title: DESCRIBE
description: Get information about the columns in a table, source, or materialized view.
slug: /sql-describe
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-describe/" />
</head>

Use the `DESCRIBE` command to view columns in the specified table, source, or materialized view.

`DESCRIBE` is a shortcut for [`SHOW COLUMNS`](sql-show-columns.md).

:::tip

`DESCRIBE` also lists the indexes on a table or materialized view, whereas `SHOW COLUMNS` doesn't.

:::


## Syntax

```sql
DESCRIBE table_name;
```



import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('DESCRIBE'),
        rr.NonTerminal('table_name', 'skip'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />



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
    Name     |      Type
-------------+-----------------
 col1        | integer
 col2        | integer
 primary key | col1
 idx1        | index(col2) distributed by(col2)
```
