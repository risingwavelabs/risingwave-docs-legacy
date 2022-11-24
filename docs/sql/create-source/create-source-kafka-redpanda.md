---
id: create-source-kafka-redpanda
title: Kafka & Redpanda
description: Connect RisingWave to a Kafka/Redpanda broker.
slug: /create-source-kafka-redpanda
---

RisingWave supports ingesting data from Kafka topics.

Use the SQL statement below to connect RisingWave to a Kafka broker.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type, ...
)
WITH (
   connector='kafka',
   topic='value',
   field_name='value', ...
)
ROW FORMAT data_format 
[ MESSAGE 'main_message' ]
[ ROW SCHEMA LOCATION 'location' ]
[ ROW SCHEMA CONFLUENT SCHEMA REGISTRY 'schema_registry_link' ];
```
### `WITH` parameters

|Field|	Required?| 	Notes|
|---|---|---|
|topic|Yes|Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server	|Yes|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|
|properties.group.id	|Yes|Name of the Kafka consumer group	|
|scan.startup.mode|No|The Kafka consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`. If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|No|Specify the offset in milliseconds from a certain point of time.	|


### Row format parameters

Specify the format of the stream in the `ROW FORMAT` section of your statement.

|Parameter | Description|
|---|---|
|*data_format*| Supported formats: `JSON`, `AVRO`, `PROTOBUF`.|
|MESSAGE |Message for the format. Required when *data_format* is `AVRO` or `PROTOBUF`.|
|ROW SCHEMA LOCATION| Location of the schema file. It can be a local or remote location of the schema file, or an S3 bucket link that points to the schema file.  Examples:<br/> `file:///risingwave/proto-simple-schema.proto`<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location`<br/>For Kafka data in Avro or Protobuf format, you need to provide either a schema location or a Confluent Schema Registry link.|
|ROW SCHEMA CONFLUENT SCHEMA REGISTRY| Confluent Schema Registry link. Example: `http://127.0.0.1:8081` <br/>For Kafka data in Avro or Protobuf format, you need to provide either a schema location or a Confluent Schema Registry link.|

## Example

Here is an example of connecting RisingWave to a Kafka broker to read data from individual topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000',
   properties.group.id='demo_consumer_name'
)
ROW FORMAT AVRO MESSAGE 'main_message'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc';
```
</TabItem>
<TabItem value="json" label="JSON" default>

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
   properties.group.id='demo_consumer_name'
)
ROW FORMAT JSON;
```
</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000',
   properties.group.id='demo_consumer_name'
)
ROW FORMAT PROTOBUF MESSAGE 'main_message'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto';
```

</TabItem>
</Tabs>


