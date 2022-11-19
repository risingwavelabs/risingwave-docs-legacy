---
id: sql-function-time-window
slug: /sql-function-time-window
title: Time window functions
---

In stream processing, time windows are time intervals based on which we can divide events and perform data computations.

RisingWave supports two types of time windows:

* Tumbling windows
* Hopping windows

For each type of time window, there is a corresponding time windowing function (hereafter referred to as “time window function”) that creates a window of this type. For tumbling windows, the function is `tumble()`. For hopping windows, the function is `hop()`.

In RisingWave, the result of a time window function is a table in which each row carries data for a time window. A time window function extends the schema of the original table with two new columns, `window_start` and `window_end`, which indicate the start and end of time windows respectively.

In RisingWave, time window functions are invoked in the **FROM** clause. See the sections below for the syntaxes of two time window functions.

## `tumble()` time window function

Tumbling windows are contiguous time intervals. 

The syntax of the `tumble()` window function is as follows:

```sql
SELECT [ ALL | DISTINCT ] [ * | expression [ AS output_name ] [, expression [ AS output_name ]...] ]
FROM TUMBLE(table_or_source, start_time, window_size);
```

*start_time* can be in either timestamp or timestamp with time zone format. Example of timestamp with time zone format: 2022-01-01 10:00:00+00:00.

*window_size* is in the format of `INTERVAL 'interval'`. Example: `INTERVAL '2 MINUTES'`. The standard SQL format, which places time units outside of quotation marks (for example, `INTERVAL '2' MINUTE`), is also supported.


Suppose that we have a table, "taxi_trips", that consists of these columns: `id`, `taxi_id`, `completed_at`, and `distance`.

|trip_id|  taxi_id	|completed_at	    |distance|
|-------|-----------|-------------------|--------|
|1      |   1001    |2022-07-01 22:00:00|4|
|2      |	1002    |2022-07-01 22:01:00|6|
|3      |	1003    |2022-07-01 22:02:00|3|
|4      |	1004    |2022-07-01 22:03:00|7|
|5      |	1005    |2022-07-01 22:05:00|2|
|6      |	1006    |2022-07-01 22:05:30|8|



Here is an example that uses the tumble window function.


```sql
SELECT trip_id,  taxi_id, completed_at, window_start, window_end
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES');
```


The result looks like this: 

```
trip_id | taxi_id   | completed_at          | window_start          | window_end 
--------+-----------+-----------------------+-----------------------+---------------------
1       | 1001      | 2022-07-01 22:00:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
2       | 1002      | 2022-07-01 22:01:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
3       | 1003      | 2022-07-01 22:02:10   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
4       | 1004      | 2022-07-01 22:03:00   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
5       | 1005      | 2022-07-01 22:05:00   | 2022-07-01 22:04:00   | 2022-07-01 22:06:00
6       | 1006      | 2022-07-01 22:06:00   | 2022-07-01 22:06:00   | 2022-07-01 22:08:00
```


## `hop()` time window function

Hopping windows are scheduled time intervals. A hopping window consists of three time-related parameters: start time, hop size, and window size.

See below for the syntax of the `hop()` window function.

```sql
SELECT [ ALL | DISTINCT] [ * | expression [ AS output_name ] [, expression [ AS output_name ]...] ]
FROM HOP(table_or_source, start_time, hop_size, window_size);
```

*start_time* can be in either timestamp or timestamp with time zone format. Example of timestamp with time zone format: 2022-01-01 10:00:00+00:00.

Both *hop_size* and *window_size* are in the format of `INTERVAL '<interval>'`. For example: `INTERVAL '2 MINUTES'`. The standard SQL format, which places time units outside of quotation marks (for example, `INTERVAL '2' MINUTE`), is also supported.

Here is an example.

```sql
SELECT trip_id, taxi_id, completed_at, window_start, window_end
FROM HOP (taxi_trips, completed_at, INTERVAL '1 MINUTE', INTERVAL '2 MINUTES')
ORDER BY window_start;
```

The result looks like the table below. Note that the number of rows in the result of a hop window function is N times the number of rows in the original table, where N is the window size divided by the hop size.


