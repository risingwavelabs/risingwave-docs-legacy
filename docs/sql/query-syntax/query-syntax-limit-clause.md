---
id: query-syntax-limit-clause
slug: /query-syntax-limit-clause
title: LIMIT clause
description: Restricts the number of rows fetched.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-limit-clause/" />
</head>

`LIMIT` is an output modifier. Logically it is applied at the end of the query, and the `LIMIT` clause restricts the number of rows fetched.

Note that while `LIMIT` can be used without an `ORDER BY` clause, the results might not be deterministic without the `ORDER BY` clause. This can still be useful, for example, when you want to inspect a quick snapshot of the data.

Basic `LIMIT` clause examples:

```sql
-- provide the result set by the average salary in descending order and return only the first 5 rows of the result set
SELECT department, job_title, AVG(salary)
FROM employees
ORDER BY AVG(salary) DESC
LIMIT 5;
```

The `ORDER BY` clause sorts the rows in the result set based on the value of the specified expression, in this case the average salary.

It's possible to remove the `GROUP BY` clause from the query and retrieve the first 5 rows of the result set without sorting the data, as shown in the example below. However, the result set will contain 5 random rows from the `employees` table, as the data is not sorted.

```sql
-- provide the result set by the average salary without sorting and return only the first 5 rows of the result set
SELECT department, job_title, AVG(salary)
FROM employees
LIMIT 5;
```