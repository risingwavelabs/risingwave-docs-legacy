---
id: query-syntax-group-by-clause
slug: /query-syntax-group-by-clause
title: GROUP BY clause
description: Group rows with similar values.
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

If your goal is to generate windowed calculation results strictly as append-only output, you can utilize the emit-on-window-close policy. This approach helps avoid unnecessary computations. For more information on the emit-on-window-close policy, please refer to [Emit on window close](/transform/emit-on-window-close.md).

You can use more than one column in the `GROUP BY` clause.

Basic `GROUP BY` example:

```sql
-- compute the average salary per department per job_title
SELECT department, job_title, AVG(salary)
FROM employees
GROUP BY department, job_title;
```

This query results in a table with columns for department, job title, and average salary. Each row represents the average salary for a unique department and job title combination.

## `GROUP BY GROUPING SETS()`

With the `GROUPING SETS()` option, you can group data by multiple sets of columns in a single query. Each sublist of `GROUPING SETS` may specify zero or more columns or expressions and is interpreted the same way as though it were directly in the `GROUP BY` clause.

```sql title="With GROUPING SETS"
SELECT customer_id, product_category, SUM(order_amount) AS total_amount
FROM orders
GROUP BY GROUPING SETS ((customer_id, product_category), ());
```

```sql title="Without GROUPING SETS"
SELECT customer_id, product_category, SUM(order_amount) AS total_amount
FROM orders
GROUP BY customer_id, product_category
UNION ALL
SELECT NULL, NULL, SUM(order_amount) AS total_amount
FROM orders;
```

## `GROUP BY ROLLUP()`

The `GROUP BY ROLLUP()` clause extends the functionality of the `GROUP BY` clause by providing a way to generate subtotals and grand totals for multiple levels of grouping. It creates a result set that includes rows representing different combinations of the specified grouping columns, along with subtotals and a grand total.

The columns listed in the `GROUP BY ROLLUP` clause define the hierarchy of grouping levels, with the rightmost column being the most detailed level of grouping.

```sql
SELECT product_category, product_subcategory, region, SUM(sales_amount) AS total_sales
FROM sales
GROUP BY ROLLUP (product_category, product_subcategory, region);
```

The results are like below:

| product_category | product_subcategory | region | total_sales |
| ---------------- | ------------------- | ------ | ----------- |
| Electronics      | Smartphones         | North  | 1000        |
| Electronics      | Smartphones         | South  | 1500        |
| Electronics      | Smartphones         | NULL   | 2500        |
| Electronics      | Laptops             | North  | 2000        |
| Electronics      | Laptops             | South  | 0           |
| Electronics      | Laptops             | NULL   | 2000        |
| Electronics      | NULL                | NULL   | 4500        |
| Furniture        | Chairs              | North  | 500         |
| Furniture        | Chairs              | South  | 700         |
| Furniture        | Chairs              | NULL   | 1200        |
| Furniture        | Tables              | North  | 1000        |
| Furniture        | Tables              | South  | 1200        |
| Furniture        | Tables              | NULL   | 2200        |
| Furniture        | NULL                | NULL   | 3400        |
| NULL             | NULL                | NULL   | 7900        |

In this example, there are subtotals for each combination of `product_category`, `product_subcategory`, and `region`. The NULL values in the grouping columns represent the grand total.

## `GROUP BY CUBE()`

The `GROUP BY CUBE()` clause generates multiple levels of grouping within a single query. It creates a result set that includes all possible combinations of the specified columns, generating a subtotal for each combination.

The `GROUP BY CUBE()` clause is particularly useful when you need to analyze data across multiple dimensions and want to examine various levels of aggregation simultaneously.

```sql title="GROUP BY CUBE clause"
GROUP BY CUBE(c1,c2,c3) 
```

```sql title="Equivalent GROUP BY GROUPING SETS clause"
GROUP BY GROUPING SETS (
            (c1,c2,c3), 
            (c1,c2),
            (c1,c3),
            (c2,c3),
            (c1),
            (c2),
            (c3), 
            ()
        ) 
...
