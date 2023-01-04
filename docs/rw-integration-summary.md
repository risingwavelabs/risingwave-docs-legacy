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
|Kafka | Yes. See [Ingest data from Kafka](../docs/sql/create-source/create-source-kafka-redpanda.md) for details. | Yes. See [Deliver data to Kafka](../docs/sql/commands/sql-create-sink.md) for details.| |
|Redpanda | Yes. See [Ingest data from Kafka](../docs/sql/create-source/create-source-kafka-redpanda.md) for details. |Yes. See [Deliver data to Kafka](../docs/sql/commands/sql-create-sink.md) for details.|
|Apache Pulsar|Yes. See [Ingest data from Pulsar](../docs/sql/create-source/create-source-pulsar.md) for details. | Not yet <voteNotify note="pulsar_sink" />|
|DataStax Astra Streaming| Yes | Not yet <voteNotify note="astra_streaming_sink" />|
|StreamNative Cloud| Yes| Not yet <voteNotify note="streamnative_cloud_sink" />|
|Kinesis Data Streams|Yes. See [Ingest data from Kinesis](../docs/sql/create-source/create-source-kinesis.md) for details.|Not yet <voteNotify note="kinesis_sink" />|

## ETL/ELT and data integration

|System | |Supported |
|---|---|---|
|Fivetran| |Not yet <voteNotify note="fivetran" /> |
|Airbyte | |Not yet  <voteNotify note="airbyte" /> |
|dbt| |Not yet <voteNotify note="dbt" />|
|Hightouch| |Not yet <voteNotify note="hightouch" />|

## Query engines

|System | |Supported |
|---|---|---|
|Apache Spark| |Not yet <voteNotify note="spark" />|
|AWS Athena| |Not yet <voteNotify note="athena" />|
|Presto| |Not yet <voteNotify note="presto" />|
|Trino| |Not yet <voteNotify note="trino" />|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| In Progress | Not yet <voteNotify note="pg_sink" />|
|AWS Aurora (Postgres)| In Progress |Not yet <voteNotify note="aurora_pg_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | In Progress| Not yet <voteNotify note="mysql_sink" />|
|AWS Aurora (MySQL)|In Progress| Not yet <voteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Apache Druid| No plan| Not yet <voteNotify note="druid_sink" /> |
|Apache Pinot| No plan|Not yet <voteNotify note="pinot_sink" />|
|AWS Redshift| No plan|Not yet <voteNotify note="redshift_sink" />|
|Clickhouse|No plan |Not yet <voteNotify note="clickhouse_sink" />|
|Snowflake| No plan|Not yet <voteNotify note="snowflake_sink" />|
|Google BigQuery| No plan |Not yet <voteNotify note="bigquery_sink" />|
|DataStax Astra DB & Apache Cassandra| Not yet <voteNotify note="cassandra_source" /> |In progress |
|CockroachDB| Not yet <voteNotify note="cockroachdb_source" />|Not yet <voteNotify note="cockroachdb_sink" /> |
|Db2| Not yet <voteNotify note="db2_source" />|Not yet <voteNotify note="db2_sink" /> |
|MongoDB| Not yet <voteNotify note="mongodb_source" />|Not yet <voteNotify note="mongodb_sink" /> |
|Oracle Database| Not yet <voteNotify note="oracle_source" />|Not yet <voteNotify note="oracle_sink" /> |
|SQL Server| Not yet <voteNotify note="sql_server_source" />|Not yet <voteNotify note="sql_server_sink" /> |
|TiDB| Not yet <voteNotify note="tidb_source" />|Not yet <voteNotify note="tidb_sink" /> |

## Data lakes

|System | |Supported |
|---|---|---|
|Delta Lake| |Not yet <voteNotify note="deltalake" />|
|Apache Hudi| |Not yet <voteNotify note="hudi" />|
|Apache Iceberg| |Not yet <voteNotify note="iceberg" />|

## BI and data analytics platforms

|System | |Supported |
|---|---|---|
|Apache Superset|| Yes |
|Cube.js| |Not yet <voteNotify note="cubejs" />|
|DBeaver| |In progress|
|Grafana| |Yes. See [Visualize RisingWave data in Grafana](./guides/grafana-integration.md) for details.|
|Jupyter Notebook| |Not yet <voteNotify note="jupyter" />|
|Looker| |Not yet <voteNotify note="looker" /> |
|Metabase | |In progress|


## Other systems

|System | |Supported |
|---|---|---|
|Alluxio| |Not yet <voteNotify note="alluxio" />|
