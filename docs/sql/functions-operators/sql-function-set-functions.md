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
FROM generate_series(start, stop, step);
```

`start`, `stop`, and `step` can be of type *integer*, *bigint*, *numeric*, or *timestamp*.

`start` is the first value in the series.

`stop` is the last value in the series.

`step` is optional unless `start` and `stop` are of type *timestamp*. It is the increment value. If it is omitted, the default step value is 1.

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

From version 2.0, RisingWave supports continuously generating timestamp with a given interval into a materialized view. To achieve this, you can use `now()` as the `stop` of `generate_series`(), for example:

Starting with version 2.0, RisingWave allows you to continuously generate timestamps at specified intervals in a materialized view. To do this, use `now()` as the `stop` parameter in the `generate_series`() function. For example:

```sql
CREATE MATERIALIZED VIEW mv AS
SELECT * FROM generate_series(
  '2020-01-01 00:00:00', 
  now(),
  interval '1 hour'
);
```

And you should follow the following syntax: 

- `start` must be a constant expression of type *timestamptz*.

- `stop` must be `now()`.

- `step` must be a constant expression of type *interval*.

## range()

The `range`() function in PostgreSQL is a set-returning function that generates a series of values, based on the start and end values defined by the user. The end value is not included, unlike `generate_series()`. It is useful for generating test data or for creating a sequence of numbers or timestamps.

The syntax for the `range`() function is as follows:

```sql
SELECT * 
FROM range(start, stop, step);
```

`start`, `stop`, and `step` can be of type *integer*, *bigint*, *numeric*, or *timestamp*. 

`start` is the first value in the series.

`stop` is the last value in the series.

`step` is optional unless `start` and `stop` are of type *timestamp*. It is the increment value. If it is omitted, the default step value is 1.

Here is an example of how you can use the `range`() function to generate a series of numbers:

```sql
SELECT * 
FROM range(1, 4);
```

The result looks like this:

```sql
1
2
3
```

And here is an example with a step increment of 0.5:

```sql
SELECT * 
FROM range(0.1, 2.1, 0.5);
```

The result looks like this:

```sql
0.1
0.6
1.1
1.6
```

Here is an example of how you can use the `range`() function to generate a series of timestamps:

```sql
SELECT range 
FROM range(
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
```

## _pg_expandarray()

The `_pg_expandarray` function takes an array as input and expands it into a set of rows, providing values and their corresponding indices within the array. Ensure that [`information_schema`](/sql/system-catalogs/information-schema.md) is in the search path to access the `_pg_expandarray` function.

Example: 

```sql
SELECT * FROM information_schema._pg_expandarray(Array['a','b','c']);
```
```
 x | n 
---+---
 a | 1
 b | 2
 c | 3
(3 rows)
```

Columns in the returned set of rows:

- x: The value within the array.

- n: The index of the value within the array.