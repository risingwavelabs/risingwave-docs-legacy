---
id: data-ingestion
title: Overview of data ingestion
slug: /data-ingestion
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion/" />
</head>

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Insert data to tables directly.

## Ingest data from external data sources

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command. If you want to persist the data from the source, you need to create a table with connector settings using the `CREATE TABLE` command.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

RisingWave supports ingesting data from these external sources:

- [Kafka](./create-source/create-source-kafka.md)
- [Redpanda](./create-source/create-source-redpanda.md)
- [Kinesis](./create-source/create-source-kinesis.md)
- [Pulsar](./create-source/create-source-pulsar.md)
- [Astra Streaming](guides/connector-astra-streaming.md)
- [MySQL CDC](guides/ingest-from-mysql-cdc.md)
- [PostgreSQL CDC](guides/ingest-from-postgres-cdc.md)
- [AWS S3](create-source/create-source-s3.md)

## Change Data Capture (CDC)

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. 

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert CDC data into Kafka topics.

For complete step-to-step guides about ingesting MySQL and PostgreSQL data using both approaches, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md). 

### Supported data formats

To learn about the supported data formats, see [Data formats](./sql/commands/sql-create-source.md#supported-formats).

## Insert data into tables

As a database, RisingWave supports creating tables ([`CREATE TABLE`](./sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](./sql/commands/sql-insert.md)).