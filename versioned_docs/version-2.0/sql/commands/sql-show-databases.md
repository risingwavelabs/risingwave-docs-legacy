---
id: sql-show-databases
title: SHOW DATABASES
description: Show existing databases.
slug: /sql-show-databases
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-databases/" />
</head>

Use the `SHOW DATABASES` command to show all databases.

## Syntax

```sql
SHOW DATABASES [ LIKE_expression ];
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Example

```sql
SHOW DATABASES;
```
