---
id: query-syntax-join-clause
slug: /query-syntax-join-clause
title: Joins
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-join-clause/" />
</head>

A JOIN clause, also known as a join, combines the results of two or more table expressions based on certain conditions, such as whether the values of some columns are equal.

For regular equality joins on streaming queries, the temporary join results are unbounded. If the size of the join results becomes too large, query performance may get impacted. Therefore, you may want to consider time-bounded join types such as interval joins and temporal joins.

## Regular joins

RisingWave supports these regular join types:

- Inner joins
- Left (outer) joins
- Right (outer) joins
- Full (outer) joins

### Inner joins

An inner Join returns the rows from both the left and the right table expressions where the specified join condition is met. Rows that do not meet the condition will be excluded from the result set.

The syntax of INNER JOIN is as follows:

```sql
<table_expression> INNER JOIN <table_expression> ON <join_conditions>;
<table_expression> INNER JOIN <table_expression> USING (<col_name>, <col_name>, ...);
<table_expression> NATURAL [ INNER ] JOIN <table_expression>;
```

### Left outer joins

A left outer join (or simply left join) returns all rows from the left table expression and the matched rows from the right table expression. If no match is found, NULL values will be filled in for columns from the right table.

The syntax of LEFT (OUTER) JOIN is as follows:

```sql
<table_expression> LEFT [ OUTER ] JOIN <table_expression> ON <join_conditions>;
<table_expression> LEFT [ OUTER ] JOIN <table_expression> USING (<col_name>, <col_name>, ...);
<table_expression> NATURAL LEFT [ OUTER ] JOIN <table_expression>;
```

### Right outer joins

A right outer join (or simply right join) returns all rows from the right table expression and the matched rows from the left table expression. If no match is found, NULL values will be returned for columns from the left table expression.

The syntax of RIGHT (OUTER) JOIN is as follows:

```sql
<table_expression> RIGHT [ OUTER ] JOIN <table_expression> ON <join_conditions>;
<table_expression> RIGHT [ OUTER ] JOIN <table_expression> USING (<col_name>, <col_name>, ...);
<table_expression> NATURAL RIGHT [ OUTER ] JOIN <table_expression>;
```

### Full outer joins

A full outer join (or simply, full join) returns all rows when there is a match in either the left or right table expression. If no match is found, NULL values will be returned for columns from the table expression where no match is found.

```sql
<table_expression> FULL [ OUTER ] JOIN <table_expression> ON <join_conditions>;
<table_expression> FULL [ OUTER ] JOIN <table_expression> USING (<col_name>, <col_name>, ...);
<table_expression> NATURAL FULL [ OUTER ] JOIN <table_expression>;
```

## Windows joins

In a regular join (that is, a join without time attributes), the join state may grow without restriction. If you only need to get windowed results of two sources, you can segment data in the sources into time windows, and join matching windows from the two sources. To create a window join, the same time window functions must be used, and the window size must be the same.

The syntax of a window join is:

```sql
<time_window_expression> JOIN <time_window_expression> ON <join_conditions>;
```

One of the `join_conditions` must be an equality condition based on the watermarks of the two table expressions. For the syntax of `<time_window_expression>`, see [Time window functions](../functions-operators/sql-function-time-window.md).

For example, suppose you have these two sources:

```sql
CREATE SOURCE s1 (
 id int, 
 value int, 
 ts TIMESTAMP, 
 WATERMARK FOR ts AS ts - INTERVAL '20' SECOND
) WITH (connector = 'datagen');


CREATE SOURCE s2 (
 id int, 
 value int, 
 ts TIMESTAMP, 
 WATERMARK FOR ts AS ts - INTERVAL '20' SECOND
) WITH (connector = 'datagen');
```

You can join them with the following statement:

```sql
CREATE MATERIALIZED VIEW window_join AS
SELECT s1.id AS id1,
       s1.value AS value1,
       s2.id AS id2,
       s2.value AS value2
FROM TUMBLE(s1, ts, interval '1' MINUTE)
JOIN TUMBLE(s2, ts, interval '1' MINUTE)
ON s1.id = s2.id and s1.window_start = s2.window_start;
```

## Interval joins

Window joins require that the two sources have the same window type and window size. This requirement can be too strict in some scenarios. If you want to join two sources that have some time offset, you can create an interval join by specifying an accepted interval range based on watermarks.

The syntax of an interval join is:

```sql
<table_expression> JOIN <table_expression> ON <equality_join_condition> AND <interval_condition> ...;
```

In an interval join, the `interval_condition` must be a watermark-based range.

For example, for sources `s1` and `s2` used in the above section, you can create an interval join:

