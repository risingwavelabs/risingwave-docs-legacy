---
id: connector-astra-streaming
title: Ingest data from DataStax Astra Streaming
description: Ingest data from DataStax Astra Streaming.
slug: /connector-astra-streaming
---


Astra Streaming is a multi-cloud streaming-as-a-service product built on Apache Pulsar by DataStax. Pulsar is a cloud-native, multi-tenant, high-performance solution for server-to-server messaging and queuing built on the publisher-subscribe (pub-sub) pattern. Pulsar combines the best features of a traditional messaging system like RabbitMQ with those of a pub-sub system like Apache Kafka, scaling up or down dynamically without downtime.

To ingest data from Astra Streaming into RisingWave, you need to set up an Astra Streaming account and create an Astra Streaming topic first. You can then create a materialized or non-materialized source connection using the Pulsar connector in RisingWave to consume data from the Astra Streaming topic.

To learn about how to set up an Astra Streaming account and create a topic, see the [Astra Streaming QuickStart](https://docs.datastax.com/en/streaming/astra-streaming/getting-started/astream-quick-start.html).

To learn about how to consume data from a Pulsar topic, see [Ingest data from Pulsar](../create-source/create-source-pulsar.md).