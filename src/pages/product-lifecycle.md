---
id: product-lifecycle
title: Product lifecycle
description: RisingWave's product release lifecycle and how RisingWave defines each stage.
slug: /product-lifecycle
---

This page lists RisingWave's product release lifecycle, how RisingWave defines each stage, and a complete list of all features in the public preview stage.

## Product release lifecycle

In RisingWave, the release of product typically follows three main stages:

1. **Technical preview**: The technical preview stage is where we release a new feature for testing and feedback. It's not fully polished or finalized and is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

2. **Public preview**: The public preview stage is where we've incorporated feedback from the technical preview and are nearing the final product. It's more stable than the technical preview, but there may still be some bugs and issues. During this stage, the corresponding guides are available in the official documentation for your reference. For the overview of all such features, see the list below.

3. **General availability (GA)**: All other features are considered to be generally available. The general availability stage is where the feature is fully developed, tested, and ready for use in production environments.

## Features in the public preview stage

As introduced above, when you see a "Public preview" note in the documentation, it indicates that a feature has not yet achieved 100% stability. We recommend evaluating the feature according to your specific use case. If you encounter any issues with the feature, please contact us via our [Slack channel](https://www.risingwave.com/slack). We also welcome any of your feedback to help us improve it. 

Below is a list of all features in the public preview phase:

| Feature name            | Start date | Start version |
|---------------------------|------------|---------------|
| [Native map data](/docs/next/supported-sources-and-formats/#native-map-type)|2024.8|2.0|
| [Azure Blob sink](/docs/next/sink-to-azure-blob)|2024.8|2.0|
| [Approx percentile](/docs/next/sql-function-aggregate/#approx_percentile) | 2024.8     | 2.0           |
| [Auto schema change in MySQL CDC](/docs/next/ingest-from-mysql-cdc/#automatically-change-schema) | 2024.8     | 2.0           |
| [SQL Server CDC source](/docs/next/ingest-from-sqlserver-cdc/) | 2024.8    | 2.0         |
| [Sink data in parquet format](/docs/next/data-delivery/#sink-data-in-parquet-format) | 2024.8     | 2.0           |
| [Time travel queries](/docs/next/time-travel-queries/)         | 2024.7    | 2.0         |
| [Manage secrets](/docs/next/manage-secrets/)                   | 2024.7    | 2.0         |
| [Amazon DynamoDB sink](/docs/next/sink-to-dynamodb/)           | 2024.6    | 1.10        |
| Auto-map upstream table schema in [MySQL CDC](/docs/next/ingest-from-mysql-cdc/#automatically-map-upstream-table-schema) and [PostgreSQL CDC](/docs/next/ingest-from-postgres-cdc/#automatically-map-upstream-table-schema) | 2024.6     | 1.10          |
| [Version column](/docs/next/sql-create-table/)                | 2024.6  | 1.9      |
| [Snowflake sink](/docs/next/sink-to-snowflake/)                | 2024.5    | 1.9         |
| [Subscription](/docs/next/subscription)                        | 2024.5    | 1.9         |
| [`schema.registry.name.strategy`](/docs/next/supported-sources-and-formats/) | 2024.4  | 1.8      |
| [RisingWave as PostgreSQL FDW](/docs/next/risingwave-as-postgres-fdw/) | 2024.4  | 1.9      |
| [Iceberg source](/docs/next/ingest-from-iceberg/)             | 2024.3  | 1.8     |
| [Google BigQuery sink](/docs/next/sink-to-bigquery/)           | 2023.11   | 1.4         |
| [SET BACKGROUND_DDL command](/docs/next/sql-set-background-ddl/) | 2023.10  | 1.3      |
| [Decouple sinks](/docs/next/data-delivery/#sink-decoupling)    | 2023.10   | 1.3         |
| [Pulsar sink](/docs/next/sink-to-pulsar/)                     | 2023.10  | 1.3     |
| [Cassandra sink](/docs/next/sink-to-cassandra/)               | 2023.9 | 1.2     |
| [Elasticsearch sink](/docs/next/sink-to-elasticsearch/)       | 2023.9 | 1.2      |
| [NATS sink](/docs/next/sink-to-nats/)                         | 2023.9  | 1.2      |
| [NATS source](/docs/next/ingest-from-nats/)                   | 2023.9  | 1.2      |
| [Append-only tables](/docs/next/sql-create-table/)            | 2023.8  | 1.1      |
| [Emit on window close](/docs/next/emit-on-window-close/)      | 2023.8  | 1.1      |
| [Read-only transactions](/docs/next/sql-start-transaction)| 2023.8  | 1.1      |
| [AWS Kinesis sink](/docs/next/sink-to-aws-kinesis/)           | 2023.7  | 1.0     |
| [AWS PrivateLink connection](/docs/next/sql-create-connection/) | 2023.5  | 0.19     |
| [CDC Citus source](/docs/next/ingest-from-citus-cdc/)         | 2023.5  | 0.19     |
| [Iceberg sink](/docs/next/sink-to-iceberg/)                   | 2023.4 | 0.18      |
| [Pulsar source](/docs/next/ingest-from-pulsar/)               | 2022.12  | 0.1     |

This table will be updated regularly to reflect the latest status of features as they progress through the release stages.
