---
id: create-source-pulsar
title: Pulsar
description: Connect RisingWave to a Pulsa broker.
slug: /create-source-pulsar
---


Use the SQL statement below to connect RisingWave to a Pulsa broker.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type, ...
)
WITH (
   connector='pulsar',
   field_name='value', ...
)
ROW FORMAT JSON | PROTOBUF MESSAGE 'main_message';
```
### `WITH` options

|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|topic	|None	|String	|Address of the Pulsar topic. One source can only correspond to one topic.	|True|
|service.url	|None	|String	|Address of the Pulsar service	|True|
|admin.url	|None	|String	|Address of the Pulsar admin	|True|
|scan.startup.mode	|earliest	|String	|The Pulsar consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`.	|False|
|scan.startup.timestamp_millis	|None	|Int64	|Specify the offset in seconds from a certain point of time.	|False|

## Example
Here is an example of connecting RisingWave to a Pulsar broker to read data from individual topics.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_abc (
   column1 string,
   column2 integer,
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT PROTOBUF MESSAGE 'FooMessage'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto';
```
