---
id: sql-show-schemas
title: SHOW SCHEMAS
description: Show existing schemas.
slug: /sql-show-schemas
---

Use the `SHOW SCHEMAS` command to show schemas in the "dev" database.

## Syntax

```sql
SHOW SCHEMAS;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW SCHEMAS'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />



## Example

```sql
SHOW SCHEMAS;
```