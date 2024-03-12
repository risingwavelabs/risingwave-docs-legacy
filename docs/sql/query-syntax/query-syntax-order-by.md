---
id: query-syntax-order-by
title: ORDER BY clause
description: 
slug: /query-syntax-order-by
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-order-by/" />
</head>

Use the `ORDER BY` clause to sort the result set of a query based on one or more columns in ascending or descending order. It is commonly used to organize data in a specific sequence for better analysis and presentation.

## Examples

Consider a table named "employees" with columns "employee_id", "employee_name", and "salary". To retrieve the list of employees sorted by their salaries in descending order, the SQL query would be:

```sql
SELECT employee_id, employee_name, salary
FROM employees
ORDER BY salary DESC;
```

In this example, the result set will display the employees' details sorted by their salaries in descending order, showing the highest-paid employees first. The ORDER BY clause helps in arranging data in a structured and meaningful way for easier interpretation and decision-making.