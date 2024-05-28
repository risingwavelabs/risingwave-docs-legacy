---
id: sql-show-create-source
title: SHOW CREATE SOURCE
description: Show the query used to create the specified source.
slug: /sql-show-create-source
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-create-source/" />
</head>

Use the `SHOW CREATE SOURCE` command to see the SQL statement used to create the specified source. By
using this command, you can verify the source's settings and troubleshoot any issues.

## Syntax

```sql
SHOW CREATE SOURCE source_name;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('SHOW CREATE SOURCE'),
rr.NonTerminal('source_name', 'skip'),
rr.Terminal(';')
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter     | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| _source_name_ | The source for which you want to show the corresponding SQL statement. |

## See also

[CREATE SOURCE](sql-create-source.md) — Create a source.
