---
id: sql-show-tables
title: SHOW TABLES
description: Show existing tables.
slug: /sql-show-tables
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-tables/" />
</head>

Use the `SHOW TABLES` command to view tables in a particular schema.

## Syntax

```sql
SHOW TABLES [ FROM schema_name ] [ LIKE_expression ];
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW TABLES'),
        rr.Optional(
            rr.Sequence(
                rr.Terminal('FROM'),
                rr.NonTerminal('schema_name', 'skip'),
            ),
        ),
        rr.Optional(
            rr.NonTerminal('LIKE_expression'),
        ),
        rr.Terminal(';'),
    ),
);

<drawer SVG={svg} />



## Parameters
|Parameter or clause   | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema in which tables will be listed. If not given, tables from the default schema, `public`, will be listed.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|


## Example

```sql
SHOW TABLES FROM public LIKE 't_';
```
```
t1
```