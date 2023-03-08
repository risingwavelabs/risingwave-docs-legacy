---
id: sql-pattern-temporal-filter
slug: /sql-pattern-temporal-filter
title: Temporal filter
---

Temporal filter is a feature that allows you to filter data based on time intervals, and it's used to retrieve data within a specific time range. A temporal filter will enable you to filter data based on a particular time, such as the current time, a specific date, or a range of dates. By using a temporal filter, you can ensure that your queries only return data relevant to the period you are interested in, making your data analysis more accurate and efficient.


The following example query returns all rows from the `sales` table where the `sale_date` column plus one week is greater than the current date and time. In other words, it will return all sales records within the past week.

```sql
SELECT * 
FROM sales 
WHERE sale_date > NOW() - INTERVAL '1 week';
```

The temporal filter in this query is `sale_date + INTERVAL '1 week' > NOW()`. It filters the rows based on the `sale_date` column and checks if it is within one week of the current time or `NOW()`.


The following example query returns all rows from the `user_sessions` table where the sum of the `last_active` timestamp and double the `session_timeout` duration is greater than the current timestamp, indicating active user sessions. This query could be used to clean up old user sessions from the database by deleting any rows that no longer satisfy the condition.

```sql
SELECT * 
FROM user_sessions 
WHERE last_active + session_timeout * 2 > NOW();
```

The temporal filter in this query is in the `WHERE` clause, where it checks whether the timestamp of the last activity plus twice the session timeout is greater than the current time or `NOW()`, indicating that the session is still active.
