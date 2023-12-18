---
id: ingest-from-warpstream
title: Ingest data from WarpStream
description: Connect RisingWave to a WarpStream broker.
slug: /ingest-from-warpstream
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-warpstream/" />
</head>

You can ingest data from WarpStream, an Apache Kafka-compatible data streaming platform built directly on top of S3, into RisingWave.

This guide will help you set up WarpStream, ingest data into RisingWave, and create and query a materialized view in RisingWave.

## Set up WarpStream 

### Install WarpStream Agent

To interact with the WarpStream cluster, install the WarpStream Agent or CLI:

```shell
curl https://console.warpstream.com/install.sh | bash
```

### Create a Kafka topic and produce sample data

After the installation, run the following commands in the terminal:

- Initiate WarpStream playground:

  ```shell  
  warpstream playground
  ```

- Generate a Kafka topic with fake click stream data:

  ```shell
  warpstream demo
  ```

## Ingest data into RisingWave

### Create a source

In RisingWave, create a source named "website_visits" to connect RisingWave to the WarpStream topic:

```sql
CREATE SOURCE IF NOT EXISTS website_visits_stream (
 timestamp timestamp,
 user_id varchar,
 page_id varchar,
 action varchar
 )
WITH (
 connector='kafka',
 topic='demo-stream',
 properties.bootstrap.server='localhost:9092',
 scan.startup.mode='earliest'
 ) ROW FORMAT JSON;
```

### Create a materialized view

In RisingWave, create a materialized view that offers insights into user behavior on different pages for analyzing website traffic and engagement.

```sql
CREATE MATERIALIZED VIEW visits_stream_mv AS 
SELECT page_id, 
count(*) AS total_visits, 
count(DISTINCT user_id) AS unique_visitors, 
max(timestamp) AS last_visit_time 
FROM website_visits_stream 
GROUP BY page_id;
```

### Query the materialized view

Let's retrieve data from the created materialized view:

```sql
SELECT * FROM visits_stream_mv;
```

Expected result:

```sql

 page_id | total_visits | unique_visitors |   last_visit_time   
---------+--------------+-----------------+---------------------
 page_0  |            2 |               2 | 2023-07-26 19:03:08
 page_4  |            9 |               9 | 2023-07-26 19:03:00
 page_8  |            9 |               9 | 2023-07-26 19:02:57
 page_3  |           14 |              14 | 2023-07-26 19:03:09
 page_7  |            4 |               4 | 2023-07-26 19:02:52
 page_1  |            7 |               6 | 2023-07-26 19:02:55
 page_5  |            9 |               9 | 2023-07-26 19:03:01
 page_9  |           12 |              12 | 2023-07-26 19:02:48
 page_2  |            4 |               4 | 2023-07-26 19:02:58
 page_6  |            7 |               6 | 2023-07-26 19:03:03
```

You have successfully ingested data from WarpStream into RisingWave, created a materialized view, and queried it in RisingWave.
