---
id: query-syntax-where-clause
slug: /query-syntax-where-clause
title: WHERE clause
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-where-clause/" />
</head>

The `WHERE` clause specifies any conditions or filters to apply to your data. This allows you to select only a specific subset of the data. The `WHERE` clause is used right after the `FROM` clause.

Here is the basic syntax of a SELECT statement with the optional `WHERE` clause:

```sql
SELECT column1, column2, columnN
FROM table_name
WHERE condition
```

Here, `condition` is any expression that evaluates to a result of type boolean. Any row that does not satisfy this condition will be removed from the output. A row satisfies the condition if it returns true when the actual row values are substituted for any variable references. Subqueries are allowed in a condition expression.

Basic `WHERE` clause example:

```sql
-- compute the average salary per department per job_title
-- filtering the result set only to include the departments and job titles with an average salary of at least $50,000
SELECT department, job_title, AVG(salary)
FROM employees
WHERE salary >= 50000
GROUP BY department, job_title;
```

This query results in a table with columns for department, job title, and average salary. Each row represents the average salary for a unique combination of department and job title, and only those groups with an average salary of at least $50,000 are returned.

Notice that the `WHERE` clause comes before the `GROUP BY` clause in this example because the `WHERE` clause is used to filter the rows in a table before any aggregations are performed. In contrast, the `HAVING` clause filters data after aggregations are performed.
