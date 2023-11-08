---
id: sql-show-views
title: SHOW VIEWS
description: Show existing views.
slug: /sql-show-views
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-views/" />
</head>

Use the `SHOW VIEW` command to list existing views in a particular schema.

## Syntax

```sql
SHOW VIEWS [ FROM schema_name ] [ LIKE_expression ];
```

## Parameters
|Parameter or clause  | Description           |
|---------------------------|-----------------------|
|*schema_name*              |The schema from which existing views will be listed. If not given, views from the default schema, "public", will be listed.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|


## Example

Say we create the table `t3` in the `public` schema and a view `v3`.

```sql
CREATE TABLE IF NOT EXISTS t3 (
    v1 int, 
    v2 int, 
    v3 int) 
WITH (appendonly = 'true');

CREATE VIEW v3 AS SELECT sum(v2) AS sum_v2 FROM t3;
```

Then we can use `SHOW VIEWS` to show the existing views.

```sql
SHOW VIEWS FROM public;
```

```
v3
```

## Related topics

[CREATE VIEW](sql-create-view.md)

[SHOW CREATE VIEW](sql-show-create-view.md)
