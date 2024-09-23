---
id: query-syntax-value-exp
slug: /query-syntax-value-exp
title: Value expressions
description: Represent fixed values in SQL commands.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-value-exp/" />
</head>

Value expressions are used in a variety of contexts, such as in the target list of the `SELECT` command, as new column values in `INSERT` or `UPDATE`, or in search conditions in a number of commands. The result of a value expression is sometimes called a scalar, to distinguish it from the result of a table expression (which is a table).

## Aggregate function calls

An aggregate function call represents the application of an aggregate function across the rows selected by a query.

An aggregate function call should be in one of the following syntaxes:

```sql
aggregate_name ( expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( DISTINCT expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( * ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( [ expression [ , ... ] ] ) WITHIN GROUP ( order_by_clause ) [ FILTER ( WHERE filter_clause ) ]
```

`aggregate_name` is one of the aggregation functions listed on [Aggregate functions](/sql/functions-operators/sql-function-aggregate.md), and `expression` is a value expression that does not contain an aggregate expression or a window function call.

The `DISTINCT` keyword, which is only available in the second form, cannot be used together with an `ORDER BY` or `WITHIN GROUP` clause. Additionally, it's important to note that the `order_by_clause` is positioned differently in the first and fourth forms.

In batch mode, `aggregate_name` can also be in the following form:

```sql
AGGREGATE:function_name
```

where the `AGGREGATE:` prefix converts a [builtin array function](../functions-operators/sql-function-array.md) (e.g. `array_sum`) or an [user-defined function](../../sql/udf/user-defined-functions.md), to an aggregate function. The function being converted must accept exactly one argument of an [array type](../data-types/data-type-array.md). After the conversion, a function like `foo ( array of T ) -> U` becomes an aggregate function like `AGGREGATE:foo ( T ) -> U`.

## Window function calls

A window function call represents the application of an aggregate-like function over a set of rows that are related to the current row (the "window").

The "window" is defined by the `OVER` clause, which generally consists of three parts:

- Window partitioning (the `PARTITION BY` clause): Specifies how to partition rows into smaller sets.
- Window ordering (the `ORDER BY` clause): Specifies how the rows are ordered. This part is required for ranking functions.
- Window frame (the `ROWS`, `RANGE` or `SESSION` clause): Specifies a particular row or the range of the rows over which calculations are performed.

A window function call should be in the following syntax:

```sql
window_function_name ( [expression [, expression ... ]] ) OVER
( PARTITION BY partition_expression
[ ORDER BY sort_expression [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
[frame_clause])
```

:::note

Currently, the `PARTITION BY` clause is required. If you do not want to partition the rows into smaller sets, you can work around by specifying `PARTITION BY 1::int`.

For ranking window functions like `row_number`, `rank` and `dense_rank`, `ORDER BY` clause is required.

When operating in the [Emit on window close](../../transform/emit-on-window-close.md) mode for a streaming query, `ORDER BY` clause is required for all window functions. Please ensure that you specify exactly one column in the `ORDER BY` clause. This column, generally a timestamp column, must have a watermark defined for it. It's important to note that when using the timestamp column from this streaming query in another streaming query, the watermark information associated with the column is not retained.

:::

`window_function_name` is one of the window functions listed on [Window functions](../../sql/functions-operators/sql-function-window-functions.md).

`frame_clause` can be one of:

```sql
{ ROWS | RANGE } frame_start [ frame_exclusion ]
{ ROWS | RANGE } BETWEEN frame_start AND frame_end [ frame_exclusion ]
SESSION WITH GAP gap [ frame_exclusion ]
```

For `ROWS` or `RANGE` frame, `frame_start` and `frame_end` can be:

```
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

If only `frame_start` is specified, `CURRENT ROW` will be used as the end of the window.

The requirements of `offset` vary in different frames. In `ROWS` frame, the `offset` should be a positive constant integer indicating the number of rows before or after the current row. While `RANGE` frame requires the `ORDER BY` clause to specify exactly one column, and the `offset` expression to be a positive constant of a data type that is determined by the data type of the ordering column. For example, if the ordering column is `timestamptz`, the `offset` expression should be an positive constant `interval`.

For `SESSION` frame, the requirements of `gap` are very similar to those of `offset` for `RANGE` frame. The `ORDER BY` clause should specify exactly one column and the `gap` expression should be a positive constant of a data type that is determined by the data type of the ordering column.

:::note

Currently, `SESSION` frame is only supported in batch mode and Emit-On-Window-Close streaming mode.

:::

`frame_exclusion` can be either of these:

```
EXCLUDE CURRENT ROW
EXCLUDE NO OTHERS
```

:::note

In RisingWave, `frame_clause` is optional. Depending on whether the `ORDER BY` clause is present, the default value is different. When the `ORDER BY` clause is present, the default value is `ROWS UNBOUNDED PRECEDING AND CURRENT ROW`. When the `ORDER BY` clause is not present, the default value is `ROWS UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. This is different from the behavior in PostgreSQL. We may align the default frame with PostgreSQL in the future.

:::

## Type casts

A type cast specifies a conversion from one data type to another.

```sql
CAST ( expression AS type )
expression::type
```

| Parameter | Description     |
|-----------|-----------------|
| *expression* | The expression of which the data type to be converted. |
| *type*       | The data type of the returned value.<br/>For the types you can cast the value to, see [Casting](/sql/data-types/data-type-casting.md |

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

The row constructor in the statement below returns all rows in table `t` in the form of row values `(,)`.

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
