---
id: sql-delete
title: DELETE
description: Remove rows from a table.
slug: /sql-delete
---

Use the `DELETE` command to permanently remove rows from a table.

## Syntax

```sql
DELETE FROM table_name
WHERE condition;
```


## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*               |The table where you want to remove records.|
|**WHERE** *condition*      |Specify which rows you want to remove using an expression that returns a boolean value. Rows for which this expression returns true will be removed. <br/> If you omit the WHERE clause, all rows of records in the table will be deleted but the table structure will be kept.|


## Example

The `taxi_trips` table has three records:

```sql
SELECT * FROM taxi_trips;
```
```
 id | distance |    city     
----+----------+-------------
  1 |       16 | Yerba Buena
  2 |       23 | New York
  3 |        6 | Chicago
(3 rows)
```

The following statement removes the record with id 3 from the table.

```sql
DELETE FROM taxi_trips 
WHERE id = 3;
```

The following statement removes all rows from the table. 

```sql
DELETE FROM taxi_trips 
```

Let's see the result.

```sql
SELECT * FROM taxi_trips;
```
```
 id | distance | city 
----+----------+------
(0 rows)
```