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

The following is a list of all features in the public preview phase:

| Feature name            | Start date | Start version |
|---------------------------|------------|---------------|
| [Decouple sinks](/docs/next/data-delivery/#sink-decoupling)    | 2023.10   | 1.3         |
| [Google BigQuery sink](/docs/next/sink-to-bigquery/)           | 2023.11   | 1.4         |
| [Subscription](/docs/next/subscription)                        | 2024.5    | 1.9         |
| [Snowflake sink](/docs/next/sink-to-snowflake/)                | 2024.5    | 1.9         |
| [MySQL CDC source (Auto-map schema)](/docs/next/ingest-from-mysql-cdc/#automatically-map-upstream-table-schema) | 2024.6     | 1.10          |
| [Amazon DynamoDB sink](/docs/next/sink-to-dynamodb/)           | 2024.6    | 1.10        |
| [Time travel queries](/docs/next/time-travel-queries/)         | 2024.7    | 2.0         |
| [Manage secrets](/docs/next/manage-secrets/)                   | 2024.7    | 2.0         |
| [SQL Server CDC source](/docs/next/ingest-from-sqlserver-cdc/) | 2024.8    | 2.0         |
| [MySQL CDC source (Auto schema change)](/docs/next/ingest-from-mysql-cdc/#automatically-change-schema) | 2024.8     | 2.0           |


This table will be updated regularly to reflect the latest status of features as they progress through the release stages.