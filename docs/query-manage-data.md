---
id: query-manage-data
title: Query and manage data
description: Query and manage data using RisingWave.
slug: /query-manage-data
---

RisingWave uses Postgres-compatible SQL as the interface to manage and query data.

Before we start, ensure that you have [connected to RisingWave via `psql`](deploy-risingwave.md/#step-2-connect-to-risingwave). 

Now let us create a table to store data about taxi trips.

```sql
CREATE TABLE taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION
);
```

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

Now let us add some data to the table.

```sql
INSERT INTO taxi_trips
VALUES
    ('1', 4, 10);
```

We can now query the average speed.

```sql
SELECT * FROM mv_avg_speed;
```

Here is the result we get. 

```sql
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           1 |              4 |             10 | 0.4
```

Now let us add a new record.

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
```sql
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           2 |             10 |             20 | 0.5

```

You can see that the results are based on the two rows of data. The calculation is performed automatically behind the scene. No matter how many more rows of data we insert, we can always get the latest results by querying the values of the materialized view.

Creating a materialized view from a source is similar. 

```sql title="To create a materialized view from a source:"
CREATE MATERIALIZED VIEW debezium_json_mysql_mv 
AS 
    SELECT COLUMN1, COLUMN2, COLUMN3 FROM debezium_json_mysql_source;
```

With RisingWave, you can also create a materialized view from an existing materialized view. 

```sql title="To create a materialized view from existing materialized views:"
CREATE MATERIALIZED VIEW m3
AS 
    SELECT m1.v1 as m1v1, m1.v2 as m1v2, m2.v1, m2.v2 
    FROM m1 
    INNER JOIN m2 ON m1.v1 = m2.v1;
```

For the complete list of supported SQL commands, please navigate to SQL reference → Commands. 






