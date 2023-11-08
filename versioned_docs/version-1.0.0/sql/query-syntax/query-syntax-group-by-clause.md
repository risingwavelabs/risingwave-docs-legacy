---
id: query-syntax-group-by-clause
slug: /query-syntax-group-by-clause
title: GROUP BY clause
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-group-by-clause/" />
</head>

The `GROUP BY` clause groups rows in a table with identical data, thus eliminating redundancy in the output and aggregates that apply to these groups.

Additionally, all tuples with matching data in the grouping columns (i.e., all tuples that belong to the same group) will be combined. The values of the grouping columns are unchanged, and any other columns can be combined using an aggregate function (such as `COUNT`, `SUM`, `AVG`, etc.).

The `GROUP BY` clause follows the `WHERE` clause in a `SELECT` statement and can precede the optional `ORDER BY` clause.

Here is the basic syntax of the `GROUP BY` clause:

```sql
SELECT column_list
FROM table_name
WHERE [ conditions ]
GROUP BY column1, column2....columnN
ORDER BY column1, column2....columnN
```

You can use more than one column in the `GROUP BY` clause.


Basic `GROUP BY` example:

```sql
-- compute the average salary per department per job_title
SELECT department, job_title, AVG(salary)
FROM employees
GROUP BY department, job_title;
```

This query results in a table with columns for department, job title, and average salary. Each row represents the average salary for a unique department and job title combination.