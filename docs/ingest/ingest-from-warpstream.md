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
## Set Up WarpStream 
### Installation of WarpStream Agent
Install WarpStream Agent / CLI to interact with the WarpStream cluster:

```shell
curl https://console.warpstream.com/install.sh | bash
```
### Creating a Kafka Topic and Producing Sample Data

After installing the WarpStream agent, run the following command in the terminal:
```shell  
warpstream playground
```
Run the below command to create a Kafka topic and populate it with the data that can be consumed by RisingWave.
```shell
warpstream demo
```
## Ingesting Data into RisingWave 
After successfully creating a RisingWave cluster, you create a source named website_visits to ingest data from WarpStream into the RisingWave cluster:
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
### Creating a Materialized View
Now, you create a materialized view in RisingWave:
```sql
CREATE MATERIALIZED VIEW visits_stream_mv AS 
SELECT page_id, 
count(*) AS total_visits, 
count(DISTINCT user_id) AS unique_visitors, 
max(timestamp) AS last_visit_time 
FROM website_visits_stream 
GROUP BY page_id;
```
### Querying the Materialized View
After creating a materialized view, now you query it:
```sql
select * FROM visits_stream_mv;
```
This shows the following result:
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
