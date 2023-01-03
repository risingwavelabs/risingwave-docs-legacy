---
id: create-source-cdc
title: Ingest data from databases with CDC
description: Ingest data from databases with CDC.
slug: /create-source-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. 

CDC tools and platforms can record row-level changes (INSERT, UPDATE, and DELETE activities) that apply to tables in an upstream database and stream the data change event records to event streaming platforms such as Kafka. You can connect RisingWave to the Kafka topics to receive the data changes.

To ingest CDC data from MySQL or PostgreSQL into RisingWave, you can use a CDC tool to convert data change streams in databases to Kafka topics, and then use the native Kafka connector in RisingWave to consume data from the Kafka topics.

For RisingWave to ingest CDC data, you must create a materialized source (`CREATE MATERIALIZED SOURCE`) and specify primary keys. Materializing a source means that you want to persist the data from the source in RisingWave. For CDC data, the source must be materalized.

The supported CDC data formats are [Debezium](https://debezium.io) JSON (for both MySQL and PostgreSQL) and [Maxwell](https://maxwells-daemon.io) JSON (for MySQL only).

- Debezium JSON (`ROW FORMAT DEBEZIUM_JSON`): You can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) to convert MySQL or PostgreSQL data change streams to Kafka topics. To learn about how to configure MySQL and deploy the Debezium connector for MySQL, see the [Debezium connector for MySQL documentation](https://debezium.io/documentation/reference/stable/connectors/mysql.html).
- Maxwell JSON (`ROW FORMAT MAXWELL`): You can use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to Kafka topics. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).


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

|Field|Notes|
|---|---|
|topic| Required. Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server| Required. Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|
|properties.group.id	|Optional. Name of the Kafka consumer group.	|
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds). If this field is specified, the value for `scan.startup.mode` will be ignored.|


## Example

Here is an example of creating a materialized source using the Kafka connector to consume data from Kafka topics.

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
