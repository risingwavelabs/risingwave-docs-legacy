---
id: query-syntax-values-clause
slug: /query-syntax-values-clause
title: VALUES clause
---

In RisingWave, the `VALUES` clause is used to generate one or more rows of data as a table expression. It is commonly used in SQL queries to create temporary tables or to insert data into a table or materialized view.

The syntax of the `VALUES` clause in RisingWave is as follows:

```sql
VALUES (expression1, expression2, ...),
       (expression1, expression2, ...),
       ...
```

Here, each set of expressions enclosed in parentheses represents a row of data. The number of expressions must match the number of columns in the table or view being created.

To use the `VALUES` clause in creating a materialized view, you can specify it in the `SELECT` statement used to define the view. For example:

```sql
CREATE MATERIALIZED VIEW my_view AS
  SELECT column1, column2
  FROM (VALUES (1, 'John'), (2, 'Jane'), (3, 'Bob')) AS my_table(column1, column2);
```

In this example, the `VALUES` clause is used to generate a temporary table with three rows and two columns. The resulting table is then used in the `SELECT` statement to create a materialized view called `my_view` with columns `column1` and `column2`.

The `VALUES` clause can also be used in more complex queries, such as subqueries or joins, to generate temporary tables or insert data into existing tables. For example:

```sql
CREATE MATERIALIZED VIEW mv AS
WITH dict(abbr, full) AS (VALUES ('cn', 'China'), ('us', 'United States')) 
SELECT * FROM t JOIN dict ON t.c = dict.real;
```
