---
id: cluster-choose-a-cluster-plan
title: Choose a cluster plan
description: Choose a plan when you create a cluster.
slug: /choose-a-cluster-plan
---

RisingWave Cloud offers different types of RisingWave clusters. Each cluster type is associated with the corresponding features, capabilities, restrictions, and pricing models. Please choose a cluster plan and configure cluster resources according to your needs when creating a cluster. 

Currently, RisingWave Cloud offers three types of clusters: **Developer**, **Standard**, and **Invited**. The table below describes a high-level comparison of features and restrictions across three cluster types.

| Service type | Developer | Standard | Invited |
| --- | --- | --- | --- |
| Deployment type | Multi-tenancy deployment, single-node cluster | Multi-tenancy deployment, multi-node cluster | Multi-tenancy deployment, multi-node cluster |
| Description | Standalone deployment with 2-RWU resources.  | Deployed on shared Kubernetes service with customized resources.  | Customized cluster deployment based on requests |
| Pricing | $99/month after a 7-day trial | Pay-as-you-go | Customized, contact sales |
| Payment | Credit card | Credit card | Credit card, bank transfer, marketplace |
| Compute resource | 2 RWUs | Customized, up to 160 RWUs | Customized and unlimited resources |
| Cluster number | 3 | Unlimited | Unlimited |
| Monitoring | Yes | Yes | Yes |
| Query console | Yes | Yes | Yes |
| Source management | Yes | Yes | Yes |
| Sink management | Yes | Yes | Yes |
| VPC PrivateLink | No | Yes | Yes |

Select the plan below to see the details.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="plan">

<TabItem value="developer" label="Developer plan">

The **Developer** plan is designed for individual developers or small teams looking to explore and develop on the RisingWave platform. This plan equips you with all the essential resources needed to test and experience the features offered by RisingWave at a cheap and affordable price. 

Each RisingWave cluster is given a 7-day free trial. You must [add a payment method](/billing-manage-payment-methods.md) to continue your use after the free trial. 

You can create up to three clusters with the Developer plan in your account. Your cluster will be allocated with 2 RWUs with standalone deployment.

#### **Configuration**

- **Cloud platform**
  
    You can deploy your cluster on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

</TabItem>

<TabItem value="standard" label="Standard plan">

The **Standard** plan offers a customizable and scalable cluster suitable for larger teams and more complex projects. You can tailor your cluster's resources to align with your project's specific needs, with the flexibility to adjust configurations as your project evolves. In the Standard plan, you can customize the resources of each component in the RisingWave cluster.

You have to [add a payment method](/billing-manage-payment-methods.md) before you can access the **Standard** plan.

#### **Configuration**

- **Cloud platform**
  
    You can deploy your cluster on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

- **Node configuration**

    Configure each node's instance resources and numbers according to your actual needs.
    
    To learn more about the nodes, see [Understanding nodes in RisingWave](#understanding-nodes-in-risingwave).

</TabItem>

<TabItem value="invited" label="Invited plan">

The **Invited** plan is specifically designed for our enterprise customers. This plan provides unparalleled flexibility, allowing you to customize everything from the underlying infrastructure and cluster configurations to the pricing plan, which includes exclusive discounts.

To access the Invited plan, please contact our sales team. We will provide you with an invitation code. Once you receive this code, you can redeem it to activate the Invited plan across your entire organization.


#### **Configuration**

- **Cloud platform**
  
    You can deploy your cluster on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **Cluster name**

    Name of the cluster. Assigning a descriptive name to each cluster can be helpful when managing multiple clusters.

- **Node configuration**

    Configure each node's instance resources and numbers according to your actual needs.
    
    To learn more about the nodes, see [Understanding nodes in RisingWave](#understanding-nodes-in-risingwave).

</TabItem>

</Tabs>

## Understanding nodes in RisingWave

RisingWave clusters consist of three types of nodes, each serving a distinct role:

1. **Compute node**: Responsible for ingesting data from upstream systems, parsing and running SQL queries, and delivering data to downstream systems.

2. **Frontend node**: Responsible for parsing and validating queries, optimizing query execution plans, and delivering query results.

3. **Compactor node**: Handles data storage and retrieval from object storage. They also perform data compaction to optimize storage efficiency.

4. **Meta node**: Takes charge of managing the metadata of compute and compact nodes and orchestrating operations across the system.

5. **ETCD**: A distributed key-value store that provides a reliable way to store data across a cluster of machines. This node cannot be scaled manually after the cluster is created.

For the architecture of RisingWave, see [RisingWave architecture](/docs/current/architecture/).

## Pricing

For information on your service fee, see [Pricing](/billing-pricing.md).