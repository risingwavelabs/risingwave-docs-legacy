---
id: sql-create-index
title: CREATE INDEX
description: Create an index on a column of a source, materialized view, or table to speed up data retrieval.
slug: /sql-create-index
---

Use the `CREATE INDEX` command to construct an index on a source, materialized view, or table. The main purpose of creating indexes is to improve data retrieval performance. Indexes can also be used to create materialized views.


## Syntax

```sql
CREATE INDEX index_name ON table_name(column_name)
[ INCLUDE ( column_name [, ...] ) ];
```

## Parameters

| Parameter or clause| Descriptiion|
|-----------|-------------|
|*index_name*    |The name of the index to be created.|
|*table_name*    |The name of the table or materialized view for which the index is created.|
|*column_name*   |The name of the column on which the index is created.|
|**INCLUDE** clause|Specify the columns to be included in the index as non-key columns. <br /> An index-only query can return the values of non-key columns without having to visit the indexed table thus improving the performance.|

## Examples

The following statement creates an index on the `id` column in the `taxi_trips` table and includes the `distance` and `city` columns as non-key columns in the index.

```sql
CREATE INDEX id_index ON taxi_trips(id) INCLUDE (distance, city);
```

To see the indexes of a table, run the `DESCRIBE` statement. For example:

```sql
DESCRIBE taxi_trips;
```
```
   Name   |               Type                
----------+-----------------------------------
 id       | Int32
 distance | Float64
 city     | Varchar
 id_index | index(id) include(distance, city)
(4 rows)
```

The following statement creates an index on the `ad_id` column in the `ad_ctr_5min` materialized view:
```sql
CREATE INDEX ad_id_index ON ad_ctr_5min(ad_id);
```

Alternatively, you can create a materialized view to improve query performance:
```sql
CREATE MATERIALIZED VIEW ad_id_index_mv AS 
    SELECT ad_id FROM ad_ctr_5min
    ORDER BY ad_id;
```


