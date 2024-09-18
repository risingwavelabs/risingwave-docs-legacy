---
id: sql-show-create-table
title: SHOW CREATE TABLE
description: Show the query used to create the specified table.
slug: /sql-show-create-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-create-table/" />
</head>

Use the `SHOW CREATE TABLE` command to see what query was used to create the specified table.

## Syntax

```sql
SHOW CREATE TABLE table_name;
```




## Parameters
 |Parameter    | Description|
|---------------|------------|
|*table_name* |The table to show the query of.|

## Example

```sql
CREATE TABLE IF NOT EXISTS taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    city VARCHAR
) WITH (appendonly = 'true');

SHOW CREATE TABLE taxi_trips;
```

Here is the result. Note that the `IF NOT EXISTS` clause is omitted while the `WITH` option is preserved.
```
   Name    |                 Create Sql
-----------+---------------------------------------------
 public.taxi_trips | CREATE TABLE taxi_trips (id CHARACTER VARYING, distance DOUBLE, city CHARACTER VARYING) WITH (appendonly = 'true')
(1 row)
```

## Related topics

[SHOW CREATE MATERIALIZED VIEW](sql-show-create-mv.md)

[SHOW CREATE VIEW](sql-show-create-view.md)