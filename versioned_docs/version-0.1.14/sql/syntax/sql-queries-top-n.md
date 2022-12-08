---
id: sql-queries-top-n
slug: /sql-queries-top-n
title: Top-N by group
---

Top-N queries provide the N largest or smallest values ordered by columns. Top-N queries are helpful to display only the N top-most or the N bottom-most records.

Syntax of the Top-N statement:
```sql
SELECT [column_list] 
  FROM (
    SELECT [column_list], 
      ROW_NUMBER() OVER ([PARTITION BY col1[, col2...]] 
        ORDER BY col1 [asc|desc][, col2 [asc|desc]...]) AS rank 
    FROM table_name)
WHERE rank <= N [AND conditions];
```

:::note

`rank` cannot be included in `column_list`.

:::

|Parameter|Description|
|---|---|
|`ROW_NUMBER()`|Assigns a unique, sequential number to each row, starting with one, according to the ordering of rows within the partition. `RANK()` is supported for materialized views but not tables.|
|`PARTITION BY col1[, col2...]`|Specifies the partition columns. Each partition will have a Top-N result.|
|<code>ORDER BY col1 [asc&#124;desc][, col2 [asc&#124;desc]...]</code>|Specifies the ordering columns.|
|`WHERE rank <= N`|Required to recognize the query as a Top-N query.|
