---
id: create-sink-kafka
title: SINK TO KAFKA
description: Sink to Kafka.
slug: /create-sink-kafka
---

This topic describes how to sink data from RisingWave to a Kafka broker and how to specify security (encryption and authentication) settings.

A sink is an external target that you can send data to. To stream data out of RisingWave, you need to create a sink. Use the `CREATE SINK` statement to create a sink. You can create a sink with data from a materialized source, a materialized view, or a table.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='kafka',
   field_nake = 'value', ...
);
```

## Parameters

All WITH options are required except `force_append_only`.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified. See [SELECT](../commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type. Currently, only `‘kafka’` and `‘jdbc’` are supported. If there is a particular sink you are interested in, see the [Integrations Overview](../../rw-integration-summary.md) page for a full list of connectors and integrations we are working on. |
|properties.bootstrap.server|Address of the Kafka broker. Format: `‘ip:port’`. If there are multiple brokers, separate them with commas. |
|topic|Address of the Kafka topic. One sink can only correspond to one topic.|
|format|Data format. Allowed formats:<ul><li> `append_only`: Output data with insert operations.</li><li> `debezium`: Output change data capture (CDC) log in Debezium format.</li></ul>|
|force_append_only| If `true`, forces the sink to be `append_only`, even if it cannot be.| 

## Examples

Create a sink by selecting an entire materialized view.
```sql
CREATE SINK sink1 FROM mv1 
WITH (
   connector='kafka',
   kafka.brokers='localhost:9092',
   kafka.topic='test',
   format='append_only'
);
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
   kafka.brokers='localhost:9092',
   kafka.topic='test',
   format='append_only'
);

```

## TLS/SSL encryption and SASL authentication

RisingWave can sink data to Kafka that is encrypted with [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) and/or authenticated with SASL.

Secure Sockets Layer (SSL) was the predecessor of Transport Layer Security (TLS), and has been deprecated since June 2015. For historical reasons, `SSL` is used in configuration and code instead of `TLS`.

Simple Authentication and Security Layer (SASL) is a framework for authentication and data security in Internet protocols.

RisingWave supports four SASL authentication mechanisms:

- `SASL/PLAIN`
- `SASL/SCRAM`
- `SASL/GSSAPI`
- `SASL/OAUTHBEARER`

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
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.security.protocol='SSL',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
);
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
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
);
```
This is an example of creating a sink authenticated with SASL/PLAIN with SSL encryption.

```sql
CREATE SINK sink1 FROM mv1                 
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.sasl.mechanism='PLAIN',
   properties.security.protocol='SASL_SSL',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret',
   properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
   properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
   properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
   properties.ssl.key.password='abcdefgh'
);
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
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.sasl.mechanism='SCRAM-SHA-256',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.username='admin',
   properties.sasl.password='admin-secret'
);
```

### `SASL/GSSAPI`

|Parameter| Notes|
|---|---|
|`properties.security.protocol`| Set to `SASL_PLAINTEXT`, as RisingWave does not support using SASL/GSSPI with SSL.|
|`properties.sasl.mechanism`| Set to `GSSAPI`.|
|`properties.sasl.kerberos.service.name`| |
|`properties.sasl.kerberos.keytab`| |
|`properties.sasl.kerberos.principal`| |
|`properties.sasl.kerberos.kinit.cmd`| |
|`properties.sasl.kerberos.min.time.before.relogin`| |

:::note

For the definitions of the parameters, see the [librdkafka properties list](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Note that the parameters in the list assumes all parameters start with `properties.` and therefore do not include this prefix.

:::

Here is an example of creating a sink authenticated with SASL/GSSAPI without SSL encryption.

```sql
CREATE SINK sink1 FROM mv1                 
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.sasl.mechanism='GSSAPI',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.kerberos.service.name='kafka',
   properties.sasl.kerberos.keytab='/etc/krb5kdc/kafka.client.keytab',
   properties.sasl.kerberos.principal='kafkaclient4@AP-SOUTHEAST-1.COMPUTE.INTERNAL',
   properties.sasl.kerberos.kinit.cmd='sudo kinit -R -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal} || sudo kinit -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal}',
   properties.sasl.kerberos.min.time.before.relogin='10000'
);
```

### `SASL/OAUTHBEARER`

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

This is an example of creating a sink authenticated with SASL/OAUTHBEARER without SSL encryption.

```sql
CREATE SINK sink1 FROM mv1                 
WITH (
   connector='kafka',
   kafka.topic='quickstart-events',
   kafka.brokers='localhost:9093',
   format = 'append_only',
   properties.sasl.mechanism='OAUTHBEARER',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.oauthbearer.config='principal=bob'
);
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::