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

An valid temporal filter comprises the following components:

- A comparision operator including `<`, `>`, `<=`, `>=`, `=` and `BETWEEN`
- A time expression of the columns in the base relation as the left side 
- A time expression with `NOW() +/- interval` as the right side

A temporal filter condition can not be connected with another temporal filter with `OR` expression, but connected with a normal expression is allowed.
e.g.

```SQL
/* this is allowed*/
t > NOW() - INTERVAL '1 hour' OR t is NULL OR a < 1
/* this is invalid!*/
t > NOW() - INTERVAL '1 hour' OR t < NOW() - INTERVAL '1 hour'
/* this is invalid!*/
(a < 1) OR (t > NOW() - INTERVAL '1 hour' AND t < NOW() - INTERVAL '1')
```

Also the temporal filter condition can not be connected with expressions including temporal filter with `AND` expression
```SQL
(t > NOW() - INTERVAL '1 hour' OR t is NULL OR a < 1) 
AND (t < NOW() - INTERVAL '1 hour' OR a < 1)
```

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
