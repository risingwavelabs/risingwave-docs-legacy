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
SHOW SINKS [ FROM schema_name ] [ LIKE_expression ];
```


## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sinks to be listed.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Example

```sql
SHOW SINKS;
```