---
id: sql-show-columns
title: SHOW COLUMNS
description: Show columns in a table, source, or materialized view.
slug: /sql-show-columns
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-columns/" />
</head>

Use the `SHOW COLUMNS` command to view columns in the specified table, source, or materialized view.

## Syntax

```sql
SHOW COLUMNS FROM table_name;
```
## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*                    |The name of the table, source, or materialized view from which the columns will be listed.|


## Example
```sql
SHOW COLUMNS FROM taxi_trips;
```