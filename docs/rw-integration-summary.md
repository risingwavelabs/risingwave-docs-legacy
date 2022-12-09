---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many modern-data-stack systems as possible. 

However, with limited resources, we cannot achieve this goal in a short period of time. If an integration with a system is crucial to you but has not been supported, please register your interest by clicking the bell icon in the corresponding tables on this page. We will prioritize the development based on the number of requests for each system. 

## Message brokers

|Broker | Source | Sink | Notes|
|---|---|---|---|
|Kafka | Yes| Yes| For details, see [Kafka as source](../docs/sql/create-source/create-source-kafka-redpanda.md) and [CREATE SINK](../docs/sql/commands/sql-create-sink.md).|
|Redpanda | Yes|Yes|For details, see [Kafka as source](../docs/sql/create-source/create-source-kafka-redpanda.md) and [CREATE SINK](../docs/sql/commands/sql-create-sink.md).|
|Apache Pulsar|Yes | No <notifyButton note="integration_pulsar_sink" />| For details, see [Pulsar as source](../docs/sql/create-source/create-source-pulsar.md).|
|Kinesis Data Streams|Yes |No<notifyButton note="integration_kinesis_sink" />| For details, see [Kinesis as source](../docs/sql/create-source/create-source-kinesis.md) |

## ETL/ELT and data integration

|System | Supported | Notes|
|--|---|---|
|Fivetran| Not yet <notifyButton note="integration_fivetran" /> |If you need this integration, click the little bell to let us know.|
|Airbyte | Not yet  <notifyButton note="integration_airbyte" /> |If you need this integration, click the little bell to let us know. |
|dbt| Not yet <notifyButton note="integration_dbt" />|If you need this integration, click the little bell to let us know.  |
|Hightouch| Not yet <notifyButton note="integration_hightouch" />|If you need this integration, click the little bell to let us know.|

## Query engines

|System | Supported | Notes|
|---|---|----|
|Apache Spark| Not yet <notifyButton note="integration_spark" />| If you need this integration, click the little bell to let us know.|
|Presto|Not yet <notifyButton note="integration_presto" />|If you need this integration, click the little bell to let us know. |
|AWS Athena| Not yet <notifyButton note="integration_athena" />|If you need this integration, click the little bell to let us know. |

## Databases

### PostgreSQL

|System | Source | Sink | Notes|
|---|---|----|---|
|Postgres| In Progress | | |
|AWS Aurora (Postgres)|| In Progress | |

### MySQL

|System | Source | Sink | Notes|
|---|---|----|--|
|MySQL | Yes || |
|AWS Aurora (MySQL)|| | |

### Other databases

|System | Supported | Notes|
|---|---|----|
|Clickhouse|Not yet <notifyButton note="integration_clickhouse" />|  If you need this integration, click the little bell to let us know.|
|Apache Pinot| Not yet <notifyButton note="integration_pinot" />| If you need this integration, click the little bell to let us know.|
|Apache Druid| Not yet <notifyButton note="integration_druid" />| If you need this integration, click the little bell to let us know.|



## Data warehouses

|System | Supported | Notes|
|---|---|----|
|Snowflake| Not yet <notifyButton note="integration_snowflake" />|  If you need this integration, click the little bell to let us know.|
|AWS Redshift| Not yet <notifyButton note="integration_redshift" />|  If you need this integration, click the little bell to let us know.|
|Google BigQuery| Not yet <notifyButton note="integration_bigquery" /> |  If you need this integration, click the little bell to let us know.|

## Data lakes

|System | Supported | Notes|
|---|---|----|
|Delta Lake| Not yet <notifyButton note="integration_deltalake" />|  If you need this integration, click the little bell to let us know.|
|Apache Hudi| Not yet <notifyButton note="integration_hudi" />| If you need this integration, click the little bell to let us know.|
|Apache Iceberg| Not yet <notifyButton note="integration_iceberg" />| If you need this integration, click the little bell to let us know. |

## BI and data analytics platforms

|System | Supported | Notes|
|---|---|----|
|Metabase | Not yet| If you need this integration, click the little bell to let us know. |
|Apache Superset| Yes | |
|Grafana| Yes| |
|Looker| Not yet <notifyButton note="integration_looker" /> | If you need this integration, click the little bell to let us know. |
|Jupyter Notebook| Not yet <notifyButton note="integration_jupyter" />|  If you need this integration, click the little bell to let us know.|

## Other systems

|System | Supported | Notes|
|---|---|----|
|Cube.js|Not yet <notifyButton note="integration_cubejs" />| If you need this integration, click the little bell to let us know. |
|Alluxio|Not yet <notifyButton note="integration_alluxio" />|  If you need this integration, click the little bell to let us know.|
