---
id: create-source-kafka-redpanda
title: Kafka & Redpanda
description: Connect RisingWave to a Kafka/Redpanda broker.
slug: /create-source-kafka-redpanda
---

Use the SQL statement below to connect RisingWave to a Kafka/Redpanda broker.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type, ...
)
WITH (
   connector='kafka',
   field_name='value', ...
)
ROW FORMAT JSON | PROTOBUF MESSAGE 'main_message'
[ ROW SCHEMA LOCATION 's3://path' ];
```
### `WITH` options

|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|topic|None|String|Address of the Kafka topic. One source can only correspond to one topic.|True
|properties.bootstrap.server	|None	|String	|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|True|
|scan.startup.mode	|earliest	|String	|The Kafka consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`.	|False
|scan.startup.timestamp_millis	|None	|Int64	|Specify the offset in seconds from a certain point of time.	|False|
|consumer.group.id	|None	|String	|Name of the Kafka consumer group	|True|

## Example

Here is an example of connecting RisingWave to a Kafka broker to read data from individual topics.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000',
   consumer.group.id='demo_consumer_name'
)
ROW FORMAT JSON;
```
