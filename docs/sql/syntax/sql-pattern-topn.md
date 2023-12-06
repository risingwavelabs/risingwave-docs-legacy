---
id: sql-pattern-topn
slug: /sql-pattern-topn
title: Top-N by group
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-pattern-topn/" />
</head>

Top-N queries return only the N top-most or the N bottom-most records from a table or view based on a condition.

In RisingWave, a Top-N query includes a ranking function clause and a rank filtering condition. In the ranking function clause, you can include a `PARTITION BY` clause to fetch top N rows per group.

## Syntax

```sql
SELECT [column_list] 
  FROM (
    SELECT [column_list], 
      ranking_function_clause AS rank
    FROM table_name)
WHERE rank_range;
```

The syntax of the `ranking_function_clause` is:

```sql
function_name() OVER ([PARTITION BY col1[, col2...]] 
        ORDER BY col1 [ ASC | DESC ][, col2 [ ASC | DESC ]...])
```

:::note

`rank` cannot be included in `column_list`.

:::

:::info

You must follow the pattern exactly to construct a valid Top-N query.

:::

|Parameter|Description|
|---|---|
|*function_name*| RisingWave supports two window functions in top-N queries: <ul><li>`row_number()`: Returns the sequential row ordinal (1-based) of each row for each ordered partition.</li><li>`rank()`: Returns the ordinal (1-based) rank of each row within the ordered partition. All peer rows receive the same rank value. The next row or set of peer rows receives a rank value which increments by the number of peers with the previous rank value.</li></ul>|
|`PARTITION BY` clause |Specifies the partition columns. Each partition will have a Top-N result.|
|`ORDER BY` clause|Specifies how the rows are ordered.|
|rank_range|Specifies the range of the rank number. The rank range is required for the query to be recognized as a top-N query. The range can be specified in these forms. <br />Examples: `WHERE M < rank AND rank < N` or `WHERE rank between M and N`. Optionally, you can specify any additional conditions to further filter the results. |

## Example

```sql title="Create a table"
CREATE TABLE t (x int, y int, z int);
```

```sql title="Insert data"
INSERT INTO t (x, y, z) VALUES
  (1, 10, 50),
  (1, 10, 60),
  (1, 10, 70),
  (1, 11, 55),
  (1, 11, 65),
  (2, 20, 30),
  (2, 20, 40),
  (2, 21, 25),
  (2, 21, 35),
  (2, 21, 45);
```

```sql title="Run a top-N query"
SELECT r1
  FROM (
    SELECT
      *,
      row_number() OVER (PARTITION BY x ORDER BY y) r
    FROM t
  ) Q
WHERE Q.r1 < 10;
```
