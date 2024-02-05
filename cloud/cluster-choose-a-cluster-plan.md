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

<Tabs queryString="plan">

<TabItem value="free" label="Free plan">

The Free plan provides all the necessary resources to test and explore all RisingWave Cloud's features — at no cost.

You can create up to three clusters with the free plan in your account.

:::caution
Clusters created under the Free plan will expire after seven days, and your data will be kept for an additional seven days. If you want to get a backup of your data, please contact us at cloud-support@risingwave-labs.com.

DO NOT choose this plan for production.
:::

#### **Configuration**

- **Cloud platform**
  
    You can deploy your cluster on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

</TabItem>

<TabItem value="customized" label="Customized plan">

If you signed up for early access and received an invitation code, you can select the **Customized plan for invited users**. Redeem your invitation code to continue.

The customized plan offers the flexibility of configuring the resources to better suit your demand.


#### **Configuration**

- **Cloud platform**
  
    You can deploy your cluster on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

- **Node configuration**

    Configure each node's instance resources and numbers according to your actual needs.
    
    To learn more about the nodes, see the [architecture of RisingWave](/docs/current/architecture).

</TabItem>

</Tabs>