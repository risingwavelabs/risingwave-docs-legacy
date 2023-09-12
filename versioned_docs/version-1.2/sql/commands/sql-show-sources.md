---
id: sql-show-sources
title: SHOW SOURCES
description: Show existing sources.
slug: /sql-show-sources
---

Use the `SHOW SOURCES` command to show existing sources. 

## Syntax

```sql
SHOW SOURCES [ FROM schema_name ] [ LIKE_expression ];
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW SOURCES'),
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
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sources to be listed. The default schema is `public`.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Example

```sql
SHOW SOURCES;
```