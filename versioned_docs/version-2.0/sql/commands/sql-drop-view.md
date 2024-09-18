---
id: sql-drop-view
title: DROP VIEW
description: Drop a view.
slug: /sql-drop-view
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-user/" />
</head>

Use the `DROP VIEW` command to remove an existing view from a particular schema.

## Syntax

```sql
DROP VIEW [ IF EXISTS ] view_name [ CASCADE ];
```

## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|**IF EXISTS** clause       |Do not return an error if the specified view does not exist.|
|*view_name*                |Name of the view to be dropped.|
|**CASCADE** option| If this option is specified, all objects (such as materialized views or other regular views) that depend on the view, and in turn all objects that depend on those objects will be dropped.|

## Example

This statement removes the `sales_report` view if it exists.

```sql
DROP VIEW IF EXISTS sales_report;
```

## Related topics

- [`CREATE VIEW`](sql-create-view.md) — Create a non-materialized view.
- [`SHOW CREATE VIEW`](sql-show-create-view.md) — Show query used to create specified view.
- [`SHOW VIEWS`](sql-show-views.md) — List existing views in a particular schema.
