---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many systems as possible. 

However, with limited resources, we cannot achieve this goal in a short period of time. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://join.slack.com/t/risingwave-community/shared_invite/zt-120rft0mr-d8uGk3d~NZiZAQWPnElOfw), or by clicking the thumb-up icon in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system. 

If you wish to receive notifications when a connector or integration is available, you can click the small bell icon to enter your email address.

For tools or integrations that you would like to use but are not listed in the tables below, you can [submit a feature request](https://github.com/risingwavelabs/risingwave/issues/new?assignees=&labels=type%2Ffeature&template=feature_request.yml), or let us know in the Slack workspace.


## Message brokers or streaming services

|Broker or streaming service| Source | Sink |
|---|---|---|
|Kafka | Available. See [Ingest data from Kafka](/create-source/create-source-kafka.md) for details. | Available. See [CREATE SINK](/sql/commands/sql-create-sink.md) for details.| |
|Redpanda | Available. See [Ingest data from Redpanda](/create-source/create-source-redpanda.md) for details. |Available. See [CREATE SINK](/sql/commands/sql-create-sink.md) for details.|
|Apache Pulsar|Available. See [Ingest data from Pulsar](/create-source/create-source-pulsar.md) for details. | Researching <voteNotify note="pulsar_sink" />|
|DataStax Astra Streaming| Available | Researching <voteNotify note="astra_streaming_sink" />|
|StreamNative Cloud| Available| Researching <voteNotify note="streamnative_cloud_sink" />|
|Kinesis Data Streams|Available. See [Ingest data from Kinesis](/create-source/create-source-kinesis.md) for details.|Researching <voteNotify note="kinesis_sink" />|
|Redis|Researching <voteNotify note="redis_source" />|In progress <voteNotify note="redis_sink" />|

## ETL/ELT and data integration

|System | |Availability |
|---|---|---|
|Fivetran| |Researching <voteNotify note="fivetran" /> |
|Airbyte | |Researching  <voteNotify note="airbyte" /> |
|dbt| |Researching <voteNotify note="dbt" />|
|Hightouch| |Researching <voteNotify note="hightouch" />|

## Query engines

|System | |Availability |
|---|---|---|
|Apache Spark| |Researching <voteNotify note="spark" />|
|AWS Athena| |Researching <voteNotify note="athena" />|
|Presto| |Researching <voteNotify note="presto" />|
|Trino| |Researching <voteNotify note="trino" />|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| In progress <voteNotify note="pg_source" />| Researching <voteNotify note="pg_sink" />|
|AWS Aurora (Postgres)| In progress <voteNotify note="aurora_pg_source" />|Researching <voteNotify note="aurora_pg_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | In progress <voteNotify note="mysql_source" />| Researching <voteNotify note="mysql_sink" />|
|AWS Aurora (MySQL)|In progress <voteNotify note="aurora_mysql_source" />| Researching <voteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Apache Druid| No plan| Researching <voteNotify note="druid_sink" /> |
|Apache Pinot| No plan|Researching <voteNotify note="pinot_sink" />|
|AWS Redshift| No plan|Researching <voteNotify note="redshift_sink" />|
|Clickhouse|No plan |Researching <voteNotify note="clickhouse_sink" />|
|Snowflake| No plan|Researching <voteNotify note="snowflake_sink" />|
|Google BigQuery| No plan |Researching <voteNotify note="bigquery_sink" />|
|DataStax Astra DB & Apache Cassandra| Researching <voteNotify note="cassandra_source" /> |In progress <voteNotify note="cassandra_sink" />|
|CockroachDB| Researching <voteNotify note="cockroachdb_source" />|Researching <voteNotify note="cockroachdb_sink" /> |
|Db2| Researching <voteNotify note="db2_source" />|Researching <voteNotify note="db2_sink" /> |
|MongoDB| Researching <voteNotify note="mongodb_source" />|Researching <voteNotify note="mongodb_sink" /> |
|Oracle Database| Researching <voteNotify note="oracle_source" />|Researching <voteNotify note="oracle_sink" /> |
|SQL Server| Researching <voteNotify note="sql_server_source" />|Researching <voteNotify note="sql_server_sink" /> |
|TiDB| Researching <voteNotify note="tidb_source" />|Researching <voteNotify note="tidb_sink" /> |
|Redis|Researching <voteNotify note="redis_source" />|In progress <voteNotify note="redis_sink" />|

## Data lakes

|System | |Availability |
|---|---|---|
|Delta Lake| |Researching <voteNotify note="deltalake" />|
|Apache Hudi| |Researching <voteNotify note="hudi" />|
|Apache Iceberg| |Researching <voteNotify note="iceberg" />|

## BI and data analytics platforms

|System | |Availability |
|---|---|---|
|Apache Superset|| Available |
|Cube.js| |Researching <voteNotify note="cubejs" />|
|DBeaver| |In progress <voteNotify note="dbeaver" />|
|Grafana| |Available. See [Visualize RisingWave data in Grafana](./guides/grafana-integration.md) for details.|
|Jupyter Notebook| |Researching <voteNotify note="jupyter" />|
|Looker| |Researching <voteNotify note="looker" /> |
|Metabase | |In progress <voteNotify note="metabase" />|


## Other systems

|System | |Availability |
|---|---|---|
|Alluxio| |Researching <voteNotify note="alluxio" />|
