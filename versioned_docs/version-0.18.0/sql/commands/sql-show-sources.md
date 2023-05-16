---
id: sql-show-sources
title: SHOW SOURCES
description: Show existing sources.
slug: /sql-show-sources
---

Use the `SHOW SOURCES` command to show existing sources. 

## Syntax

```sql
SHOW SOURCES [ FROM schema_name ];
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
        rr.Terminal(';'),
    ),
);

<drawer SVG={svg} />


## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sources to be listed. The default schema is "public".|


## Example

```sql
SHOW SOURCES;
```