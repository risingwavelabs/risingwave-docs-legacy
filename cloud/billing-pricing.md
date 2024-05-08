---
id: billing-pricing
title: Pricing
description: Pricing of RisingWave Cloud services.
slug: /pricing
---

RisingWave Cloud offers a flexible pricing model based on your usage and the resources consumed within your organization. This guide will help you understand how the pricing works in RisingWave Cloud.

## Pricing model

RisingWave Cloud charges the cost of each cluster individually. The pricing model of each cluster varies depending on its plan.

| Plan | Pricing model | Pricing precision |
| --- | --- | --- |
| [Developer](#developer-plan) | Fixed price | Daily basis |
| [Pro](#pro-plan) | Pay-as-you-go | 30-second basis |
| [Enterprise](#enterprise-plan) | Contact sales | Contact sales |

### Developer plan

The Developer plan offers a fixed-price model. After a 7-day trial period, each developer cluster is charged at a flat rate of $99 per month, with no storage or other costs, irrespective of your region.

#### Pro-rated daily charges

If you initiate, stop, or delete a Developer cluster mid-month, daily charges apply. The Developer plan would incur a daily charge of $3.3 in a 30-day month. Daily charges are calculated by dividing the monthly fee by the number of days in the month:

| Month | Price |
| --- | --- |
| January | $3.19/day |
| February (non-leap year) | $3.54/day |
| February (leap year) | $3.41/day |
| March | $3.19/day |
| April | $3.3/day |
| May | $3.19/day |
| June | $3.3/day |
| July | $3.19/day |
| August | $3.19/day |
| September | $3.3/day |
| October | $3.19/day |
| November | $3.3/day |
| December | $3.19/day |

### Pro plan

The Pro plan operates on a pay-as-you-go model. You only pay for your actual usage, which includes compute resources and storage capacity.

- **Compute resources**: Compute resources are measured in RisingWave Unit (RWU) hours used across all clusters in the organization. See the [explanation of RWU](#risingwave-unit-rwu) below. In each RisingWave cluster, the usages are tracked for all five components:

    - Compute node
    - Frontend node
    - Meta node
    - Compactor node
    - ETCD

    For detailed information on each node, see [Understanding nodes in RisingWave](/cluster-choose-a-cluster-plan.md#understanding-nodes-in-risingwave).

- **Storage capacity**: RisingWave Cloud bills the storage in per GB-month increments at a second rate. You pay for the storage capacity of the data your RisingWave cluster persisted during stream processing, such as tables, materialized views, and internal states.

See the [pricing information](#pricing-information) below for the cost of compute resources and storage capacity in different regions.

### Enterprise plan

The Enterprise plan offers a customized pricing model based on your specific needs. Unlike other plans, the billing details for enterprise clusters aren't directly displayed in the billing system. The usage for enterprise clusters is monitored in the backend and your invoices are generated based on a customized base price. While the pricing model aligns with the Pro plan, we provide a custom offer to match your specific needs. Please reach out to our sales for your customized offer.

## RisingWave Unit (RWU)

In RisingWave Cloud, the primary unit of computational resource allocation and pricing is the RisingWave Unit (RWU). An RWU is a pre-allocated bundle of computational resources, specifically designed to facilitate horizontal scalability in your data processing operations.

Each RWU is composed of approximately 1-core vCPU and 4 GB of memory. This allocation allows for efficient resource management and cost-effective scalability.

Billing for all components within a RisingWave cluster is based on RWU-hour usage. This means that possessing one RWU for one hour equates to 1 RWU-hour.

## Pricing information

For detailed pricing information on the compute resources and storage capacity for the Pro plan and Enterprise plan in different regions, please contact our sales team.

## Pricing example

To better understand how pricing works in RisingWave Cloud, let's consider a hypothetical scenario.

Suppose you've provisioned a RisingWave cluster with the following configuration:

- 3 Compute nodes, each with 8 RWUs
- 3 Frontend nodes, each with 2 RWUs
- 1 Meta node with 4 RWUs
- 1 Compactor node with 4 RWUs
- 3 ETCD nodes, each with 1 RWU

In total, the cluster utilizes 41 RWUs and stores 20GB of data. The cluster operated for 700 hours in the past month.

Suppose the base price for your region is $0.18 per RWU-hour for compute resources and $0.023 per GB-month for storage capacities.

Given these details, your bill for this cluster for the past month will be calculated as follows:

- Compute resources cost: $0.18 \* 41 RWUs \* 700 hours = $5166
- Storage capacity cost: $0.023 * 20GB = $0.46

Therefore, the total cost for this example would be $5166.46.
