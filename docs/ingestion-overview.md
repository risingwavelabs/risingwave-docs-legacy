---
id: ingestion-overview
title: Data ingestion overview
slug: /ingestion-overview
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as files, databases, and message brokers.
- Insert data to tables directly.

# Ingest data from external sources

RisingWave supports ingesting data from these external sources

- PostgreSQL CDC
- MySQL CDC
- Kafka / Redpanda
- Pulsar
- Kinesis

You need to use the `CREATE SOURCE` command to establish a connection to these sources.

Click the links above to learn about how to ingest data from the sources.

## Data formats

RisingWave supports ingesting data in these formats:

- Protobuf
- Avro
- JSON
- CSV


# Insert data to tables

As a database, RisingWave supports inserting data using the `INSERT INTO VALUES` command. For syntax and parameters, see [INSERT](sql/commands/sql-insert.md).