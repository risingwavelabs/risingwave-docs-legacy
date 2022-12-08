---
id: key-concepts
title: Key concepts and terms
slug: /key-concepts
---

This page explains key concepts and terms that are used throughout the documentation.

## Data processing concepts and terms

### Batch processing

Batch processing is a method of running high-volume, repetitive data jobs. The batch method allows users to process data when computing resources are available, and with little or no user interaction.
With batch processing, users collect and store data, and then process the data during an event known as a batch window. Batch processing improves efficiency by setting processing priorities and completing data jobs at a time that makes the most sense.
With batch processing, the most recent data will only be processed after a batch job is done. If the batch frequency is once per day, the most fresh analysis you can get is for yesterday and earlier.

### Change Data Capture (CDC)

Change data capture refers to the process of identifying and capturing changes as they are made in a database or source application, then delivering those changes in real-time to a downstream process, system, or data lake.

### Data persistence

Data persistence means that data survives after the process that generated the data has ended. For a database to be considered persistent, it must write to non-volatile storage. This type of storage is able to retain data in the absence of a power supply.

### Indexes

Indexes in a database are typically created on one or more columns of a table, and they allow the database management system (DBMS) to quickly locate and retrieve the desired data from the table. This can greatly improve the performance of database queries, especially for large tables or tables that are frequently accessed.

### Materialized source

If you want to store all the data from a source in the database, you can create a materialized source. As the data size continues to grow, a materialized source can consume a large amount of storage space. 

### Materialized view

When the results of a view expression are stored in a database system, they are called materialized views. In RisingWave, the result of a materialized view is updated when a relevant event arrives in the system. When you query the result, it is returned instantly as the computation has already been completed when the data comes in.

### Object storage

Object storage, or object-based storage, is a technology that stores data in a hierarchy-free manner. Data in object storage exists as discrete units (objects) at the same level in a storage pool. Each object has a unique, identifying name that an application uses to retrieve it. The benefits of using object storage include massive scalability and cost efficiency.

### OLAP

OLAP (for online analytical processing) is software technology you can use to perform multidimensional analysis at high speeds on large volumes of data from a data warehouse or some other unified, centralized data store.

### Serialization

In stream processing, serialization is the process of converting business objects into bytes so that they can be recognized by message brokers. Deserialization is the process of converting bytes to objects so that they can be accepted by databases or application systems.

### Sink

A sink is an external target you can send data to. RisingWave now supports exporting data to Kafka topics.

### Source

A source is a resource that RisingWave can read data from. Common sources include message brokers such as Apache Kafka and Apache Pulsar and databases such as MySQL and PostgreSQL. 

### Streaming database

A streaming database is broadly defined as a data store designed to collect, process, and/or enrich streams of data in real-time, typically immediately after the data is created.

### Stream processing

Stream processing is the processing of data in motion, or in other words, computing on data directly as it is produced or received.
The majority of data are born as continuous streams: sensor events, user activity on a website, financial trades, and so on – all these data are created as a series of events over time.

### View

A view is a virtual relation that acts as an actual relation. It is not a part of logical relational model of the database system. Results of the view are not stored in the database system. Results of a view are calculated every time the view is accessed. Query expression of the view is stored in the databases system.

### Wire protocol

A wire protocol is a format for interactions between a database server and its clients. It consists of authentication, sending queries, and receiving responses. The wire protocol for PostgreSQL is called pgwire. Being compatible with pgwire means that a tool or database can work with the majority of PostgreSQL database tools.

## RisingWave architecture terms

### Cluster

A group of interconnected nodes and services that acts as a single system running an instance of RisingWave.

### Node

A logical collection of IT resources that handles specific workloads based on their types. There are three types of nodes in RisingWave: 
- Frontend node
- Compute node
- Compactor node

### Frontend node

A frontend node acts as a stateless proxy that accepts user queries through Postgres protocol. It is responsible for parsing and validating queries, optimizing query execution plans, and delivering query results.

### Compute node

A computer node executes the optimized query plans and handles data ingestion and output.

### Compactor node

A stateless worker node that compacts data for the storage engine.

### Meta service

The central metadata management service. It also acts as a failure detector that periodically sends heartbeats to frontend nodes and compute nodes in the cluster.

