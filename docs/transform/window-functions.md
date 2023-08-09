---
id: window-functions
slug: /window-functions
title: Window functions (OVER clause)
---
Window or windowing functions perform a calculation over a set of rows that are related to the current row (the "window").

The "window" is defined by the `OVER` clause, which generally consists of three parts:

- Window partitioning (the `PARTITION` clause): Specifies how to partition rows into smaller sets. If not provided, RisingWave will not partition the rows into smaller sets.
- Window ordering (the `ORDER BY` clause): Specifies how the rows are ordered. This part is required for ranking functions.
- Window frame (the `ROWS` clause): Specifies a particular row or the range of the rows over which calculations are performed.

If your goal is to generate calculation results strictly as append-only output when a window closes, you can utilize the emit-on-window-close policy. This approach helps avoid unnecessary computations. For more information on the emit-on-window-close policy, please refer to [Emit on window close](/transform/emit-on-window-close.md).

## Syntax

```sql
window_function ( [expression [, expression ... ]] ) OVER 
( PARTITION BY partition_expression 
[ ORDER BY sort_expression [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
[frame_clause])

```

`window_function` can be one of the following:

- Ranking functions – `row_number()`, `rank()`
- Aggregate-type functions – `sum()`, `min()`, `max()`, `avg()` and `count()`
- Value functions – `lead()`, `lag()`, `first_value()`, and `last_value()`

:::note

The `PARTITION` clause is required. If you do not want to partition the rows into smaller sets, you can work around by specifying `PARTITION BY 1::int`.

:::

When operating in the emit-on-window-close mode for a streaming query, it is necessary to include an ORDER BY clause for each window function. Please ensure that you specify only one column to order by. This column must be a timestamp column that includes watermarks. It's important to note that when using the timestamp column from this streaming query in another streaming query, the watermark information associated with the column is not retained.

The syntax of `frame_clause` is:

```sql
{ ROWS } frame_start [ frame_exclusion ]
{ ROWS } BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

`frame_start` and `frame_end` can be:

```
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

Where `offset` in a positive integer.

:::note

In RisingWave, `frame_clause` is optional. Depending on whether the `ORDER BY` clause is present, the default value is different. When the `ORDER BY` clause is present, the default value is `ROWS UNBOUNDED PRECEDING AND CURRENT ROW`. When the `ORDER BY` clause is not present, the default value is `ROWS UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. This is different from the behavior in PostgreSQL. The difference is temporary. Once the `RANGE` frame clause is supported in RisingWave, the default values will be aligned with PostgreSQL.

:::

## General-purpose window functions

### `row_number()`

The `row_number()` function assigns a unique sequential integer to each row within a partition of a result set. The numbering starts at 1 for the first row in each partition and increments by 1 for each subsequent row.

`row_number()` can be used to turn non-unique rows into unique rows. This could be used to eliminate duplicate rows.

### `rank()`

Returns the rank of the current row, with gaps; that is, the `row_number` of the first row in its peer group. Only top-N pattern is supported. For details about this pattern, see [Top-N by group](../syntax/sql-pattern-topn.md).

### `lag()` and `lead()`

`lag()` allows you to access the value of a previous row in the result set. You can specify the number of rows to look back.

The syntax of `lag()` is:

```sql
lag ( value anycompatible [, offset const integer] ) → anycompatible
```

`lead()` is similar to `lag()`, but it allows you to access the value of a subsequent row in the result set.

The syntax of `lead()` is:

```sql
lead ( value anycompatible [, offset const integer] ) → anycompatible
```

### `first_value()` and `last_value()`

The `first_value()` function returns the value of the first row in the current window frame.

The syntax of `first_value()` is:

```sql
first_value ( value anyelement ) → anyelement
```

`last_value()` returns the value of the last row in the current window frame.

The syntax of `last_value()` is:

```sql
last_value ( value anyelement ) → anyelement
```

## Aggregate-type window functions

The aggregate-type window functions include `sum()`, `min()`, `max()`, `avg()` and `count()`.

Although the calculations that are performed in aggregate-type window functions are similar to those performed by regular aggregate functions, they are different in nature.

Unlike regular aggregate functions, aggregate-type window functions does not group multiple rows into a single output row — the rows retain their separate identities. Behind the scenes, aggregate-type window functions can access more than just the current row of the query result.
