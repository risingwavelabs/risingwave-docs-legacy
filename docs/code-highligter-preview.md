---
id: streaming-preview
title: Streaming SQL cheat sheet preview
slug: /streaming-preview
---

## Flink SQL Cheat Sheet

**Flink SQL** is an ANSI-compliant SQL engine that can process both real-time and historical data.
It provides users with a declarative way to express data transformations and analytics on streams of data.

### Create a MySQL source

```sql
CREATE TABLE my_flink_table (
  id INT,
  name STRING,
  age INT,
  PRIMARY KEY (id) NOT ENFORCED
) WITH (
  'connector' = 'mysql-cdc',
  'hostname' = '[hostname]',
  'port' = '3306',
  'table-name' = '[my_table]',
  'username' = '[username]',
  'password' = '[password]',
  'database-name' = '[my_db]');
```

### Create a Debezium Avro source

```sql
WITH (
 'connector' = 'kafka',
 'topic' = 'your_kafka_topic',
  'properties.bootstrap.servers' = 'kafka-broker:9092',
 'format' = 'debezium-avro-confluent',
 'debezium-avro-confluent.url' = 'http://your-schema-registry:8081'
)
```

### Create a Protobuf source

```sql
WITH (
 'connector' = 'kafka',
 'topic' = 'your_kafka_topic',
  'properties.bootstrap.servers' = 'kafka-broker:9092',
 'format' = 'protobuf',
 'protobuf.message-class-name' = 'com.example.SimpleTest',
 'protobuf.ignore-parse-errors' = 'true'
);
```

### Create a table with a watermark column

A watermark marks a specific point in a data stream, ensuring that all events up to that point have been received.

```sql
CREATE TABLE my_event_table (
  event_time TIMESTAMP,
  event_value INT,
  WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND
)
```

### Add a column to a table

```sql
ALTER TABLE my_event_table ADD COLUMN new_field INT;
```

## KEY PATTERNS

{column-index=1}

### Window functions

The sum of amounts of all orders for the same product that were received within one hour before the current order.

```sql
SELECT order_id, order_time, amount,
  SUM(amount) OVER (
    PARTITION BY product
    ORDER BY order_time
    RANGE BETWEEN INTERVAL '1' HOUR PRECEDING AND CURRENT ROW
  ) AS one_hour_prod_amount_sum
FROM orders
```

### Top-N by group

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() 
    OVER (PARTITION BY category ORDER BY sales DESC) AS row_num
  FROM shop_sales)
WHERE row_num <= 5
```

### Deduplication

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() 
    OVER (PARTITION BY b, d ORDER BY rowtime DESC) as row_num
  FROM T)
WHERE row_num = 1
```

## Time window functions

### TUMBLE

The **TUMBLE** function is used for windowing time-series data into fixed-size, non-overlapping intervals.

```sql
SELECT window_start, window_end, SUM(price)
FROM TABLE(
  TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), 
  INTERVAL '10' MINUTES))
GROUP BY window_start, window_end;
```

### HOP

The **HOP** function creates sliding windows for time-series data, where windows overlap and slide at a specified interval.

```sql
SELECT window_start, window_end, SUM(price)
FROM TABLE(
  HOP(TABLE Bid, DESCRIPTOR(bidtime), 
      INTERVAL '5' MINUTES, INTERVAL '10' MINUTES))
GROUP BY window_start, window_end;
```

### CUMULATE

The **CUMULATE** function aggregates data over cumulative, expanding time windows with a specified step and maximum size.

```sql
SELECT window_start, window_end, SUM(price)
FROM TABLE(
  CUMULATE(TABLE Bid, DESCRIPTOR(bidtime),
  INTERVAL '2' MINUTES, INTERVAL '10' MINUTES))
GROUP BY window_start, window_end;
```

## FUNCTIONS & EXPRESSIONS

### JSON access

```sql
SELECT JSON_VALUE(json_column, '$.glossary.GlossDiv.GlossList.GlossEntry.ID') AS gloss_entry_id
```

