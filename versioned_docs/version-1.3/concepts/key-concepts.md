---
id: key-concepts
title: Key concepts and terms
slug: /key-concepts
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/key-concepts/" />
</head>

This page explains key concepts and terms that are used throughout the documentation.

## Key concepts of RisingWave

### Sources

A source is a resource that RisingWave can read data from. Common sources include message brokers such as Apache Kafka and Apache Pulsar and databases such as MySQL and PostgreSQL. You can create a source in RisingWave using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command.

If you want to persist the data from the source, you should use the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command with connector settings.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform data transformations.

### Sinks

A sink is an external target to which you can send data. RisingWave now supports exporting data to Kafka topics. Before you stream data out of RisingWave to a sink, you need to create a sink using the [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to establish the connection.

### Views

A view is a virtual relation that acts as an actual relation. It is not a part of the logical relational model of the database system. The query expression of the view is stored in the database system. The results of a non-materialized view are not stored in the database system and are calculated every time the view is accessed.

### Materialized views

When the results of a view expression are stored in a database system, they are called materialized views. In RisingWave, the result of a materialized view is updated when a relevant event arrives in the system. When you query the result, it is returned instantly as the computation has already been completed when the data comes in. You need to use the [`CREATE MATERIALIZED VIEW`](/sql/commands/sql-create-mv.md) statement to create a materialized view.

### Indexes

Indexes in a database are typically created on one or more columns of a table, allowing the database management system (DBMS) to  locate and retrieve the desired data from the table quickly. This can greatly improve the performance of database queries, especially for large tables or frequently accessed tables.

## Streaming actors

RisingWave distributes its computation across lightweight threads called "streaming actors," which run simultaneously on CPU cores.

By spreading these streaming actors across cores, RisingWave achieves parallel computation, resulting in improved performance, scalability, and throughput.

### Fragments

In RisingWave, When a streaming query plan executes, it divides into multiple independent fragments to allow parallel execution. Each fragment is a chain of SQL operators. Under the hood, it is executed by parallel actors. The degree of parallelism between fragments can be different.

### Streaming database

A streaming database is broadly defined as a data store designed to collect, process, and/or enrich streams of data in real time, typically immediately after the data is created.

### Stream processing

Stream processing is the processing of data in motion, or in other words, computing on data directly as it is produced or received.
The majority of data are born as continuous streams: sensor events, user activity on a website, financial trades, and so on – all these data are created as a series of events over time.

### Streaming queries

A streaming query, also referred to as a streaming job, is an SQL query that is issued against continuously generated data. In RisingWave, `CREATE SOURCE` `CREATE TABLE` (with connector settings), `CREATE MATERIALIZED VIEW`, `CREATE INDEX`, `CREATE SINK` are streaming queries.

## RisingWave architecture terms

### Clusters

A group of interconnected nodes and services that acts as a single system running an instance of RisingWave.

### Nodes

A node is a logical collection of IT resources that handles specific workloads based on their types. There are four types of nodes in RisingWave:

- Frontend node
- Compute node
- Compactor node
- Connector node

### Frontend nodes

A frontend node acts as a stateless proxy that accepts user queries through Postgres protocol. It is responsible for parsing and validating queries, optimizing query execution plans, and delivering query results.

### Compute nodes

A compute node executes the optimized query plans and handles data ingestion and output.

### Compactor nodes

A stateless worker node that compacts data for the storage engine.

### Connector node

The connector node is a Java component that handles consuming CDC events from upstream systems and sinking data from RisingWave to downstream systems. When running RisingWave with Docker, this node is enabled by default. If running RisingWave locally, see [Enable the connector node](/deploy/risingwave-trial.md/?method=binaries#optional-enable-the-connector-node).

### Meta service

The central metadata management service. It also acts as a failure detector that periodically sends heartbeats to frontend nodes and compute nodes in the cluster.

## Data processing concepts and terms

### Avro

Avro is an open-source data serialization system that facilitates data exchange between systems, programming languages, and processing frameworks. Avro has a JSON-like data model, but it can be represented as either JSON or in a compact binary form. RisingWave can decode Avro data. You need to specify the schema by providing either a schema location or a schema registry URL (only for Kafka topics).

### Connection

A connection allows access to services located outside of your VPC. AWS PrivateLink provides a network connection used to create a private connection between VPCs, private networks, and other services. In RisingWave, the [`CREATE CONNECTION`](/sql/commands/sql-create-connection.md) command establishes a connection between RisingWave and an external service. Then, a source or sink can be created to receive or send messages.

### Change data capture (CDC)

Change data capture refers to the process of identifying and capturing changes as they are made in a database or source application, then delivering those changes in real time to a downstream process, system, or data lake. RisingWave supports ingesting CDC events in Debezium JSON or [Maxwell](https://maxwells-daemon.io/) JSON from Kafka topics.

### Data persistence

Data persistence means that data survives after the process that generated the data has ended. For a database to be considered persistent, it must write to non-volatile storage. This type of storage is able to retain data in the absence of a power supply. To learn about how data is persisted in RisingWave, see [Data persistence](/data-persistence.md).

### Debezium

Debezium is an open-source distributed platform for [change data capture (CDC)](#change-data-capture-cdc). It converts change records from existing databases into event streams in the form of Kafka topics. Debezium provides a unified format schema for changelog and supports serializing messages in JSON and Apache Avro.

### Object storage

Object storage, or object-based storage, is a technology that stores data in a hierarchy-free manner. Data in object storage exists as discrete units (objects) at the same level in a storage pool. Each object has a unique, identifying name that an application uses to retrieve it. The benefits of using object storage include massive scalability and cost efficiency.

### Protobuf

Protocol buffers (commonly known as Protobuf) are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data. It is similar to XML, but smaller, faster, and simpler. RisingWave supports decoding Protobuf data. When creating a source that uses the Protobuf format, you need to specify the schema. For details about the requirements, see [Protobuf requirements](/sql/commands/sql-create-source.md#protobuf).

### `psql`

`psql` is a terminal-based front-end to PostgreSQL and other databases that are compatible with the PostgreSQL [wire protocol](#wire-protocol), such as RisingWave. With `psql`, you can type queries interactively, issue these queries to RisingWave, and see the query results. In addition, `psql` provides a number of meta-commands and various shell-like features to facilitate writing scripts and automating a wide variety of tasks.

### Serialization

In stream processing, serialization is the process of converting business objects into bytes so that they can be easily saved or transmitted. The reverse process, recreating the data structure or object from a stream of bytes, is called deserialization. Common data serialization formats include JSON, [Avro](#avro), Protobuf (protocol buffers), and CSV.

### Wire protocol

A wire protocol is a format for interactions between a database server and its clients. It consists of authentication, sending queries, and receiving responses. The wire protocol for PostgreSQL is called pgwire. If a tool or database is compatible with pgwire, it can work with most PostgreSQL database tools.
