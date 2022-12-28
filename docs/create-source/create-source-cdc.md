---
id: create-source-cdc
title: Ingest data from databases via CDC
description: Connect RisingWave to a CDC source.
slug: /create-source-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. 

CDC tools and platforms can record row-level changes (INSERT, UPDATE, and DELETE activities) that apply to tables in a upstream database and stream the data change event records to event streaming platforms such as Kafka. You can connect RisingWave to the Kafka topics to receive the data changes.

To ingest CDC data from MySQL or PostgreSQL into RisingWave, you can use a CDC tool to convert data change streams in databases to Kafka topics, and then use the native Kafka connector in RisingWave to consume data from the Kafka topics.

For the Kafka connector to ingest CDC data, you must create a materialized source connection (`CREATE MATERIALIZED SOURCE`) and specify primary keys.

The difference between a non-materialized You can create two types of source connections in RisingWave: non-materialized and materialized source connections. The difference between these two types of connections is data from a materialized source connection is stored in RisingWave, while data from a non-materialized source is not.

The supported CDC data formats are [Debezium](https://debezium.io) JSON (for both MySQL and PostgreSQL) and [Maxwell](https://maxwells-daemon.io) JSON (for MySQL only). 

- Debezium JSON (`ROW FORMAT DEBEZIUM_JSON`): You can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) to convert MySQL or PostgreSQL data change streams to Kafka topics. To learn about how to configure MySQL and deploy the Debezium connector for MySQL, see the [Debezium connector for MySQL documentation](https://debezium.io/documentation/reference/stable/connectors/mysql.html).
- Maxwell JSON (`ROW FORMAT MAXWELL`): You can use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to kafka topics. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).


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
ROW FORMAT { DEBEZIUM_JSON | MAXWELL };
```

### `WITH` parameters


|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|topic|None|String|Address of the Kafka topic. One source can only correspond to one topic.|True
|properties.bootstrap.server	|None	|String	|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|True|
|scan.startup.mode	|earliest	|String	|The Kafka consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`.	|False
|scan.startup.timestamp_millis	|None	|Int64	|Specify the offset in seconds from a certain point of time.	|False|
|properties.group.id	|None	|String	|Name of the Kafka consumer group	|True|


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
   topic='user_test_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest',
   properties.group.id='demo_consumer_name'
) 
ROW FORMAT DEBEZIUM_JSON;
```
