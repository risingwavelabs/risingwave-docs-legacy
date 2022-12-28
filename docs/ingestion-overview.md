---
id: ingestion-overview
title: Overview of data ingestion
slug: /ingestion-overview
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Insert data to tables directly.

## Ingest data from external data sources

### Materialized and non-materialized source connections

A source is a resource that RisingWave can read data from. You can create two types of source connections in RisingWave: non-materialized and materialized source connections. The difference between these two types of connections is data from a materialized source connection is stored in RisingWave, while data from a non-materialized source is not.

Use the [`CREATE SOURCE`](./sql/commands/sql-create-source.md) command to create a non-materialized source connection. After a non-materialized source connection is created, the input data is not stored in RisingWave. You need to create materialized views ([`CREATE MATERIALIZED VIEW`](./sql/commands/sql-create-mv.md)) to process the data and store the results in RisingWave.

Use the [`CREATE MATERIALIZED SOURCE`](./sql/commands/sql-create-source.md) command to create a materialized source connection. Once a materialized source connection is created, all data from the source is ingested into RisingWave.


RisingWave supports ingesting data from these external sources:

- [PostgreSQL CDC](./create-source/create-source-cdc.md)
- [MySQL CDC](./create-source/create-source-cdc.md)
- [Kafka](./create-source/create-source-kafka-redpanda.md)
- [Redpanda](./create-source/create-source-kafka-redpanda.md)
- [Kinesis](./create-source/create-source-kinesis.md)
- [Pulsar](./create-source/create-source-pulsar.md)

For most of the data sources, you can create either a materialized or non-materialized connection.

### Supported data formats

To learn about the supported data formats, see [Data formats](./sql/commands/sql-create-source.md#supported-formats).

## Insert data into tables

As a database, RisingWave supports creating tables ([`CREATE TABLE`](./sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](./sql/commands/sql-insert.md)).