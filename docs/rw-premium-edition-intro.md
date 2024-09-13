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

- Automatic schema mapping to the source tables for [PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md#automatically-map-upstream-table-schema) and [MySQL CDC](/guides/ingest-from-mysql-cdc.md#automatically-map-upstream-table-schema)

- [Automatic schema change for MySQL CDC](/guides/ingest-from-mysql-cdc.md#automatically-change-schema)

- [AWS Glue Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-aws-glue-schema-registry)

### Connectors

- [Sink to Snowflake](/guides/sink-to-snowflake.md)

- [Sink to DynamoDB](/guides/sink-to-dynamodb.md)

- [Sink to OpenSearch](/guides/sink-to-opensearch.md)

- [Sink to BigQuery](/guides/sink-to-bigquery.md)

- Sink to Shared tree on ClickHouse Cloud

- [Sink to SQL Server](/guides/sink-to-sqlserver.md)

- [Direct SQL Server CDC source connector](/guides/ingest-from-sqlserver-cdc.md)

- [Sink to Iceberg with glue catalog](/guides/sink-to-iceberg.md#glue-catelogs)

For users who are already using these features in 1.9.x or earlier versions, rest assured that the functionality of these features will be intact if you stay on the version. If you choose to upgrade to v2.0 or later versions, an error will show up to indicate you need a license to use the features.

## License key management

The Premium Edition features are only available to users who have purchased a license. The license key, essentially a certificate, is a JSON Web Token (JWT) that encodes information such as the license tier and expiration time. The integrity of the license key is validated using asymmetric encryption.

### Set license key

The license key is treated as a system parameter and can be set in two primary ways:

1. Before launching a new cluster:

    - Through the `system.license_key` in the TOML configuration file
    - Using the `RW_LICENSE_KEY` environment variable

2. After the cluster is initialized, through the SQL interface with the command:

    ```sql
    ALTER SYSTEM SET license_key TO '...';
    ```

### Verify license key

To check the validity of the license key, execute the SQL function:

```sql
SELECT rw_test_paid_tier();
```

If the license key is valid, the result will be `t` (true); if invalid, the function will return an error.

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

Pricing for RisingWave Premium will be based on the cluster size, measured in RisingWave Units (RWUs). The number of RWUs will be determined based on the scale of data ingestion, number of streaming jobs, the complexity of use case. There could be additional factors as well. Please contact our sales at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com) for more details.