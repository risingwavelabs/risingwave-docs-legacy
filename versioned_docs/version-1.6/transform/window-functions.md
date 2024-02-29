---
id: window-functions
slug: /window-functions
title: Window functions (OVER clause)
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/window-functions/" />
</head>

Window or windowing functions perform a calculation over a set of rows that are related to the current row (the "window").

The "window" is defined by the `OVER` clause, which generally consists of three parts:

- Window partitioning (the `PARTITION BY` clause): Specifies how to partition rows into smaller sets.
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

:::note

Currently, the `PARTITION BY` clause is required. If you do not want to partition the rows into smaller sets, you can work around by specifying `PARTITION BY 1::int`.

For ranking window functions like `row_number` and `rank`, `ORDER BY` clause is required.

When operating in the emit-on-window-close mode for a streaming query, `ORDER BY` clause is required for each window function. Please ensure that you specify only one column to order by. This column, generally a timestamp column, must have a watermark defined for it. It's important to note that when using the timestamp column from this streaming query in another streaming query, the watermark information associated with the column is not retained.

:::

`window_function` can be one of the following:

- [General-purpose window functions](#general-purpose-window-functions)
- [Aggregate functions](#aggregate-window-functions)

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

Where `offset` is a positive integer. If only `frame_start` is specified, `CURRENT ROW` will be used as the end of the window.

`frame_exclusion` can be either of these:

```
EXCLUDE CURRENT ROW
EXCLUDE NO OTHERS
```

`EXCLUDE CURRENT ROW` means that the `CURRENT ROW` will be excluded from the frame.
`EXCLUDE NO OTHERS` indicates that all rows within the frame will be processed. As this is the default setting, there is no need to explicitly specify it.

:::note

In RisingWave, `frame_clause` is optional. Depending on whether the `ORDER BY` clause is present, the default value is different. When the `ORDER BY` clause is present, the default value is `ROWS UNBOUNDED PRECEDING AND CURRENT ROW`. When the `ORDER BY` clause is not present, the default value is `ROWS UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. This is different from the behavior in PostgreSQL. The difference is temporary. Once the `RANGE` frame clause is supported in RisingWave, the default values will be aligned with PostgreSQL.

:::

Example:
```sql
CREATE TABLE t (v1 int, v2 int);
INSERT INTO t VALUES(1, 2), (3, 4), (5, 6);
insert into t values(1, 0), (3, 1), (5, 2);
flush;
select * from t;
select v1, v2, array_agg(v2) over (partition by v1 order by v2 desc ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING ) FROM t;
```

Output:
```
-- select * from t;
 v1 | v2 
----+----
  1 |  2
  3 |  4
  5 |  6
  1 |  0
  3 |  1
  5 |  2
(6 rows)

-- select v1, v2, array_agg(v2) over (partition by v1 order by v2 desc ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING ) FROM t;
 v1 | v2 | array_agg 
----+----+-----------
  1 |  2 | {2,0}
  1 |  0 | {0}
  3 |  4 | {4,1}
  3 |  1 | {1}
  5 |  6 | {6,2}
  5 |  2 | {2}
(6 rows)
```

Explanation:
1. `array_agg` concatenates a set of values together.
2. `partition by v1` is similar to our aggregation clause of `GROUP BY`. We will group all rows with the same `v1` value, so we have 3 unique partitions: `v1:1`, `v1:3`, and `v1:5`.
4. Next, we consider 1 partition, `v1:1`. For this partition, we have 2 rows.
   `{v1:1, v2:2}` and `{v1:1, v2:0}`.
5. `order by v2 desc` specifies that the records should be processed in descending order based on the `v2` value. As a result, we first append `v2:2` and then `v2:0` to the `array_agg` function, yielding `{2,0}` for the `v1:1` partition.
6. The frame expression `ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING` also applies to each partition. For the first row in the `v1:1` partition, we have `{2, 0}` as the result of `array_agg`. However, since there's no row following the second row in the partition, the `array_agg` function only yields `{0}` for that row.
7. Repeat the logic from 4-6 for the other partitions, and you will get the expected results.

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

The aggregate window functions include `sum()`, `min()`, `max()`, `avg()` and `count()` etc. For the complete list of aggregate functions and their usage, see [Aggregate functions](../sql/functions-operators/sql-function-aggregate.md).
