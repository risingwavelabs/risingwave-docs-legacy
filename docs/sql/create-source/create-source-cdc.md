---
id: create-source-cdc
title: CDC
description: Connect RisingWave to a CDC source.
slug: /create-source-cdc
---

   
Use the SQL statement below to connect RisingWave to a CDC source.

:::note

Currently, RisingWave only supports materialized CDC sources with primary keys, and the data format must be Debezium JSON.

:::

## Syntax

```sql
CREATE MATERIALIZED SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   PRIMARY KEY ( column_name, ... )
) 
WITH (
   connector='kafka',
   field_name='value', ...
) 
ROW FORMAT DEBEZIUM_JSON;
```

### `WITH` options


|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|kafka.topic|None|String|Address of the Kafka topic. One source can only correspond to one topic.|True
|kafka.brokers	|None	|String	|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|True|
|kafka.scan.startup.mode	|earliest	|String	|The Kafka consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`.	|False
|kafka.time.offset	|None	|Int64	|Specify the offset in seconds from a certain point of time.	|False|
|kafka.consumer.group	|None	|String	|Name of the Kafka consumer group	|True|


## Example
Here is an example of connecting RisingWave to a CDC service to read data from individual streams.

```sql
CREATE MATERIALIZED SOURCE [IF NOT EXISTS] source_name (
   column1 varchar,
   column2 integer,
   PRIMARY KEY (column1)
) 
WITH (
   connector='kafka',
   kafka.topic='user_test_topic',
   kafka.brokers='172.10.1.1:9090,172.10.1.2:9090',
   kafka.scan.startup.mode='earliest',
   kafka.consumer.group='demo_consumer_name'
) 
ROW FORMAT DEBEZIUM JSON;
```
