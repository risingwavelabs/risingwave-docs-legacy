---
id: create-source-kafka-redpanda
title: Kafka & Redpanda
description: Connect RisingWave to a Kafka/Redpanda broker.
slug: /create-source-kafka-redpanda
---

This topic describes how to connect RisingWave to a Kafka broker that you want to receive data from, and how to specify data formats, schemas, and security (encryption and authentication) settings.

To connect to a Kafka or Redpanda broker, you need to use the `CREATE SOURCE` command to create a source for that broker.


## Syntax

```sql
CREATE [ MATERIALIZED ] SOURCE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
WITH (
   connector='kafka',
   topic='value',
   field_name='value', ...
)
ROW FORMAT data_format 
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION ['location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ] ];
```

:::note
RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record. 
:::

### `WITH` parameters

|Field|	Required?| 	Notes|
|---|---|---|
|topic|Yes|Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server	|Yes|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|
|properties.group.id	|Yes|Name of the Kafka consumer group	|
|scan.startup.mode|No|The Kafka consumer starts consuming data from the commit offset. This includes two values: `'earliest'` and `'latest'`. If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|No|Specify the offset in milliseconds from a certain point of time.	|

### `ROW FORMAT` parameters

|Field | Notes|
|---|----|
|*data_format*| Data format. Supported formats: `JSON`, `AVRO`, `PROTOBUF`|
|*message* | Message for the format. Required for Avro and Protobuf.|
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. For Avro and Protobuf data, you must specify either a schema location or a schema registry but not both.|
|*schema_registry_url*| Confluent Schema Registry URL. Example: `http://127.0.0.1:8081`. For Avro or Protobuf data, you must specify either a schema location or a schema registry but not both.|


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
ROW SCHEMA LOCATION CONFLUENT SCHEMA REGISTRY 'http://127.0.0.1:8081';
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

## Read schemas from locations

RisingWave supports reading schemas from a Web location in `http://...`, `https://...`, or `S3://...` format, or a Confluent Schema Registry for Kafka data in Avro or Protobuf format.

For Protobuf, if a schema location is specified, the schema file must be a `FileDescriptorSet`, which can be compiled from a `.proto` file with a command like this:

```shell
protoc -I=$include_path --include_imports --descriptor_set_out=schema.pb schema.proto
```

To specify a schema location, add this clause to a `CREATE SOURCE` statement.
```SQL
ROW SCHEMA LOCATION 'location'
```

## Read schemas from Schema Registry

Confluent Schema Registry provides a serving layer for your metadata. It provides a RESTful interface for storing and retrieving your schemas.

RisingWave supports reading schemas from a Schema Registry. The latest schema will be retrieved from the specified Schema Registry using the `TopicNameStrategy` strategy when the `CREATE SOURCE` statement is issued. Then the schema parser in RisingWave will automatically determine the columns and data types to use in the source.

To specify the Schema Registry, add this clause to a `CREATE SOURCE` statement. 

```sql
ROW FORMAT LOCATION CONFLUENT SCHEMA REGISTRY 'schema_registry_url;
```

