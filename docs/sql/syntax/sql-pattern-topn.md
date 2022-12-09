---
id: sql-pattern-topn
slug: /sql-pattern-topn
title: Top N by group
---

Top-N queries return only the N top-most or the N bottom-most records from a table or view based on a condition.

In RisingWave, a Top-N query includes an `OVER` clause and a filter condition. In an `OVER` clause, you can include a `PARTITION BY` clause to fetch top N rows per group.


## Syntax

```sql
SELECT [column_list] 
  FROM (
    SELECT [column_list], 
      function_name() OVER ([PARTITION BY col1[, col2...]] 
        ORDER BY col1 [ ASC | DESC ][, col2 [ ASC |DESC ]...]) AS rank 
    FROM table_name)
WHERE rank <= N [AND conditions];
```
:::note

`rank` cannot be included in `column_list`.

:::

:::info

You must follow the pattern exactly to construct a valid Top-N query.

:::

|Parameter|Description|
|---|---|
|*function_name*| RisingWave supports two functions in Top-N queries: <br />`row_number()`: Returns the number of the current row within its partition, counting from 1.<br />`rank()`: Returns the ordinal (1-based) rank of the current row within its partition, with gaps. All peer rows receive the same rank value. The next row or set of peer rows receives a rank value which increments by the number of peers with the previous rank value.|
|`PARTITION BY` clause |Specifies the partition columns. Each partition will have a Top-N result.|
|`ORDER BY` clause|Specifies the ordering columns.|
|`WHERE rank <= N`|Required for the query to be recognized as a Top-N query.|
|`[AND conditions]`|You can specify any additional conditions to further filter the results. |

## Example

```sql
CREATE MATERIALIZED VIEW mv AS
SELECT x, y FROM (
    SELECT *, row_number() OVER (PARTITION BY x ORDER BY y) AS rank FROM t
)
WHERE rank <= 3;
```
