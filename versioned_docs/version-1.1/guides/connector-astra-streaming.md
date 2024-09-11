---
id: connector-astra-streaming
title: Ingest data from DataStax Astra Streaming
description: Ingest data from DataStax Astra Streaming.
slug: /connector-astra-streaming
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/connector-astra-streaming/" />
</head>

Astra Streaming is a multi-cloud streaming-as-a-service product built on Apache Pulsar by DataStax. Pulsar is a cloud-native, multi-tenant, high-performance solution for server-to-server messaging and queuing built on the publisher-subscribe (pub-sub) pattern. Pulsar combines the best features of a traditional messaging system like RabbitMQ with those of a pub-sub system like Apache Kafka, scaling up or down dynamically without downtime.

To ingest data from Astra Streaming into RisingWave, you need to set up an Astra Streaming account and create an Astra Streaming topic. You can then create a materialized or non-materialized source connection using the Pulsar or Kafka connector in RisingWave to consume data from the Astra Streaming topic.

This guide will go over how to ingest streaming data from Astra Streaming in RisingWave.

## Set up Astra Streaming

To learn about how to set up an Astra Streaming account and create a topic, see the [Astra Streaming QuickStart](https://docs.datastax.com/en/streaming/astra-streaming/getting-started/index.html). You can connect to your tenant with Pulsar or Kafka. For this demo, we will assume the tenant is connected to Pulsar.

Once you have created a topic, note down the following information regarding the tenant and topic you want to connect to.

1. Get the full name of the topic by going to `Namespace and Topics` and clicking the copy button next to the topic you just created.

2. Get the `Broker service URL` of the tenant, which can be found by going to the `Connect` tab and scrolling down.

3. Get the token of the tenant by going to the `Settings` tab and copying the token.

## Consume data from Astra Streaming in RisingWave

### Install and launch RisingWave

See the [Get started](/get-started.md) guide for options on how you can run RisingWave.

### Create a table in RisingWave

To learn about the specific syntax used to consume data from a Pulsar topic, see [Ingest data from Pulsar](/create-source/create-source-pulsar.md). To learn about the specific syntax used to consume data from a Kafka topic, see [Ingest data from Kafka](/create-source/create-source-kafka.md).

As an example, the following query creates a table that consumes data from an Astra Streaming topic connected to Pulsar.

```sql
CREATE TABLE t (v1 int, v2 varchar)
WITH (
   connector='pulsar',
   topic='persistent://tenant0/default/topic0',
   service.url='pulsar+ssl://pulsar-gcp-useast1.streaming.datastax.com:6651',
   auth.token='replace me with your token'
) FORMAT PLAIN ENCODE JSON;
```

### Produce messages in Astra Streaming

We can now send messages from Astra Streaming to RisingWave.

Navigate to the tenant RisingWave is connected to in Astra Streaming and click on the `Try Me` tab. Ensure the `Namespace`, `Producer topic`, and the `Consumer topic` match the Astra Streaming topic that RisingWave is consuming data from.

Set the `Connection type` as `Read` and the `Read position` as `Earliest`. Click `Connect`.

Try sending the following messages line by line in the `Test message` text box. Set the `Message type` as `JSON`. Note that the schema of the messages matches the schema of the table we created in RisingWave.

![Send messages on Astra Streaming](../images/astra-send-msg.png)

```terminal
{"v1":1,"v2":"name0"}
{"v1":2,"v2":"name0"}
{"v1":6,"v2":"name3"}
{"v1":0,"v2":"name5"}
{"v1":5,"v2":"name8"}
```

### Query the messages in RisingWave

Now we can query the table in RisingWave to see that RisingWave has consumed the messages.

```sql
SELECT * FROM t;
```

```
  v1 |  v2
 ----+-------
   1 | name0
   2 | name0
   3 | name3
   4 | name5
   5 | name8
```
