---
id: alter-streaming
title: Alter a streaming job
description: Update an existing streaming job.
slug: /alter-streaming
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/alter-streaming/" />
</head>

This document explains how to modify the logic in streaming pipelines within RisingWave. Understanding these mechanisms is essential for effectively managing your data processing workflows.


## Alter a table or source

To add or drop columns from a table or source, simply use the [ALTER TABLE](https://docs.risingwave.com/docs/dev/sql-alter-table/) or [ALTER SOURCE](https://docs.risingwave.com/docs/dev/sql-alter-source/) command. For example:

```sql
ALTER TABLE customers ADD COLUMN birth_date;

ALTER SOURCE orders ADD COLUMN birth_date;
```

The new column will be `NULL` for existing records. 

## Alter a materialized view

To alter a materialized view, you need to create a new materialized view and drop the existing one. 

For example, suppose we want to add a new column to the materialized view `cust_sales`:
    
```sql
CREATE MATERIALIZED VIEW cust_sales AS
    SELECT
        customer_id,
        SUM(total_price) AS sales_amount,
    FROM orders
    GROUP BY customer_id;
```

Here we create a new materialized view `cust_sales_new` with the new column `sales_count`:
    
```sql
CREATE MATERIALIZED VIEW cust_sales_new AS
    SELECT
        customer_id,
        SUM(total_price) AS sales_amount,
        COUNT(*) AS sales_count -- The new column
    FROM orders
    GROUP BY customer_id;
```

After the new materialized view is created, we can drop the old materialized view `cust_sales` and rename `cust_sales_new` to `cust_sales`:

```sql
DROP MATERIALIZED VIEW cust_sales;
ALTER MATERIALIZED VIEW cust_sales_new RENAME TO cust_sales;
```

## Alter a sink

To alter a sink, you will need to create a new sink and drop the old sink. Please check the example from the last section.

If your sink is created based on a materialized view using the `CREATE SINK ... FROM ...` statement, you have the option to specify `without_backfill = true` to exclude existing data.

```sql
CREATE SINK ... FROM ... WITH (without_backfill = true).
```

## Alter streaming jobs with dependencies

If the modified materialized view is depended upon by other materialized views or sinks, or if multiple materialized views or sinks with dependencies need to be modified simultaneously, similarly, first create all the new ones and then drop all the old ones.

Let's continue with the previous example, but suppose the upstream `orders` is not a table but another materialized view, derived from tables `order_items` and `price`.

```sql
CREATE MATERIALIZED VIEW orders AS
    SELECT
        order_id,
        customer_id,
        SUM(price * quantity) AS total_price,
    FROM order_items, price
    WHERE order_items.product_id = price.product_id
    GROUP BY order_id, customer_id;

CREATE MATERIALIZED VIEW cust_sales AS
    SELECT
        customer_id,
        SUM(total_price) AS sales_amount,
    FROM orders
    GROUP BY customer_id;
```

To add a new column `sales_count` to `cust_sales`, we need to create the new materialized views `cust_sales_new` and `orders_new` first:

```sql
CREATE MATERIALIZED VIEW orders_new AS
    SELECT
        order_id,
        customer_id,
        SUM(price * quantity) AS total_price,
        COUNT(*) AS item_count -- The new column
    FROM order_items, price
    WHERE order_items.product_id = price.product_id
    GROUP BY order_id, customer_id;

CREATE MATERIALIZED VIEW cust_sales_new AS
    SELECT
        customer_id,
        SUM(total_price) AS sales_amount,
        SUM(item_count) AS sales_count -- The new column
    FROM orders
    GROUP BY customer_id;
```

After the new materialized views are created, we can drop the old materialized view `cust_sales` and rename `cust_sales_new` to `cust_sales`:

```sql
DROP MATERIALIZED VIEW orders;
ALTER MATERIALIZED VIEW orders_new RENAME TO orders;

DROP MATERIALIZED VIEW cust_sales;
ALTER MATERIALIZED VIEW cust_sales_new RENAME TO cust_sales;
```

## Why is it not possible to modify a streaming job in place?

Streaming systems like RisingWave need to maintain **internal state** for streaming operators, such as joins and aggregations. Generally, modifying a materialized view would require consistent changes to the internal state accordingly, which is not always feasible. Let’s see an example.

Given a table `adult_users` that tracks the number of users aged ≥ 18. 

```sql
CREATE MATERIALIZED VIEW adult_users AS
  SELECT
    COUNT(*) as user_count
  FROM users
  WHERE age >= 18;
```

It was discovered later that the legal definition for adulthood should be set at ≥16. Initially, one might consider modifying the filter condition from `age >= 18` to `age >= 16` as a straightforward solution. However, this is not feasible in stream processing since records with ages between 16 and 18 have already been filtered out. Therefore, the only option to restore the missing data is to recompute the entire stream from the beginning.

Therefore, we recommend persistently storing the source data in a long-term storage solution, such as [a RisingWave table](/sql/commands/sql-create-table.md). This allows for the recomputation of the materialized view when altering the logic becomes necessary.
