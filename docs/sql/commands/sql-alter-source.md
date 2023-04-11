---
id: sql-alter-source
title: ALTER SOURCE
description: Modify existing source name.
slug: /sql-alter-source
---

Use the `ALTER SOURCE` command along with `RENAME TO` to modify the existing source name.

## Syntax

```sql
ALTER SOURCE current_source_name
   RENAME TO new_source_name;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Stack(
        rr.Sequence(
            rr.Terminal('ALTER SOURCE'),
            rr.NonTerminal('current_source_name'),
        ),
        rr.Sequence(
            rr.Terminal('RENAME TO'),
            rr.NonTerminal('new_source_name'),
        ),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*current_source_name*               |The current name of the source you want to modify.|
|**RENAME TO**  |Indicates the intention to rename the specified source.|
|*new_source_name*      |The new name you want to assign to the source object.|

## Example

```sql
ALTER SOURCE src 
   RENAME TO src1;
```
