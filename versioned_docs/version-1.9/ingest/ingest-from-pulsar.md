---
id: ingest-from-pulsar
title: Ingest data from Pulsar
description: Connect RisingWave to a Pulsar broker.
slug: /ingest-from-pulsar
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-pulsar/" />
</head>

You can ingest data from Pulsar into RisingWave by using the Pulsar source connector in RisingWave.

:::note Beta feature
The Pulsar source connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

When creating a source, you can choose to persist the data from the source in RisingWave by using `CREATE TABLE` instead of `CREATE SOURCE` and specifying the connection settings and data format.

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
[INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]]
WITH (
   connector='pulsar',
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

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` or `CREATE TABLE` statement. The schema should be provided in a Web location in the option `schema.location` in `ENCODE properties` section.
:::

:::note

RisingWave performs primary key constraint checks on tables with connector settings but not on regular sources. If you need the checks to be performed, please create a table with connector settings.

For a table with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record.
:::

### Connector parameters

|Field|Notes|
|---|---|
|topic |Required. Address of the Pulsar topic. One source can only correspond to one topic.|
|service.url| Required. Address of the Pulsar service. |
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp.millis.| Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds).|
|auth.token | Optional. A token for auth. If both `auth.token` and `oauth` are set, only `oauth` authorization is effective.|
|oauth.issuer.url | Optional. The issuer url for OAuth2. This field must be filled if other `oauth` fields are specified. |
|oauth.credentials.url | Optional. The path for credential files, starts with `file://`. This field must be filled if other `oauth` fields are specified.|
|oauth.audience | Optional. The audience for OAuth2. This field must be filled if other `oauth` fields are specified.|
|oauth.scope | Optional. The scope for OAuth2. |

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Supported formats: `DEBEZIUM`, `MAXWELL`, `CANAL`, `UPSERT`, `PLAIN`.|
|*data_encode*| Supported encodes: `JSON`, `AVRO`, `PROTOBUF`, `CSV`,  `BYTES`. |
|*message* |Message name of the main Message in schema definition. Required when `data_encode` is `PROTOBUF`.|
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. Required when `data_encode` is `AVRO` or `PROTOBUF`. Examples:<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location` |
|*access_key* | Optional. The AWS access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path.|
|*secret_access* | Optional. The AWS secret access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path. |
|*region*| Required if loading descriptors from S3. The AWS service region. |
|*arn*| Optional. The Amazon Resource Name (ARN) of the role to assume. |
|*external_id*| Optional. The [external](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) id used to authorize access to third-party resources. |

## Read schemas from locations

RisingWave supports reading schemas from a Web location in `http://...`, `https://...`, or `S3://...` format for Pulsar data in Avro or Protobuf format.

For Protobuf, if a schema location is specified, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

```shell
protoc -I=$include_path --include_imports --descriptor_set_out=schema.pb schema.proto
```

To specify a schema location, add this clause to a `CREATE SOURCE` statement.

```sql
ROW SCHEMA LOCATION 'location'
```

If a primary key also needs to be defined, use the table constraint syntax.

```sql
CREATE TABLE table1 (PRIMARY KEY(id)) 
```

## Example

Here is an example of connecting RisingWave to a Pulsar broker to read data from individual topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc 
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   oauth.issuer.url='https://auth.streamnative.cloud/',
   oauth.credentials.url='s3://bucket_name/your_key_file.file',
   oauth.audience='urn:sn:pulsar:o-d6fgh:instance-0',
   access_key='access_key',
   secret_access='secret_access',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE AVRO (
   message = 'message',
   schema.location = 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc'
);
```

</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   oauth.issuer.url='https://auth.streamnative.cloud/',
   oauth.credentials.url='s3://bucket_name/your_key_file.file',
   oauth.audience='urn:sn:pulsar:o-d6fgh:instance-0',
   access_key='access_key',
   secret_access='secret_access',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   oauth.issuer.url='https://auth.streamnative.cloud/',
   oauth.credentials.url='s3://bucket_name/your_key_file.file',
   oauth.audience='urn:sn:pulsar:o-d6fgh:instance-0',
   access_key='access_key',
   secret_access='secret_access',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE PROTOBUF (
   message = 'package.message_name',
   schema.location = 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto'
);
```

</TabItem>
</Tabs>