```sql
CREATE MATERIALIZED VIEW interval_join AS
SELECT s1.id AS id1,
       s1.value AS value1,
       s2.id AS id2,
       s2.value AS value2
FROM s1 JOIN s2
ON s1.id = s2.id and s1.ts between s2.ts and s2.ts + INTERVAL '1' MINUTE;
```

#### Notes

- Interval join‘s state cleaning is triggered only when upstream messages arrive, and it operates at the granularity of each join key. As a result, if no messages are received for a join key, the state may still hold stale data.

## Process-time temporal joins

Process-time temporal joins are divided into two categories: append-only process-time temporal join and non-append-only process-time temporal join. Check the following instructions for their differences.

### Append-only process-time temporal join

An append-only temporal join is often used to widen a fact table. Its advantage is that it does not require RisingWave to maintain the join state, making it suitable for scenarios where the dimension table is not updated, or where updates to the dimension table do not affect the previously joined results. To further improve performance, you can use the index of a dimension table to form a join with the fact table.

#### Syntax

```sql
SELECT ... FROM <table_expression> [AS <alias>]
[ LEFT | INNER ] JOIN <table_expression> FOR SYSTEM_TIME AS OF PROCTIME() [AS <alias>]
ON <join_conditions>;
```

#### Notes

- The left table expression is an append-only table or source.
- The right table expression is a table, index or materialized view.
- The process-time syntax `FOR SYSTEM_TIME AS OF PROCTIME()` is included in the right table expression.
- The join type is INNER JOIN or LEFT JOIN.
- The Join condition includes the primary key of the right table expression.

#### Example

If you have an append-only stream that includes messages like below:

| transaction_id | product_id | quantity | sale_date  | process_time        |
|----------------|------------|----------|------------|---------------------|
| 1              | 101        | 3        | 2023-06-18 | 2023-06-18 10:15:00 |
| 2              | 102        | 2        | 2023-06-19 | 2023-06-19 15:30:00 |
| 3              | 101        | 1        | 2023-06-20 | 2023-06-20 11:45:00 |

And a versioned table `products`:

| id | product_name | price | valid_from          | valid_to            |
|------------|--------------|-------|---------------------|---------------------|
| 101        | Product A    | 20    | 2023-06-01 00:00:00 | 2023-06-15 23:59:59 |
| 101        | Product A    | 25    | 2023-06-16 00:00:00 | 2023-06-19 23:59:59 |
| 101        | Product A    | 22    | 2023-06-20 00:00:00 | NULL                |
| 102        | Product B    | 15    | 2023-06-01 00:00:00 | NULL                |

For the same product ID, the product name or the price is updated from time to time.

You can use a temporal join to fetch the latest product name and price from the `products` table and form a wider table. To further improve performance, you can create an index for table `products`, and join `sales` with the index instead.

```sql
SELECT transaction_id, product_id, quantity, sale_date, product_name, price 
FROM sales
JOIN products FOR SYSTEM_TIME AS OF PROCTIME()
ON product_id = id WHERE process_time BETWEEN valid_from AND valid_to;
```

| transaction_id | product_id | quantity | sale_date  | product_name | price |
|----------------|------------|----------|------------|--------------|-------|
| 1              | 101        | 3        | 2023-06-18 | Product A    | 25    |
| 2              | 102        | 2        | 2023-06-19 | Product B    | 15    |
| 3              | 101        | 1        | 2023-06-20 | Product A    | 22    |

### Non-append-only process-time temporal join

Compared to the append-only temporal join, the non-append-only temporal join can accommodate non-append-only input for the left table. However, it introduces an internal state to materialize the lookup result for each left-hand side (LHS) insertion. This allows the temporal join operator to retract the join result it sends downstream when update or delete messages arrive.

#### Syntax

The non-append-only temporal join shares the same syntax as the append-only temporal join.

```sql
<table_expression> [ LEFT | INNER ] JOIN <table_expression> FOR SYSTEM_TIME AS OF PROCTIME() ON <join_conditions>;
```

#### Example

Now if you update the table `sales`:

```sql
UPDATE sales SET quantity = quantity + 1;
```

You will get these results:

| transaction_id | product_id | quantity | sale_date | product_name | price |
| --- | --- | --- | --- | --- | --- |
| 1 | 101 | 4 | 2023-06-18 | Product A | 25 |
| 2 | 102 | 3 | 2023-06-19 | Product B | 15 |
| 3 | 101 | 2 | 2023-06-20 | Product A | 22 |

:::note
Every time you update the left-hand side table, it will look up the latest data from the right-hand side table.
:::
