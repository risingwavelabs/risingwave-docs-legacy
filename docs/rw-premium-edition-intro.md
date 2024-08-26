---
id: rw-premium-edition-intro
title: RisingWave Premium introduction
description: Introduction of RisingWave Premium and a complete list of premium features.
slug: /rw-premium-edition-intro
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-premium-edition-intro/" />
</head>

This topic introduces the RisingWave Premium edition and offers a complete list of all premium features.

## What is RisingWave Premium?

RisingWave Premium is a new edition from RisingWave Labs, tailored for enterprises with unique requirements that surpass typical stream processing workloads. This premium service combines new advanced features with the same user-friendly experience.

By this edition, we aim to provide a seamless transition for businesses self-hosting. Our comprehensive tools and premium support ensure you can confidently move your workloads to production.

## Complete list of premium features

RisingWave Premium 1.0 is the first major release of this new edition with several high-impact features planned. The following is the initial list of premium features, which we have targeted "Premium Edition Feature" note in the documentation.

### Schema management

- Automatic schema mapping to the source tables

- Automatic schema change from upstream

- [Support AWS Glue Schema Registry](/ingest/ingest-from-kafka.md#read-schemas-from-aws-glue-schema-registry)

- Seamless integration with Pulsar source

- Automatic Pulsar catalog mapping

- Auto-register Kafka sink schemas on schema registry

- Iceberg sink with glue catalog

### Source and sink connectors

- Direct Oracle CDC

- [Direct SQL Server CDC](/guides/ingest-from-sqlserver-cdc.md)

- Sink to Oracle

- Sink to Azure SQL database

- Google Pub/Sub Sink

- Sink into Snowflake

- Redshift Sink

- Sink to Rockset

- Sink to DynamoDB

### UDF and language enhancements

- Built-in UDFs

- Unlimited number of embedded JS, WASM, or Python UDFs

### Maintenance and operation

- [Manage user credentials like secrets](/deploy/manage-secrets.md)

- New Grafana template for Observability

- [Terraform provider support](https://github.com/risingwavelabs/terraform-provider-risingwavecloud)

- Automatic (Serverless) scaling on streaming jobs
  - Based on workload metrics
  - Based on time-range schedules

- Automatic scaling on backfilling jobs

- Automatic scaling on compaction jobs

- [VPC Private link](/cloud/create-a-connection/)

- Backup/Restore

Our premium features will expand over time. Customers can shape our roadmap through monthly success reviews.

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



## Licensing

RisingWave Premium maintains the Apache 2 license of the source code. All feature development will remain in the same open repository. However, we'll offer two binary sets:

- **RisingWave Open Source**: The original edition, without access to premium features.

- **RisingWave Premium**: Full access to all premium features via a license key.

## Pricing

Pricing for RisingWave Premium will be based on the cluster size, measured in RisingWave Units (RWUs). The number of RWUs will be determined based on the scale of data ingestion, number of streaming jobs, the complexity of use case. There could be additional factors as well. Detailed pricing will be provided by the sales team. Please contact our sales at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com) for more details.