---
id: ingestion-overview
title: Overview of data ingestion
slug: /ingestion-overview
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Insert data directly using the [`INSERT`](/sql/commands/sql-insert.md) command from the `psql` terminal or via PostgreSQL drivers from your applications.

## Ingest data from external data sources

### Materialized and non-materialized source

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command. When creating a source, you can choose to persist the data from the source in RisingWave by adding `MATERIALIZED` in between `CREATE` and `SOURCE` (that is, `CREATE MATERIALIZED SOURCE`). 

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.


RisingWave supports ingesting data from these external sources:

- [PostgreSQL CDC](./create-source/create-source-cdc.md)
- [MySQL CDC](./create-source/create-source-cdc.md)
- [Kafka](./create-source/create-source-kafka.md)
- [Redpanda](./create-source/create-source-redpanda.md)
- [Kinesis](./create-source/create-source-kinesis.md)
- [Pulsar](./create-source/create-source-pulsar.md)


### Supported data formats

To learn about the supported data formats, see [Data formats](./sql/commands/sql-create-source.md#supported-formats).

## Insert data directly

You can insert data directly to RisingWave by using the [`INSERT`](./sql/commands/sql-insert.md) command from the `psql` terminal or via PostgreSQL drivers from your applications. To learn about supported PostgreSQL drivers for different programming languages, see [Client libraries](/dev/java-client-libraries.md).