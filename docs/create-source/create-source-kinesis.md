---
id: create-source-kinesis
title: Ingest data from Kinesis
description: Connect RisingWave to Kinesis Data Streams
slug: /create-source-kinesis
---

Use the SQL statement below to connect RisingWave to Kinesis Data Streams.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
) 
WITH (
   connector='kinesis',
   field_name='value', ...
) 
ROW FORMAT data_format
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION 'location' ]
```

:::note
RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record. 
:::

### `WITH` parameters

|Field|	Default|	Type|	Description|	Required?|
|---|---|---|---|---|
|stream	|None	|String|	The stream name identifies the stream.	|True|
|aws.region	|None	|String|	AWS service region. For example, US East (N. Virginia).	|True|
|endpoint	|None	|String	|The URL of the entry point for the AWS Kinesis service.| False|
|aws.credentials.access_key_id	|None	|String	|Indicates the Access key ID of AWS. Must appear in pairs with aws.credentials.secret_access_key.	|False|
|aws.credentials.secret_access_key	|None	|String	|Indicates the secret access key of AWS. Must appear in pairs with aws.credentials.access_key_id.	|False|
|aws.credentials.session_token	|None	|String	|The session token associated with the credentials. Temporary Session Credentials.	|False|
|aws.credentials.role.arn	|None	|String |The Amazon Resource Name (ARN) of the role to assume.		|False|
|aws.credentials.role.external_id	|None	|String	|The [external id](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) used to authorize access to third-party resources.	|False|
|scan.startup.mode |earliest  |String| The startup mode for Kinesis consumer. Supported modes: 'earliest' (starts from the earliest offset), 'latest' (starts from the latest offset), and 'sequence_number' (starts from specific sequence number, specified by 'scan.startup.sequence_number').|False|
|scan.startup.sequence_number |None | String| Specify the sequence number to start consuming from. | True if `scan.startup.mode` = 'sequence_number', otherwise False| 

### Row format parameters

Specify the format of the stream in the `ROW FORMAT` section of your statement.

|Parameter | Description|
|---|---|
|*data_format*| Supported formats: `JSON`, `AVRO`, `PROTOBUF`.|
|*message* |Message for the format. Required when *data_format* is `AVRO` or `PROTOBUF`.|
|*location*| Web location of the schema file in  `http://...`, `https://...`, or `S3://...` format. Required when *data_format* is `AVRO` or `PROTOBUF`. Examples:<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location` |


## Example
Here is an example of connecting RisingWave to Kinesis Data Streams to read data from individual streams.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE [MATERIALIZED] SOURCE [IF NOT EXISTS] source_name
WITH (
   connector='kinesis',
   stream='kafka',
   aws.region='user_test_topic',
   endpoint='172.10.1.1:9090,172.10.1.2:9090',
   aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
   aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
   aws.credentials.role.external_id='demo_external_id'
) 
ROW FORMAT AVRO MESSAGE 'main_message'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc';
```
</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE [MATERIALIZED] SOURCE [IF NOT EXISTS] source_name (
   column1 varchar,
   column2 integer,
) 
WITH (
   connector='kinesis',
   stream='kafka',
   aws.region='user_test_topic',
   endpoint='172.10.1.1:9090,172.10.1.2:9090',
   aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
   aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
   aws.credentials.role.external_id='demo_external_id'
) 
ROW FORMAT JSON;
```
</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE [MATERIALIZED] SOURCE [IF NOT EXISTS] source_name
WITH (
   connector='kinesis',
   stream='kafka',
   aws.region='user_test_topic',
   endpoint='172.10.1.1:9090,172.10.1.2:9090',
   aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
   aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
   aws.credentials.role.external_id='demo_external_id'
) 
ROW FORMAT PROTOBUF MESSAGE 'main_message'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto';
```
</TabItem>
</Tabs>
