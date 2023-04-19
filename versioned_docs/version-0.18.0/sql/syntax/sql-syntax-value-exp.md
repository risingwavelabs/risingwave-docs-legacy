---
id: sql-syntax-value-exp
slug: /sql-syntax-value-exp
title: Value expressions
---

Value expressions are used in a variety of contexts, such as in the target list of the SELECT command, as new column values in INSERT or UPDATE, or in search conditions in a number of commands. The result of a value expression is sometimes called a scalar, to distinguish it from the result of a table expression (which is a table).


## Aggregate expressions

An aggregate expression represents the application of an aggregate function across the rows selected by a query.

The supported syntax of an aggregate expression is one of the following:

```sql
aggregate_name (expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name (DISTINCT expression [ , ... ]) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( * ) [ FILTER ( WHERE filter_clause ) ]
```

where *aggregate_name* is one of the aggregation functions listed on [Aggregate functions](https://www.risingwave.dev/docs/latest/sql-function-aggregate/), and *expression* is a value expression that does not contain an aggregate expression or a window function call.

`DISTINCT` cannot be used with an `ORDER BY` clause in RisingWave.


## Row constructors

A row constructor is an expression that builds a row value using values from its member fields. 

```sql
ROW([expression][,...])
```


#### Example

The following two statements create a table and add values to the table.

```sql
CREATE TABLE t (v1 int, v2 int);
INSERT INTO t VALUES (1,12), (2,13), (3,30);
```

The row constructor in the statement below returns all rows in table "t" in the form of row values `(,)`.

```sql
SELECT row (v1, v2*2) AS demo FROM t;
```

```
  demo  
--------
 (1,24)
 (2,26)
 (3,60)
(3 rows)
```

## Array constructors


An array constructor is an expression that creates an array from a group of values. 

An array can be construcuted with the following syntax.

```sql
ARRAY [expression1, expression2, ...]
```

For example:
```sql
SELECT ARRAY[1, 2, 3*4];
----------
 {1,2,12}
(1 row)

```

An array constructor can be nested in another array constructor. For example:

```sql
SELECT ARRAY[ARRAY[1, 2], ARRAY[3, 4]];
----------
 {{1,2},{3,4}}
(1 row)
```

For a nested array constructor, `ARRAY` cannot be omitted. The following statement cannot be parsed.
```sql
SELECT ARRAY[[1,2], [3,4]];
```

When you create a table, define an array with square brackets. For example:
```sql
CREATE TABLE (f1 INT[], f2 INT[]);

INSERT INTO arr VALUES (ARRAY[1,2], ARRAY[3,4]);
```
