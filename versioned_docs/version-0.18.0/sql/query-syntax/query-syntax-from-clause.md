---
id: query-syntax-from-clause
slug: /query-syntax-from-clause
title: FROM clause
---

The `FROM` clause specifies the source of the data on which the query should operate. Logically, the `FROM` clause is where the query starts execution. It can contain a single table, a combination of multiple joined tables, or another SELECT query inside a subquery node.

The `FROM` clause derives a table from one or more tables in a comma-separated table reference list.

Here is the basic syntax of the `FROM` clause:

```sql
FROM table_reference [, table_reference [, ...]]
```

A `table_reference` can be a table name, a derived table such as a subquery, a `JOIN` construct, or complex combinations.


If multiple sources are specified, the result is all the sources' Cartesian product (i.e., cross join). The result of the `FROM` list is an intermediate virtual table that can then be subject to transformations by the `WHERE`, `GROUP BY`, and `HAVING` clauses and is finally the result of the overall table expression.


### Joined tables

A joined table is a table derived from two other (real or derived) tables according to the rules of the particular join type. Inner, outer, and cross-joins are available. 

Syntax:

```sql
t1 join_type t2 [ join_condition ]
```

### Subqueries

Subqueries specifying a derived table must be enclosed in parentheses and must be assigned a table alias name.

Syntax:

```sql
FROM (SELECT * FROM table1) AS alias_name
```

This example is equivalent to `FROM table1 AS alias_name`.



### Table functions

Table functions produce a set of rows made up of either base data types (scalar types) or composite data types (table rows). They are used like a table, view, or subquery in the `FROM` clause of a query. Columns returned by table functions can be included in `SELECT`, `JOIN`, or `WHERE` clauses in the same manner as table columns, view, or subquery columns.

