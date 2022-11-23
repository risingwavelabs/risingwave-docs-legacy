---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
---

We aim to minimize the hassel of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats and as many modern-data-stack systems as possible, which is no small feat. If an integration with a system is crucial to you but has not been supported, please let us know in our [Slack workspace](https://join.slack.com/t/risingwave-community/shared_invite/zt-120rft0mr-d8uGk3d~NZiZAQWPnElOfw). We will prioritize the development based on the number of requests for each system. 

## Message brokers

|Broker | Supported | Notes|
|---|---|---|
|Kafka| Yes |Supported as both a source and a sink.|
|Redpanda| Yes| Supported as both a source and a sink.|
|Apache Pulsar| Yes | Supported as a source but not a sink.|
|Kinesis Data Streams| Yes | Supported as a source but not a sink.|

## ETL/ELT and data integration

|System | Supported | Notes|
|---|---|----|
|Fivetran| Not yet ||
|Airbyte | Not yet | |
|dbt| Not yet| |
|Hightouch| Not yet | |

## Query engines
|System | Supported | Notes|
|---|---|----|
|Apache Spark| Not yet | |
|Presto|Not yet| |
|AWS Athena| Not yet | |

## Databases

|System | Supported | Notes|
|---|---|----|
|MySQL | Yes | Supported as both a source and a sink.|
|Postgres| Yes| Supported as a source. The support for exporting data to Postgres is in development.|
|AWS Aurora (MySQL)| | |
|AWS Aurora (Postgres)| | |
|Clickhouse|Not yet| |
|Apache Pinot| Not yet| |
|Apache Druid| Not yet| |

## Data warehouses

|System | Supported | Notes|
|---|---|----|
|Snowflake| Not yet| |
|AWS Redshift| Not yet | |
|Google BigQuery| Not yet | |

## Data lakes

|System | Supported | Notes|
|---|---|----|
|Delta Lake| Not yet| |
|Apache Hudi| Not yet||
|Apache Iceberg| Not yet | |

## BI and data analytics platforms

|System | Supported | Notes|
|---|---|----|
|Metabase | Not yet| |
|Apache Superset| Yes | |
|Grafana| Yes| |
|Looker| Not yet | |
|Jupyter Notebook| Not yet| |

## Other systems

|System | Supported | Notes|
|---|---|----|
|Cube.js|Not yet| |
|Alluxio|Not yet| |
