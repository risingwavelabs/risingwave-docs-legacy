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

|Broker or streaming service| Source | Sink |
|---|---|---|
|Apache Kafka | Available. See [Ingest data from Kafka](/ingest/ingest-from-kafka.md) for details. | Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.| |
| Confluent Cloud | Available. See [Ingest data from Confluent Cloud](/guides/confluent-kafka-source.md) for details. | |
| Amazon MSK | Available. See [Ingest data from Amazon MSK](/guides/connector-amazon-msk.md) for details. | |
|Redpanda | Available. See [Ingest data from Redpanda](/ingest/ingest-from-redpanda.md) for details. |Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.|
|Apache Pulsar|Available. See [Ingest data from Pulsar](/ingest/ingest-from-pulsar.md) for details. | Available. See [Sink data to Pulsar](/guides/sink-to-pulsar.md) for details.|
|DataStax Astra Streaming| Available. See [Ingest data from DataStax Astra Streaming](/guides/connector-astra-streaming.md) for details. | Researching <voteNotify note="astra_streaming_sink" />|
|StreamNative Cloud| Available| Researching <voteNotify note="streamnative_cloud_sink" />|
|Kinesis Data Streams|Available. See [Ingest data from Kinesis](/ingest/ingest-from-kinesis.md) for details.|Available. See [Sink data to Kinesis](/guides/sink-to-aws-kinesis.md) for details.|
|NATS / NATS JetStream | Available. See [Ingest data from NATS JetStream](/ingest/ingest-from-nats.md) for details. | Available. See [Sink data to NATS](/guides/sink-to-nats.md) for details.|

## ETL/ELT and data integration

|System | |Availability |
|---|---|---|
|Airbyte | |Researching  <voteNotify note="airbyte" /> |
|[Census](https://www.getcensus.com/)||Researching  <voteNotify note="census" /> |
|dbt| |Available. For details, see [Use dbt for data transformations](/transform/use-dbt.md).|
|Fivetran| |Researching <voteNotify note="fivetran" /> |
|Hightouch| |Researching <voteNotify note="hightouch" />|
|Vector| |Available. |

## Query engines

|System | |Availability |
|---|---|---|
|Apache Spark| |Researching <voteNotify note="spark" />|
|AWS Athena| |Researching <voteNotify note="athena" />|
|Presto| |Researching <voteNotify note="presto" />|
|Trino| |Researching <voteNotify note="trino" />|
|GraphQL| |Available. See this blog for details: [Query real-time data with GraphQL, Kafka and RisingWave streaming database](https://blog.det.life/query-real-time-data-with-graphql-and-streaming-database-78bba4d08c97).|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details.| Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS RDS (Postgres)| Available. See [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details. |Available. See [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS Aurora (Postgres)| In progress <voteNotify note="aurora_pg_source" />|Researching <voteNotify note="aurora_pg_sink" />|
|Citus Data| Available. See [Ingest data from Citus CDC](/guides/ingest-from-citus-cdc.md). | Researching <voteNotify note="citus_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md).|
|AWS RDS (MySQL)|Available. See [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink data from RisingWave to MySQL](/guides/sink-to-mysql.md).|
|AWS Aurora (MySQL)|In progress <voteNotify note="aurora_mysql_source" />| Researching <voteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Apache Druid| No plan| Researching <voteNotify note="druid_sink" /> |
|Apache Pinot| No plan|Researching <voteNotify note="pinot_sink" />|
|AWS Redshift| No plan|Researching <voteNotify note="redshift_sink" />|
|ClickHouse|No plan |Available. For details, see [Sink data to ClickHouse](/guides/sink-to-clickhouse.md).|
|Snowflake| No plan|Researching <voteNotify note="snowflake_sink" />|
|Google BigQuery| No plan |Available. For details, see [Sink data to Google BigQuery](/guides/sink-to-bigquery.md).|
|DataStax Astra DB & Apache Cassandra & ScyllaDB| Researching <voteNotify note="cassandra_source" /> |Available. For details, see [Sink data to Cassandra or ScyllaDB](/guides/sink-to-cassandra.md).|
|CockroachDB| Researching <voteNotify note="cockroachdb_source" />|Available. For details, see [Sink data to CockroachDB](/guides/sink-to-clickhouse.md). |
|Db2| Researching <voteNotify note="db2_source" />|Researching <voteNotify note="db2_sink" /> |
|MongoDB| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).|Researching <voteNotify note="mongodb_sink" /> |
|Oracle Database| Researching <voteNotify note="oracle_source" />|Researching <voteNotify note="oracle_sink" /> |
|SQL Server| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).|Researching <voteNotify note="sql_server_sink" /> |
|TiDB| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).|Available. For details, see [Sink data from RisingWave to TiDB](/guides/sink-to-tidb.md). |
|Redis|Researching <voteNotify note="redis_source" />|Available. For details, see [Sink data from RisingWave to Redis](/guides/sink-to-redis.md).|
|Greenplum| No plan| Researching <voteNotify note="greenplum_sink" /> |
|Elasticsearch| No plan| Available. Only versions 7.x and 8.x are supported. For details, see [Sink data from RisingWave to Elasticsearch](/guides/sink-to-elasticsearch.md).|

## Data lakes

|System | |Availability |
|---|---|---|
|Delta Lake| |Available. See [Sink data from RisingWave to Delta Lake](/guides/sink-to-delta-lake.md)|
|Apache Hudi| |Researching <voteNotify note="hudi" />|
|Apache Iceberg| |Available. For details, see [Sink data from RisingWave to Apache Iceberg](/guides/sink-to-iceberg.md).|

## BI and data analytic platforms

|System ||Availability |
|---|-|--|
|Apache Superset| |Available. See [Visualize RisingWave data in Superset](/guides/superset-integration.md) for details. |
|Beekeeper Studio| |Available. See [Connect Beekeeper Studio to RisingWave](/guides/beekeeper-integration.md) for details. |
|Bytebase| | Available. See [Supported databases](https://www.bytebase.com/docs/introduction/supported-databases/) for details. |
|Cube.js| | Researching <voteNotify note="cubejs" />|
|DBeaver| | Available. See [Connect DBeaver to RisingWave](/guides/dbeaver-integration.md) for details. |
|Grafana| |Available. See [Visualize RisingWave data in Grafana](/guides/grafana-integration.md) for details.|
|Jupyter Notebook||Researching <voteNotify note="jupyter" />|
|Looker||Available. See [Connect Looker to RisingWave](/guides/looker-integration.md) for details. |
|Metabase ||Available. See [Connect Metabase to RisingWave](/guides/metabsase-integration.md) for details.|
|Redash || Available |
|DataGrip | |Researching <voteNotify note="datagrip" /> |
|PgAdmin | |Researching <voteNotify note="pgadmin" /> |

## Other systems

|System | |Availability |
|---|---|---|
|Alluxio| |Researching <voteNotify note="alluxio" />|
|Google Cloud Storage (GCS)| | Available as source. For details, see [Ingest data from Google Cloud Storage](/ingest/ingest-from-gcs.md).|
|Supabase| |Available. For details, see [Empower Supabase with stream processing capabilities](/guides/supabase-integration.md).|
