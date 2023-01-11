---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many systems as possible. 

However, with limited resources, we cannot achieve this goal in a short period of time. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://join.slack.com/t/risingwave-community/shared_invite/zt-1aqqe7jj7-dCvl81cNgNOIq0hoRZbJkw), or by clicking the thumb-up icon in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system. 

If you wish to receive notifications when a connector or integration is available, you can click the small bell icon to enter your email address.

For tools or integrations that you would like to use but are not listed in the tables below, you can [submit a feature request](https://github.com/risingwavelabs/risingwave/issues/new?assignees=&labels=type%2Ffeature&template=feature_request.yml), or let us know in the Slack workspace.


## Message brokers or streaming services

|Broker or streaming service| Source | Sink |
|---|---|---|
|Kafka | Available. See [Ingest data from Kafka](/create-source/create-source-kafka.md) for details. | Available. See [CREATE SINK](/sql/commands/sql-create-sink.md) for details.| |
|Redpanda | Available. See [Ingest data from Redpanda](/create-source/create-source-redpanda.md) for details. |Available. See [CREATE SINK](/sql/commands/sql-create-sink.md) for details.|
|Apache Pulsar|Available. See [Ingest data from Pulsar](/create-source/create-source-pulsar.md) for details. | Planning <voteNotify note="pulsar_sink" />|
|DataStax Astra Streaming| Available | Planning <voteNotify note="astra_streaming_sink" />|
|StreamNative Cloud| Available| Planning <voteNotify note="streamnative_cloud_sink" />|
|Kinesis Data Streams|Available. See [Ingest data from Kinesis](/create-source/create-source-kinesis.md) for details.|Planning <voteNotify note="kinesis_sink" />|
|Redis|Planning <voteNotify note="redis_source" />|Upcoming <voteNotify note="redis_sink" />|

## ETL/ELT and data integration

|System | |Availability |
|---|---|---|
|Fivetran| |Planning <voteNotify note="fivetran" /> |
|Airbyte | |Planning  <voteNotify note="airbyte" /> |
|dbt| |Planning <voteNotify note="dbt" />|
|Hightouch| |Planning <voteNotify note="hightouch" />|

## Query engines

|System | |Availability |
|---|---|---|
|Apache Spark| |Planning <voteNotify note="spark" />|
|AWS Athena| |Planning <voteNotify note="athena" />|
|Presto| |Planning <voteNotify note="presto" />|
|Trino| |Planning <voteNotify note="trino" />|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| Upcoming <voteNotify note="pg_source" />| Planning <voteNotify note="pg_sink" />|
|AWS Aurora (Postgres)| Upcoming <voteNotify note="aurora_pg_source" />|Planning <voteNotify note="aurora_pg_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | Upcoming <voteNotify note="mysql_source" />| Planning <voteNotify note="mysql_sink" />|
|AWS Aurora (MySQL)|Upcoming <voteNotify note="aurora_mysql_source" />| Planning <voteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Apache Druid| No plan| Planning <voteNotify note="druid_sink" /> |
|Apache Pinot| No plan|Planning <voteNotify note="pinot_sink" />|
|AWS Redshift| No plan|Planning <voteNotify note="redshift_sink" />|
|Clickhouse|No plan |Planning <voteNotify note="clickhouse_sink" />|
|Snowflake| No plan|Planning <voteNotify note="snowflake_sink" />|
|Google BigQuery| No plan |Planning <voteNotify note="bigquery_sink" />|
|DataStax Astra DB & Apache Cassandra| Planning <voteNotify note="cassandra_source" /> |Upcoming <voteNotify note="cassandra_sink" />|
|CockroachDB| Planning <voteNotify note="cockroachdb_source" />|Planning <voteNotify note="cockroachdb_sink" /> |
|Db2| Planning <voteNotify note="db2_source" />|Planning <voteNotify note="db2_sink" /> |
|MongoDB| Planning <voteNotify note="mongodb_source" />|Planning <voteNotify note="mongodb_sink" /> |
|Oracle Database| Planning <voteNotify note="oracle_source" />|Planning <voteNotify note="oracle_sink" /> |
|SQL Server| Planning <voteNotify note="sql_server_source" />|Planning <voteNotify note="sql_server_sink" /> |
|TiDB| Planning <voteNotify note="tidb_source" />|Planning <voteNotify note="tidb_sink" /> |
|Redis|Planning <voteNotify note="redis_source" />|Upcoming <voteNotify note="redis_sink" />|

## Data lakes

|System | |Availability |
|---|---|---|
|Delta Lake| |Planning <voteNotify note="deltalake" />|
|Apache Hudi| |Planning <voteNotify note="hudi" />|
|Apache Iceberg| |Planning <voteNotify note="iceberg" />|

## BI and data analytics platforms

|System | |Availability |
|---|---|---|
|Apache Superset|| Available |
|Cube.js| |Planning <voteNotify note="cubejs" />|
|DBeaver| |Upcoming <voteNotify note="dbeaver" />|
|Grafana| |Available. See [Visualize RisingWave data in Grafana](./guides/grafana-integration.md) for details.|
|Jupyter Notebook| |Planning <voteNotify note="jupyter" />|
|Looker| |Planning <voteNotify note="looker" /> |
|Metabase | |Upcoming <voteNotify note="metabase" />|


## Other systems

|System | |Availability |
|---|---|---|
|Alluxio| |Planning <voteNotify note="alluxio" />|
