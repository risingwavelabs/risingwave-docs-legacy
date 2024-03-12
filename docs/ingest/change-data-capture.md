---
id: change-data-capture
title: Change data capture (CDC)
slug: /change-data-capture
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/change-data-capture-risingwave/" />
</head>

RisingWave offers support for ingesting Change Data Capture (CDC) from upstream databases through two primary methods:

Method 1: RisingWave establishes direct connections to upstream databases for data ingestion via the built-in CDC connectors in RisingWave. Currently, RisingWave supports direct CDC data ingestion from MySQL and PostgreSQL databases.

Method 2: RisingWave consumes CDC data from message queues. RisingWave is compatible with popular CDC formats such as DEBEZIUM, MAXWELL, and CANAL. These formats can be transmitted via message queues like Apache Kafka or Apache Pulsar into RisingWave. This approach allows for the transfer of data from both OLTP databases (such as TiDB, MySQL, PostgreSQL, and Oracle) and NoSQL databases (like MongoDB) to RisingWave.

Method 2 is suitable for users who have not implemented CDC via message queues or prefer a simplified architecture. Method 1 is ideal for users who have already set up standard CDC pipelines using message queues. Regardless of the chosen method for loading CDC data, RisingWave guarantees accurate import of both full and incremental data from the source table.

Here is the example of method 2, direct MySQL CDC data ingestion:

```sql
CREATE TABLE orders (
   order_id int,
   price decimal,
   PRIMARY KEY (order_id)
) WITH (
 connector = 'mysql-cdc',
 hostname = '127.0.0.1',
 port = '3306',
 username = 'root',
 password = '123456',
 database.name = 'mydb',
 table.name = 'orders',
);
```

Here is the example of method 1, CDC ingestion via Debezium:

```sql
CREATE TABLE IF NOT EXISTS mq_cdc
WITH (
   connector='kafka',
   topic='cdc_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest'
) FORMAT DEBEZIUM ENCODE AVRO (
   schema.registry = 'http://127.0.0.1:8081'
);
```





It is worth noting that RisingWave is actively expanding the functionality and performance of direct CDC connectors. We plan to support more databases and advanced features such as full data backfill resumption, multi-table transactions, and more in the future.

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

