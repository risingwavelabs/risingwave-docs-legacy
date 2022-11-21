---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We at RisingWave aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose, we will try to support the mainstream data formats and as many modern-data-stack systems as possible, which is no small feat. If an integration with a system is crucial to you but has not been supported, please let us know by clicking <b>I need it</b> for the integration. We'll prioritize the development based on the number of requests for each system. 

## Message brokers

|Broker | Supported | Notes|
|---|---|---|
|Apache Kafka| Yes |Supported as both a source and a sink.|
|Redpanda| Yes| Supported as both a source and a sink.|
|Apache Pulsar| Partially | Supported as a source but not a sink.|
|Kinesis Data Streams| Partially | Supported as a source but not a sink.|

## ETL/ELT and data integration

|System | Supported | Notes|
|---|---|----|
|Fivetran| No ||
|Airbyte | No | |
|dbt| No| |
|Hightouch| No | |

## Query engines
|System | Supported | Notes|
|---|---|----|
|Spark| No | |
|Presto|No| |
|AWS Athena| No | |

## Databases

|System | Supported | Notes|
|---|---|----|
|MySQL | Partially | Supports ingesting data from but not exporting data to MySQL.|
|Postgres| Partially| Data ingestion from Postgres is supported but not data exports|
|AWS Aurora (MySQL)| |
|AWS Aurora (Postgres)| |
|Clickhouse|No| |
|Apache Pinot| No| |
|Apache Druid| No| |

## Data warehouses

|System | Supported | Notes|
|---|---|----|
|Snowflake| No| |
|AWS Redshift| No | |
|Google BigQuery| No | |

## Data lakes

|System | Supported | Notes|
|---|---|----|
|Delta lake| No| |
|Hudi| No||
|Icerberg| No | |

## Business intelligence tools

|System | Supported | Notes|
|---|---|----|
|Metabase | Partially| |
|Superset| Partially | |
|Grafana| Yes| |
|Looker| No | |
|Jupyter notebook| No| |

## Other systems

|System | Supported | Notes|
|---|---|----|
|Cubejs|No| |
|Alluxio|No| |
