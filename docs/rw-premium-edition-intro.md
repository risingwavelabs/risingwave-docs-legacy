---
id: rw-premium-edition-intro
title: RisingWave Premium introduction
description: Introduction of RisingWave Premium and a complete list of premium features.
slug: /rw-premium-edition-intro
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-premium-edition-intro/" />
</head>

This topic introduce the RisingWave Premium edition and offer a complete list of all premium features.

## What is RisingWave Premium?

RisingWave Premium is a new edition from RisingWave Labs, tailored for enterprises with unique requirements that surpass typical stream processing workloads. This premium service combines new advanced features with the same user-friendly experience.

Our goal is to provide a seamless transition for businesses self-hosting, enabling them to confidently move their workloads to production with comprehensive tooling and premium support.

## Complete list of premium features

RisingWave Premium 1.0 is the first major release of this new edition with several high-impact features planned. The following is the initial list of premium features.

### Schema management

- Automatic schema mapping to the source tables

- Automatic schema change from upstream

- Support AWS Glue Schema Registry

- Seamless integration with Pulsar source

- Automatic Pulsar catalog mapping

- Auto-register Kafka sink schemas on schema registry

- Iceberg sink with glue catalog

### Source and sink connectors

- Direct Oracle CDC

- [Direct SQL Server CDC](/)

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

- Terraform provider support: [https://github.com/risingwavelabs/terraform-provider-risingwavecloud](https://github.com/risingwavelabs/terraform-provider-risingwavecloud)

- Automatic (Serverless) scaling on streaming jobs
  - Based on workload metrics
  - Based on time-range schedules

- Automatic scaling on backfilling jobs

- Automatic scaling on compaction jobs

- VPC Private link: [https://docs.risingwave.com/cloud/create-a-connection/](https://docs.risingwave.com/cloud/create-a-connection/)

- Backup/Restore

The premium feature set will grow over time. Meanwhile, customers will have the opportunity to influence our roadmap through monthly customer success reviews.

## Support

## Licensing

RisingWave Premium will not alter the source code licensing model. RisingWave will continue to keep Apache 2 license. All the feature development will occur in the same open repository. However, there will be two sets of binaries. Original edition will be released ‘RisingWave Open Source’, the new edition will be released as ‘RisingWave Premium’. The former will not have access to the features tagged as ‘Premium features’ while the latter will provide full access albeit using a license key.

## Pricing

Pricing for RisingWave Premium will be based on the Cluster size, measured in RisingWave Units (RWUs). The number of RWUs will be determined based on the scale of data ingestion, number of streaming jobs, the complexity of use case. There could be additional factors as well. Detailed pricing will be provided by the Sales team. Please contact sales@risingwave-labs.com for more 
details.