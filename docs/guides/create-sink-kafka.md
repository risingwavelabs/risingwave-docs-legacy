---
id: create-sink-kafka
title: Sink to Kafka
description: Sink data from RisingWave to Kafka topics.
slug: /create-sink-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-sink-kafka/" />
</head>

This topic describes how to sink data from RisingWave to a Kafka broker and how to specify security (encryption and authentication) settings.

A sink is an external target that you can send data to. To stream data out of RisingWave, you need to create a sink. Use the `CREATE SINK` statement to create a sink. You can create a sink with data from a materialized view or a table. RisingWave only supports writing messages in non-transactional mode.

:::tip Guided setup
RisingWave Cloud provides an intuitive guided setup for creating a Kafka sink. For more information, see [Create a sink using guided setup](/cloud/create-a-sink/#using-guided-setup) in the RisingWave Cloud documentation.

<lightButton text="Sign up for RisingWave Cloud" url="https://cloud.risingwave.com/auth/signup/" />
:::

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='kafka',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode [ (
    format_parameter = 'value'
) ]
;
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

## Basic Parameters

All `WITH` options are required unless explicitly mentioned as optional.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified. See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the SELECT command.|
|`connector`| Sink connector type must be `'kafka'` for Kafka sink. |
|`properties.bootstrap.server`|Address of the Kafka broker. Format: `‘ip:port’`. If there are multiple brokers, separate them with commas. |
|`topic`|Address of the Kafka topic. One sink can only correspond to one topic.|
|`primary_key`| Conditional. The primary keys of the sink. Use ',' to delimit the primary key columns. This field is optional if creating a `PLAIN` sink, but required if creating a `DEBEZIUM` or `UPSERT` sink.|

## Additional Kafka parameters

When creating a Kafka sink in RisingWave, you can specify the following Kafka-specific parameters. To set the parameter, add the RisingWave equivalent of the Kafka parameter as a `WITH` option. For additional details on these parameters, see the [Configuration properties](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md).

| Kafka parameter name | RisingWave parameter name | Type |
|----------------------|---------------------------|------|
|allow.auto.create.topics|properties.allow.auto.create.topics|bool|
|batch.num.messages |properties.batch.num.messages|int|
|batch.size |properties.batch.size| int|
|client.id|properties.client.id| string |
|enable.idempotence |properties.enable.idempotence |bool |
|max.in.flight.requests.per.connection| properties.max.in.flight.requests.per.connection| int |
|message.max.bytes | properties.message.max.bytes | int |
|message.send.max.retries |properties.message.send.max.retries| int|
|message.timeout.ms| properties.message.timeout.ms| int |
|queue.buffering.max.kbytes |properties.queue.buffering.max.kbytes| int|
|queue.buffering.max.messages |properties.queue.buffering.max.messages |int|
|queue.buffering.max.ms |properties.queue.buffering.max.ms |float|
|retry.backoff.ms |properties.retry.backoff.ms| int|
|receive.message.max.bytes | properties.receive.message.max.bytes | int |
|ssl.endpoint.identification.algorithm | properties.ssl.endpoint.identification.algorithm | str |

:::note
Set `properties.ssl.endpoint.identification.algorithm` to `none` to bypass the verification of CA certificates and resolve SSL handshake failure. This parameter can be set to either `https` or `none`. By default, it is `https`.
:::

## Sink parameters

|Field|Notes|
|-----|-----|
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `DEBEZIUM`: Output change data capture (CDC) log in Debezium format.</li><li> `UPSERT`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `UPSERT` sink, see the [Overview](/data-delivery.md).|
|data_encode| Data encode. Supported encodes: `JSON` and `AVRO`. Only `UPSERT AVRO` sinks are supported. |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|
|timestamptz.handling.mode|Controls the timestamptz output format. This parameter specifically applies to append-only or upsert sinks using JSON encoding. <br/> - If omitted, the output format of timestamptz is `2023-11-11T18:30:09.453000Z` which includes the UTC suffix `Z`. <br/> - When `utc_without_suffix` is specified, the format is changed to `2023-11-11 18:30:09.453000`.|
|schemas.enable| Only configurable for upsert JSON sinks. By default, this value is `false` for upsert JSON sinks and `true` for debezium `JSON` sinks. If `true`, RisingWave will sink the data with the schema to the Kafka sink. Note that this is not referring to a schema registry containing a JSON schema, but rather schema formats defined using [Kafka Connect](https://www.confluent.io/blog/kafka-connect-deep-dive-converters-serialization-explained/#json-schemas).|

### Avro specific parameters

When creating an upsert Avro sink, the following options can be used following `FORMAT UPSERT ENCODE AVRO`.

|Field|Notes|
|-----|-----|
|schema.registry| Required. The address of the schema registry. |
|schema.registry.username| Optional. The user name used to access the schema registry. |
|schema.registry.password| Optional. The password associated with the user name. |
|schema.registry.name.strategy| Optional. Accepted options include `topic_name_strategy` (default), `record_name_strategy`, and `topic_record_name_strategy`.|
|key.message| Required if `schema.registry.name.strategy` is set to `record_name_strategy` or `topic_record_name_strategy`. |
|message| Required if `schema.registry.name.strategy` is set to `record_name_strategy` or `topic_record_name_strategy`.|

Syntax:

```sql
FORMAT UPSERT
ENCODE AVRO (
   schema.registry = 'schema_registry_url',
   [schema.registry.username = 'username'],
   [schema.registry.password = 'password'],
   [schema.registry.name.strategy = 'topic_name_strategy'],
   [key.message = 'test_key'],
   [message = 'main_message',]
)
```

## Examples

Create a sink by selecting an entire materialized view.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test'
)
FORMAT PLAIN ENCODE JSON;
```

Create a sink with the Kafka configuration `message.max.bytes` set at 2000 by setting `properties.message.max.bytes` to 2000.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test',
   properties.message.max.bytes = 2000
)
FORMAT PLAIN ENCODE JSON;
```

Create a sink by selecting the average `distance` and `duration` from `taxi_trips`.

The schema of `taxi_trips` is like this:

```sql
{
  "id": VARCHAR,
  "distance": DOUBLE PRECISION,
  "duration": DOUBLE PRECISION,
  "fare": DOUBLE PRECISION
}
```

The table may look like this:

```
 id | distance | duration |   city
----+----------+----------+----------
  1 |       16 |       23 | Dallas
  2 |       23 |        9 | New York
  3 |        6 |       15 | Chicago
  4 |        9 |       35 | New York
```

```sql
CREATE SINK sink2 AS
SELECT
   avg(distance) as avg_distance,
   avg(duration) as avg_duration
FROM taxi_trips
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test'
)
FORMAT PLAIN ENCODE JSON;

```

## Create sink with VPC connection

If your Kafka sink service is located in a different VPC from RisingWave, use AWS PrivateLink or GCP Private Service Connect to establish a secure and direct connection. For details on how to set up an AWS PrivateLink connection, see see [Create an AWS PrivateLink connection](/sql/commands/sql-create-connection.md#create-an-aws-privatelink-connection).

To create a Kafka sink with a VPC connection, in the WITH section of your `CREATE SINK` statement, specify the following parameters.

|Parameter| Notes|
|---|---|
|`privatelink.targets`| The PrivateLink targets that correspond to the Kafka brokers. The targets should be in JSON format. Note that each target listed corresponds to each broker specified in the `properties.bootstrap.server` field. If the order is incorrect, there will be connectivity issues. |
|`privatelink.endpoint`|The DNS name of the VPC endpoint.<br/> If you're using RisingWave Cloud, you can find the auto-generated endpoint after you created a connection. See details in [Create a VPC connection](/cloud/vpc-create-a-connection.md#whats-next).|
|`connection.name`| The name of the connection, which comes from the connection created using the [`CREATE CONNECTION`](/sql/commands/sql-create-connection.md) statement. Omit this parameter if you have provisioned a VPC endpoint using `privatelink.endpoint` (recommended).|

Here is an example of creating a Kafka sink using a PrivateLink connection. Notice that `{"port": 8001}` corresponds to the broker `ip1:9092`, and `{"port": 8002}` corresponds to the broker `ip2:9092`.

```sql
CREATE SINK sink2 FROM mv2
WITH (
   connector='kafka',
   properties.bootstrap.server='b-1.xxx.amazonaws.com:9092,b-2.test.xxx.amazonaws.com:9092',
   topic='msk_topic',
   privatelink.endpoint='10.148.0.4',
   privatelink.targets = '[{"port": 8001}, {"port": 8002}]'
)
FORMAT PLAIN ENCODE JSON (
   force_append_only='true'
);
```

## TLS/SSL encryption and SASL authentication

RisingWave can sink data to Kafka that is encrypted with [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) and/or authenticated with SASL.

Secure Sockets Layer (SSL) was the predecessor of Transport Layer Security (TLS), and has been deprecated since June 2015. For historical reasons, `SSL` is used in configuration and code instead of `TLS`.

Simple Authentication and Security Layer (SASL) is a framework for authentication and data security in Internet protocols.

RisingWave supports these SASL authentication mechanisms:

- `SASL/PLAIN`
- `SASL/SCRAM`

SSL encryption can be used concurrently with SASL authentication mechanisms.

To learn about how to enable SSL encryption and SASL authentication in Kafka, including how to generate the keys and certificates, see the [Security Tutorial](https://docs.confluent.io/platform/current/security/security_tutorial.html#overview) from Confluent.

You need to specify encryption and authentication parameters in the WITH section of a `CREATE SINK` statement.

### SSL without SASL

To sink data encrypted with SSL without SASL authentication, specify these parameters in the WITH section of your `CREATE SINK` statement.

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

Here is an example of creating a sink encrypted with SSL without using SASL authentication.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   properties.security.protocol='SSL',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
)
FORMAT PLAIN ENCODE JSON;
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

Here is an example of creating a sink authenticated with SASL/PLAIN without SSL encryption.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
)
FORMAT PLAIN ENCODE JSON;
```

This is an example of creating a sink authenticated with SASL/PLAIN with SSL encryption.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_SSL',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
)
FORMAT PLAIN ENCODE JSON;
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

- properties.ssl.ca.location
- properties.ssl.certificate.location
- properties.ssl.key.location
- properties.ssl.key.password

Here is an example of creating a sink authenticated with SASL/SCRAM without SSL encryption.

```sql
CREATE SINK sink1 FROM mv1
WITH (
   connector='kafka',
   topic='quickstart-events',
   properties.bootstrap.server='localhost:9093',
   properties.sasl.mechanism='SCRAM-SHA-256',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
)
FORMAT PLAIN ENCODE JSON;
```

## Data type mapping - RisingWave and Debezium JSON

|RisingWave Data Type | Schema Type in JSON | Schema Name in JSON|
|-----|-----|-----|
|boolean | boolean | n/a|
|smallint | int16 | n/a|
|integer | int32 | n/a|
|bigint | int64 | n/a|
|real| float| n/a|
|double precision|double| n/a|
|character varying|string| n/a|
|bytea | bytes | n/a|
|numeric|string| n/a|
|date | int32 | org.apache.kafka.connect.data.Date|
|time without time zone| int64|org.apache.kafka.connect.data.Time|
|timestamp| int64|org.apache.kafka.connect.data.Timestamp|
|timestamptz|string |io.debezium.time.ZonedTimestamp|
|interval|string|io.debezium.time.Interval|
|JSONB | string|io.debezium.data.Json|
|struct| string| n/a|
|array | string| n/a|
