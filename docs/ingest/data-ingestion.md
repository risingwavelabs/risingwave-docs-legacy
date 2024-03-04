---
id: data-ingestion
title: Overview of data ingestion
slug: /data-ingestion
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion/" />
</head>

In databases, users often use the `INSERT` statement to insert data. However, in stream processing, data is continuously imported from upstream systems, and evidently, the `INSERT` statement is unable to meet this need. RisingWave allows users to directly create `table` and `source` to import upstream data. When there is new data entering from the upstream systems, RisingWave will directly consume the data and carry out incremental computations.

In short, you can ingest data into RisingWave in two ways:

- Connect to and ingest data from external sources such as databases and message brokers.
- Use SQL statements to insert, update, or delete data in tables directly.

It is important to note that as RisingWave is a streaming database, the first way, streaming data import, is the recommended method for data ingestion. The second way serves as a supplementary method, primarily suitable for data corrections and scenarios involving infrequent bulk imports.

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

<details>
  <summary>What's the difference between a table and a source?</summary>
  <div>
    <div>The table below shows the main differences between a table and a source in RisingWave.</div>
<br/>

| Functionalities | Table | Source |
| ----------------| ----- | ------ |
| Support persisting data     | yes       | no |
| Support primary key   | yes        | no |
| Support appending data  | yes        | yes |
| Support updating/deleting data   | yes, but a primary key needs to be defined       | no |
<br/>

<div>As shown above, a very fundamental difference between them is that a table will persist the consumed data, while a source will not. For instance, let's assume the upstream inputs 5 records: `AA`, `BB`, `CC`, `DD`, and `EE`. If using a table, these 5 records will be persisted within RisingWave; if using a source, these records will not be persisted. </div>
<br/>
<div>The advantage of using a table to persist records is that it can speed up queries. Naturally, if the data is within the same system, queries will be much more efficient, although the downside is that it occupies storage.</div>
<br/>

<div>Another advantage is the ability to consume data changes. That is to say, if the upstream system deletes or updates a record, this operation will be consumed by RisingWave, thereby modifying the results of the stream computation. On the other hand, a source only supports appending records and cannot handle data changes. Besides, to allow a table to accept data changes, a primary key must be specified on the table.</div>

<br/>
<div>Apart from the above differences, here are a few points worth noting about a table:</div>
<br/>
<div></div>

- When a user sends a `create table` request, the corresponding table will be immediately created and populated with data.
- When a user creates a materialized view on the existing table, RisingWave will start reading data from the table and perform streaming computation.
- RisingWave's batch processing engine supports direct batch reading of the table. Users can send ad-hoc queries to directly access the data within the table.

And here are the points worth noting about a source:

- When a user sends a `create source` request, no physical objects are created, and data is not immediately read from the source.
- Data from the source is only read when a user creates materialized views or sinks on that source.

Regardless of whether data is persisted in RisingWave, you can create materialized views to transform or analyze them.
  </div>
</details>

## Insert data into tables (without connectors)

You can also load data to RisingWave by creating tables ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and inserting data into tables ([`INSERT`](/sql/commands/sql-insert.md)). For example, the statement below creates a table `website_visits` and inserts 5 rows of data.



```sql
CREATE TABLE website_visits (
  timestamp timestamp with time zone,
  user_id varchar,
  page_id varchar,
  action varchar
);

INSERT INTO website_visits (timestamp, user_id, page_id, action) VALUES
  ('2023-06-13T10:00:00Z', 'user1', 'page1', 'view'),
  ('2023-06-13T10:01:00Z', 'user2', 'page2', 'view'),
  ('2023-06-13T10:02:00Z', 'user3', 'page3', 'view'),
  ('2023-06-13T10:03:00Z', 'user4', 'page1', 'view'),
  ('2023-06-13T10:04:00Z', 'user5', 'page2', 'view');
```

## Topics in this section

Above is just a simple overview of how to ingest data in RisingWave. The following topics in the "Ingest data" section will help you understand this process more deeply. Here is a simple introduction to the information you will find on each topic:

- For more detailed information about a source, like its concept, type, format and encoding options, see [Source types](/ingest/source-types.md) and [Formats and encoding].

- For the complete list of supported sources and formats, see [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources).

- For instructions on how to perform some operations on a source, see:

  - [Modify source or table schemas](/ingest/modify-schemas.md)
  - [Ingest additional fields with INCLUDE clause](/ingest/include-clause.md)

- For specific instructions on ingesting data from a particular source supported by RisingWave, read the guides under the [Source part](/docs/current/sources).