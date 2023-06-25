---
id: query-syntax-join-clause
slug: /query-syntax-join-clause
title: Joins
---

A JOIN clause, also known as a join, combines the results of two or more table expressions based on certain conditions, such as whether the values of some columns are equal.

For regular equality joins on streaming queries, the temporary join results are unbounded. If the size of the join results becomes too large, query performance may get impacted.

## Syntax of the JOIN clause

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

You can join two sources that have the same watermarks. This is called a window join. In a regular join (that is, a join without time attributes), the join state may grow without restriction. With window joins, the join state size can be kept at a resonable size.

The syntax of a window join is:

```sql
<table_expression> JOIN <table_expression> ON <equality_join_conditions>
```

In which, one of the `equality_join_conditions` must be an equality condition based on the watermarks of the two table expressions.

For example, suppose you have these two sources:

```sql
CREATE SOURCE t1 (ts1 timestamp with time zone, a1 int, b1 int, WATERMARK for ts1 AS ts1 - INTERVAL '1' SECOND) WITH (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
CREATE SOURCE t2 (ts2 timestamp with time zone, a2 int, b2 int, WATERMARK for ts2 as ts2 - INTERVAL '1' SECOND) WITH (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
```

You can join them with the following statement:

```sql
SELECT * FROM t1
JOIN t2
ON ts1 = ts2 
AND a1 = a2;
```

## Interval joins

Window joins require that the two sources have the exactly same watermarks. This requirement can be too strict in some scenarios. If you want to join two sources that have some time offset, you can create an interval join by specifying an accepted internval range based on watermarks.

The syntax of an interval join is:

```sql
<table_expression> JOIN <table_expression> ON <equality_join_condition> AND <interval_condition>
```

In an interval join, the `interval_condtion` must be a watermark-based range.

For example, for sources `t1` and `t2` used in the above section, you can create an interval join:

```sql
SELECT * FROM t1
JOIN t2 
WHERE a1 = a2 
AND ts1 BETWEEN ts2 - INTERVAL '10' SECOND AND ts2 + INTERVAL '15' SECOND;
```

## Process-time temporal joins

A temporal join is often used to widen a fact table. Its advantage is that it does not require RisingWave to maintain the join state, making it suitable for scenarios where the dimension table is not updated, or where updates to the dimension table do not affect the previously joined results.

### Syntax

```sql
<left_table_expression> [ LEFT | INNER ] JOIN <right_table_expression> FOR SYSTEM_TIME AS OF PROCTIME() ON <join_conditions>;
```

### Notes

- The left table expression is an append-only table or source.
- The right table expression is a table or materialized view.
- The process-time syntax `FOR SYSTEM_TIME AS OF PROCTIME()` is included in the right table expression.
- The join type is INNER JOIN or LEFT JOIN.
- The Join condition includes the primary key of the right table expression.

### Example

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

You can use a temporal join to fetch the latest product name and price from the `products` table and form a wider table.

```sql
SELECT transaction_id, product_id, quantity, sale_date, product_name, price 
FROM sales
JOIN products FOR SYSTEMSYSTEM_TIME AS OF PROCTIME()
ON product_id = id
```

| transaction_id | product_id | quantity | sale_date  | product_name | price |
|----------------|------------|----------|------------|--------------|-------|
| 1              | 101        | 3        | 2023-06-18 | Product A    | 25    |
| 2              | 102        | 2        | 2023-06-19 | Product B    | 15    |
| 3              | 101        | 1        | 2023-06-20 | Product A    | 22    |