To learn more about Confluent Schema Registry and how to set up a Schema Registry, refer to the [Confluent Schema Registry documentation](https://docs.confluent.io/platform/current/schema-registry/index.html).

### Schema evolution

Based on the compatibility type that is configured for the schema registry, some changes are allowed without changing the schema to a different version. In this case, RisingWave will continue using the original schema definition. To use a newer version of the writer schema in RisingWave, you need to drop and recreate the source.

To learn about compatibility types for Schema Registry and the changes allowed, see [Compatibility Types](https://docs.confluent.io/platform/current/schema-registry/avro.html#compatibility-types).

## TLS/SSL encryption and SASL authentication

RisingWave can read Kafka data that is encrypted with [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) and/or authenticated with SASL.

Secure Sockets Layer (SSL) was the predecessor of Transport Layer Security (TLS), and has been deprecated since June 2015. For historical reasons, `SSL` is used in configuration and code instead of `TLS`.

Simple Authentication and Security Layer (SASL) is a framework for authentication and data security in Internet protocols.

RisingWave supports four SASL authentication mechanisms:

- SASL/PLAIN
- SASL/SCRAM
- SASL/GSSAPI
- SASL/OAUTHBEARER

SSL encryption can be used concurrently with SASL authentication mechanisms.

To learn about how to enable SSL encryption and SASL authentication in Kafka, including how to generate the keys and certificates, see the [Security Tutorial](https://docs.confluent.io/platform/current/security/security_tutorial.html#overview) from Confluent.

You need to specify encryption and authentication parameters in the WITH section of a `CREATE SOURCE` statement.

### SSL without SASL

To read data encrypted with SSL without SASL authentication, specify these parameters in the WITH section of your `CREATE SOURCE` statement.

|Parameter| Notes|
|---|---|
|properties.security.protocol|Set to `SSL`.|
|properties.ssl.ca.location| |
|properties.ssl.certificate.location| |
|properties.ssl.key.location| |
|properties.ssl.key.password| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

Here is an example of creating a source encrypted with SSL without using SASL authentication.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_1 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.security.protocol='SSL',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
)                                                       
ROW FORMAT JSON;
```

### SASL/PLAIN

|Parameter| Notes|
|---|---|
|properties.security.protocol| For SASL/PLAIN without SSL, set to `SASL_PLAINTEXT`. For SASL/PLAIN with SSL, set to `SASL_SSL`.|
|properties.sasl.mechanism|Set to `PLAIN`.|
|properties.sasl.username| |
|properties.sasl.password| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

For SASL/PLAIN with SSL, you need to include these SSL parameters:

- properties.ssl.ca.location
- properties.ssl.certificate.location
- properties.ssl.key.location
- properties.ssl.key.password

Here is an example of creating a source authenticated with SASL/PLAIN without SSL encryption.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_2 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
)                                                           
ROW FORMAT JSON;
```
This is an example of creating a source authenticated with SASL/PLAIN with SSL encryption.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_3 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_SSL',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
)                                                           
ROW FORMAT JSON;
```

### SASL/SCRAM

|Parameter| Notes|
|---|---|
|properties.security.protocol| For SASL/SCRAM without SSL, set to `SASL_PLAINTEXT`. For SASL/SCRAM with SSL, set to `SASL_SSL`.|
|properties.sasl.mechanism|Set to `SCRAM-SHA-256` or `SCRAM-SHA-512` depending on the encryption method used.|
|properties.sasl.username| |
|properties.sasl.password| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

For SASL/SCRAM with SSL, you also need to include these SSL parameters:

- properties.ssl.ca.location
- properties.ssl.certificate.location
- properties.ssl.key.location
- properties.ssl.key.password

Here is an example of creating a source authenticated with SASL/SCRAM without SSL encryption.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_4 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.sasl.mechanism='SCRAM-SHA-256',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
)                                                       
ROW FORMAT JSON;
```

### SASL/GSSAPI

|Parameter| Notes|
|---|---|
|properties.security.protocol| Set to `SASL_PLAINTEXT`, as RisingWave does not support using SASL/GSSPI with SSL.|
|properties.sasl.mechanism| Set to `GSSAPI`.|
|properties.sasl.kerberos.service.name| |
|properties.sasl.kerberos.keytab| |
|properties.sasl.kerberos.principal| |
|properties.sasl.kerberos.kinit.cmd=| |
|properties.sasl.kerberos.min.time.before.relogin| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

Here is an example of creating a source authenticated with SASL/GSSAPI without SSL encryption.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_5 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.sasl.mechanism='GSSAPI',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.kerberos.service.name='kafka',
   properties.sasl.kerberos.keytab='/etc/krb5kdc/kafka.client.keytab',
   properties.sasl.kerberos.principal='kafkaclient4@AP-SOUTHEAST-1.COMPUTE.INTERNAL',
   properties.sasl.kerberos.kinit.cmd='sudo kinit -R -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal} || sudo kinit -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal}',
   properties.sasl.kerberos.min.time.before.relogin='10000'
)                                                       
ROW FORMAT JSON;
```

### SASL/OAUTHBEARER

:::caution

 The implementation of SASL/OAUTHBEARER in RisingWave validates only [unsecured client side tokens](https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_oauth.html#unsecured-client-side-token-creation-options-for-sasl-oauthbearer), and does not support OpenID Connect (OIDC) authentication. Therefore, it should not be used in production environments.

:::

|Parameter| Notes|
|---|---|
|properties.security.protocol| For SASL/OAUTHBEARER without SSL, set to `SASL_PLAINTEXT`. For SASL/OAUTHBEARER with SSL, set to `SASL_SSL`.|
|properties.sasl.mechanism|Set to `OAUTHBEARER`.|
|properties.sasl.oauthbearer.config| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix. Also, due to the limitation of the SASL/OAUTHBEARER implementation, you only need to specify one OAUTHBEARER parameter: `properties.sasl.oauthbearer.config`. Other OAUTHBEARER parameters are not applicable.

:::

For SASL/OAUTHBEARER with SSL, you also need to include these SSL parameters:

- properties.ssl.ca.location
- properties.ssl.certificate.location
- properties.ssl.key.location
- properties.ssl.key.password

This is an example of creating a source authenticated with SASL/OAUTHBEARER without SSL encryption.

```sql
CREATE MATERIALIZED SOURCE IF NOT EXISTS source_6 (
   column1 varchar,
   column2 integer,
)                  
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   kafka.scan.startup.mode='earliest',
   properties.sasl.mechanism='OAUTHBEARER',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.oauthbearer.config='principal=bob'
)                                                       
ROW FORMAT JSON;
```