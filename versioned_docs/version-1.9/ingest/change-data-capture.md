---
id: change-data-capture
title: Change data capture (CDC)
slug: /change-data-capture
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/change-data-capture-risingwave/" />
</head>

CDC is a technology that captures data changes as they occur in the source systems, such as databases or applications. Unlike traditional batch processes that can introduce significant delays, CDC enables near real-time data integration and synchronization, allowing businesses to stay on top of the latest data changes and make timely decisions based on the most current information.

RisingWave supports ingesting CDC data from databases through two methods:

- Method A: Utilizing the built-in CDC connectors in RisingWave. Currently, built-in CDC connectors are available for these databases:
  - PostgreSQL. See [Ingest CDC data from Postgres](/guides/ingest-from-postgres-cdc.md) for details.
  - MySQL. See [Ingest CDC data from MySQL](/guides/ingest-from-mysql-cdc.md) for details.
  - Citus. See [Ingest CDC data from Citus](/guides/ingest-from-citus-cdc.md) for details.

- Method B: Leveraging third-party CDC formats and tools. RisingWave is compatible with popular CDC formats such as DEBEZIUM, MAXWELL, and CANAL. These formats can be transmitted via message queues like Apache Kafka or Apache Pulsar into RisingWave. This approach allows for the transfer of data from both OLTP databases (such as TiDB, MySQL, PostgreSQL, and Oracle) and NoSQL databases (like MongoDB) to RisingWave. For details about this method, see [CDC via message streaming systems](/docs/ingest/ingest-from-cdc.md).

Method A is suitable for users who have not implemented CDC via message queues or prefer a simplified architecture. Method B is ideal for users who have already set up standard CDC pipelines using message queues. Regardless of the chosen method for loading CDC data, RisingWave guarantees the accurate import of both full and incremental data from the source table.


## **Storage system**

RisingWave supports ingesting data from upstream storage systems, notably S3 and S3-compatible systems. For example,

```sql
CREATE TABLE s(
    id int,
    name varchar,
    age int,
    primary key(id)
) 
WITH (
    connector = 's3_v2',
    s3.region_name = 'ap-southeast-2',
    s3.bucket_name = 'example-s3-source',
    s3.credentials.access = 'xxxxx',
    s3.credentials.secret = 'xxxxx'
) FORMAT PLAIN ENCODE CSV (
    without_header = 'true',
    delimiter = ','
);
```

Currently, data with CSV and JSON encoding can be imported from a specified bucket in S3. In the future, RisingWave will extend its support to import data from a wider range of upstream storage systems.

