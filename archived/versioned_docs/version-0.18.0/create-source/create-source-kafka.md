---
id: create-source-kafka
title: Ingest data from Kafka
description: Connect RisingWave to a Kafka broker.
slug: /create-source-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-kafka/" />
</head>

This topic describes how to connect RisingWave to a Kafka broker that you want to receive data from, and how to specify data formats, schemas, and security (encryption and authentication) settings.

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command. When creating a source, you can choose to persist the data from the source in RisingWave by using the `CREATE TABLE` command and specifying the connection settings and data format.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
WITH (
   connector='kafka',
   connector_parameter='value', ...
)
ROW FORMAT data_format 
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION ['location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ] ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
   rr.Stack(
      rr.Sequence(
         rr.Choice(1,
            rr.Terminal('CREATE TABLE'),
            rr.Terminal('CREATE SOURCE')
         ),
         rr.Optional(rr.Terminal('IF NOT EXISTS')),
         rr.NonTerminal('source_name', 'skip'),
      ),
      rr.Optional(rr.NonTerminal('schema_definition', 'skip')),
      rr.Sequence(
         rr.Terminal('WITH'),
         rr.Terminal('('),
         rr.Stack(
            rr.Stack(
               rr.Sequence(
                  rr.Terminal('connector'),
                  rr.Terminal('='),
                  rr.NonTerminal('kafka', 'skip'),
                  rr.Terminal(','),
               ),
               rr.OneOrMore(
                  rr.Sequence(
                     rr.NonTerminal('connector_parameter', 'skip'),
                     rr.Terminal('='),
                     rr.NonTerminal('value', 'skip'),
                     rr.Terminal(','),
                  ),
               ),
            ),
            rr.Terminal(')'),
         ),
      ),
      rr.Stack(
         rr.Sequence(
            rr.Terminal('ROW FORMAT'),
            rr.NonTerminal('data_format', 'skip'),
         ),
         rr.Optional(
            rr.Sequence(
               rr.Terminal('MESSAGE'),
               rr.NonTerminal('message', 'skip'),
            ),
         ),
         rr.Optional(
            rr.Sequence(
               rr.Terminal('ROW SCHEMA LOCATION'),
               rr.Choice(1,
                  rr.Terminal('location'),
                  rr.Sequence(
                     rr.Terminal('CONFLUENT SCHEMA REGISTRY'),
                     rr.NonTerminal('schema_registry_url', 'skip'),
                  ),
               ),
            ),
         ),
         rr.Terminal(';'),
      ),
   )
);

<drawer SVG={svg} />

**schema_definition**:

```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

:::info

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` statement. The schema should be provided either in a Web location or a Confluent Schema Registry link in the `ROW SCHEMA LOCATION` section.

:::

:::note

RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record.

:::

### Connector parameters

|Field|Notes|
|---|---|
|topic| Required. Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server| Required. Address of the Kafka broker. Format: `'ip:port,ip:port'`. |
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds). If this field is specified, the value for `scan.startup.mode` will be ignored.|

### Other parameters

|Field|Notes|
|---|---|
|*data_format*| Data format. Supported formats: `JSON`, `UPSERT_JSON`, `AVRO`, `UPSERT_AVRO`, `PROTOBUF`|
|*message* | Message name of the main message in schema definition. Required for Protobuf.|
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. For Avro and Protobuf data, you must specify either a schema location or a schema registry but not both.|
|*schema_registry_url*| Confluent Schema Registry URL. Example: `http://127.0.0.1:8081`. For Avro or Protobuf data, you must specify either a schema location or a Confluent Schema Registry but not both.|

## Example

Here is an example of connecting RisingWave to a Kafka broker to read data from individual topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT AVRO 
ROW SCHEMA LOCATION CONFLUENT SCHEMA REGISTRY 'http://127.0.0.1:8081';
```

</TabItem>
<TabItem value="upsert avro" label="Upsert Avro" default>

```sql
CREATE SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test_topic'
)
ROW FORMAT UPSERT_AVRO
ROW SCHEMA LOCATION CONFLUENT SCHEMA REGISTRY 'http://127.0.0.1:8081';
```

</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE TABLE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT JSON;
```

</TabItem>
<TabItem value="upsert json" label="Upsert JSON" default>

```sql
CREATE TABLE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='t1'
) ROW FORMAT UPSERT_JSON;
```

</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE SOURCE IF NOT EXISTS source_abc 
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT PROTOBUF MESSAGE 'main_message'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto';
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

Currently, RisingWave supports schema registry for Avro (recommended) and Protobuf format. JSON Schema is not supported yet.

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

RisingWave supports these SASL authentication mechanisms:

- `SASL/PLAIN`
- `SASL/SCRAM`

SSL encryption can be used concurrently with SASL authentication mechanisms.

To learn about how to enable SSL encryption and SASL authentication in Kafka, including how to generate the keys and certificates, see the [Security Tutorial](https://docs.confluent.io/platform/current/security/security_tutorial.html#overview) from Confluent.

You need to specify encryption and authentication parameters in the WITH section of a `CREATE SOURCE` statement.

### SSL without SASL

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

Here is an example of creating a materialized source encrypted with SSL without using SASL authentication.

```sql
CREATE TABLE IF NOT EXISTS source_1 (
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
)                                                       
ROW FORMAT JSON;
```

### `SASL/PLAIN`

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
)                                                           
ROW FORMAT JSON;

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
)                                                           
ROW FORMAT JSON;
```

### `SASL/SCRAM`

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

Here is an example of creating a materialized source authenticated with SASL/SCRAM without SSL encryption.

```sql
CREATE TABLE IF NOT EXISTS source_4 (
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
)                                                       
ROW FORMAT JSON;
```
