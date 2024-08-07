---
id: project-scale-a-project-manually
title: Scale a project manually
description: Manually scale a project by adding or removing nodes.
slug: /scale-a-project-manually
---

After creating a project, you have the flexibility to scale its resources and capacity to meet your specific data processing and analysis needs. This can be achieved through two methods: increasing or decreasing the number of worker nodes (horizontal scaling) or adjusting the resource capacity of each node in the project (vertical scaling).

:::note
You can scale the projects created in the Standard plan and the Advanced plan. The Trial plan has a fixed number of nodes and resources.
:::

## Scale your project

To scale your project:

1. Navigate to the project details page.

2. Click **Configuration details** > **Re-scale** to access the scaling options.

## Configure node resources

When scaling, you will configure the vCPU numbers for each component, with the memory size automatically scaling at a 1:4 ratio with the vCPUs. The [RWU](/billing-pricing.md#risingwave-unit-rwu) numbers are calculated based on the vCPU and memory size.

- **Compute node**
    - RWU options: 2, 4, 8, 16
    - You can have between 1 to 5 compute nodes in a project.
- **Frontend node**
    - RWU options: 1, 2, 4
    - You can have between 1 to 5 frontend nodes in a project.
- **Meta node**
    - RWU options: 1, 2, 4, 8, 16
    - Only one meta node is allowed per project.
- **Compactor node**
    - RWU options: 1, 2, 4, 8, 16
    - You can have up to 2 compactor nodes in a project.

For detailed information on each node, see [Understanding nodes in RisingWave](/project-choose-a-project-plan.md#understanding-nodes-in-risingwave).

## Pricing

For information on how scaling impacts pricing, see [Pricing](/billing-pricing.md).