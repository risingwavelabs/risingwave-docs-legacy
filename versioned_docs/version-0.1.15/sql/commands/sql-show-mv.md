---
id: sql-show-materizalized-views
title: SHOW MATERIALIZED VIEWS
description: Show existing materialized views.
slug: /sql-show-mv
---

Use the `SHOW MATERIALZED VIEWS` command to show existing materialized views.

## Syntax

```sql
SHOW MATERIALIZED VIEWS [FROM schema_name];
```
## Parameters
|Parameter      | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema in which the materialized views will be listed. If not given, materialized views from the default schema, "public", will be listed|


## Example
```sql
SHOW MATERIALIZED VIEWS FROM schema_1;
```