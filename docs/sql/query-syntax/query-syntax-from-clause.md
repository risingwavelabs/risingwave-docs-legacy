---
id: query-syntax-from-clause
slug: /query-syntax-from-clause
title: FROM clause
description: Specify the data source for a query.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-from-clause/" />
</head>

The `FROM` clause specifies the source of the data on which the query should operate. Logically, the `FROM` clause is where the query starts execution. It can contain a single table, a combination of multiple joined tables, or another SELECT query inside a subquery node.

The `FROM` clause derives a table from one or more tables in a comma-separated table reference list.

Here is the basic syntax of the `FROM` clause:

```sql
FROM table_reference [, table_reference [, ...]]
```

A `table_reference` can be a table name, a derived table such as a subquery, a `JOIN` construct, or complex combinations.

If multiple sources are specified, the result is all the sources' Cartesian product (i.e., cross join). The result of the `FROM` list is an intermediate virtual table that can then be subject to transformations by the `WHERE`, `GROUP BY`, and `HAVING` clauses and is finally the result of the overall table expression.

## Joined tables

A joined table is a table derived from two other (real or derived) tables according to the rules of the particular join type. Inner, outer, and cross-joins are available.

Syntax:

```sql
t1 join_type t2 [ join_condition ]
```

## Subqueries

Subqueries specifying a derived table must be enclosed in parentheses and must be assigned a table alias name.

Syntax:

```sql
FROM (SELECT * FROM table1) AS alias_name
```

This example is equivalent to `FROM table1 AS alias_name`.

## Table functions

Table functions produce a set of rows made up of either base data types (scalar types) or composite data types (table rows). They are used like a table, view, or subquery in the `FROM` clause of a query. Columns returned by table functions can be included in `SELECT`, `JOIN`, or `WHERE` clauses in the same manner as table columns, view, or subquery columns.

## `LATERAL` subqueries

Subqueries appearing in `FROM` can be preceded by the keyword `LATERAL`. This allows them to reference columns provided by preceding `FROM` items. Without `LATERAL`, each subquery is evaluated independently and so cannot cross-reference any other `FROM` item.

To create a `LATERAL` subquery, use the `LATERAL` keyword directly before the inner subquery's `SELECT` statement.

The following query includes two `LATERAL` subqueries. The first `LATERAL` subquery calculates the maximum sale amount and caches the result in a derived table `max_sale`. The second `LATERAL` subquery finds the customer name based on the maximum sale amount from the derived table, and stores the result in another derived table `max_sale_customer`.

```sql
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale_customer.customer_name
FROM
  salesperson,
  -- Calculate the maximum sale and cache it in a derived table
  LATERAL
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS max_sale,
  -- find customer, reusing cached maximum sale amount
  LATERAL
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
        -- the cached maximum sale amount
        max_sale.amount)
  AS max_sale_customer;
  ```

You can apply a LEFT join to a LATERAL subquery to ensure that source rows appear in the result, even if the subquery yields no rows for them.

For example, the above query can be rewritten to LEFT join a LATERAL subquery:

```sql
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale.customer_name
FROM
  salesperson left join
  -- find maximum size and customer at same time
  LATERAL
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
  AS max_sale on true;
```
