---
id: rw-premium-edition-intro
title: RisingWave Premium Edition
description: Introduction of RisingWave Premium Edition and a complete list of premium features.
slug: /rw-premium-edition-intro
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-premium-edition-intro/" />
</head>

This topic introduces the RisingWave Premium Edition and offers a complete list of all premium features.

## What is RisingWave Premium?

The RisingWave Premium Edition is a feature-rich paid offering built on top of the open-source RisingWave Community Edition that is available from RisingWave v2.0. Designed for enterprises and organizations with mission-critical data infrastructure needs, the Premium Edition provides a suite of enterprise-grade capabilities to help users maximize the benefits of their RisingWave deployments.

While the Premium Edition is a paid offering, it is designed to complement and enhance the open-source RisingWave Community Edition. The Community Edition will continue to be freely available under the Apache License (Version 2.0), and we remain committed to supporting the needs of our open-source community and ecosystem.

Both the RisingWave Community Edition and Premium Edition share the same underlying binary or container image. However, the Premium Edition features are only available to users who have purchased a license. This is managed by a dedicated license system maintained by the RisingWave team.

## Premium features

RisingWave Premium 1.0 is the first major release of this new edition with several high-impact features planned. The following is the initial list of premium features, which we have targeted "Premium Edition Feature" note in the documentation.

### SQL and security

- [Time travel queries](/transform/time-travel-query.md)

- [Secret management](/deploy/manage-secrets.md)

### Schema management

- Automatic schema mapping to the source tables

- Automatic schema change for MySQL CDC

- [AWS Glue Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-aws-glue-schema-registry)

### Connectors

- [Direct SQL Server CDC source connector](/guides/ingest-from-sqlserver-cdc.md)

- Sink to Azure SQL Database

- Sink to Snowflake

- Sink to OpenSearch

- Sink to BigQuery

- Sink to ClickHouse with SharedMergeTree engine

- Sink to Iceberg with glue catalog

### Others

- [Terraform provider support](https://github.com/risingwavelabs/terraform-provider-risingwavecloud)

For users who are already using these features in 1.9.x or earlier versions, rest assured that the functionality of these features will be intact if you stay on the version. If you choose to upgrade to v2.0 or later versions, an error will show up to indicate you need a license to use the features.


## Support

RisingWave Premium edition offers the premium support:

| Support feature             | Standard            | Premium            |
|-----------------------------|---------------------|--------------------|
| Service hours               | 12x5                | 24x7               |
| Response time               | Critical - 4 hours  | Critical - 1 hour  |
|                             | High - 12 hours     | High - 4 hours     |
|                             | Medium - 24 hours   | Medium - 12 hours  |
|                             | Low - 48 hours      | Low - 24 hours     |
| Dedicated Slack channel      | No                  | Yes                |
| Max technical contacts      | 2                   | 8                  |
| Named support engineer      | No                  | Yes                |
| Solution engineer access    | 2 hours per month   | 8 hours per month  |


## Pricing

Pricing for RisingWave Premium will be based on the cluster size, measured in RisingWave Units (RWUs). The number of RWUs will be determined based on the scale of data ingestion, number of streaming jobs, the complexity of use case. There could be additional factors as well. Detailed pricing will be provided by the sales team. Please contact our sales at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com) for more details.