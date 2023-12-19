---
id: alter-streaming
title: Alter streaming jobs
description: Update an existing streaming job.
slug: /alter-streaming
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/alter-streaming/" />
</head>

This document covers the mechanisms for altering logic within streaming pipelines in RisingWave. Understanding these mechanisms is crucial for managing and evolving your data processing workflows.

## Concepts & Pipeline Composition

Altering streaming logic essentially modifies the pipeline's **intermediate states, logic**, and **materialized results**:

- **Logic:** The transformation applied to the data stream.
- **State:** Internal data structures holding intermediate results used for calculations and updates.
- **Materialized results:** The persistent table structure used for serving queries.

## Sink

Sink pipelines consist of logic and intermediate states, but without materialized results:

```
logic + intermediate states (persistent)
```

Here are different scenarios for altering sink logic:

- **Add separate sinks**. This avoids affecting existing state, but requires the modification to be independent. Consistency between new and existing sinks is not guaranteed.
    
    For example, suppose we want to add a new column to the destination table:
    
    ```sql
    ALTER TABLE customers ADD COLUMN birth_date;
    ```
    
    We can create a new sink that specifically writes the additional column `birth_date` to the downstream table `customers`.
    
    ```sql
    ALTER SOURCE test_source ADD COLUMN birth_date;
    
    CREATE SINK sink_1 AS
      SELECT
        customer_id,
        SUM(total_price) AS sales_amount
      FROM test_source
      GROUP BY customer_id
    WITH (
      'table.name' = 'customers',
      'primary_key' = 'customer_id'
    );
    
    CREATE SINK sink_2 AS
      SELECT 
        customer_id,
        birth_date -- additional column
      FROM test_source
    WITH (
      'table.name' = 'customers',
      'primary_key' = 'customer_id'
    );
    ```
    
    In the above case, `birth_date` will not be updated along with each `sales_amount` update.
    
- **Drop and recreate sinks**. This solution discards previous states. Choose this option if the modification depends on previous sinks.

## ****Materialized View****

Unlike sinks, materialized views tightly couple logic, states, and results. This semantic coupling makes altering the logic infeasible.

```
logic + intermediate states (persistent) -> materialized results (persistent)
```

The only current option is to drop and recreate the entire materialized view. Let’s use an example to illustrate the inherent reason for this constraint.

Given a table `adult_users` that tracks the number of users aged ≥ 18. 

```sql
CREATE MATERIALIZED VIEW adult_users AS
	SELECT
	  COUNT(*) as user_count
	FROM users
  WHERE age >= 18;
```

Later, it turns out that the legal definition for adulthood should be ≥16. Intuitively, one may attempt to simply modify the filter condition from `age ≥ 18` to `age ≥ 16`. However, this is not possible due to the nature of stream processing: records with age < 18 were already filtered out. Consequently, the only way to refill the missing data is to recompute the entire stream from scratch.

Therefore, as a best practice, it is recommended to persistently store the source data in a long-term storage, e.g, [a RisingWave Table](https://docs.risingwave.com/docs/current/sql-create-table/). This enables recomputing the materialized view when altering logic is necessary.

## Table

Similar to traditional databases, RisingWave offers [dynamic table schema change](https://docs.risingwave.com/docs/current/sql-alter-table/). Unlike sinks, tables essentially involve no transformation logic or intermediate states. Users can add or drop columns, while the schema change will not directly affect materialized views atop the table.

## Future Roadmap

We are actively developing features to enhance logic alteration capabilities:

- **RisingWave Table Sinks:** Unlike materialized views, results are decoupled from logic, thus allowing multiple sinks to write to the same destination, similar to third-party sinks like Postgres sink.
    
    ```sql
    sink1: logic + intermediate states (persistent) ->
    sink2: logic + intermediate states (persistent) -> table
    sink3: logic + intermediate states (persistent) ->
    ```
    
    A use case for this feature is unifying multiple data sources into one destination. Typically, we use UNION clauses to combine multiple SELECT statements.
    
    ```sql
    CREATE SINK sink1 AS
    	SELECT
    	  id, name, age
    	FROM t1
    UNION -- The logic is unmodifiable.
    	SELECT
    	  id, name, age
    	FROM t2
    WITH (
      ...
    );
    
    CREATE SINK sink2 AS
    	SELECT
    	  id, name, age
    	FROM t3
    WITH (
      ...
    );
    ```
    
    As illustrated above, the sink will be unmodifiable once built, disallowing the user to add another UNION clause to `sink1`.  To prevent losing the states, the user can create a new sink `sink2` to the same destination, instead of adding a UNION clause.