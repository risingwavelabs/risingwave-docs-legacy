---
id: sql-show-sinks
title: SHOW SINKS
description: Shows all sinks.
slug: /sql-show-sinks
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-sinks/" />
</head>

Use the `SHOW SINKS` command to return a list of all sinks.

## Syntax

```sql
SHOW SINKS [ LIKE_expression ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('SHOW SINKS'),
rr.Optional(
rr.NonTerminal('LIKE_expression'),
),
rr.Terminal(';'),
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter or clause | Description                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LIKE_expression     | Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions). |

## Example

```sql
SHOW SINKS;
```