### BIGINT to UTC+8 TIMESTAMP

```sql
SELECT TO_TIMESTAMP_LTZ(your_bigint_column, 8) AS converted_timestamp
```

### Array unnesting

The UNNEST function expands an array into multiple rows. For example:

```sql
SELECT * FROM unnest(array[1,2,3]);
---
1
2
3
```

## RisingWave Streaming SQL Cheat Sheet

RisingWave is a distributed SQL streaming database that enables simple, efficient, and reliable processing of streaming data.
RisingWave Streaming SQL is RisingWave's dialect of SQL for streaming data.

## CORE CONCEPTS

### Sources

You ingest real-time data from sources. Typical sources include Kafka topics and PostgreSQL changelog streams.

### Tables

Tables in RisingWave can store both real-time and historical data.

### Sinks

Sinks are targets that you can send data to. Typical sinks include Kafka topics and database tables.

### Materialized views

RisingWave leverages materialized views in a unique way to enable efficient pipeline orchestration and data transformations.
Materialized views in RisingWave are automatically refreshed and incrementally computed whenever a new event is received.

## DATA INGESTION

You create a source or table to ingest real-time data. For a source, data is not persisted in RisingWave.
For a table, data is persisted in RisingWave. For CDC data, tables are needed.

### Create a MySQL source

```sql
CREATE TABLE my_risingwave_table (
  id INT PRIMARY KEY,
  name TEXT,
  age INT
) WITH (
  'connector' = 'mysql-cdc',
  'hostname' = '[hostname]',
  'port' = '3306',
  'username' = '[username]',
  'password' = '[password]',
  'database.name' = '[my_db]'
  'table.name' = '[my_table]',
 );
```

### Create a Debezium Avro source

```sql
CREATE SOURCE ... WITH (...)
FORMAT DEBEZIUM ENCODE AVRO (
  schema.registry = 'http://your-schema-registry:8081'
)
```

### Create a Protobuf source

Given a protobuf message `Event` in `package twitter.schema`, the create statement is:

```sql
CREATE SOURCE ... WITH (...)
FORMAT PLAIN ENCODE PROTOBUF (
  message = 'twitter.schema.Event',
  schema.location = 'http://your_schema_host/schema_file_path'
);
```

It's recommended to use a Confluent Schema Registry to manage Protobuf schemas.

### Create an Upsert Kafka source in Avro

Upsert is a format that treats a tombstone record (a record with null values) as a DELETE event. It's typically used in CDC scenarios.

```sql
CREATE SOURCE ...
WITH (
  connector = 'kafka',
  topic = 'your_topic',
  properties.bootstrap.server = 'your_kafka_broker_url',
)
FORMAT UPSERT ENCODE AVRO (
  schema.registry = 'http://your-schema-registry:8081'
)
```

## DATA MANIPULATION

### Add a column to a table

```sql
ALTER TABLE my_event_table ADD COLUMN new_field INT;
```

### Ingest a batch of values into a table

```sql
INSERT INTO my_table (column1, column2, column3)
VALUES
  ('value1_row1', 'value2_row1', 'value3_row1'), ...;
FLUSH;
```

The FLUSH command ensures the data is committed completely.

## DATA TRANSFORMATION

Your transformation logic should be expressed in the definition of materialized views so that you can
query the latest results from time to time. If you want to use RisingWave for pure streaming ETL and there is
no need to query the results, your transformation logic can be expressed in the definition of sinks (`CREATE SINK AS SELECT...`).

### Create a materialized view

```sql
CREATE MATERIALIZED VIEW mv_avg_speed
AS SELECT COUNT(trip_id) as no_of_trips,
    SUM(distance) as total_distance,
    SUM(duration) as total_duration,
    SUM(distance) / SUM(duration) as avg_speed
    FROM taxi_trips;
```

### Top-N by group

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() 
    OVER (PARTITION BY category ORDER BY sales DESC) AS row_num
  FROM shop_sales)
