---
id: ingestion-overview
title: Overview of data ingestion
slug: /ingestion-overview
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Insert data to tables directly.

## Ingest data from external data sources

### Materialized and non-materialized source

A source is a resource that RisingWave can get data from. You can create a source in RisingWave using the `CREATE SOURCE` command. If you want to persist the data from the source, you need to create a table with connector settings using the `CREATE TABLE` command.

Regardless whether the data is persisted in RisingWave or not, you can create materialized views or sinks to perform analysis and transformations.

RisingWave supports ingesting data from these external sources:

- [PostgreSQL CDC](./create-source/create-source-cdc.md)
- [MySQL CDC](./create-source/create-source-cdc.md)
- [Kafka](./create-source/create-source-kafka.md)
- [Redpanda](./create-source/create-source-redpanda.md)
- [Kinesis](./create-source/create-source-kinesis.md)
- [Pulsar](./create-source/create-source-pulsar.md)


### Supported data formats

To learn about the supported data formats, see [Data formats](./sql/commands/sql-create-source.md#supported-formats).

## Insert data into tables

As a database, RisingWave supports creating tables ([`CREATE TABLE`](./sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](./sql/commands/sql-insert.md)).