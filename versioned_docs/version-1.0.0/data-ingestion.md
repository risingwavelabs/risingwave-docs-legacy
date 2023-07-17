---
id: data-ingestion
title: Overview of data ingestion
slug: /data-ingestion
---

You can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Use SQL statements to insert, update or delete data in tables directly.

## Ingest data from sources or tables (with connectors)

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command. If you want to persist the data from the source, you need to create a table with connector settings using the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

Another difference between `CREATE SOURCE` and `CREATE TABLE` (with connectors) is that the data from upstream system must be append-only, such as application events or log messages. In order to create an updatable data source, you have to define it as a table and specify a primary key. See CDC sources or Kafka upsert formats for examples.

## Insert data into tables (without connectors)

You can also load data to RisingWave by creating tables ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](/sql/commands/sql-insert.md)).

## Supported sources and formats

For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources).
