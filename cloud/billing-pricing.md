---
id: billing-pricing
title: Pricing
description: Pricing of RisingWave Cloud services.
slug: /pricing
---

RisingWave Cloud offers a flexible pricing model based on your usage and the resources consumed within your organization. This guide will help you understand how the pricing works in RisingWave Cloud.

## Pricing model

RisingWave Cloud charges the cost of each project individually. The pricing model of each project varies depending on its plan.

| Plan | Pricing model | Pricing precision |
| --- | --- | --- |
| [Trial](#trial-plan) | Free | / |
| [Standard](#standard-plan) | Pay-as-you-go | 30-second basis |
| [Advanced](#advanced-plan) | Contact sales | Contact sales |

### Trial plan

The Trial plan is offered for free. This plan equips you with all the essential resources needed to test and experience the features offered by RisingWave.

### Standard plan

The Standard plan operates on a pay-as-you-go model. You only pay for your actual usage, which includes compute resources and storage capacity.

- **Compute resources**: Compute resources are measured in RisingWave Unit (RWU) hours used across all projects in the organization. See the [explanation of RWU](#risingwave-unit-rwu) below. In each RisingWave project, the usages are tracked for all five components:

    - Compute node
    - Frontend node
    - Meta node
    - Compactor node
    - ETCD

    For detailed information on each node, see [Understanding nodes in RisingWave](/project-choose-a-project-plan.md#understanding-nodes-in-risingwave).

- **Storage capacity**: RisingWave Cloud bills the storage in per GB-month increments at a second rate. You pay for the storage capacity of the data your RisingWave project persisted during stream processing, such as tables, materialized views, and internal states.

See the [pricing information](#pricing-information) below for the cost of compute resources and storage capacity in different regions.

### Advanced plan

The Advanced plan offers a customized pricing model based on your specific needs. Unlike other plans, the billing details for Advanced projects aren't directly displayed in the billing system. The usage for Advanced projects is monitored in the backend and your invoices are generated based on a customized base price. While the pricing model aligns with the Standard plan, we provide a custom offer to match your specific needs. Please reach out to our sales for your customized offer.

## RisingWave Unit (RWU)

In RisingWave Cloud, the primary unit of computational resource allocation and pricing is the RisingWave Unit (RWU). An RWU is a pre-allocated bundle of computational resources, specifically designed to facilitate horizontal scalability in your data processing operations.

Each RWU is composed of approximately 1-core vCPU and 4 GB of memory. This allocation allows for efficient resource management and cost-effective scalability.

Billing for all components within a RisingWave project is based on RWU-hour usage. This means that possessing one RWU for one hour equates to 1 RWU-hour.

## Pricing information

For detailed pricing information on the compute resources and storage capacity for the Standard plan and Advanced plan in different regions, please contact our sales team.

## Pricing example

To better understand how pricing works in RisingWave Cloud, let's consider a hypothetical scenario.

Suppose you've provisioned a RisingWave project with the following configuration:

- 3 Compute nodes, each with 8 RWUs
- 3 Frontend nodes, each with 2 RWUs
- 1 Meta node with 4 RWUs
- 1 Compactor node with 4 RWUs
- 3 ETCD nodes, each with 1 RWU

In total, the project utilizes 41 RWUs and stores 20GB of data. The project operated for 700 hours in the past month.

Suppose the base price for your region is $0.18 per RWU-hour for compute resources and $0.023 per GB-month for storage capacities.

Given these details, your bill for this project for the past month will be calculated as follows:

- Compute resources cost: $0.18 \* 41 RWUs \* 700 hours = $5166
- Storage capacity cost: $0.023 * 20GB = $0.46

Therefore, the total cost for this example would be $5166.46.
