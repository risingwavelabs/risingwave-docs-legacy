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

A sink is an external target that you can send data to. To stream data out of RisingWave, you need to create a sink. Use the `CREATE SINK` statement to create a sink. You can create a sink with data from a materialized view, a table or a source. RisingWave only supports writing messages in non-transactional mode.

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

## Sink parameters

|Field|Notes|
|-----|-----|
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `DEBEZIUM`: Output change data capture (CDC) log in Debezium format.</li><li> `UPSERT`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `UPSERT` sink, see the [Overview](/data-delivery.md).|
|data_encode| Data encode. Supported encode: `JSON`. |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|

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

## Create sink with AWS PrivateLink connection

If your Kafka sink service is located in a different VPC from RisingWave, use AWS PrivateLink to establish a secure and direct connection. For details on how to set up an AWS PrivateLink connection, see [Create an AWS PrivateLink connection](/sql/commands/sql-create-connection.md#create-an-aws-privatelink-connection).

To create a Kafka sink with a PrivateLink connection, in the WITH section of your `CREATE SINK` statement, specify the following parameters.

|Parameter| Notes|
|---|---|
|`connection.name`| The name of the connection, which comes from the connection created using the [`CREATE CONNECTION`](/sql/commands/sql-create-connection.md) statement.|
|`privatelink.targets`| The PrivateLink targets that correspond to the Kafka brokers. The targets should be in JSON format. Note that each target listed corresponds to each broker specified in the `properties.bootstrap.server` field. If the order is incorrect, there will be connectivity issues. |
|`privatelink.endpoint`|The DNS name of the AWS VPC endpoint or the GCP private link endpoint.|

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
