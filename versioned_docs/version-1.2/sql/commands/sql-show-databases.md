---
id: sql-show-databases
title: SHOW DATABASES
description: Show existing databases.
slug: /sql-show-databases
---

Use the `SHOW DATABASES` command to show all databases.

## Syntax

```sql
SHOW DATABASES [ LIKE_expression ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW DATABASES'),
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
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Example

```sql
SHOW DATABASES;
```
