---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many systems as possible. 

However, with limited resources, we cannot achieve this goal in a short period of time. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://join.slack.com/t/risingwave-community/shared_invite/zt-1aqqe7jj7-dCvl81cNgNOIq0hoRZbJkw), or by clicking the bell icon <notifyButton /> in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system.

:::info

If a connector or integration is not available yet, you can click the small bell icon <notifyButton note="example" /> in the corresponding cell to register your interest.

:::

## Message brokers

|Broker | Source | Sink |
|---|---|---|
|Kafka | Yes. See [Ingest data from Kafka](../docs/sql/create-source/create-source-kafka-redpanda.md) for details. | Yes. See [Deliver data to Kafka](../docs/sql/commands/sql-create-sink.md) for details.| |
|Redpanda | Yes. See [Ingest data from Kafka](../docs/sql/create-source/create-source-kafka-redpanda.md) for details. |Yes. See [Deliver data to Kafka](../docs/sql/commands/sql-create-sink.md) for details.|
|Apache Pulsar|Yes. See [Ingest data from Pulsar](../docs/sql/create-source/create-source-pulsar.md) for details. | Not yet <notifyButton note="pulsar_sink" />|
|Kinesis Data Streams|Yes. See [Ingest data from Kinesis](../docs/sql/create-source/create-source-kinesis.md) for details.|Not yet <notifyButton note="kinesis_sink" />|

## ETL/ELT and data integration

|System | Supported |
|--|---|
|Fivetran| Not yet <notifyButton note="fivetran" /> |
|Airbyte | Not yet  <notifyButton note="airbyte" /> |
|dbt| Not yet <notifyButton note="dbt" />|
|Hightouch| Not yet <notifyButton note="hightouch" />|

## Query engines

|System | Supported |
|---|---|
|Apache Spark| Not yet <notifyButton note="spark" />|
|Presto|Not yet <notifyButton note="presto" />|
|AWS Athena| Not yet <notifyButton note="athena" />|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| In Progress | Not yet <notifyButton note="pg_sink" />|
|AWS Aurora (Postgres)| In Progress |Not yet <notifyButton note="aurora_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | In Progress|Not yet Not yet <notifyButton note="mysql_sink" />|
|AWS Aurora (MySQL)|In Progress| Not yet Not yet <notifyButton note="mysql_sink" /> |

### Other databases

|System | Source| Sink |
|---|---|----|
|Clickhouse|Not yet <notifyButton note="clickhouse_source" />| Not yet <notifyButton note="clickhouse_sink" />|
|Apache Pinot| Not yet <notifyButton note="pinot_source" />| Not yet <notifyButton note="pinot_sink" />|
|Apache Druid| Not yet <notifyButton note="druid_source" />|Not yet <notifyButton note="druid_sink" /> |
|Oracle| Not yet <notifyButton note="oracle_source" />|Not yet <notifyButton note="oracle_sink" /> |
|SQL Server| Not yet <notifyButton note="sql_server_source" />|Not yet <notifyButton note="sql_server_sink" /> |
|MongoDB| Not yet <notifyButton note="mongodb_source" />|Not yet <notifyButton note="mongodb_sink" /> |
|Db2| Not yet <notifyButton note="db2_source" />|Not yet <notifyButton note="db2_sink" /> |
|TiDB| Not yet <notifyButton note="tidb_source" />|Not yet <notifyButton note="tidb_sink" /> |
|CockroachDB| Not yet <notifyButton note="cockroachdb_source" />|Not yet <notifyButton note="cockroachdb_sink" /> |



## Data warehouses

|System | Supported |
|---|---|
|Snowflake| Not yet <notifyButton note="snowflake" />|
|AWS Redshift| Not yet <notifyButton note="redshift" />|
|Google BigQuery| Not yet <notifyButton note="bigquery" />|

## Data lakes

|System | Supported |
|---|---|
|Delta Lake| Not yet <notifyButton note="deltalake" />|
|Apache Hudi| Not yet <notifyButton note="hudi" />|
|Apache Iceberg| Not yet <notifyButton note="iceberg" />|

## BI and data analytics platforms

|System | Supported |
|---|---|
|Apache Superset| Yes |
|Cube.js|Not yet <notifyButton note="cubejs" />|
|Grafana| Yes|
|Jupyter Notebook| Not yet <notifyButton note="jupyter" />|
|Looker| Not yet <notifyButton note="looker" /> |
|Metabase | Not yet <notifyButton note="metabase" />|


## Other systems

|System | Supported |
|---|---|
|Alluxio|Not yet <notifyButton note="alluxio" />|
