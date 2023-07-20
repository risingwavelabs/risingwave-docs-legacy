---
id: window-functions
slug: /window-functions
title: Window functions
---
Window or windowing functions perform a calculation over a set of rows that are related to the current row (the "window").

The "window" is defined by the `OVER` clause, which generally consists of three parts:

- Window partitioning (the `PARTITION` clause): Specifies how to partition rows into smaller sets. If not provided, RisingWave will not partition the rows into smaller sets.
- Window ordering (the `ORDER BY` clause): Specifies how the rows are ordered. This part is required for ranking functions.
- Window frame (the `ROWS` expression): Specifies a particular row or the range of the rows over which calculations are performed.

## Syntax

```sql
window_function (expression) OVER ([PARTITION BY partition_expression ] [ORDER BY sort_expression,] [frame_expression])

```

`window_function` can be one of the following:

- Ranking function – `row_number()`
- Aggregate-type function – `sum()`, `min()`, `max()`, `avg()` and `count()`
- Value functions – `lead()`, `lag()`, `first_value()`, and `last_value()`

The syntax of `frame_expression` is:

```sql
ROWS
{ UNBOUNDED PRECEDING | n PRECEDING | CURRENT ROW } |

{ BETWEEN
{ UNBOUNDED PRECEDING | n { PRECEDING | FOLLOWING } | CURRENT ROW}
AND
{ UNBOUNDED FOLLOWING | n { PRECEDING | FOLLOWING } | CURRENT ROW }}
```

## `row_number()`

The `row_number()` function assigns a unique sequential integer to each row within a partition of a result set. The numbering starts at 1 for the first row in each partition and increments by 1 for each subsequent row.

`row_number()` can be used to turn non-unique rows into unique rows. This could be used to eliminate duplicate rows, for example.

The syntax for `row_number()` is:

```sql
row_number() OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

## `lag()` and `lead()`

`lag()` allows you to access the value of a previous row in the result set. You can specify the number of rows to look back and also provide a default value in case the previous row does not exist.

The syntax for `lag()` is:

```sql
lag(expression [, offset [, default ]]) OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

`lead()` is similar to `lag()`, but it allows you to access the value of a subsequent row in the result set.

The syntax for `lead()` is:

```sql
lead(expression [, offset [, default ]]) OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

## `first_value()` and `last_value()`

The `first_value()` function returns the value of the first row in the current window frame.

The syntax for `first_value()` is:

```sql
first_value(expression) OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

`last_value()` returns the value of the last row in the current window frame.

The syntax for `last_value()` is:

```sql
last_value(expression) OVER (PARTITION BY partition_expression ORDER BY sort_expression)
```

## Aggregate-type window functions

The aggregate-type window functions include `sum()`, `min()`, `max()`, `avg()` and `count()`.

Although the calculations that are performed in aggregate-type window functions are similar to those performed by regular aggregate functions, they are different in nature.

Unlike regular aggregate functions, aggregate-type window functions does not group multiple rows into a single output row — the rows retain their separate identities. Behind the scenes, aggregate-type window functions can access more than just the current row of the query result.
