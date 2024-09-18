---
id: sql-show-materizalized-views
title: SHOW MATERIALIZED VIEWS
description: Show existing materialized views.
slug: /sql-show-mv
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-mv/" />
</head>

Use the `SHOW MATERIALZED VIEWS` command to show existing materialized views.

## Syntax

```sql
SHOW MATERIALIZED VIEWS [ FROM schema_name ] [ LIKE_expression ];
```


## Parameters
|Parameter      | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema in which the materialized views will be listed. If not given, materialized views from the default schema, `public`, will be listed|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|


## Example
```sql
SHOW MATERIALIZED VIEWS FROM schema_1;
```