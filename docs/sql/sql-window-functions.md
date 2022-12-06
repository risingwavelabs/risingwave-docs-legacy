---
id: sql-window-functions
slug: /sql-window-functions
title: Window functions
---

A window function performs a calculation across a set of table rows that are related to the current row, and returns a single result for each row. It is different from an aggregate function, which returns a single result for a group of rows.

A window function includes an OVER clause, which defines a window of rows around the row being evaluated.

RisingWave now supports two general-purpose window functions:

- `row_number()`: Returns the number of the current row within its partition, counting from 1.
- `rank()`: Returns the ordinal (1-based) rank of the current row within its partition, with gaps. All peer rows receive the same rank value. The next row or set of peer rows receives a rank value which increments by the number of peers with the previous rank value.

With these two window functions, you can query for the N largest or smallest values ordered by columns, optionally in partitions.

The syntax for a window function: 

```sql
function_name over_clause
```

The syntax for `over_clause`:
```sql
OVER ([ PARTITION BY column [ , column.. ]]
ORDER BY column [ ASC | DESC ] [, col [ ASC | DESC ]]...
)
```

If you intend to query for the top N largest or smallest values, you can construct your query using the following syntax:

```sql
SELECT [column_list] 
  FROM (
    SELECT [column_list], 
      function_name() OVER ([PARTITION BY col1[, col2...]] 
        ORDER BY col1 [ ASC | DESC ][, column [ ASC | DESC ]...]) AS rank 
    FROM table_name)
WHERE rank <= N [AND conditions];
```

In the syntax above, `table_name` is the name of a table, view, or materialized view, and the WHERE clause specifies the ranking condition for the top N query.


```sql
CREATE MATERIALIZED VIEW mv AS
SELECT x, y FROM (
    SELECT *, row_number() OVER (PARTITION BY x ORDER BY y) AS rank FROM t
)
WHERE rank <= 3;
```
