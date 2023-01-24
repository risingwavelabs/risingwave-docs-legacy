---
id: create-source-pulsar
title: Ingest data from Pursar
description: Connect RisingWave to a Pulsa broker.
slug: /create-source-pulsar
---


Use the SQL statement below to connect RisingWave to a Pulsa broker.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name 
[schema_definition]
WITH (
   connector='pulsar',
   field_name='value', ...
)
ROW FORMAT data_format 
[MESSAGE 'message']
[ROW SCHEMA LOCATION 'location'];
```

**schema_definition**:
```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

:::info

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` or `CREATE MATERIALIZED SOURCE` statement. The schema should be provided in a Web location in the `ROW SCHEMA LOCATION` section.

:::

:::note

RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record. 

:::


|Field|Notes|
|---|---|
|topic|Required. Address of the Pulsar topic. One source can only correspond to one topic.	|
|service.url| Required. Address of the Pulsar service	|
|admin.url	| Required. Address of the Pulsar admin	|
|scan.startup.mode| The Pulsar consumer starts consuming data from the commit offset. Supported modes are `earliest` and `latest`. If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|The offset in milliseconds from a certain point of time.|

|Field|Notes|
|---|---|
|`MATERIALIZED`| When you materialize a source, you choose to persist the data from the source in RisingWave.|
|topic	|Required. Address of the Pulsar topic. One source can only correspond to one topic.|
|service.url| Required. Address of the Pulsar service.	|
|admin.url	|Required. Address of the Pulsar admin.|
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis.| Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds).|
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
