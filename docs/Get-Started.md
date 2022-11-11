---
id: get-started
title: Get started
description: Get started with RisingWave.
slug: /get-started
---

This guide will help you get started with RisingWave.

|Stages | |
|---|---|
|<img src={require('./images/data_process_0.png').default} alt="RisingWave Architecture" width='250'/>|[**Run RisingWave**](get-started.md/#run-risingwave) — Install, start, and connect to RisingWave.|
|<img src={require('./images/data_process_1.png').default} alt="RisingWave Architecture" width='250'/>|[**Ingest streaming data**](/sql/commands/sql-create-source.md) — Connect a streaming data source to RisingWave.|
|<img src={require('./images/data_process_2.png').default} alt="RisingWave Architecture" width='250'/>|**Query and manage data** <ul><li>[RisingWave SQL 101](risingwave-sql-101.md) — A simple yet typical data processing quickstart guide for RisingWave first-timers.</li><li>[Tutorials](/tutorials/real-time-ad-performance-analysis.md) — A series of guided tours in solving real-world stream processing tasks with simulated data.</li><li>**SQL reference** — Navigate to **SQL reference** on the sidebar if you are familiar with PostgreSQL and materialized views.</li></ul>|
|<img src={require('./images/data_process_3.png').default} alt="RisingWave Architecture" width='250'/>|[**Output data**](/sql/commands/sql-create-sink.md) — Output data from RisingWave to data sinks.|


## Run RisingWave

RisingWave offers two modes for different testing purposes:

|Comparison \ Mode|Playground mode|Full-featured mode|
|---|---|---|
|**Purpose**|Quick tests|Advanced tests and demos|
|**Starts in**|A single-node instance|A full-featured, multi-node cluster|
|**Data persistence**|Data is stored solely in memory and will not be persisted after the service is terminated.|Data is persisted in storage.|
|**Auto termination**|Service is automatically terminated after 30 minutes of inactivity.|No automatic termination.|
|**Choose a method to run RisingWave**|Run a single-node instance in<br /><lightButton text="Local environment" doc="risingwave-local"/><lightButton text="Docker" doc="risingwave-docker-image"/>|Set up a local cluster with<br /><lightButton text="Docker Compose" doc="risingwave-docker-compose"/><lightButton text="Kubernetes" doc="risingwave-kubernetes"/>|

> Currently, RisingWave does not support Windows. Use a macOS or Linux machine to run RisingWave.


