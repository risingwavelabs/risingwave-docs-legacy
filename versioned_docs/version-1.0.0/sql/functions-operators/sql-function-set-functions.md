---
id: sql-function-set-functions
slug: /sql-function-set-functions
title: Set functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-set-functions/" />
</head>

## generate_series()

The `generate_series`() function in PostgreSQL is a set-returning function that generates a series of values, based on the start and end values defined by the user. It is useful for generating test data or for creating a sequence of numbers or timestamps.

The syntax for the `generate_series`() function is as follows:

```sql
SELECT * 
FROM generate_series(start_int, stop_int, step_int);
```

*start_int* is the first value in the series.

*stop_int* is the last value in the series.

*step_int* is optional. It is the increment value. If it is omitted, the default step value is 1.

Here is an example of how you can use the `generate_series`() function to generate a series of numbers:

```sql
SELECT * 
FROM generate_series(1, 5);
```

The result looks like this:

```sql
1
2
3
4
5
```

And here is an example with a step increment of 2:

```sql
SELECT * 
FROM generate_series(2, 10, 2);
```

The result looks like this:

```sql
2
4
6
8
10
```

Here is an example of how you can use the `generate_series`() function to generate a series of timestamps:

```sql
SELECT generate_series 
FROM generate_series(
    '2008-03-01 00:00:00'::TIMESTAMP,
    '2008-03-04 12:00:00'::TIMESTAMP, 
    interval '12' hour
);
```

The result looks like this:

```sql
2008-03-01 00:00:00
2008-03-01 12:00:00
2008-03-02 00:00:00
2008-03-02 12:00:00
2008-03-03 00:00:00
2008-03-03 12:00:00
2008-03-04 00:00:00
2008-03-04 12:00:00
```