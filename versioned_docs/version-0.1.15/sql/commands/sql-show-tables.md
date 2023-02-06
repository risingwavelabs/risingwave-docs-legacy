---
id: sql-show-tables
title: SHOW TABLES
description: Show existing tables.
slug: /sql-show-tables
---

Use the `SHOW TABLES` command to view tables in a particular schema.

## Syntax

```sql
SHOW TABLES [FROM schema_name];
```
## Parameters
|Parameter   | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema in which tables will be listed. If not given, tables from the default schema, "public", will be listed.|


## Example
```sql
SHOW TABLES FROM schema_1;
```