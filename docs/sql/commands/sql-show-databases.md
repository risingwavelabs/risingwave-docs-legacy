---
id: sql-show-databases
title: SHOW DATABASES
description: Show existing databases.
slug: /sql-show-databases
---

Use the `SHOW DATABASES` command to show all databases.

## Syntax

```sql
SHOW DATABASES;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW DATABASES'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Example

```sql
SHOW DATABASES;
```
