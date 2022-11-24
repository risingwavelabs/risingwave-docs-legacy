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
ROW FORMAT encode_format 
[MESSAGE 'main_message']
[ROW SCHEMA LOCATION 'location'];
```
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
|*encode_format*| Supported formats: `JSON`, `AVRO`, `PROTOBUF`.|
|MESSAGE |Message for the format. Required when *encode_format* is `AVRO` or `PROTOBUF`.|
|ROW SCHEMA LOCATION| Location of the schema file. Required when *encode_format* is `AVRO` or `PROTOBUF`. It can be a local or remote location of the schema file, or an S3 bucket link that points to the schema file.  Example:<ul><li> `file:///risingwave/proto-simple-schema.proto`</li><li>`https://<example_host>/risingwave/proto-simple-schema.proto`</li><li>`s3://risingwave-demo/schema-location`</li></ul>|

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
