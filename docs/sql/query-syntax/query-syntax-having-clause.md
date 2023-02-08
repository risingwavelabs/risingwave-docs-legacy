---
id: query-syntax-having-clause
slug: /query-syntax-having-clause
title: HAVING clause
---

The `HAVING` clause is optional and eliminates group rows that do not satisfy a given condition. `HAVING` is similar to the `WHERE` clause, but `WHERE` occurs before the grouping, and `HAVING` occurs after. 

This means that the `WHERE` clause places conditions on selected columns, whereas the `HAVING` clause places conditions on groups created by the `GROUP BY` clause.

Here's an example showing the position of the `HAVING` clause in a SELECT query:

```sql
SELECT column1, column2
FROM table1, table2
WHERE [ conditions ]
GROUP BY column1, column2
HAVING [ conditions ]
ORDER BY column1, column2
```

Basic `HAVING` clause example:

```sql
-- compute the average salary per department per job_title
-- filtering the result set to only include the departments and job titles with an average salary of at least $50,000
SELECT department, job_title, AVG(salary)
FROM employees
GROUP BY department, job_title
HAVING AVG(salary) >= 50000;
```
