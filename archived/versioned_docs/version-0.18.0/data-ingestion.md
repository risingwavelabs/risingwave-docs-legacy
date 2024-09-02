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

## Ingest data from sources

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command. If you want to persist the data from the source, you need to create a table with connector settings using the [`CREATE TABLE`](/sql/commands/sql-create-source.md) command.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

## Insert data into tables

You can also load data to RisingWave by creating tables ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](/sql/commands/sql-insert.md)).

## Supported sources and formats

For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources-and-formats).
