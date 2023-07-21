---
id: sql-create-mv
title: CREATE MATERIALIZED VIEW
description: Create a materialized view.
slug: /sql-create-mv
---

Use the `CREATE MATERIALIZED VIEW` command to create a materialized view. A materialized view can be created based on sources, tables, materialized views, or indexes.

## Syntax

```sql
CREATE MATERIALIZED VIEW [IF NOT EXISTS] mv_name AS select_query;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal("CREATE MATERIALIZED VIEW"),
      rr.Optional(rr.Terminal('IF NOT EXISTS')),
      rr.NonTerminal("mv_name", "skip"),
      rr.Terminal("AS"),
      rr.NonTerminal("select_query", "skip"),
      rr.Terminal(";")
   )
)
);

<drawer SVG={svg} />

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*mv_name*                       |The name of the materialized view to be created.|
|*select_query*             |A SELECT query that retrieves data for the materialized view. See [SELECT](sql-select.md) for the syntax and examples of the `SELECT` command.|

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

:::note

The `ORDER BY` clause in the `CREATE MATERIALIZED VIEW` statement is allowed but not considered as part of the definition of the materialized view. It's only used in the initial creation of the materialized view and not during refreshes.

:::

## Examples
Refer to this [tutorial](/tutorials/server-performance-anomaly-detection.md) for examples of creating materialized views based on external sources or existing materialized views.


