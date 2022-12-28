---
id: create-source-cdc
title: Ingest data from databases via CDC
description: Connect RisingWave to a CDC source.
slug: /create-source-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. <br/> CDC tools and platforms can record row-level changes (INSERT, UPDATE, and DELETE activities) that apply to tables in a upstream database and stream the data change event records to event streaming platforms such as Kafka. You can connect RisingWave to the Kafka topics to receive the data changes.

To subscribe to a Kafka topic that reads data from a CDC tool, use the `CREATE SOURCE` command to create a source connector.

:::note

Currently, RisingWave only supports materialized CDC sources with primary keys, and the data format must be Debezium JSON or Maxwell JSON.

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

### `ROW FORMAT` parameters

- `DEBEZIUM_JSON` — [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures. Supported serialization format: JSON.
- `MAXWELL` — [Maxwell](https://maxwells-daemon.io) is a log-based CDC tool that can capture row changes from MySQL and write them as JSON to Kafka.


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
