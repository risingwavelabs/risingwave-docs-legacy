---
id: query-syntax-with-clause
slug: /query-syntax-with-clause
title: WITH clause
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-with-clause/" />
</head>

The `WITH` clause provides a way to write supplemental statements for a larger query. These statements, also known as Common Table Expressions or CTEs, can be viewed as defining temporary tables that exist just for one query.

It helps break down complicated and large queries into simpler, easily readable forms and proves especially useful when the subquery is executed multiple times. It computes the aggregation once and can then be repeatedly referenced by its name in the queries.

CTEs can reference each other and can be nested. The `WITH` clause must be defined before it's used in the query.

Here is the basic syntax of a `SELECT` statement with the optional `WITH` clause:

```sql
WITH name_for_summary_data AS (SELECT statement)
SELECT columns
FROM name_for_summary_data
```


Basic CTE examples:

```sql
-- create a CTE called "cte" and use it in the main query
WITH cte AS (SELECT 35 AS x)
SELECT * FROM cte;
┌────┐
│ x  │
├────┤
│ 35 │
└────┘
```
```sql
-- create two CTEs, where the second CTE references the first CTE
WITH cte AS (SELECT 35 AS i),
     cte2 AS (SELECT i*100 AS x FROM cte)
SELECT * FROM cte2;
┌──────┐
│  x   │
├──────┤
│ 3500 │
└──────┘
```
