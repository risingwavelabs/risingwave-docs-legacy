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
- Use SQL statements to insert, update or delete data in tables directly.

## Ingest data from external sources

To ingest data from external sources into RisingWave, you need to create a source ([`CREATE SOURCE`](/sql/commands/sql-create-source.md)) or a table with connector settings ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) in RisingWave.

The syntax for creating a source is similar to creating a table with connector settings:

```sql
CREATE {TABLE | SOURCE} source_or_table_name 
[optional_schema_definition]
WITH (
   connector='kafka',
   connector_parameter='value', ...
)
...
```

After creating a table or source, RisingWave will continuously consume data from the upstream system.

### Difference between table and source

The table below shows the fundamental differences between a table and a source.

| Functionalities | `table` | `source` |
| :: | :: | :: |
| Support persisting data     | yes       | no |
| Support primary key   | yes        | no |
| Support appending data  | yes        | yes |
| Support updating/deleting data   | yes, but a primary key needs to be defined       | no |

As shown, a very fundamental difference between them is that a table will persist the consumed data, while a source will not. For instance, if the upstream inputs 5 records: `AA` `BB` `CC` `DD` `EE`, if using table, these 5 records will be persisted within RisingWave; if using source, these records will not be persisted. 


When connector settings are specified for a table in RisingWave, it is able to store streaming data. However, a table with connector settings is different from a source in RisingWave.

- A source does not persist all data that flows in. It persists only results from materialized views. It accepts only append-only data, such as application events or log messages.
- A table with connector settings persists all data that flows in. It accepts both append-only data and updateable data. To accept updateable data, you need to specify a primary key when creating the table. CDC sources and Kafka data in upsert formats are the examples of updateable data.

Regardless of whether data is persisted in RisingWave, you can create materialized views to transform or analyze them.

## Insert data into tables (without connectors)

You can also load data to RisingWave by creating tables ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and inserting data to tables ([`INSERT`](/sql/commands/sql-insert.md)).

## Supported sources and formats

For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources).
