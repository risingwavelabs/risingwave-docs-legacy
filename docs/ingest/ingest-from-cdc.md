---
id: ingest-from-cdc
title: Change data capture with RisingWave
description: Overview of change data capture with RisingWave
slug: /ingest-from-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-cdc/" />
</head>

Change data capture (CDC) refers to the process of identifying and capturing data changes in a database and then delivering the changes to a downstream service in real-time.

You can use event streaming systems like Apache Kafka, Pulsar, or Kinesis to stream changes from MySQL, PostgreSQL, and TiDB to RisingWave. In this case, you will need an additional CDC tool to stream the changes from the database and specify the corresponding formats when ingesting the streams into RisingWave.

RisingWave also provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka. For complete step-to-step guides about using the native CDC connector to ingest MySQL and PostgreSQL data, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md). This topic only describes the configurations for using RisingWave to ingest CDC data from an event streaming system.


For the supported sources and corresponding formats, see [Supported sources and formats](/ingest/supported-sources-and-formats.md).