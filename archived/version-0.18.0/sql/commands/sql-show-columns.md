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
SHOW COLUMNS FROM table_name;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('SHOW COLUMNS'),
rr.Terminal('FROM'),
rr.NonTerminal('table_name'),
rr.Terminal(';')
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter or clause | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| _table_name_        | The name of the table, source, or materialized view from which the columns will be listed. |

## Example

```sql
SHOW COLUMNS FROM taxi_trips;
```
