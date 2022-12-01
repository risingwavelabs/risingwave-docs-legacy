---
id: create-source-kinesis
title: Kinesis
description: Connect RisingWave to a Kinesis.
slug: /create-source-kinesis
---

Use the SQL statement below to connect RisingWave to Kinesis Data Streams.

## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type, ...
) 
WITH (
   connector='kinesis',
   field_name='value', ...
) 
ROW FORMAT AVRO | JSON | PROTOBUF MESSAGE 'main_message';
```
### `WITH` options

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
|scan.startup.mode |earliest  |String| The Kinesis consumer starts consuming data from the commit offset. This includes three values: 'earliest', 'latest', and 'sequence_number'.|False|
|scan.startup.sequence_number |None | int64| Specify the sequence number to start consuming from. | True if `scan.startup.mode` = 'sequence_number', otherwise False| 

### Formats

Specify the format of the stream in the `ROW FORMAT` section of your statement.

|Format|Syntax| Notes|
|---|---|---|
|Avro|`ROW FORMAT AVRO MESSAGE 'main_message' ROW SCHEMA LOCATION 'local_or_remote_location'`| Message and schema location are required.|
|JSON| `ROW FORMAT JSON`| |
|Protobuf|`ROW FORMAT AVRO MESSAGE 'main_message' ROW SCHEMA LOCATION 'local_or_remote_location'`|Message and schema location are required.|

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
