---
id: risingwave-sql-101
title: RisingWave SQL 101
description: A simple yet typical data processing workflow that shows how to manipulate data with RisingWave.
slug: /risingwave-sql-101
---

In this guide, we will walk you through some of the most used SQL commands in RisingWave. This is a simple yet typical data processing workflow that shows how to manipulate data with RisingWave.

> RisingWave uses Postgres-compatible SQL as the interface to manage and query data. For a complete list of supported SQL commands, please navigate to SQL reference → Commands. 

## Before we start

Ensure that you have [started and connected to RisingWave](get-started.md/#run-risingwave).

## Create a table

Now let's create a table to store data about taxi trips.

```sql
CREATE TABLE taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION
);
```

And let's add some data to the table.

```sql
INSERT INTO taxi_trips
VALUES
    ('1', 4, 10);
```

> In this guide, we use a user-defined table to better explain the mechanism of materialized views.<br/>The best and most common practice is to [create a source connector](sql/commands/sql-create-source.md) to ingest streaming data from a data source, not inserting records into a table.

## Create a materialized view

We want to create a materialized view to dynamically calculate the average speed of all trips.

```sql
CREATE MATERIALIZED VIEW mv_avg_speed
AS
    SELECT COUNT(id) as no_of_trips,
    SUM(distance) as total_distance,
    SUM(duration) as total_duration,
    SUM(distance) / SUM(duration) as avg_speed
    FROM taxi_trips;
```

> For details about creating a materialized view, see [CREATE MATERIALIZED VIEW](sql/commands/sql-create-mv.md).

## Query a materialized view

We can now query the average speed.

```sql
SELECT * FROM mv_avg_speed;
```

Here is the result we get. 

```
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           1 |              4 |             10 | 0.4
```

Now let's add a new record.

```sql
INSERT INTO taxi_trips
VALUES
    ('2', 6, 10);
```

As soon as we insert the new record, the materialized view `mv_avg_speed` will be refreshed to re-calculate the results. Let us see if the results are updated.

```sql
SELECT * FROM mv_avg_speed;
```

Here is the result we get. 

```
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           2 |             10 |             20 | 0.5

```

You can see that the results are based on the two rows of data. The calculation is performed automatically behind the scene. No matter how many more rows of data we insert, we can always get the latest results by querying the values of the materialized view.

## Create a materialized view from a source

Creating a materialized view from a source is similar to creating from a table.

The following statement creates a materialized view for three columns in a connected source named `debezium_json_mysql_source`.

```sql title="To create a materialized view from a source:"
CREATE MATERIALIZED VIEW debezium_json_mysql_mv 
AS 
    SELECT COLUMN1, COLUMN2, COLUMN3 FROM debezium_json_mysql_source;
```
> For details about creating a source connector, see [CREATE SOURCE](sql/commands/sql-create-source.md).

## Create a materialized view on materialized views

With RisingWave, you can also create a materialized view from an existing materialized view. 

```sql title="To create a materialized view from existing materialized views:"
CREATE MATERIALIZED VIEW m3
AS 
    SELECT m1.v1 as m1v1, m1.v2 as m1v2, m2.v1, m2.v2 
    FROM m1 
    INNER JOIN m2 ON m1.v1 = m2.v1;
```

## Create a data sink connector

Finally, we can output the processed data to a data sink using [CREATE SINK](sql/commands/sql-create-sink.md).

## More to read
We also prepared several [tutorials](/tutorials/real-time-ad-performance-analysis.md), each focusing on solving a real-world stream processing task, with simulated data.




