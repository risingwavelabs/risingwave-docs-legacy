---
id: query-syntax-values-clause

title: VALUES clause
description: Generate one or more rows of data as a table expression.
---

In RisingWave, the `VALUES` clause is used to generate one or more rows of data as a table expression. It is commonly used in SQL queries to create temporary tables or to insert data into a table.

The syntax of the `VALUES` clause in RisingWave is as follows:

```sql
VALUES (expression1, expression2, ...),
       (expression1, expression2, ...),
       ...
```

Here, each set of expressions enclosed in parentheses represents a row of data. The number of expressions must match the number of columns in the table or view being created.

When creating a view or materialized view, you can use the `VALUES` clause to construct a temporary table and assign that table to the view or materialized view. For example:

```sql
CREATE MATERIALIZED VIEW mv (id, name) AS VALUES (1, 'John'), (2, 'Jane'), (3, 'Bob');
```

The `VALUES` clause can also be used in more complex queries, such as subqueries or joins, to generate temporary tables or insert data into existing tables. For example:

```sql
CREATE MATERIALIZED VIEW join_mv AS
WITH info(number, job) AS (VALUES (1, 'Writer'), (2, 'Software Engineer'), (3, 'Accountant')) 
SELECT * FROM mv JOIN info ON mv.id = info.number;
```

To see the values in `join_mv`:

```sql
SELECT * FROM join_mv;
-- Results
 id | name | number |        job        
----+------+--------+-------------------
  2 | Jane |      2 | Software Engineer
  3 | Bob  |      3 | Accountant
  1 | John |      1 | Writer

```
