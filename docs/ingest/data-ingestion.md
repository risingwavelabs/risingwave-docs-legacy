---
id: data-ingestion
title: Overview of data ingestion
slug: /data-ingestion
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion/" />
</head>

RisingWave can ingest data from message queues, databases, and storage systems like AWS S3. As an SQL database, it also supports directly adding data rows with the  `INSERT` command.

Please be aware that since RisingWave is a streaming database, it excels at ingesting and processing streaming data. Direct data insertion is meant to be used as a supplementary method, mainly for data corrections and infrequent bulk imports.

## Ingest data from external sources

To ingest data from external sources into RisingWave, you need to create a source ([`CREATE SOURCE`](/sql/commands/sql-create-source.md)) or a table with connector settings ([`CREATE TABLE`](/sql/commands/sql-create-table.md)) in RisingWave.

<details>
  <summary>What's the difference between a table and a source?</summary>
  <div>
    <div>The table below shows the main differences between a table and a source in RisingWave.</div>
<br/>

| Functionalities | Table | Source |
| ----------------| ----- | ------ |
| Data is persisted in RisingWave    | yes       | no |
| Primary keys can be defined  | yes        | no |
| Append-only data | yes        | yes |
| Upsert data   | yes, but a primary key needs to be defined       | no |
<br/>

<div>As shown above, a key distinction between the two is that a table persists the ingested raw data, whereas a source does not. For example, let's consider the upstream input of 5 records: `AA`, `BB`, `CC`, `DD`, and `EE`. If a table is used, these 5 records will be persisted in RisingWave. However, if a source is used, these records will not be persisted. </div>
<br/>
<div>One advantage of using a table is that you can performa ad-hoc queries against the ingested raw data. </div>
<br/>

<div>Another advantage of using a table is the ability to consume data changes. If the upstream system deletes or updates a record, this operation will be consumed by RisingWave, thereby modifying the results of the stream computation. On the other hand, a source only supports appending records and cannot handle data changes. Besides, to allow a table to accept data changes, a primary key must be specified on the table.</div>

<br/>
<div>Apart from the above differences, here are a few points worth noting about a table:</div>
<br/>
<div></div>

- With a `CREATE TABLE` statement, the corresponding table will be immediately created and populated with data.
- When a materialized view is defined based on the existing table, RisingWave will start reading data from the table and perform streaming computation.
- RisingWave's batch processing engine supports direct batch reading of the table. Users can issue ad-hoc queries against the data within the table.

And here are the points worth noting about a source:

- With a `CREATE SOURCE` statement, no physical objects are created, and data is not immediately read from the source.
- Data from the source is only read when a user creates materialized views or sinks on that source.

Regardless of whether data is persisted in RisingWave, you can create materialized views to transform or analyze them.
  </div>
</details>


### Supported source types

A source is a connection to an external system that RisingWave can read data from. RisingWave supports these types of sources:

- Event streaming systems such as Apache Kafka, Apache Pulsar, AWS Kinesis
- Change data capture streams from databases such as MySQL, PostgreSQL, and MongoDB
- Storage systems such as AWS S3 or S3-compatible systems

To ingest data from these sources, you need to create a source or table and specify the connector settings in the `CREATE SOURCE` or `CREATE TABLE` statements.

## Insert data into tables (without connectors)

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


## Topics in this section

The information presented above provides a brief overview of the data ingestion process in RisingWave. To gain a more comprehensive understanding of this process, the following topics in this section will delve deeper into the subject matter. Here is a brief introduction to what you can expect to find in each topic:

- For more detailed information about the types, formats, and encoding options of sources, see [Formats and encoding](/ingest/format-and-encode-parameters.md).

- For the complete list of the sources and formats supported in RisingWave, see [Supported sources and formats](/ingest/supported-sources-and-formats.md).

- To learn about how to manage schemas and ingest additional fields from sources :

  - [Modify source or table schemas](/ingest/modify-schemas.md)
  - [Ingest additional fields with INCLUDE clause](/ingest/include-clause.md)

- To learn about how to ingest data from a particular source, see [Data ingestion guides](/docs/current/sources). 