---
id: sql-pattern-temporal-filters
slug: /sql-pattern-temporal-filters
title: Temporal filters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-pattern-temporal-filters/" />
</head>

With temporal filters, you can filter data based on a particular time, such as the current time, a specific date, or a range of dates. By using temporal filters, you can ensure that your queries only return data relevant to the period you are interested in, making your data analysis more accurate and efficient.

Temporal filters are usually used to represent a slide window with a flexibile start or end. Below are some examples.

```bash
time_col >= now() - INTERVAL '1 hour' 
# a sliding window of recent 1 hour
time_col BETWEEN now() - INTERVAL '2 hour' AND NOW() - INTERVAL '1 hour'
# a sliding window of an hour between two hours earlier and one hour earlier
time_col >= date_trunc('day', now())
# a sliding window of today (from 0:00)
```

The following expressions are not temporal filters:

```bash
time_col >= '2022-10-01 00:00:00'
# an ordinary static filtering condition
to_char(time_col, 'yyyymmdd')` = to_char(now(), 'yyyymmdd')
# the condition is not applied on datetime/timestamp data type
```

In addition, temporal filters are also used to bound the size of states for an arbitrary query. A query without temporal conditions generally returns all historical data, and the size of states will grow without limits. To address this issue, you can use temporal filters.

Let's see two examples.

```sql
SELECT customer_id, amount FROM orders GROUP BY customer_id;
-- the size of states is unbounded
SELECT customer_id, amount FROM orders GROUP BY customer_id
WHERE order_date > NOW() - INTERVAL '7 DAYS';
-- the size of states is bounded
```

## Syntax

```bash
time_col comparison_operator NOW() +/- interval
```

`comparison_operator` can be `<`, `>`, `<=`, `>=` and `BETWEEN`. If it is `BETWEEN`, you also need to add another `NOW() +/- interval` expression after `AND`.

Besides, the temporal filter condition must not be part of an `OR` expression. For example, `t > NOW() - INTERVAL '1 hour' OR a > 0` is invalid.

## Examples

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
