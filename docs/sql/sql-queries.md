---
id: sql-queries
slug: /sql-queries
title: Queries
---

## Top-N
Top-N queries provide the N largest or smallest values ordered by columns. Top-N queries are helpful to display only the N top-most or the N bottom-most records.

Syntax of the Top-N statement:
```sql
SELECT [column_list] 
  FROM (
    SELECT [column_list], 
      ROW_NUMBER() OVER ([PARTITION BY col1[, col2...]] 
        ORDER BY col1 [asc|desc][, col2 [asc|desc]...]) AS rank 
    FROM table_name)
WHERE rank <= N;
```

NOTE: `rank` cannot be included in `column_list`.

Parameter Specification:

<ul>
  <li>
    ROW_NUMBER(): Assigns a unique, sequential number to each row, starting with one, according to the ordering of rows within the partition. RANK() is also supported for streaming but not batch.
  </li>
  <li>
    PARTITION BY col1[, col2...]: Specifies the partition columns. Each partition will have a Top-N result.
  </li>
  <li>
    ORDER BY col1 [asc|desc][, col2 [asc|desc]...]: Specifies the ordering columns.
  </li>
  <li>
    WHERE is required to recognize the query as a Top-N query.
  </li>
</ul>
