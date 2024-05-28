---
id: rw-integration-summary
title: Integrations
description: Summary of integrations
slug: /rw-integration-summary
keywords: [kafka, confluent cloud, amazon msk, data ingestion]
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-integration-summary/" />
</head>

We aim to minimize the hassle of integrating RisingWave with your existing data stack. With that purpose in mind, we will try to support the mainstream data formats, tools, and as many systems as possible.

However, with limited resources, we cannot achieve this goal in a short period of time. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://www.risingwave.com/slack), or by clicking the thumb-up icon in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system.

If you wish to receive notifications when a connector or integration is available, you can click the small bell icon to enter your email address.

For tools or integrations that you would like to use but are not listed in the tables below, you can [submit a feature request](https://github.com/risingwavelabs/risingwave/issues/new?assignees=&labels=type%2Ffeature&template=feature_request.yml), or let us know in the Slack workspace.

:::note Note about sink status

RisingWave can sink data to Kafka. This allows indirectly sinking data to any system that can ingest from Kafka. The tables below show direct sink status:

"Available" means a direct sink connector exists for that system.

"Researching" means no direct sink yet, but the system can still be used if it can ingest from Kafka.

:::

## Message brokers or streaming services

| Broker or streaming service | Source                                                                                                        | Sink                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --- |
| Apache Kafka                | Available. See [Ingest data from Kafka](/ingest/ingest-from-kafka.md) for details.                            | Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.          |     |
| Confluent Cloud             | Available. See [Ingest data from Confluent Cloud](/guides/confluent-kafka-source.md) for details.             |                                                                                    |
| Amazon MSK                  | Available. See [Ingest data from Amazon MSK](/guides/connector-amazon-msk.md) for details.                    |                                                                                    |
| Redpanda                    | Available. See [Ingest data from Redpanda](/ingest/ingest-from-redpanda.md) for details.                      | Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.          |
| Apache Pulsar               | Available. See [Ingest data from Pulsar](/ingest/ingest-from-pulsar.md) for details.                          | Available. See [Sink data to Pulsar](/guides/sink-to-pulsar.md) for details.       |
| DataStax Astra Streaming    | Available. See [Ingest data from DataStax Astra Streaming](/guides/connector-astra-streaming.md) for details. | Researching <Capsule note="astra_streaming_sink" />                                |
| StreamNative Cloud          | Available                                                                                                     | Researching <Capsule note="streamnative_cloud_sink" />                             |
| Kinesis Data Streams        | Available. See [Ingest data from Kinesis](/ingest/ingest-from-kinesis.md) for details.                        | Available. See [Sink data to Kinesis](/guides/sink-to-aws-kinesis.md) for details. |
| NATS / NATS JetStream       | Available. See [Ingest data from NATS JetStream](/ingest/ingest-from-nats.md) for details.                    | Available. See [Sink data to NATS](/guides/sink-to-nats.md) for details.           |

## ETL/ELT and data integration

| System    |     | Availability                                                                           |
| --------- | --- | -------------------------------------------------------------------------------------- |
| Fivetran  |     | Researching <Capsule note="fivetran" />                                                |
| Airbyte   |     | Researching <Capsule note="airbyte" />                                                 |
| dbt       |     | Available. For details, see [Use dbt for data transformations](/transform/use-dbt.md). |
| Hightouch |     | Researching <Capsule note="hightouch" />                                               |

## Query engines

| System       |     | Availability                          |
| ------------ | --- | ------------------------------------- |
| Apache Spark |     | Researching <Capsule note="spark" />  |
| AWS Athena   |     | Researching <Capsule note="athena" /> |
| Presto       |     | Researching <Capsule note="presto" /> |
| Trino        |     | Researching <Capsule note="trino" />  |

## Databases

### PostgreSQL

| System                | Source                                                                                             | Sink                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Postgres              | Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details. | Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details. |
| AWS RDS (Postgres)    | Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details. | Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details. |
| AWS Aurora (Postgres) | In progress <Capsule note="aurora_pg_source" />                                                    | Researching <Capsule note="aurora_pg_sink" />                                                      |
| Citus Data            | Available. See [Ingest data from Citus CDC](/guides/ingest-from-citus-cdc.md).                     | Researching <Capsule note="citus_sink" />                                                          |

### MySQL

| System             | Source                                                                                     | Sink                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| MySQL              | Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details. | Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md). |
| AWS RDS (MySQL)    | Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details. | Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md). |
| AWS Aurora (MySQL) | In progress <Capsule note="aurora_mysql_source" />                                         | Researching <Capsule note="aurora_mysql_sink" />                               |

### Other databases

