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

However, with limited resources, we cannot achieve this goal in a short period. If a connector or integration is crucial to you but has not been supported, please let us know in the [RisingWave Slack workspace](https://www.risingwave.com/slack), or by clicking the thumb-up icon in the corresponding cell on this page. We will prioritize the development based on the number of requests for each system.

If you wish to receive notifications when a connector or integration is available, you can click the small bell icon to enter your email address.

For tools or integrations that you would like to use but are not listed in the tables below, you can [submit a feature request](https://github.com/risingwavelabs/risingwave/issues/new?assignees=&labels=type%2Ffeature&template=feature_request.yml), or let us know in the Slack workspace.

:::note Note about sink status

RisingWave can sink data to Kafka. This allows indirectly sinking data to any system that can ingest from Kafka. The tables below show the direct sink status:

"Available" means a direct sink connector exists for that system.

"Researching" means no direct sink yet, but the system can still be used if it can ingest from Kafka.

:::

## Message brokers or streaming services

|Broker or streaming service| Source | Sink |
|---|---|---|
|Apache Kafka | Available. See [Ingest from Kafka](/ingest/ingest-from-kafka.md) for details. | Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.| |
| Amazon MSK | Available. See [Ingest from Amazon MSK](/guides/connector-amazon-msk.md) for details. | |
|Apache Pulsar|Available. See [Ingest from Pulsar](/ingest/ingest-from-pulsar.md) for details. | Available. See [Sink to Pulsar](/guides/sink-to-pulsar.md) for details.|
| Confluent Cloud | Available. See [Ingest from Confluent Cloud](/guides/confluent-kafka-source.md) for details. | |
|DataStax Astra Streaming| Available. See [Ingest data from DataStax Astra Streaming](/guides/connector-astra-streaming.md) for details. | Researching <voteNotify note="astra_streaming_sink" />|
|EMQX|Available. See [Ingest from MQTT brokers](/ingest/ingest-from-mqtt.md) for details.| Available. See [Sink to MQTT brokers](/guides/sink-to-mqtt.md) for details. |
|Google Pub/Sub|Available. See [Ingest from Google Pub/Sub](/ingest/ingest-from-google-pubsub.md) for details.| Available. See [Sink to Google Pub/Sub](/guides/sink-to-google-pubsub.md) for details. |
|HiveMQ|Available. See [Ingest from MQTT brokers](/ingest/ingest-from-mqtt.md) for details.| Available. See [Sink to MQTT brokers](/guides/sink-to-mqtt.md) for details. |
|Kinesis Data Streams|Available. See [Ingest from Kinesis](/ingest/ingest-from-kinesis.md) for details.|Available. See [Sink to Kinesis](/guides/sink-to-aws-kinesis.md) for details.|
|RabbitMQ|Researching <voteNotify note="rabbitmq_source" />|Researching <voteNotify note="rabbitmq_sink" />|
|Redpanda | Available. See [Ingest from Redpanda](/ingest/ingest-from-redpanda.md) for details. |Available. See [Sink to Kafka](/guides/create-sink-kafka.md) for details.|
|StreamNative Cloud| Available| Researching <voteNotify note="streamnative_cloud_sink" />|
|NATS / NATS JetStream | Available. See [Ingest from NATS JetStream](/ingest/ingest-from-nats.md) for details. | Available. See [Sink to NATS](/guides/sink-to-nats.md) for details.|

## ETL/ELT and data integration

|System | |Availability |
|---|---|---|
|Airbyte | |Researching  <voteNotify note="airbyte" /> |
|[Census](https://www.getcensus.com/)||Researching  <voteNotify note="census" /> |
|dbt| |Available. For details, see [Use dbt for data transformations](/transform/use-dbt.md).|
|Fivetran| |Researching <voteNotify note="fivetran" /> |
|Hightouch| |Researching <voteNotify note="hightouch" />|
|Vector| |Available. |
|migrate| |Available. `migrate` is a powerful tool written in Go for managing database migrations. For details, see [its introduction and tutorial](https://github.com/risingwavelabs/migrate?tab=readme-ov-file).|

## Query engines

|System | |Availability |
|---|---|---|
|Apache Spark| |Researching <voteNotify note="spark" />|
|AWS Athena| |Researching <voteNotify note="athena" />|
|Presto| |Available. See [Presto documentation](https://prestodb.io/docs/current/connector/postgresql.html).|
|Trino| |Available. See [Trino documentation](https://trino.io/docs/current/connector/postgresql.html).|
|GraphQL| |Available. See this blog for details: [Query real-time data with GraphQL, Kafka and RisingWave streaming database](https://blog.det.life/query-real-time-data-with-graphql-and-streaming-database-78bba4d08c97).|

## Databases

### PostgreSQL

|System | Source | Sink |
|---|---|----|
|Postgres| Available. See [Ingest from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details.| Available. See [Sink to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS RDS (Postgres)| Available. See [Ingest from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md) for details. |Available. See [Sink to PostgreSQL](/guides/sink-to-postgres.md) for details.|
|AWS Aurora (Postgres)| In progress <voteNotify note="aurora_pg_source" />|Researching <voteNotify note="aurora_pg_sink" />|
|Citus Data| Available. See [Ingest from Citus CDC](/guides/ingest-from-citus-cdc.md). | Researching <voteNotify note="citus_sink" />|
|Neon| Available. See [Ingest from Neon CDC](/guides/ingest-from-neon-cdc.md). | Researching <voteNotify note="neon_sink" />|

### MySQL

|System | Source | Sink |
|---|---|----|
|MySQL | Available. See [Ingest from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink to MySQL](/guides/sink-to-mysql.md).|
|AWS RDS (MySQL)|Available. See [Ingest from MySQL CDC](/guides/ingest-from-mysql-cdc.md) for details.| Available. See [Sink to MySQL](/guides/sink-to-mysql.md).|
|AWS Aurora (MySQL)|In progress <voteNotify note="aurora_mysql_source" />| Researching <voteNotify note="aurora_mysql_sink" /> |

### Other databases

|System | Source |Sink |
|---|---|---|
|Amazon DynamoDB| In progress <voteNotify note="amazon_dynamodb_source" />| Available. For details, see [Sink to DynamoDB](/guides/sink-to-dynamodb.md). |
|Apache Druid| No plan| Researching <voteNotify note="druid_sink" /> |
|Apache Pinot| No plan| Pinot supports ingesting data from Kafka, Pulsar, and Kinesis. To sink data from RisingWave to Pinot, you can use Kafka, Pulsar, or Kinesis as a sink, then ingest the data into Pinot. See [Sink Changes from RisingWave Tables to Apache Pinot](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests/pinot-sink) for a demo. |
|AWS Redshift| No plan|Researching <voteNotify note="redshift_sink" />|
|ClickHouse|No plan |Available. For details, see [Sink to ClickHouse](/guides/sink-to-clickhouse.md).|
|CockroachDB| Researching <voteNotify note="cockroachdb_source" />|Available. For details, see [Sink to CockroachDB](/guides/sink-to-clickhouse.md). |
|DataStax Astra DB & Apache Cassandra & ScyllaDB| Researching <voteNotify note="cassandra_source" /> |Available. For details, see [Sink to Cassandra or ScyllaDB](/guides/sink-to-cassandra.md).|
|Db2| Researching <voteNotify note="db2_source" />|Researching <voteNotify note="db2_sink" /> |
|Elasticsearch| No plan| Available. Only versions 7.x and 8.x are supported. For details, see [Sink to Elasticsearch](/guides/sink-to-elasticsearch.md).|
|Greenplum| No plan| Researching <voteNotify note="greenplum_sink" /> |
|Google BigQuery| No plan |Available. For details, see [Sink to Google BigQuery](/guides/sink-to-bigquery.md).|
|MongoDB| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).|Researching <voteNotify note="mongodb_sink" /> |
|Oracle Database| Researching <voteNotify note="oracle_source" />|Researching <voteNotify note="oracle_sink" /> |
|OpenSearch| No plan| Available. For details, see [Sink to OpenSearch](/guides/sink-to-opensearch.md). |
|Redis|Researching <voteNotify note="redis_source" />|Available. For details, see [Sink to Redis](/guides/sink-to-redis.md).|
|Snowflake| No plan|Available. For details, see [Sink data to Snowflake](/guides/sink-to-snowflake.md).|
|SQL Server| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).| Available. See [Sink to SQL Server](/guides/sink-to-sqlserver.md). |
|StarRocks| No plan | Available. For details, see [Sink data to StarRocks](/guides/sink-to-starrocks.md).|
|TiDB| Available. For details, see [CDC via event streaming systems](/ingest/ingest-from-cdc.md).|Available. For details, see [Sink to TiDB](/guides/sink-to-tidb.md). |

## Data lakes

|System | |Availability |
|---|---|---|
|Delta Lake| |Available. See [Sink to Delta Lake](/guides/sink-to-delta-lake.md)|
|Apache Hudi| |Researching <voteNotify note="hudi" />|
|Apache Iceberg| |Available. For details, see [Sink to Apache Iceberg](/guides/sink-to-iceberg.md).|

## BI and data analytic platforms

|System ||Availability |
|---|-|--|
|Apache Superset| |Available. See [Visualize RisingWave data in Superset](/guides/superset-integration.md) for details. |
|Beekeeper Studio| |Available. See [Connect Beekeeper Studio to RisingWave](/guides/beekeeper-integration.md) for details. |
|Bytebase| | Available. See [Supported databases](https://www.bytebase.com/docs/introduction/supported-databases/) for details. |
|Cube.js| | Available. See the [documentation of Cube](https://cube.dev/docs/product/configuration/data-sources/postgres) for details.|
|DBeaver| | Available. See [Connect DBeaver to RisingWave](/guides/dbeaver-integration.md) for details. |
|Grafana| |Available. See [Visualize RisingWave data in Grafana](/guides/grafana-integration.md) for details.|
|Jupyter Notebook||Available. For this integration, you can use a PostgreSQL Python driver, such as `psycopg2`, to connect to RisingWave. There is no difference from writing a normal python app. See [Use RisingWave in your Python application](/dev/python-client-libraries.md) for details.|
|Looker||Available. See [Connect Looker to RisingWave](/guides/looker-integration.md) for details. |
|Metabase ||Available. See [Connect Metabase to RisingWave](/guides/metabase-integration.md) for details.|
|Redash || Available |
|DataGrip | |Researching <voteNotify note="datagrip" /> |
|PgAdmin | |Researching <voteNotify note="pgadmin" /> |
|Hex | |Available. For this integration, you can directly use the [PostgreSQL data connection of Hex](https://learn.hex.tech/docs/connect-to-data/data-connections/data-connections-introduction).|

## Other systems

|System | |Availability |
|---|---|---|
|Alluxio| |Researching <voteNotify note="alluxio" />|
|Datadog| |Researching <voteNotify note="datadog" />|
|Google Cloud Storage (GCS)| | Available as source. For details, see [Ingest from Google Cloud Storage](/ingest/ingest-from-gcs.md).|
|Hasura| |Researching <voteNotify note="hasura" />|
|Liquibase| |Researching <voteNotify note="liquibase" />|
|Supabase| |Available. For details, see [Ingest data from Supabase CDC](/ingest/ingest-from-supabase-cdc.md) and [Sink data to Supabase](/guides/sink-to-supabase.md).|
