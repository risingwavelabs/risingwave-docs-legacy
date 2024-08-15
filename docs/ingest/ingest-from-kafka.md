---
id: ingest-from-kafka
title: Ingest data from Kafka
description: Connect RisingWave to a Kafka broker.
slug: /ingest-from-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-kafka/" />
</head>

This topic describes how to connect RisingWave to a Kafka broker that you want to receive data from, and how to specify data formats, schemas, and security (encryption and authentication) settings.

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command. When creating a source, you can choose to persist the data from the source in RisingWave by using the `CREATE TABLE` command and specifying the connection settings and data format.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or data transformations.

RisingWave supports exactly-once semantics by reading transactional messages only when the associated transaction has been committed. This is the set behavior for RisingWave and not configurable.

:::tip Guided setup
RisingWave Cloud provides an intuitive guided setup for creating a Kafka source. For more information, see [Create a source using guided setup](/cloud/manage-sources/#using-guided-setup) in the RisingWave Cloud documentation.

<lightButton text="Sign up for RisingWave Cloud" url="https://cloud.risingwave.com/auth/signup/" />
:::

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
[INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]]
WITH (
   connector='kafka',
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

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` statement.

:::

:::note

RisingWave performs primary key constraint checks on tables but not on sources. If you need the checks to be performed, please create a table.

For tables with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record.

:::

### Connector parameters

|Field|Notes|
|---|---|
|topic| Required. Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server| Required. Address of the Kafka broker. Format: `'ip:port,ip:port'`. |
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp.millis|Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds). If this field is specified, the value for `scan.startup.mode` will be ignored.|
|properties.sync.call.timeout | Optional. Specify the timeout. By default, the timeout is 5 seconds.  |
|properties.client.id|Optional. Client ID associated with the Kafka client. |

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Data format. Supported formats: `DEBEZIUM`, `MAXWELL`, `CANAL`, `UPSERT`, `PLAIN`. |
|*data_encode*| Data encode. Supported encodes: `JSON`, `AVRO`, `PROTOBUF`, `CSV`. |
|*message* | Message name of the main Message in schema definition. Required for Protobuf. |
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. This option is not supported for Avro data. For Protobuf data, you must specify either a schema location or a schema registry but not both.|
|*schema.registry*| Confluent Schema Registry URL. Example: `http://127.0.0.1:8081`. For Avro data, you must specify a Confluent Schema Registry or an AWS Glue Schema Registry. For Protobuf data, you must specify either a schema location or a Confluent Schema Registry but not both.|
|*schema.registry.username*|Conditional. User name for the schema registry. It must be specified with `schema.registry.password`.|
|*schema.registry.password*|Conditional. Password for the schema registry. It must be specified with `schema.registry.username`.|
|*schema.registry.name.strategy*|Optional. Accepts `topic_name_strategy` (default), `record_name_strategy`, `topic_record_name_strategy`. If it is set to either `record_name_strategy` or `topic_record_name_strategy`, the `message` parameter must also be set. It can only be specified with *schema.registry*. |
|*access_key*|Required if loading descriptors from S3. The access key ID of AWS. | 
|*secret_key*|Required if loading descriptors from S3. The secret access key of AWS. |
|*region*|Required if loading descriptors from S3. The AWS service region. |
|*arn*|Optional. The Amazon Resource Name (ARN) of the role to assume. |
|*external_id*| Optional. The [external](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) id used to authorize access to third-party resources. |

## Additional Kafka parameters

When creating a source in RisingWave, you can specify the following Kafka parameters. To set the parameter, add the RisingWave equivalent of the Kafka parameter under the `WITH options`. For an example of the usage of these parameters, see the JSON example. For additional details on these parameters, see the [Configuration properties](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md).

| Kafka parameter name | RisingWave parameter name | Type |
|----------------------|---------------------------|------|
|enable.auto.commit | properties.enable.auto.commit | boolean |
|enable.ssl.certificate.verification|properties.enable.ssl.certificate.verification|bool|
|fetch.max.bytes | properties.fetch.max.bytes | int |
|fetch.queue.backoff.ms | properties.fetch.queue.backoff.ms | int |
|fetch.wait.max.ms | properties.fetch.wait.max.ms | int |
|message.max.bytes | properties.message.max.bytes | int |
|queued.max.messages.kbytes| properties.queued.max.messages.kbytes | int |
|queued.min.messages | properties.queued.min.messages | int |
|receive.message.max.bytes | properties.receive.message.max.bytes | int |
|ssl.endpoint.identification.algorithm | properties.ssl.endpoint.identification.algorithm | str |

:::note
Set `properties.ssl.endpoint.identification.algorithm` to `none` to bypass the verification of CA certificates and resolve SSL handshake failure. This parameter can be set to either `https` or `none`. By default, it is `https`.
:::

## Examples

Here are examples of connecting RisingWave to a Kafka broker to read data from individual topics.

:::note
RisingWave supports reading messages that have been compressed by [zstd](http://www.zstd.net/). Additional configurations are not required.
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro">

```sql
CREATE SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE AVRO (
   message = 'message_name',
   schema.registry = 'http://127.0.0.1:8081'
);
```

</TabItem>
<TabItem value="upsert avro" label="Upsert Avro">

```sql
CREATE TABLE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test_topic'
)
FORMAT UPSERT ENCODE AVRO (
   schema.registry = 'http://127.0.0.1:8081',
   schema.registry.username='your_schema_registry_username',
   schema.registry.password='your_schema_registry_password'
);
```

</TabItem>
<TabItem value="json" label="JSON">

```sql
CREATE SOURCE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE JSON;
```

The additional Kafka parameters `queued.min.messages` and `queued.max.messages.kbytes` are specified with `properties.queued.min.messages` and `properties.queued.max.messages.kbytes`, respectively, when creating the source.

```sql
CREATE SOURCE s1 (v1 int, v2 varchar) with (
  connector = 'kafka',
  topic = 'kafka_1_partition_topic',
  properties.bootstrap.server = 'message_queue:29092',
  scan.startup.mode = 'earliest',
  properties.queued.min.messages = 10000,
  properties.queued.max.messages.kbytes = 65536
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>
<TabItem value="upsert json" label="Upsert JSON">

```sql
CREATE TABLE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='t1'
) FORMAT UPSERT ENCODE JSON;
```

</TabItem>
<TabItem value="pb" label="Protobuf">

```sql
CREATE SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp.millis='140000000'
) FORMAT PLAIN ENCODE PROTOBUF (
   message = 'package.message_name',
   access_key = 'your_access_key',
   secret_key = 'your secret_key',
   location = 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto'
);
```

</TabItem>
<TabItem value="csv" label="CSV">

```sql
CREATE TABLE s0 (v1 int, v2 varchar)
WITH (
   connector = 'kafka',
   topic = 'kafka_csv_topic',
   properties.bootstrap.server = '127.0.0.1:29092',
   scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE CSV (
   without_header = 'true',
   delimiter = ','
);
```

- CSV header is not supported when creating a table with Kafka connector. Add the `without_header` option to the encode parameters.

- The `delimiter` option specifies the delimiter character used in the CSV data. Set `delimiter = E'\t'` for tab-delimited data.

</TabItem>
<TabItem value="bytes" label="Bytes">

```sql
CREATE SOURCE t1 (id bytea)
WITH (
   connector='kafka',
   topic='topic1',
   properties.bootstrap.server='localhost:9093',
) FORMAT PLAIN ENCODE BYTES;
```

</TabItem>
</Tabs>

## Query Kafka timestamp

For each Kafka source created, the virtual column, `_rw_kafka_timestamp`, will also exist. This column includes the timestamp of the Kafka message.

You can include this column in your views or materialized views to display the Kafka timestamp. Here is an example.

```sql
CREATE MATERIALIZED VIEW v1 AS
SELECT _rw_kafka_timestamp, col1
FROM source_name;
```

If directly querying from the source, you can use `_rw_kafka_timestamp` to filter messages sent within a specific time period. For example, the following query only selects messages sent in the past 10 minutes.

```sql
SELECT * FROM source_name
WHERE _rw_kafka_timestamp > now() - interval '10 minute';
```

## Read schemas from locations

RisingWave supports reading schemas from a Web location in `http://...`, `https://...`, or `S3://...` format, or a Confluent Schema Registry for Kafka data in Protobuf format. For Avro, Confluent Schema Registry and AWS Glue Schema Registry are supported for reading schemas.

For Protobuf, if a schema location is specified, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

```shell
protoc -I=$include_path --include_imports --descriptor_set_out=schema.pb schema.proto
```

To specify a schema location, add this clause to a `CREATE SOURCE` statement.

```sql
ENCODE data_encode (
   schema.location = 'location'
)
```

If a primary key also needs to be defined, use the table constraint syntax.

```sql
CREATE TABLE table1 (PRIMARY KEY(id)) 
```

## Read schemas from Confluent Schema Registry

Confluent and [Karapace](https://aiven.io/docs/products/kafka/karapace) Schema Registry provide a serving layer for your metadata. They provide a RESTful interface for storing and retrieving your schemas.

RisingWave supports reading schemas from a Confluent Schema Registry. The latest schema will be retrieved from the specified Confluent Schema Registry using the `TopicNameStrategy` strategy when the `CREATE SOURCE` statement is issued. Then the schema parser in RisingWave will automatically determine the columns and data types to use in the source.

To specify the Confluent Schema Registry, add this clause to a `CREATE SOURCE` statement.

```sql
ENCODE data_encode (
   schema.registry = 'schema_registry_url'
)
```

To learn more about Confluent Schema Registry and how to set up a Schema Registry, refer to the [Confluent Schema Registry documentation](https://docs.confluent.io/platform/current/schema-registry/index.html).

To learn more about Karapace Schema Registry and how to get started, see [Get started with Karapace](https://aiven.io/docs/products/kafka/karapace/get-started). 

If a primary key also needs to be defined, use the table constraint syntax.

```sql
CREATE TABLE table1 (PRIMARY KEY(id));
```

### Schema evolution

Based on the compatibility type that is configured for the schema registry, some changes are allowed without changing the schema to a different version. In this case, RisingWave will continue using the original schema definition. To use a newer version of the writer schema in RisingWave, you need to drop and recreate the source.

To learn about compatibility types for Schema Registry and the changes allowed, see [Compatibility Types](https://docs.confluent.io/platform/current/schema-registry/avro.html#compatibility-types).

## Read schemas from AWS Glue Schema Registry

:::note Premium Edition Feature
This feature is only available in the premium edition of RisingWave. The premium edition offers additional advanced features and capabilities beyond the free and community editions. If you have any questions about upgrading to the premium edition, please contact our sales team at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com).
:::

AWS Glue Schema Registry is a serverless feature of AWS Glue that allows you to centrally manage and enforce schemas for data streams, enabling data validation and compatibility checks. It helps in improving the quality of data streams by providing a central repository for managing and enforcing schemas across various AWS services and custom applications.

You can specify the following configurations in the `ENCODE AVRO (...)` clause to read schemas from Glue.

**Auth-related configurations**:

- `aws.region`: The region of the AWS Glue Schema Registry. For example, `us-west-2`.

- `aws.credentials.access_key_id`: Your AWS access key ID.

- `aws.credentials.secret_access_key`: Your AWS secret access key.

- `aws.credentials.role.arn`: The Amazon Resource Name (ARN) of the role to assume. For example, `arn:aws:iam::123456123456:role/MyGlueRole`.

**ARN to the schema**:

- `aws.glue.schema_arn`: The ARN of the schema in AWS Glue Schema Registry. For example, `'arn:aws:glue:ap-southeast-1:123456123456:schema/default-registry/MyEvent'`.

```sql title="Examples"
ENCODE AVRO (
  aws.glue.schema_arn = 'arn:aws:glue:ap-southeast-1:123456123456:schema/default-registry/MyEvent',
  aws.region = 'US-WEST-2',
  aws.credentials.access_key_id = 'your_access_key_id',
  aws.credentials.secret_access_key = 'your_secret_access_key',
  aws.credentials.role.arn = 'arn:aws:iam::123456123456:role/MyGlueRole'
  ...
);
```

## Create source with PrivateLink connection

If your Kafka source service is located in a different VPC from RisingWave, use AWS PrivateLink to establish a secure and direct connection. For details on how to set up an AWS PrivateLink connection, see [Create an AWS PrivateLink connection](/sql/commands/sql-create-connection.md#create-an-aws-privatelink-connection).

To create a Kafka source with a PrivateLink connection, in the WITH section of your `CREATE SOURCE` or `CREATE TABLE` statement, specify the following parameters.

|Parameter| Notes|
|---|---|
|`privatelink.targets`| The PrivateLink targets that correspond to the Kafka brokers. The targets should be in JSON format. Note that each target listed corresponds to each broker specified in the `properties.bootstrap.server` field. If the order is incorrect, there will be connectivity issues. |
|`privatelink.endpoint`|The DNS name of the VPC endpoint. <br/> If you're using RisingWave Cloud, you can find the auto-generated endpoint after you created a connection. See details in [Create a PrivateLink connection](/cloud/create-a-connection#whats-next).|
|`connection.name`| The name of the connection. <br/> This parameter should only be included if you are using a connection created with the [`CREATE CONNECTION`](/sql/commands/sql-create-connection.md) statement. Omit this parameter if you have provisioned a VPC endpoint using `privatelink.endpoint` (recommended).|

Here is an example of creating a Kafka source using a PrivateLink connection. Notice that `{"port": 9094}` corresponds to the broker `broker1-endpoint`, `{"port": 9095}` corresponds to the broker `broker2-endpoint`, and `{"port": 9096}` corresponds to the broker `broker3-endpoint`.

```sql
CREATE TABLE IF NOT EXISTS crypto_source (
  product_id VARCHAR,
  price NUMERIC,
  open_24h NUMERIC,
  volume_24h NUMERIC,
  low_24h NUMERIC,
  high_24h NUMERIC,
  volume_30d NUMERIC,
  best_bid  NUMERIC,
  best_ask  NUMERIC,
  side VARCHAR,
  time timestamp,
  trade_id bigint,
)
WITH (
  connector='kafka',
  topic='crypto',
  privatelink.endpoint='10.148.0.4',
  privatelink.targets='[{"port": 9094}, {"port": 9095}, {"port": 9096}]',
  properties.bootstrap.server='broker1-endpoint,broker2-endpoint,broker3-endpoint',
  scan.startup.mode='latest'
) FORMAT PLAIN ENCODE JSON;
```

## TLS/SSL encryption and SASL authentication

RisingWave can read Kafka data that is encrypted with [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) and/or authenticated with SASL.

Secure Sockets Layer (SSL) was the predecessor of Transport Layer Security (TLS), and has been deprecated since June 2015. For historical reasons, `SSL` is used in configuration and code instead of `TLS`.

Simple Authentication and Security Layer (SASL) is a framework for authentication and data security in Internet protocols.

RisingWave supports these SASL authentication mechanisms:

- `SASL/PLAIN`
- `SASL/SCRAM`
- `SASL/GSSAPI`
- `SASL/OAUTHBEARER`

SSL encryption can be used concurrently with SASL authentication mechanisms.

To learn about how to enable SSL encryption and SASL authentication in Kafka, including how to generate the keys and certificates, see the [Security Tutorial](https://docs.confluent.io/platform/current/security/security_tutorial.html#overview) from Confluent.

You need to specify encryption and authentication parameters in the WITH section of a `CREATE SOURCE` statement.

<Tabs queryString="method">

<TabItem value="SSL without SASL" label="SSL without SASL">

To read data encrypted with SSL without SASL authentication, specify these parameters in the WITH section of your `CREATE SOURCE` statement.

|Parameter| Notes|
|---|---|
|`properties.security.protocol`|Set to `SSL`.|
|`properties.ssl.ca.location`| |
|`properties.ssl.certificate.location`| |
|`properties.ssl.key.location`| |
|`properties.ssl.key.password`| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

Here is an example of creating a table encrypted with SSL without using SASL authentication.

```sql
CREATE TABLE IF NOT EXISTS table_1 (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.security.protocol='SSL',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
) FORMAT PLAIN ENCODE JSON;
```
</TabItem>

<TabItem value="SASL/PLAIN" label="SASL/PLAIN">

|Parameter| Notes|
|---|---|
|`properties.security.protocol`| For SASL/PLAIN without SSL, set to `SASL_PLAINTEXT`. For SASL/PLAIN with SSL, set to `SASL_SSL`.|
|`properties.sasl.mechanism`|Set to `PLAIN`.|
|`properties.sasl.username`| |
|`properties.sasl.password`| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

For SASL/PLAIN with SSL, you need to include these SSL parameters:

- `properties.ssl.ca.location`
- `properties.ssl.certificate.location`
- `properties.ssl.key.location`
- `properties.ssl.key.password`

Here is an example of creating a source authenticated with SASL/PLAIN without SSL encryption.

```sql
CREATE SOURCE IF NOT EXISTS source_2 (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
) FORMAT PLAIN ENCODE JSON;
```

This is an example of creating a source authenticated with SASL/PLAIN with SSL encryption.

```sql
CREATE SOURCE IF NOT EXISTS source_3 (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_SSL',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

<TabItem value="SASL/SCRAM" label="SASL/SCRAM">


|Parameter| Notes|
|---|---|
|`properties.security.protocol`| For SASL/SCRAM without SSL, set to `SASL_PLAINTEXT`. For SASL/SCRAM with SSL, set to `SASL_SSL`.|
|`properties.sasl.mechanism`|Set to `SCRAM-SHA-256` or `SCRAM-SHA-512` depending on the encryption method used.|
|`properties.sasl.username`| |
|`properties.sasl.password`| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

For SASL/SCRAM with SSL, you also need to include these SSL parameters:

- `properties.ssl.ca.location`
- `properties.ssl.certificate.location`
- `properties.ssl.key.location`
- `properties.ssl.key.password`

Here is an example of creating a table authenticated with SASL/SCRAM without SSL encryption.

```sql
CREATE TABLE IF NOT EXISTS table_4 (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.sasl.mechanism='SCRAM-SHA-256',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

<TabItem value="SASL/GSSAPI" label="SASL/GSSAPI">

|Parameter| Notes|
|---|---|
|`properties.security.protocol`| Set to `SASL_PLAINTEXT`, as RisingWave does not support using SASL/GSSAPI with SSL.|
|`properties.sasl.mechanism`| Set to `GSSAPI`.|
|`properties.sasl.kerberos.service.name`| |
|`properties.sasl.kerberos.keytab`| |
|`properties.sasl.kerberos.principal`| |
|`properties.sasl.kerberos.kinit.cmd`| |
|`properties.sasl.kerberos.min.time.before.relogin`| |

:::note
For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.
:::

Here is an example of creating a source authenticated with SASL/GSSAPI without SSL encryption.

```sql
CREATE SOURCE IF NOT EXISTS source_5 (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.sasl.mechanism='GSSAPI',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.kerberos.service.name='kafka',
   properties.sasl.kerberos.keytab='/etc/krb5kdc/kafka.client.keytab',
   properties.sasl.kerberos.principal='kafkaclient4@AP-SOUTHEAST-1.COMPUTE.INTERNAL',
   properties.sasl.kerberos.kinit.cmd='sudo kinit -R -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal} || sudo kinit -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal}',
   properties.sasl.kerberos.min.time.before.relogin='10000'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

<TabItem value="SASL/OAUTHBEARER" label="SASL/OAUTHBEARER">

:::caution
 The implementation of SASL/OAUTHBEARER in RisingWave validates only [unsecured client side tokens](https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_oauth.html#unsecured-client-side-token-creation-options-for-sasl-oauthbearer), and does not support OpenID Connect (OIDC) authentication. Therefore, it should not be used in production environments.
:::

|Parameter| Notes|
|---|---|
|`properties.security.protocol`| For SASL/OAUTHBEARER without SSL, set to `SASL_PLAINTEXT`. For SASL/OAUTHBEARER with SSL, set to `SASL_SSL`.|
|`properties.sasl.mechanism`|Set to `OAUTHBEARER`.|
|`properties.sasl.oauthbearer.config`| |

:::note
For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix. Also, due to the limitation of the SASL/OAUTHBEARER implementation, you only need to specify one OAUTHBEARER parameter: `properties.sasl.oauthbearer.config`. Other OAUTHBEARER parameters are not applicable.
:::

For SASL/OAUTHBEARER with SSL, you also need to include these SSL parameters:

- `properties.ssl.ca.location`
- `properties.ssl.certificate.location`
- `properties.ssl.key.location`
- `properties.ssl.key.password`

This is an example of creating a materialized source authenticated with SASL/OAUTHBEARER without SSL encryption.

```sql
CREATE TABLE IF NOT EXISTS source_6 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   scan.startup.mode='earliest',
   properties.sasl.mechanism='OAUTHBEARER',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.oauthbearer.config='principal=bob'
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

</Tabs>


---

:::note
We have noticed that there is a frequently asked question about the Kafka source: why doesn't RisingWave accept the Kafka consumer group ID? We want to inform you that we are actively working on supporting this feature. You can look forward to using the Kafka consumer group ID with RisingWave soon.
:::
