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

This query retrieves the average salary of employees in different departments and with different job titles, where the average salary is at least $50,000. The query selects the department, job title, and average salary of employees from the `employees` table. The data is grouped by `department` and `job_title`, which means that the average salary is calculated separately for each combination of department and job title.

The `HAVING` clause filters the result set only to include the departments and job titles with an average salary of at least $50,000. The `HAVING` clause operates on the result of the `GROUP BY` clause and filters out groups that do not meet the specified condition. In this case, only the departments and job titles with an average salary of at least $50,000 are returned.

This query results in a table with columns for department, job title, and average salary. Each row represents the average salary for a unique combination of department and job title, and only those groups with an average salary of at least $50,000 are returned.