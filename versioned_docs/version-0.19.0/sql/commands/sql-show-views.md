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
SHOW VIEWS [FROM schema_name];
```

## Parameters
|Parameter   | Description           |
|---------------------------|-----------------------|
|*schema_name*              |The schema from which existing views will be listed. If not given, views from the default schema, "public", will be listed.|


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
