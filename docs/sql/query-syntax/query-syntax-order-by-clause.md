---
id: query-syntax-order-by-clause
title: ORDER BY clause
description: Use the ORDER BY clause to sort the result set of a query.
slug: /query-syntax-order-by-clause
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-order-by-clause/" />
</head>

Use the `ORDER BY` clause to sort the result set of a query based on one or more columns in ascending or descending order. It is commonly used to organize data in a specific sequence for better analysis and presentation.

Here is the basic syntax of the `ORDER BY` clause:

```sql title="Syntax"
SELECT select_list
    FROM table_expression
    ORDER BY sort_expression1 [ASC | DESC] [NULLS { FIRST | LAST }]
             [, sort_expression2 [ASC | DESC] [NULLS { FIRST | LAST }] ...]
```

## Examples

Let's assume we have a table named "employees" with columns "employee_id", "employee_name", and "salary". 

```sql title="employees"
employee_id | employee_name | salary 
-------------+---------------+--------
           2 | Bob           |  60000
           4 | David         |  55000
           1 | Alice         |  50000
           3 | Charlie       |  70000
           5 | Eve           |  75000
```

```sql title="Code of creating the table and inserting data"
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR,
    salary INT           
);

INSERT INTO employees (employee_id, employee_name, salary) VALUES
(1, 'Alice', 50000),
(2, 'Bob', 60000),
(3, 'Charlie', 70000),
(4, 'David', 55000),
(5, 'Eve', 75000);
```

To retrieve the list of employees sorted by their salaries in descending order, the SQL query would be:

```sql
SELECT employee_id, employee_name, salary
FROM employees
ORDER BY salary DESC;

----RESULT
employee_id | employee_name | salary 
-------------+---------------+--------
           5 | Eve           |  75000
           3 | Charlie       |  70000
           2 | Bob           |  60000
           4 | David         |  55000
           1 | Alice         |  50000
(5 rows)
```

In this example, the result set displayed the employees' details sorted by their salaries in descending order, showing the highest-paid employees first. The `ORDER BY` clause helps in arranging data in a structured and meaningful way for easier interpretation and decision-making. 