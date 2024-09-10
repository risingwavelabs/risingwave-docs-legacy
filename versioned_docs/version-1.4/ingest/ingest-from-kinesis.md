---
id: ingest-from-kinesis
title: Ingest data from Kinesis
description: Connect RisingWave to Kinesis Data Streams
slug: /ingest-from-kinesis
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-kinesis/" />
</head>

Use the SQL statement below to connect RisingWave to Kinesis Data Streams.

When creating a source, you can choose to persist the data from the source in RisingWave by using `CREATE TABLE` instead of `CREATE SOURCE` and specifying the connection settings and data format.

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name
[ schema_definition ]
WITH (
   connector='kinesis',
   connector_parameter='value', ...
)
FORMAT data_format ENCODE data_encode (
   message = 'message',
   schema.location = 'location' | schema.registry = 'schema_registry_url'
);
```

**schema_definition**:

```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

:::info

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` or `CREATE TABLE` statement. The schema should be provided in a Web location in the option `schema.location` in the `ENCODE` section.

:::

:::note

RisingWave performs primary key constraint checks on tables with connector settings but not on regular sources. If you need the checks to be performed, please create a table with connector settings.

For a table with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record.
:::

### Connector parameters

|Field| Notes|
|---|---|
|stream |Required. Name of the stream.|
|aws.region |Required. AWS service region. For example, US East (N. Virginia).|
|endpoint |Optional. URL of the entry point for the AWS Kinesis service.|
|aws.credentials.access_key_id |Required. This field indicates the access key ID of AWS. |
|aws.credentials.secret_access_key |Required. This field indicates the secret access key of AWS. |
|aws.credentials.session_token |Optional. The session token associated with the temporary security credentials. |
|aws.credentials.role.arn |Optional. The Amazon Resource Name (ARN) of the role to assume.|
|aws.credentials.role.external_id|Optional. The [external id](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) used to authorize access to third-party resources. |
|scan.startup.mode |Optional. The startup mode for Kinesis consumer. Supported modes: `earliest` (starts from the earliest offset), `latest` (starts from the latest offset), and `timestamp` (starts from a specific timestamp, specified by `scan.startup.timestamp.millis`). The default mode is `earliest`.|
|scan.startup.timestamp.millis |Optional. This field specifies the timestamp, represented in i64, to start consuming from. |

### Other parameters

|Field| Notes|
|---|---|
|*data_format*| Supported formats: `DEBEZIUM`, `MAXWELL`, `CANAL`.|
|*data_encode*| Supported encodes: `JSON`, `AVRO`, `PROTOBUF`, `CSV`.|
|*message* |Message name of the main Message in schema definition. Required when `data_encode` is `PROTOBUF`.|
|*location*| Web location of the schema file in  `http://...`, `https://...`, or `S3://...` format. Required when `data_encode` is `AVRO` or `PROTOBUF`. Examples:<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location` |

## Example

Here is an example of connecting RisingWave to Kinesis Data Streams to read data from individual streams.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE {TABLE | SOURCE} [IF NOT EXISTS] source_name
WITH (
   connector='kinesis',
   stream='kafka',
   aws.region='user_test_topic',
   endpoint='172.10.1.1:9090,172.10.1.2:9090',
   aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
   aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
   aws.credentials.role.external_id='demo_external_id',
   aws.credentials.access_key_id = 'your_access_key',
   aws.credentials.secret_access_key = 'your_secret_key'
) FORMAT PLAIN ENCODE AVRO (
    schema.location = 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc'
);
```

</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE {TABLE | SOURCE} [IF NOT EXISTS] source_name (
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
   aws.credentials.role.external_id='demo_external_id',
   aws.credentials.access_key_id = 'your_access_key',
   aws.credentials.secret_access_key = 'your_secret_key'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE {TABLE | SOURCE} [IF NOT EXISTS] source_name
WITH (
   connector='kinesis',
   stream='kafka',
   aws.region='user_test_topic',
   endpoint='172.10.1.1:9090,172.10.1.2:9090',
   aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
   aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
   aws.credentials.role.external_id='demo_external_id',
   aws.credentials.access_key_id = 'your_access_key',
   aws.credentials.secret_access_key = 'your_secret_key'
) FORMAT PLAIN ENCODE PROTOBUF (
    message = 'demo_message',
    schema.location = 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto'
);
```

</TabItem>
</Tabs>
