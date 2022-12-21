---
id: sql-insert
title: INSERT
description: Insert new rows of data into a table.
slug: /sql-insert
---

Use the `INSERT` command to insert new rows into an existing table.

## Syntax

```sql
INSERT INTO table_name [ ( col_name [ , ... ] ) ]
      { VALUES ( value [ , ... ] ) [ , ( ... ) ] | select_query };
```


## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*               |The table where you want to insert rows.|
|*col_name*                 |The column where you want to insert corresponding values. <be/> Currently, you must provide all columns in the table in order or leave this field empty.|
|*value*                    |An expression or value to assign to the corresponding column. <br/> You can use [`DESCRIBE`](sql-describe.md) to check the order of the columns in the table.|
|*select_query*             |A [`SELECT`](sql-select.md) statement that returns the rows you want to insert to the table.|


## Example

The table `taxi_trips` has three columns:

```sql
{
  "id": INT NOT NULL,
  "distance": DOUBLE PRECISION NOT NULL,
  "city": VARCHAR
}
```

The following statement inserts four new rows into "taxi_trips".

```sql
INSERT INTO taxi_trips 
    VALUES 
      (1,16,'Dallas'), 
      (2,23,'New York'), 
      (3,6,'Chicago'), 
      (4,9,NULL);
```
Let's query the table.
```sql
SELECT * FROM taxi_trips ORDER BY id;
```
```
 id | distance |   city   
----+----------+----------
  1 |       16 | Dallas
  2 |       23 | New York
  3 |        6 | Chicago
  4 |        9 | 
```

The following statement inserts all rows in another table name "taxi_trips_new" into "taxi_trips". The two tables have the same column setup.

```sql
INSERT INTO taxi_trips 
    SELECT * FROM taxi_trips_new;
```