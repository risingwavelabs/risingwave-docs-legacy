---
id: data-ingestion
title: Overview of data ingestion
slug: /data-ingestion
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion/" />
</head>

RisingWave supports a variety of data ingestion methods. To know the difference between stream processing and ad-hoc query, please refer to [Ad-hoc (on read) vs. Streaming (on write)](/transform/overview.md#ad-hoc-on-read-vs-streaming-on-write)

- **Streaming Ingestion from External Systems**: This is tied to a stream processing task, continuously monitoring and synchronizing changes from external systems.
- **Ad-hoc Ingestion from External Systems**: This is bound to an ad-hoc query, where RisingWave queries the current data from the external system for processing during the query.
- **Ingest via DML Statements**: Like other databases, RisingWave allows users to directly insert and modify data in tables using DML statements (`INSERT`, `UPDATE`, `DELETE`). 
  - Additionally, with the `INSERT ... SELECT` statement, users can transform ad-hoc ingestion data into a streaming flow to the table, affecting the downstream streaming pipeline of the table. This can also be used for [bulk imports](./data-ingestion.md#use-insert--select--do-bulk-ingestion).

## Ingest data from external systems

### Source

In RisingWave, **Source** is the most fundamental object used to connect to data from external systems. Here is a simple example of creating a source from kafka.

```SQL
CREATE SOURCE kafka_source (
  k int, 
  v1 text,
  v2 text
)
WITH (
  connector = 'kafka',
  topic = 'topic_name',
  properties.bootstrap.server = 'message_queue:29092'
) FORMAT PLAIN ENCODE JSON;
```

After creating a source, no actual data ingestion will occur. Data ingestion happens when a query that references the source is submitted. 

- `CREATE MATERIALIZED VIEW` or `CREATE SINK` statement will generate an **streaming ingestion** jobs. 
The following statement will continuously ingest content from the Kafka topic and maintain it in the materialized view `mv`.

  ```SQL
  CREATE MATERIALIZED VIEW mv AS
  SELECT *
  FROM kafka_source;
  ```

- Also, directly query can be processed on the source and an **ad-hoc ingestion** will happened during the query's processing (more information in [directly query kafka](/ingest/ingest-from-kafka.md#query-kafka-timestamp))
  ```SQL
  SELECT * FROM source_name
  WHERE _rw_kafka_timestamp > now() - interval '10 minute';
  ```

For specific source types, their support for Streaming Ingestion and ad-hoc ingestion varies. Please refer to the [doc](/docs/current/sources) for the specific sources.

### Table with connector

For sources that support streaming ingestion, RisingWave supports the direct creation of tables on them.

```SQL
CREATE TABLE table_on_kafka (
  k int primary key, 
  v1 text,
  v2 text)
WITH (
  connector = 'kafka',
  topic = 'topic_name',
  properties.bootstrap.server = 'message_queue:29092'
) FORMAT PLAIN ENCODE JSON;
```

The statement will create a streaming job which continuously ingests data from the Kafka topic to the table and the data will be stored in RisingWave's internal storage, which brings three benefits:
1. **Improved ad-hoc query performance:** When users execute queries such as `SELECT * FROM table_on_kafka`, the query engine will directly access the data from RisingWave's internal storage, eliminating unnecessary network overhead and avoiding read pressure on upstream systems. Additionally, users can create [index](/transform/indexes.md) on the table to accelerate queries.
2. **Allow defining primary keys:** With the help of its internal storage, RisingWave can efficiently maintain primary key constraints. Users can define a primary key on a specific column of the table and define different behaviors for primary key conflicts with [ON CONFLICT clause](/sql/commands/sql-create-table.md#pk-conflict-behavior).
3. **Ability to handle delete/update changes**: Based on the definition of primary keys, RisingWave can efficiently process upstream synchronized delete and update operations. For systems that synchronize delete/update operations from external systems, such as database's CDC, we **do not** allow creating source on it but require a table with connector.

At the same time, like regular tables, tables with connectors also accept DML statements and [CREATE SINK INTO TABLE](/sql/commands/sql-create-sink-into.md), which provides greater flexibility.

## DML on tables

### Insert data into tables
You can load data in batch to RisingWave by creating a table ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) and then inserting data into it ([`INSERT`](/sql/commands/sql-insert.md)). For example, the statement below creates a table `website_visits` and inserts 5 rows of data.

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

### Use `INSERT SELECT` to do bulk ingestion

For sources that only support ad-hoc ingestion but not streaming ingestion such as [Iceberg source](/docs/next/ingest-from-iceberg/),  `insert ... select ...` can be used to implement bulk data import into the table, and to convert the data into a stream of changes that are synchronized downstream to the table.

```SQL
create source source_iceberg_t1
with (
    connector = 'iceberg',
    catalog.type = 'storage',
    ...
    database.name = 's1',
    table.name = 't1'
);

create table t1(
  timestamp timestamp with time zone,
  user_id varchar,
  page_id varchar,
  action varchar
);

insert into t1 select * from source_iceberg_t1;
```

## Topics in this section

The information presented above provides a brief overview of the data ingestion process in RisingWave. To gain a more comprehensive understanding of this process, the following topics in this section will delve deeper into the subject matter. Here is a brief introduction to what you can expect to find in each topic:

- Among different types of sources, we have abstracted a series of common syntax and features.
  - For more detailed information about the types, formats, and encoding options of sources, see [Formats and encoding](/ingest/formats-and-encode-parameters.md).
  - For the complete list of the sources and formats supported in RisingWave, see [Supported sources and formats](/ingest/supported-sources-and-formats.md).
  - To learn about how to manage schemas and ingest additional fields from sources :
    - [Modify source or table schemas](/ingest/modify-schemas.md)
    - [Ingest additional fields with INCLUDE clause](/ingest/include-clause.md)

- To learn about how to ingest data from a particular source, see [Data ingestion guides](/docs/current/sources).