---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-integration-summary/" />
</head>

<!-- MDX imports -->
import VoteNotify from "@site/src/components/VoteNotify";

We aim to minimize the hassle of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many systems as possible.

However, with limited resources, we cannot achieve this goal in a short period of time. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://www.risingwave.com/slack), or by clicking the thumb-up icon in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system.

If you wish to receive notifications when a connector or integration is available, you can click the small bell icon to enter your email address.

For tools or integrations that you would like to use but are not listed in the tables below, you can [submit a feature request](https://github.com/risingwavelabs/risingwave/issues/new?assignees=&labels=type%2Ffeature&template=feature_request.yml), or let us know in the Slack workspace.

## Message brokers or streaming services

|Broker or streaming service| Source | Sink |
|---|---|---|
|Kafka | Available. See [Ingest data from Kafka](/create-source/create-source-kafka.md) for details. | Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.| |
|Redpanda | Available. See [Ingest data from Redpanda](/create-source/create-source-redpanda.md) for details. |Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.|
|Apache Pulsar|Available. See [Ingest data from Pulsar](/create-source/create-source-pulsar.md) for details. | Researching <VoteNotify note="pulsar_sink" />|
|DataStax Astra Streaming| Available. See [Ingest data from DataStax Astra Streaming](/guides/connector-astra-streaming.md) for details. | Researching <VoteNotify note="astra_streaming_sink" />|
|StreamNative Cloud| Available| Researching <VoteNotify note="streamnative_cloud_sink" />|
|Kinesis Data Streams|Available. See [Ingest data from Kinesis](/create-source/create-source-kinesis.md) for details.|Available. See [Sink data to Kinesis](/guides/sink-to-aws-kinesis.md) for details.|

## ETL/ELT and data integration

|System | |Availability |
|---|---|---|
|Fivetran| |Researching <VoteNotify note="fivetran" /> |
|Airbyte | |Researching  <VoteNotify note="airbyte" /> |
|dbt| |Researching <VoteNotify note="dbt" />|
|Hightouch| |Researching <VoteNotify note="hightouch" />|

## Query engines

|System | |Availability |
|---|---|---|
|Apache Spark| |Researching <VoteNotify note="spark" />|
|AWS Athena| |Researching <VoteNotify note="athena" />|
|Presto| |Researching <VoteNotify note="presto" />|
|Trino| |Researching <VoteNotify note="trino" />|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details.| Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS RDS (Postgres)| Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details. |Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS Aurora (Postgres)| In progress <VoteNotify note="aurora_pg_source" />|Researching <VoteNotify note="aurora_pg_sink" />|
|Citus Data| Available. See [Ingest data from Citus CDC](/guides/ingest-from-citus-cdc.md). | Researching <VoteNotify note="citus_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md).|
|AWS RDS (MySQL)|Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md).|
|AWS Aurora (MySQL)|In progress <VoteNotify note="aurora_mysql_source" />| Researching <VoteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Apache Druid| No plan| Researching <VoteNotify note="druid_sink" /> |
|Apache Pinot| No plan|Researching <VoteNotify note="pinot_sink" />|
|AWS Redshift| No plan|Researching <VoteNotify note="redshift_sink" />|
|ClickHouse|No plan |Planning <VoteNotify note="clickhouse_sink" />|
|Snowflake| No plan|Researching <VoteNotify note="snowflake_sink" />|
|Google BigQuery| No plan |Researching <VoteNotify note="bigquery_sink" />|
|DataStax Astra DB & Apache Cassandra| Researching <VoteNotify note="cassandra_source" /> |In progress <VoteNotify note="cassandra_sink" />|
|CockroachDB| Researching <VoteNotify note="cockroachdb_source" />|Researching <VoteNotify note="cockroachdb_sink" /> |
|Db2| Researching <VoteNotify note="db2_source" />|Researching <VoteNotify note="db2_sink" /> |
|MongoDB| Available. For details, see [CDC via event streaming systems](/create-source/create-source-cdc.md).|Researching <VoteNotify note="mongodb_sink" /> |
|Oracle Database| Researching <VoteNotify note="oracle_source" />|Researching <VoteNotify note="oracle_sink" /> |
|SQL Server| Available. For details, see [CDC via event streaming systems](/create-source/create-source-cdc.md).|Researching <VoteNotify note="sql_server_sink" /> |
|TiDB| Available. For details, see [CDC via event streaming systems](/create-source/create-source-cdc.md).|Available. For details, see [Sink data from RisingWave to TiDB](/guides/sink-to-tidb.md). |
|Redis|Researching <VoteNotify note="redis_source" />|In progress <VoteNotify note="redis_sink" />|
|Greenplum| No plan| Researching <VoteNotify note="greenplum_sink" /> |

## Data lakes

|System | |Availability |
|---|---|---|
|Delta Lake| |Available. See [Sink data from RisingWave to Delta Lake](/guides/sink-to-delta-lake.md)|
|Apache Hudi| |Researching <VoteNotify note="hudi" />|
|Apache Iceberg| |Available. For details, see [Sink data from RisingWave to Apache Iceberg](/guides/sink-to-iceberg.md).|

## BI and data analytic platforms

|System ||Availability |
|---|-|--|
|Apache Superset| |Available. See [Visualize RisingWave data in Superset](/guides/superset-integration.md) for details. |
|Cube.js| | Researching <VoteNotify note="cubejs" />|
|DBeaver| | Available |
|Grafana| |Available. See [Visualize RisingWave data in Grafana](/guides/grafana-integration.md) for details.|
|Jupyter Notebook||Researching <VoteNotify note="jupyter" />|
|Looker||Researching <VoteNotify note="looker" /> |
|Metabase ||In progress <VoteNotify note="metabase" />|
|Redash || Available |

## Other systems

|System | |Availability |
|---|---|---|
|Alluxio| |Researching <VoteNotify note="alluxio" />|
