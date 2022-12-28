---
id: create-source-pulsar
title: Ingest data from Pursar
description: Connect RisingWave to a Pulsa broker.
slug: /create-source-pulsar
---


Use the SQL statement below to connect RisingWave to a Pulsa broker.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
WITH (
   connector='pulsar',
   field_name='value', ...
)
ROW FORMAT data_format 
[MESSAGE 'message']
[ROW SCHEMA LOCATION 'location'];
```

:::note
RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record. 
:::

### `WITH` parameters

|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|topic	|None	|String	|Address of the Pulsar topic. One source can only correspond to one topic.	|True|
|service.url	|None	|String	|Address of the Pulsar service	|True|
|admin.url	|None	|String	|Address of the Pulsar admin	|True|
|scan.startup.mode	|earliest	|String	|The Pulsar consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`.	|False|
|scan.startup.timestamp_millis	|None	|Int64	|Specify the offset in milliseconds from a certain point of time.	|False|

### Row format parameters

Specify the format of the stream in the `ROW FORMAT` section of your statement.

|Parameter | Description|
|---|---|
|*data_format*| Supported formats: `JSON`, `AVRO`, `PROTOBUF`.|
|*message* |Message for the format. Required when *data_format* is `AVRO` or `PROTOBUF`.|
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. Required when *data_format* is `AVRO` or `PROTOBUF`. Examples:<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location` |

## Example
Here is an example of connecting RisingWave to a Pulsar broker to read data from individual topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT AVRO MESSAGE 'FooMessage'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc';
```
</TabItem>
<TabItem value="json" label="JSON" default>

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
ROW FORMAT JSON;
```
</TabItem>
<TabItem value="pb" label="Protobuf" default>

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
</TabItem>
</Tabs>
