---
id: sql-function-window-functions
slug: /sql-function-window-functions
title: Window functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-window-functions/" />
</head>

Window functions compute a single result for each row over a set of rows that are related to the current row (the "window").

For details about the syntax of window function calls, see [Window function calls](/sql/query-syntax/query-syntax-value-exp.md#window-function-calls).

## General-purpose window functions

### `row_number()`

The `row_number()` function assigns a unique sequential integer to each row within a partition of a result set. The numbering starts at 1 for the first row in each partition and increments by 1 for each subsequent row.

`row_number()` can be used to turn non-unique rows into unique rows. This could be used to eliminate duplicate rows.

The syntax of `row_number()` is:

```sql
row_number() → integer
```

:::note

We recommend using `row_number()` only for top-N pattern queries. For details about this pattern, see [Top-N by group](/sql/syntax/sql-pattern-topn.md).

:::

### `rank()`

`rank()` returns the rank of the current row, with gaps; that is, the `row_number` of the first row in its peer group.

The syntax of `rank()` is:

```sql
rank() → integer
```

### `dense_rank()`

`dense_rank()` returns the rank of the current row, without gaps; that is, if some rows share the same rank, the row next to them is assigned the next consecutive rank.

The syntax of `dense_rank()` is:

```sql
dense_rank() → integer
```

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

## Aggregate window functions

All aggregate functions, including `sum()`, `min()`, `max()`, `avg()` and `count()` etc., can be used as window functions.

For the complete list of aggregate functions and their usage, see [Aggregate functions](./sql-function-aggregate.md).
