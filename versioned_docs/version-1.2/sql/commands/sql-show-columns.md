---
id: sql-show-columns
title: SHOW COLUMNS
description: Show columns in a table, source, or materialized view.
slug: /sql-show-columns
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-columns/" />
</head>

Use the `SHOW COLUMNS` command to view columns in the specified table, source, or materialized view.

## Syntax

```sql
SHOW COLUMNS FROM table_name [ LIKE_expression ];
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW COLUMNS'),
        rr.Terminal('FROM'),
        rr.NonTerminal('table_name'),
        rr.Optional(
            rr.NonTerminal('LIKE_expression'),
        ),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*                    |The name of the table, source, or materialized view from which the columns will be listed.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|


## Example
```sql
SHOW COLUMNS FROM taxi_trips;
```