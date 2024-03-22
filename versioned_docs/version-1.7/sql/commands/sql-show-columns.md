---
id: sql-show-columns
title: SHOW COLUMNS
description: Show columns in a table, source, sink, view or materialized view.
slug: /sql-show-columns
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-columns/" />
</head>

Use the `SHOW COLUMNS` command to view columns in the specified table, source, sink, view or materialized view.

## Syntax

```sql
SHOW COLUMNS FROM relation_name [ LIKE_expression ];
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*relation_name*              |The name of the table, source, sink, view, or materialized view from which the columns will be listed.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Examples

```sql
SHOW COLUMNS FROM taxi_trips;
```
