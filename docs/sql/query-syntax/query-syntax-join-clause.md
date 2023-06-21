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

## Windows joins (need a bit more time to handle)

Window Join involves the processing of Watermarks. In Regular Equi-Join, the Join state may expand without restriction, while Window Join can use the input Watermark information to clean up the Join state, maintaining it at a reasonable size. The condition ts1 = ts2 is necessary for constructing Window Join, where ts1 is the Watermark column of table t1, and ts2 is the Watermark column of table t2.

```sql
create source t1 (ts1 timestamp with time zone, a1 int, b1 int, watermark for ts1 as ts1 - INTERVAL '1' SECOND) with (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
create source t2 (ts2 timestamp with time zone, a2 int, b2 int, watermark for ts2 as ts2 - INTERVAL '1' SECOND) with (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
-- window join
select * from t1, t2 where ts1 = ts2 and a1 = a2;
```

## Interval joins (also needs knowledge about watermark)

Base on the watermark and specify a range based on it.

```sql
create source t1 (ts1 timestamp with time zone, a1 int, b1 int, watermark for ts1 as ts1 - INTERVAL '1' SECOND) with (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
create source t2 (ts2 timestamp with time zone, a2 int, b2 int, watermark for ts2 as ts2 - INTERVAL '1' SECOND) with (
    connector = 'datagen',
    datagen.rows.per.second = '10',
);
-- interval join
select * from t1, t2 where a1 = a2 and ts1 between ts2 - INTERVAL '10' SECOND and ts2 + INTERVAL '15' SECOND;
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