```
 trip_id | taxi_id  | completed_at          | window_start          | window_end 
---------+---------+------------------------+-----------------------+--------------------
 1       | 1001     | 2022-07-01 22:00:00   | 2022-07-01 21:59:00   | 2022-07-01 22:01:00
 2       | 1002     | 2022-07-01 22:01:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
 1       | 1001     | 2022-07-01 22:00:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
 3       | 1003     | 2022-07-01 22:02:10   | 2022-07-01 22:01:00   | 2022-07-01 22:03:00
 2       | 1002     | 2022-07-01 22:01:00   | 2022-07-01 22:01:00   | 2022-07-01 22:03:00
 4       | 1004     | 2022-07-01 22:03:00   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
 3       | 1003     | 2022-07-01 22:02:10   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
 4       | 1004     | 2022-07-01 22:03:00   | 2022-07-01 22:03:00   | 2022-07-01 22:05:00
 5       | 1005     | 2022-07-01 22:05:00   | 2022-07-01 22:04:00   | 2022-07-01 22:06:00
 6       | 1006     | 2022-07-01 22:06:00   | 2022-07-01 22:05:00   | 2022-07-01 22:07:00
 5       | 1005     | 2022-07-01 22:05:00   | 2022-07-01 22:05:00   | 2022-07-01 22:07:00
 6       | 1006     | 2022-07-01 22:06:00   | 2022-07-01 22:06:00   | 2022-07-01 22:08:00
(12 rows)
```


## Window aggregations

Let’s see how we can perform time window aggregations. 

### Tumble window aggregations

Below is an example of tumble window aggregation. In this example, we want to get the number of trips and the total distance for each tumbling window (2 minutes). 

```sql
SELECT window_start, window_end, count(trip_id) as no_of_trips, sum(distance) as total_distance 
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES') 
GROUP BY window_start, window_end 
ORDER BY window_start ASC;
```

The result looks like this:

```
 window_start        | window_end          | no_of_trips | total_distance 
---------------------+---------------------+-------------+----------------
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 2           | 10
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 2           | 10
 2022-07-01 22:04:00 | 2022-07-01 22:06:00 | 1           | 2
 2022-07-01 22:06:00 | 2022-07-01 22:08:00 | 1           | 8
```

### Hop window aggregations

Below is an example of hopping window aggregation. In this example, we want to get the number of trips and the total distance within a two-minute window every minute.

```sql
SELECT window_start, window_end, count(trip_id) as no_of_trips, sum(distance) as total_distance 
FROM HOP (taxi_trips, completed_at, INTERVAL '1 MINUTES', INTERVAL '2 MINUTES') 
GROUP BY window_start, window_end 
ORDER BY window_start ASC;
```

The result looks like this:

```
 window_start        | window_end          | no_of_trips | total_distance 
---------------------+---------------------+-------------+----------------
 2022-07-01 21:59:00 | 2022-07-01 22:01:00 | 1           | 4
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 2           | 10
 2022-07-01 22:01:00 | 2022-07-01 22:03:00 | 2           | 9
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 2           | 10
 2022-07-01 22:03:00 | 2022-07-01 22:05:00 | 1           | 7
 2022-07-01 22:04:00 | 2022-07-01 22:06:00 | 1           | 2
 2022-07-01 22:05:00 | 2022-07-01 22:07:00 | 2           | 10
 2022-07-01 22:06:00 | 2022-07-01 22:08:00 | 1           | 8
```

## Window joins

You can join a time window with a table, or another time window that is of the same type and has the same time attributes.

### Joins with tables

In the example below, we join a tumble time window with a table “taxi” to get the taxi company name.

```sql
SELECT trip.window_start, trip.window_end, trip.distance, taxi.company
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES') as trip
JOIN taxi
ON trip.taxi_id = taxi.taxi_id
ORDER BY trip.window_start ASC;
```

The result looks like this:

```
 window_start        | window_end          | distance | company 
---------------------+---------------------+----------+------------
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 6        | SAFE TAXI
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 4        | SUPER TAXI
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 3        | FAST TAXI
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 7        | BEST TAXI
 2022-07-01 22:04:00 | 2022-07-01 22:06:00 | 2        | WEST TAXI
 2022-07-01 22:06:00 | 2022-07-01 22:08:00 | 8        | EAST TAXI
```

### Window joins

In the example below, we join two tumble time windows to get both trip and fare information.

```sql
SELECT trip.window_start, trip.window_end, trip.distance, fare.total_fare, fare.payment_status
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES') as trip
JOIN TUMBLE (taxi_fare, completed_at, INTERVAL '2 MINUTES') as fare
ON trip.trip_id = fare.trip_id AND trip.window_start = fare.window_start
ORDER BY trip.window_start ASC;
```

The result looks like this.

```
 window_start        | window_end          | distance | total_fare | payment_status 
---------------------+---------------------+----------+------------+----------------
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 4        | 8          | COMPLETED
 2022-07-01 22:00:00 | 2022-07-01 22:02:00 | 6        | 12         | PROCESSING
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 7        | 15         | COMPLETED
 2022-07-01 22:02:00 | 2022-07-01 22:04:00 | 3        | 5          | COMPLETED
 2022-07-01 22:04:00 | 2022-07-01 22:06:00 | 2        | 5          | REJECTED
 2022-07-01 22:06:00 | 2022-07-01 22:08:00 | 8        | 20         | COMPLETED
```