WHERE row_num <= 5
```

### Temporal filters

```sql
SELECT * 
FROM sales 
WHERE sale_date > NOW() - INTERVAL '1 week';
```

**Data Expiration (TTL)**:
In RisingWave, we can expire data through filtering using `WHERE` clauses combined with `NOW()`.

### Temporal joins

```sql
SELECT transaction_id, product_id, quantity, sale_date, product_name, price 
FROM sales
JOIN products FOR SYSTEM_TIME AS OF PROCTIME()
ON product_id = id
```

### TUMBLE time window function

The `TUMBLE` function is used for windowing time-series data into fixed-size, non-overlapping intervals. For example:

```sql
CREATE MATERIALIZED VIEW hot_hashtags AS
SELECT hashtag, COUNT(*) AS hashtag_occurrences, window_start
FROM
  TUMBLE(table_name, time_col, INTERVAL '10 MINUTES')
GROUP BY
  hashtag, window_start;
```

### HOP time window function

Hopping windows allow for overlapping intervals of time. There are two intervals to specify in the `HOP()` function.
The first is the size of the hop, which is how often you want a new window to start.
The second is the size of the window, which is how long each window lasts.

```sql
SELECT window_start, window_end, count(trip_id) as no_of_trips, sum(distance) as total_distance 
FROM HOP (taxi_trips, completed_at, INTERVAL '1 MINUTES', INTERVAL '2 MINUTES') 
GROUP BY window_start, window_end 
ORDER BY window_start ASC;
```

### Windowed stream-stream joins

```sql
SELECT trip.window_start, trip.window_end, trip.distance, fare.total_fare, fare.payment_status
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES') as trip
JOIN TUMBLE (taxi_fare, completed_at, INTERVAL '2 MINUTES') as fare
ON trip.trip_id = fare.trip_id AND trip.window_start = fare.window_start
ORDER BY trip.window_start ASC;
```

### MV-on-MV

In RisingWave, the ability to create materialized views atop existing materialized views (MV-on-MV) streamlines the chaining of streaming pipelines without extra middleware. This functionality simplifies the layered data architectures often seen when building real-time data warehouses.

### Watermark and Emit-On-Window-Close (EOWC)

The following example emits total orders per minute at 5-minute intervals. This optimization allows the materialized view to maintain the append-only semantic, which can improve efficiency particularly for downstream systems that prefer append-only writes, such as S3 sink.

```sql
CREATE SOURCE orders (
    product VARCHAR,
    price DOUBLE PRECISION
    order_time TIMESTAMPTZ,
    WATERMARK FOR order_time AS order_time - INTERVAL '5 MINUTES'
);

CREATE MATERIALIZED VIEW orders_per_minute AS
SELECT window_start, COUNT(*) as orders_count
FROM TUMBLE(orders, order_time, INTERVAL '1 MINUTE')
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

### JSONB

JSONB is heavily used in streaming due to the unprocessed, complex, and nested nature of real-time events.

| Expression | Description |
| :---- | :---- |
| jsonb -> varchar → jsonb | Extracts JSON object field. |
| jsonb ->> varchar → varchar | Extracts JSON object field, as text. |
| jsonb_array_elements(jsonb) → setof jsonb | Expands the top-level array into a set of values. |
| jsonb_object_keys(jsonb) → setof varchar | Returns the set of keys in the top-level object. |

## DATA DELIVERY

### Kafka upsert-Avro sink

```sql
CREATE SINK IF NOT EXISTS orders_count_sink FROM orders_count
WITH (
  connector = 'kafka',
  properties.bootstrap.server='your_kafka_broker_url',
  topic = 'orders_count_topic',
  primary_key = 'order_id'
) FORMAT UPSERT ENCODE AVRO;
```

### Postgres sink

```sql
CREATE SINK ...
WITH (
  connector = 'jdbc',
  jdbc.url = 'jdbc:postgresql://postgres_url:5432/mydatabase?user=myuser&password=mypassword',
  table.name = 'orders_count',
  type = 'upsert',
  primary_key = 'order_id'
);
```

RisingWave supports MySQL sink and more sink connectors via JDBC.
