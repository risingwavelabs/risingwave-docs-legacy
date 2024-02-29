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
- Use SQL statements to insert, update, or delete data in tables directly.

## Ingest data from external sources

To ingest data from external sources into RisingWave, you need to create a source ([`CREATE SOURCE`](/sql/commands/sql-create-source.md)) or a table with connector settings ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) in RisingWave. The syntax for creating a source or a table with connector settings is similar:

```sql
CREATE {TABLE | SOURCE} source_or_table_name 
[optional_schema_definition]
WITH (
   connector='kafka',
   connector_parameter='value', ...
)
...
```

After creating a table or source, RisingWave will continuously consume data from the upstream system, and carry out incremental computations.

### Difference between table and source

As for the differences between a table and a source, you can refer to the table below, which summarizes their main differences.

| Functionalities | `table` | `source` |
| :: | :: | :: |
| Support persisting data     | yes       | no |
| Support primary key   | yes        | no |
| Support appending data  | yes        | yes |
| Support updating/deleting data   | yes, but a primary key needs to be defined       | no |

As shown above, a very fundamental difference between table and source is that a table will persist the consumed data, while a source will not. For instance, if the upstream inputs 5 records: `AA` `BB` `CC` `DD` `EE`, if using table, these 5 records will be persisted within RisingWave; if using source, these records will not be persisted. 

Here are a few key points worth noting about table:

- When a user sends a `create table` request, the corresponding table will be immediately created and populated with data.
- When a user creates a materialized view on the existing table, RisingWave will start reading data from the table and perform streaming computation.
- RisingWave's batch processing engine supports direct batch reading of the table. Users can send ad-hoc queries to directly access the data within the table.
- A table accepts both append-only data and updateable data. To accept updateable data, you need to specify a primary key when creating the table. CDC sources and Kafka data in upsert formats are the examples of updateable data.

The significant advantage of using table to persist records is that it can speed up queries. Naturally, if the data is within the same system, queries will be much more efficient, although the downside is that it occupies storage. Another advantage is the ability to consume data changes. That is to say, if the upstream system deletes or updates a record, this operation will be consumed by RisingWave, thereby modifying the results of the stream computation. On the other hand, source only supports appending records and cannot handle data changes. To allow table to accept data changes, a primary key must be specified on the table.


Here are a few important points worth noting about source:

- When a user sends a `create source` request, no physical objects are created, and data is not immediately read from the source.
- Data from the source is only read when a user creates materialized views or sinks on that source.
- A source persists only results from materialized views. It accepts only append-only data, such as application events or log messages.

Regardless of whether data is persisted in RisingWave, you can create materialized views to transform or analyze them.

### Supported sources and formats

For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources).

## Insert data into tables (without connectors)

You can also load data to RisingWave by creating tables ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and inserting data into tables ([`INSERT`](/sql/commands/sql-insert.md)).

