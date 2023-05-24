---
id: sql-drop-view
title: DROP VIEW
description: Drop a view.
slug: /sql-drop-view
---

Use the `DROP VIEW` command to remove an existing view from a particular schema.

## Syntax

```sql
DROP VIEW [IF EXISTS] view_name [CASCADE | RESTRICT];
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('DROP VIEW'),
        rr.Optional(rr.Terminal('IF EXISTS')),
        rr.NonTerminal('view_name'),
        rr.Optional(
            rr.Choice(0, rr.Terminal('CASCADE'), rr.Terminal('RESTRICT'))
        ),
        rr.Terminal(';')
    )
);


<drawer SVG={svg} />




## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|**IF EXISTS** clause       |Do not return an error if the specified view does not exist.|
|*view_name*                |Name of the view to be dropped.|
|**CASCADE** clause         |Automatically drop objects that depend on the view.|
|**RESTRICT** clause        |Refuse to drop the view if any objects depend on it. This is the default.|




## Example

This statement removes the `sales_report` view if it exists.

```sql
DROP VIEW IF EXISTS sales_report;
```


## Related topics

- [`CREATE VIEW`](sql-create-view.md) — Create a non-materialized view.
- [`SHOW CREATE VIEW`](sql-show-create-view.md) — Show query used to create specified view.
- [`SHOW VIEWS`](sql-show-views.md) — List existing views in a particular schema.
