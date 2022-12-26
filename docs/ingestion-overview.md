---
id: ingestion-overview
title: Overview of data ingestion
slug: /ingestion-overview
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Insert data to tables directly.

## Ingest data from external sources

RisingWave supports ingesting data from these external sources:

- [PostgreSQL CDC](./create-source/create-source-cdc.md)
- [MySQL CDC](./create-source/create-source-cdc.md)
- [Kafka](./create-source/create-source-kafka-redpanda.md)
- [Redpanda](./create-source/create-source-kafka-redpanda.md)
- [Kinesis](./create-source/create-source-kinesis.md)
- [Pulsar](./create-source/create-source-pulsar.md)

RisingWave provides connectors for these sources. Click the links above to learn about how to ingest data from the sources.

You need to use the `CREATE SOURCE` command to establish a connection to these sources.

### Data formats

RisingWave supports ingesting data in these formats:

- Protobuf
- Avro
- JSON


## Insert data to tables

As a database, RisingWave supports inserting data using the `INSERT INTO VALUES` command. For syntax and parameters, see [INSERT](sql/commands/sql-insert.md).