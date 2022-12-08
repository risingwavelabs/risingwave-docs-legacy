---
id: key-concepts
title: Key concepts and terms
slug: /key-concepts
---

This page explains key concepts and terms that are used throughout the documentation.

## Data processing concepts and terms

### Avro

Avro is an open source data serialization system that facilitates data exchange between systems, programming languages, and processing frameworks. Avro has a JSON like data model, but can be represented as either JSON or in a compact binary form. RisingWave can decode Avro data. You need to specify the schema by providing either a schema location or a schema registry URL (only for Kafka topics).

### Batch processing

Batch processing is a method of running high-volume, repetitive data jobs. The batch method allows users to process data when computing resources are available, and with little or no user interaction.
With batch processing, users collect and store data, and then process the data during an event known as a batch window. Batch processing improves efficiency by setting processing priorities and completing data jobs at a time that makes the most sense.
With batch processing, the most recent data will only be processed after a batch job is done. If the batch frequency is once per day, the most fresh analysis you can get is for yesterday and earlier.

### Change data capture (CDC)

Change data capture refers to the process of identifying and capturing changes as they are made in a database or source application, then delivering those changes in real-time to a downstream process, system, or data lake. RisingWave supports ingesting CDC events in Debezium JSON or [Maxwell](https://maxwells-daemon.io/) JSON from Kafka topics.

### Data persistence

Data persistence means that data survives after the process that generated the data has ended. For a database to be considered persistent, it must write to non-volatile storage. This type of storage is able to retain data in the absence of a power supply.

### Debezium

Debezium is an open-source distributed platform for [change data capture (CDC)](#change-data-capture-cdc). It converts change records from existing databases into event streams in the form of Kafka topics. Debezium provides a unified format schema for changelog and support serializing messages in JSON and Apache Avro.

### Indexes

Indexes in a database are typically created on one or more columns of a table, and they allow the database management system (DBMS) to quickly locate and retrieve the desired data from the table. This can greatly improve the performance of database queries, especially for large tables or tables that are frequently accessed.

### Materialized sources

If you want to store all the data from a source into the database, you can create a materialized source. As the data size continues to grow, a materialized source can consume a large amount of storage space. You need to use the `CREATE MATERIALIZED SOURCE` statement to create a materialized source. For details, see [CREATE SOURCE](../docs/sql/commands/sql-create-source.md).

### Materialized views

When the results of a view expression are stored in a database system, they are called materialized views. In RisingWave, the result of a materialized view is updated when a relevant event arrives in the system. When you query the result, it is returned instantly as the computation has already been completed when the data comes in. You need to use the [`CREATE MATERIALIZED VIEW`](../docs/sql/commands/sql-create-mv.md) statement to create a materialized source.

### Object storage

Object storage, or object-based storage, is a technology that stores data in a hierarchy-free manner. Data in object storage exists as discrete units (objects) at the same level in a storage pool. Each object has a unique, identifying name that an application uses to retrieve it. The benefits of using object storage include massive scalability and cost efficiency.

### OLAP

OLAP (for online analytical processing) is software technology you can use to perform multidimensional analysis at high speeds on large volumes of data from a data warehouse or some other unified, centralized data store.

### Protobuf

Protocol buffers (commonly known as Protobuf) are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data. It is similar to XML, but smaller, faster, and simpler. RisingWave supports decoding Protobuf data. When creating a source that uses Protobuf format, you need to specify the schema. For details about the requirements, see [Protobuf requirements](../docs/sql/commands/sql-create-source.md#protobuf).

### `psql`

`psql` is a terminal-based front-end to PostgreSQL and other databases that are compatible with the PostgreSQL [wire protocol](#wire-protocol), such as RisingWave. With `psql`, you can type queries interatively, issue these query to RisingWave, and see the query results. In addition, `psql` provides a number of meta-commands and various shell-like features to facilitate writing scripts and automating a wide variety of tasks.

### Serialization

In stream processing, serialization is the process of converting business objects into bytes so that they can be easily saved or transmitted. The reverse process, recreating the data structure or object from a stream of bytes, is called deserialization. Common data serialization formats include JSON, [Avro](#avro), Protobuf (protocol buffers), and CSV.

### Sinks

A sink is an external target you can send data to. RisingWave now supports exporting data to Kafka topics. Before you can stream data out of RisingWave to a sink, you need to create a sink using the [`CREATE SINK`](../docs/sql/commands/sql-create-sink.md) statement to establish the connection.

### Sources

A source is a resource that RisingWave can read data from. Common sources include message brokers such as Apache Kafka and Apache Pulsar and databases such as MySQL and PostgreSQL. To establish a connection to a source, you need to create a source by using the [`CREATE SOURCE`](../docs/sql/commands/sql-create-source.md) statement. There are two types of sources you can create, non-materialized source (default) and [materialized sources](#materialized-source). The difference between these two types of sources is data from a materialized source is stored in RisingWave, while data from a non-materialized source is not stored in RisingWave. For both types of sources, you can create materialized views to allow the results to be stored in RisingWave.

### Streaming database

A streaming database is broadly defined as a data store designed to collect, process, and/or enrich streams of data in real-time, typically immediately after the data is created.

### Stream processing

Stream processing is the processing of data in motion, or in other words, computing on data directly as it is produced or received.
The majority of data are born as continuous streams: sensor events, user activity on a website, financial trades, and so on – all these data are created as a series of events over time.

### Views 

A view is a virtual relation that acts as an actual relation. It is not a part of logical relational model of the database system. Results of a non-materialized view are not stored in the database system. Results of a non-materialized view are calculated every time the view is accessed. Query expression of the view is stored in the databases system. 

### Wire protocol

A wire protocol is a format for interactions between a database server and its clients. It consists of authentication, sending queries, and receiving responses. The wire protocol for PostgreSQL is called pgwire. If a tool or database is compatible with pgwire, that means that it can work with the majority of PostgreSQL database tools.

## RisingWave architecture terms

### Clusters

A group of interconnected nodes and services that acts as a single system running an instance of RisingWave.

### Nodes

A node is a logical collection of IT resources that handles specific workloads based on their types. There are three types of nodes in RisingWave: 
- Frontend node
- Compute node
- Compactor node

### Frontend nodes

A frontend node acts as a stateless proxy that accepts user queries through Postgres protocol. It is responsible for parsing and validating queries, optimizing query execution plans, and delivering query results.

### Compute nodes

A computer node executes the optimized query plans and handles data ingestion and output.

### Compactor nodes

A stateless worker node that compacts data for the storage engine.

### Meta service

The central metadata management service. It also acts as a failure detector that periodically sends heartbeats to frontend nodes and compute nodes in the cluster.

