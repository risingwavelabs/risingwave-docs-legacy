---
id: cluster-scale-a-cluster-manually
title: Scale a cluster manually
description: Manually scale a cluster by adding or removing nodes.
slug: /scale-a-cluster-manually
---

After creating a cluster, you have the flexibility to scale its resources and capacity to meet your specific data processing and analysis needs. This can be achieved through two methods: increasing or decreasing the number of worker nodes (horizontal scaling) or adjusting the resource capacity of each node in the cluster (vertical scaling).

:::note
You can scale the clusters created in the Standard plan and the Invited plan. The Developer plan has a fixed number of nodes and resources.
:::

## Scaling your cluster

To scale your cluster:

1. Navigate to the cluster details page.
2. Click **Edit engine specs** to access the scaling options.

<img
   src={require('./images/cluster-edit-spec.png').default}
   alt="Edit engine specs"
   width="300"
/>

## Configuring node resources

When scaling, you will configure the vCPU numbers for each component, with the memory size automatically scaling at a 1:4 ratio with the vCPUs. The [RWU](/cloud/billing-pricing.md#risingwave-unit-rwu) numbers are calculated based on the vCPU and memory size.

<img
   src={require('./images/cluster-edit-spec-page.png').default}
   alt="Edit engine specs page"
   width="600"
/>

- **Compute node**
    - RWU options: 2, 4, 8, 16
    - You can have between 1 to 5 compute nodes in a cluster.
- **Frontend node**
    - RWU options: 1, 2, 4
    - You can have between 1 to 5 frontend nodes in a cluster.
- **Meta node**
    - RWU options: 1, 2, 4, 8, 16
    - Only one meta node is allowed per cluster.
- **Compactor node**
    - RWU options: 1, 2, 4, 8, 16
    - You can have up to 2 compactor nodes in a cluster.

For detailed information on each node, see [Understanding nodes in RisingWave](/cloud/cluster-choose-a-cluster-plan.md#understanding-nodes-in-risingwave).

## Pricing

For information on how scaling impacts pricing, see [Pricing](/cloud/billing-pricing.md).