| System                                          | Source                                                                                     | Sink                                                                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apache Druid                                    | No plan                                                                                    | Researching <Capsule note="druid_sink" />                                                                                                            |
| Apache Pinot                                    | No plan                                                                                    | Researching <Capsule note="pinot_sink" />                                                                                                            |
| AWS Redshift                                    | No plan                                                                                    | Researching <Capsule note="redshift_sink" />                                                                                                         |
| ClickHouse                                      | No plan                                                                                    | Available. For details, see [Sink data to ClickHouse](/guides/sink-to-clickhouse.md).                                                                |
| Snowflake                                       | No plan                                                                                    | Researching <Capsule note="snowflake_sink" />                                                                                                        |
| Google BigQuery                                 | No plan                                                                                    | Available. For details, see [Sink data to Google BigQuery](/guides/sink-to-bigquery.md).                                                             |
| DataStax Astra DB & Apache Cassandra & ScyllaDB | Researching <Capsule note="cassandra_source" />                                            | Available. For details, see [Sink data to Cassandra or ScyllaDB](/guides/sink-to-cassandra.md).                                                      |
| CockroachDB                                     | Researching <Capsule note="cockroachdb_source" />                                          | Available. For details, see [Sink data to CockroachDB](/guides/sink-to-clickhouse.md).                                                               |
| Db2                                             | Researching <Capsule note="db2_source" />                                                  | Researching <Capsule note="db2_sink" />                                                                                                              |
| MongoDB                                         | Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md). | Researching <Capsule note="mongodb_sink" />                                                                                                          |
| Oracle Database                                 | Researching <Capsule note="oracle_source" />                                               | Researching <Capsule note="oracle_sink" />                                                                                                           |
| SQL Server                                      | Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md). | Researching <Capsule note="sql_server_sink" />                                                                                                       |
| TiDB                                            | Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md). | Available. For details, see [Sink data from RisingWave to TiDB](/guides/sink-to-tidb.md).                                                            |
| Redis                                           | Researching <Capsule note="redis_source" />                                                | Available. For details, see [Sink data from RisingWave to Redis](/guides/sink-to-redis.md).                                                          |
| Greenplum                                       | No plan                                                                                    | Researching <Capsule note="greenplum_sink" />                                                                                                        |
| Elasticsearch                                   | No plan                                                                                    | Available. Only versions 7.x and 8.x are supported. For details, see [Sink data from RisingWave to Elasticsearch](/guides/sink-to-elasticsearch.md). |

## Data lakes

| System         |     | Availability                                                                                           |
| -------------- | --- | ------------------------------------------------------------------------------------------------------ |
| Delta Lake     |     | Available. See [Sink data from RisingWave to Delta Lake](/guides/sink-to-delta-lake.md)                |
| Apache Hudi    |     | Researching <Capsule note="hudi" />                                                                    |
| Apache Iceberg |     | Available. For details, see [Sink data from RisingWave to Apache Iceberg](/guides/sink-to-iceberg.md). |

## BI and data analytic platforms

| System           |                                                                                           | Availability                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Apache Superset  |                                                                                           | Available. See [Visualize RisingWave data in Superset](/guides/superset-integration.md) for details.   |
| Beekeeper Studio |                                                                                           | Available. See [Connect Beekeeper Studio to RisingWave](/guides/beekeeper-integration.md) for details. |
| Cube.js          |                                                                                           | Researching <Capsule note="cubejs" />                                                                  |
| DBeaver          |                                                                                           | Available. See [Connect DBeaver to RisingWave](/guides/dbeaver-integration.md) for details.            |
| Grafana          |                                                                                           | Available. See [Visualize RisingWave data in Grafana](/guides/grafana-integration.md) for details.     |
| Jupyter Notebook |                                                                                           | Researching <Capsule note="jupyter" />                                                                 |
| Looker           | Available. See [Connect Looker to RisingWave](/guides/looker-integration.md) for details. |
| Metabase         |                                                                                           | In progress <Capsule note="metabase" />                                                                |
| Redash           |                                                                                           | Available                                                                                              |
| DataGrip         |                                                                                           | Researching <Capsule note="datagrip" />                                                                |
| PgAdmin          |                                                                                           | Researching <Capsule note="pgadmin" />                                                                 |

## Other systems

| System   |     | Availability                                                                                                         |
| -------- | --- | -------------------------------------------------------------------------------------------------------------------- |
| Alluxio  |     | Researching <Capsule note="alluxio" />                                                                               |
| Supabase |     | Available. For details, see [Empower Supabase with stream processing capabilities](/guides/supabase-integration.md). |
