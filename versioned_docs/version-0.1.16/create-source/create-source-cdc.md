---
id: create-source-cdc
title: CDC via Kafka
description: Ingest CDC data via Kafka.
slug: /create-source-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-cdc/" />
</head>

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. 

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert CDC data into Kafka topics.

This topic describes the configurations for using the Kafka connector in RisingWave to ingest CDC data. For complete step-to-step guides about using the native CDC connector to ingest MySQL and PostgreSQL data, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md). For completeness, instructions about using additional CDC tools and the Kafka connector to ingest CDC data are also included in these two topics.

For RisingWave to ingest CDC data, you must create a table (`CREATE TABLE`) with primary keys and connector settings. This is different from creating a standard source, as CDC data needs to be persisted in RisingWave to ensure correctness.

The Kafka connector in RisingWave accepts [Debezium](https://debezium.io) JSON (for both MySQL and PostgreSQL) and [Maxwell](https://maxwells-daemon.io) JSON (for MySQL only) as the CDC data format. 

For Debezium JSON, you can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) to convert CDC data to Kafka topics.

For Maxwell JSON (`ROW FORMAT MAXWELL`), you need to use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to Kafka topics. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).


## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   PRIMARY KEY ( column_name, ... )
) 
WITH (
   connector='kafka',
   connector_parameter='value', ...
) 
ROW FORMAT { DEBEZIUM_JSON | MAXWELL };
```

### Connector parameters

|Field|Notes|
|---|---|
|topic| Required. Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server| Required. Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|
|properties.group.id	|Optional. Name of the Kafka consumer group.	|
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds). If this field is specified, the value for `scan.startup.mode` will be ignored.|


## Example

Here is an example of creating a table using the Kafka connector to ingest CDC data from Kafka topics.

```sql
CREATE TABLE [IF NOT EXISTS] source_name (
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
