---
id: sql-pattern-dynamic-filter
slug: /sql-pattern-dynamic-filter
title: Dynamic filter
---

Dynamic filter functions as a filter operator, but the filter condition contains a dynamic variable determined by the inner stream.

The conditions must be `left_col cond right_col`, where `cond` can be one of `==, <>, <, <=, >, >=`. Furthermore, it can be easily extended to multiple conditions like `left_col cond_1 right_col_1 AND left_col cond_2 right_col_2 AND ...`.

A streaming query is a type of query that processes incoming data in real-time as it arrives instead of waiting for all data to be loaded into the database in bulk before processing it all at once, as is done with a batch query. This enables continuous, low-latency processing of data streams, allowing applications to respond quickly to new data as it arrives.

General non-equal joins are not supported in streaming, except for one special case. If a query with non-equal conditions meets the conditions below:
- The inner side always contains exactly one row.
- None of the columns from the inner side is required to output.
- The filter condition can be incrementally evaluated when the inner row changes.


Here's a special use case using a one-row table as a variable. For example, `t_erase_ts` is a table to save the minimal timestamp of querying data:

```
┌──────────────┐
│   erase_ts   │
├──────────────┤
│  1673241158  │
└──────────────┘
```

Then the following materialized view shows all the data above that timestamp:

```sql
CREATE MATERIALIZED VIEW data_not_erased AS
SELECT t1.* FROM t1 JOIN t_erase_ts
WHERE t1.k > erase_ts

ERROR:  QueryError: Feature is not yet implemented: stream nested-loop join
```

OR

```sql
CREATE MATERIALIZED VIEW data_not_erased AS
SELECT t1.* FROM t1
WHERE t1.value >= (select erase_ts from t_erase_ts);

ERROR:  QueryError: internal error: Scalar subquery might produce more than one row.
```

However, those queries will be rejected because RisingWave doesn't know there is always only one row in table `t_erase_ts`. To make it work, add an aggregation there:

```sql
CREATE MATERIALIZED VIEW data_not_erased AS
SELECT t1.* FROM t1
WHERE t1.k > (select MAX(erase_ts) from t_erase_ts)
```

`MAX(erase_ts)` updates as new data comes in. When that happens, the data retrieved will change, and some data will be trimmed.

