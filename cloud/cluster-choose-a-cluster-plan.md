---
id: cluster-choose-a-cluster-plan
title: Choose a cluster plan
description: Choose a plan when you create a cluster.
slug: /choose-a-cluster-plan
---

You can choose a cluster plan and configure cluster resources according to your needs when creating a cluster.

Select the plan below to see the details.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="free" label="Free tier">

The free-tier plan provides all the necessary resources for you to test and explore all the features of RisingWave Cloud — at no cost.

:::caution
Clusters created under the free-tier plan will expire after seven days, and your data will be kept for an additional seven days. If you want to get a backup of your data, please contact us at cloud-support@risingwave-labs.com.

DO NOT choose this plan for production.
:::

#### Configuration

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

- **Region**

    Regions are isolated from each other.

</TabItem>

<TabItem value="customized" label="Customized plan">

If you signed up for early access and received an invitation code, you can select the **Customized plan for invited users**. Redeem your invitation code to continue.

The customized plan offers the flexibility of configuring the resources to better suit your demand.


#### Configuration

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

- **Region**

    Regions are isolated from each other.

- **Configure nodes**

    Configure the instance resources and numbers of each node according to your actual needs.
    
    To learn more about the nodes, see the [architecture of RisingWave Database](https://www.risingwave.dev/docs/current/architecture/).

</TabItem>

</Tabs>