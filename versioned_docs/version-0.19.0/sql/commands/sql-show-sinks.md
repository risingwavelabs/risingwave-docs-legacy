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
SHOW SINKS;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW SINKS'),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />



## Example

```sql
SHOW SINKS;
```