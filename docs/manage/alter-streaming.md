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

ALTER SOURCE test_source ADD COLUMN birth_date;
```

The new column will be `NULL` for existing records. 

## Alter a materialized view

To alter a materialized view, you need to create a new materialized view and drop the existing one. 

For example, suppose we want to add a new column to the materialized view `mv1`:
    
```sql
ALTER TABLE customers ADD COLUMN birth_date;
```

Here we create a new materialized view `mv1_new` with the new column `sales_count`:
    
```sql
CREATE MATERIALIZED VIEW mv1_new AS
    SELECT
        customer_id,
        SUM(total_price) AS sales_amount,
        COUNT(*) AS sales_count -- The new column
    FROM test_source
    GROUP BY customer_id;
```

After the new materialized view is created, we can drop the old materialized view `mv1` and rename `mv1_new` to `mv1`:

```sql
DROP SINK mv1;
ALTER MATERIALIZED VIEW mv1_new RENAME TO mv1;
```

## Alter a sink

To alter a sink, you will need to create a new sink and drop the old sink. Please check the example from the last section.

Specifically, if your sink is created based on a materialized view i.e. created with `CREATE SINK ... FROM ...` statement, you may optionally specify `without_backfill = true` to skip the existing data.

```sql
CREATE SINK ... FROM ... WITH (without_backfill = true).
```

## Why I cannot modify a streaming job in place?

Streaming systems like RisingWave need to maintain **internal state** for streaming operators, such as joins and aggregations. Generally, modifying a materialized view would require consistent changes to the internal state accordingly, which is not always feasible. Let’s take the example below to illustrate it.

Given a table `adult_users` that tracks the number of users aged ≥ 18. 

```sql
CREATE MATERIALIZED VIEW adult_users AS
  SELECT
    COUNT(*) as user_count
  FROM users
  WHERE age >= 18;
```

Later, it turns out that the legal definition for adulthood should be ≥16. Intuitively, one may attempt to simply modify the filter condition from `age >= 18` to `age >= 16`. However, this is not possible due to the nature of stream processing: records with age between 16 and 18 were already filtered out. Consequently, the only way to refill the missing data is to recompute the entire stream from scratch.

Therefore, as a best practice, it is recommended to persistently store the source data in a long-term storage, e.g, [a RisingWave Table](https://docs.risingwave.com/docs/current/sql-create-table/). This enables recomputing the materialized view when altering logic is necessary.
