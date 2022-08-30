---
id: sql-create-mv
title: CREATE MATERIALIZED VIEW
description: Create a materialized view.
slug: /sql-create-mv
---

Use the `CREATE MATERIALIZED VIEW` command to create a materialized view. A materialized view can be created based on sources, tables, materialized views, or indexes.

## Syntax

```sql
CREATE MATERIALIZED VIEW mv_name AS select_query;
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*mv_name*                       |The name of the materialized view to be created.|
|*select_query*             |A SELECT query that retrieves data for the materialized view. See [SELECT](sql-select.md) for the syntax and examples of the `SELECT` command.|


## Examples
Refer to this [tutorial](../tutorials/server-performance-anomaly-detection.md) for instructions on setting up a materialized view based on external data sources and creating new materialized views based on the existing materialized view.