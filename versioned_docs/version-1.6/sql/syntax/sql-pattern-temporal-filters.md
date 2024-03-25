---
id: sql-pattern-temporal-filters
slug: /sql-pattern-temporal-filters
title: Temporal filters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-pattern-temporal-filters/" />
</head>

Temporal filters allow you to filter data based on time intervals, which are used to retrieve data within a specific time range. Temporal filters will enable you to filter data based on a particular time, such as the current time, a specific date, or a range of dates. By using temporal filters, you can ensure that your queries only return data relevant to the period you are interested in, making your data analysis more accurate and efficient.

## Syntax

The temporal filter is an expression using `NOW()`. It can only be used in the `WHERE` and `HAVING` clauses in the query.

An valid temporal filter comprises the following components:

- A comparison operator, including `<`, `>`, `<=`, `>=`, `=` and `BETWEEN`
- A time expression of the columns in the base relation as the left side 
- A time expression with `NOW() +/- interval` as the right side

There could be multiple temporal filters and other expressions in the `WHERE` clause connected with the `AND` operator.

```sql
-- Allowed
t > NOW() - INTERVAL '1 hour' AND t < NOW() + INTERVAL '1 hour' AND a < 1
```

A temporal filter condition cannot be connected with another temporal filter using the `OR` operator, but connecting it with a normal expression is allowed. See the examples below:

```sql
-- Allowed
t > NOW() - INTERVAL '1 hour' OR t IS NULL OR a < 1

-- Invalid
t > NOW() - INTERVAL '1 hour' OR t < NOW() - INTERVAL '1 hour'

-- Invalid
(a < 1) OR (t > NOW() - INTERVAL '1 hour' AND t < NOW() - INTERVAL '1')
```

Also, in the `WHERE` clause, each expression connected by the `AND` operator should have only one `OR` expression with a temporal filter.

```sql
-- Invalid
(t > NOW() - INTERVAL '1 hour' OR t is NULL OR a < 1) 
AND (t < NOW() - INTERVAL '1 hour' OR a < 1)
```

## Usage 1: Delete and clean expired data

When the time expression with `NOW()` is the lower bound condition of the base relation, such as `t > NOW() - INTERVAL '1 hour'`, it can filter records with event times that are too old.

The following query returns all rows from the `sales` table where the `sale_date` column plus one week is greater than the current date and time. In other words, it will return all sales records within the past week.

```sql
SELECT * 
FROM sales 
WHERE sale_date > NOW() - INTERVAL '1 week';
```

The temporal filter in this query is `sale_date > NOW() - INTERVAL '1 week'`. It filters the rows based on the `sale_date` column and checks if it is within one week of the current time or `NOW()`.

The following query returns all rows from the `user_sessions` table where the sum of the `last_active` timestamp and double the `session_timeout` duration is greater than the current timestamp, indicating active user sessions. This query could be used to clean up old user sessions from the database by deleting any rows that no longer satisfy the condition.

```sql
SELECT * 
FROM user_sessions 
WHERE last_active + session_timeout * 2 > NOW();
```

The temporal filter in this query is in the `WHERE` clause. It checks whether the timestamp of the last activity plus twice the session timeout is greater than the current time or `NOW()`. This indicates that the session is still active.

## Usage 2: Delay table changes

When the time expression with `NOW()` is the upper bound condition of the base relation such as `ts + interval '1 hour' < now()`, it can "delay" the table's changes of the input relation. It could be useful when used with the [Temporal Join](/sql/query-syntax/query-syntax-join-clause.md).

Here is a typical example of the temporal join used to widen a fact table.

```sql
  CREATE SOURCE fact(id1 INT, a1 INT, p_time TIMESTAMPTZ AS proctime()) WITH (connector = 'kafka', ...);
  CREATE TABLE dimension(id2 INT, a2 INT, PRIMARY KEY (id2)) WITH (connector = 'jdbc', ...);
  CREATE MATERIALIZED VIEW mv AS SELECT id1, a1, a2 FROM fact LEFT JOIN dimension FOR SYSTEM_TIME AS OF PROCTIME() ON id1 = id2;
```

However, due to delays caused by the network or other phases, it is not guaranteed that when the record of the `fact` arrives, the corresponding record in the `dimension` table has arrived. Therefore, a temporal filter can be set on the `fact` source to introduce a delay and wait for the dimension table's changes.

```sql
  CREATE MATERIALIZED VIEW mv AS 
  SELECT 
    id1, a1, a2 
  FROM (
    -- Delay the source for 5 seconds
    SELECT * FROM fact WHERE fact.p_time + INTERVAL '5' SECOND < NOW()
  ) fact
  LEFT JOIN dimension FOR SYSTEM_TIME AS OF PROCTIME() ON id1 = id2;
```

:::note

Currently, RisingWave's optimizer cannot ensure the temporal filter's predicate pushdown. Please add the temporal filter in the `FROM` clause as a sub-query, like the SQL example, instead of writing the temporal filter in the query's top `WHERE` clause.

:::

:::info

The `PROCTIME` in the example can be replaced with the event time in the records.

:::
