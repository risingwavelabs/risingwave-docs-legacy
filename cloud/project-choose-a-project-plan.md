---
id: project-choose-a-project-plan
title: Choose a project plan
description: Choose a plan when you create a project.
slug: /choose-a-project-plan
---

RisingWave Cloud offers different types of RisingWave projects. Each project type is associated with the corresponding features, capabilities, restrictions, and pricing models. Please choose a project plan and configure project resources according to your needs when creating a project.

Currently, RisingWave Cloud offers three types of projects: **Trial**, **Standard**, and **Advanced**. The table below describes a high-level comparison of features and restrictions across three project types.

| Service type | Trial | Standard | Advanced |
| --- | --- | --- | --- |
| Deployment type | Multi-tenancy deployment, single-node project | Multi-tenancy deployment, multi-node project | Multi-tenancy deployment, multi-node project |
| Description | Standalone deployment with 2-RWU resources.  | Deployed on shared Kubernetes service with customized resources.  | Customized project deployment based on requests |
| Pricing | Free | Pay-as-you-go | Customized, contact sales |
| Payment | / | Credit card | Credit card, bank transfer, marketplace |
| Compute resource | 2 RWUs | Customized, up to 160 RWUs | Customized and unlimited resources |
| project number | 3 | Unlimited | Unlimited |
| Monitoring | Yes | Yes | Yes |
| Workspace | Yes | Yes | Yes |
| Source management | Yes | Yes | Yes |
| Sink management | Yes | Yes | Yes |
| VPC PrivateLink | No | Yes | Yes |

Select the plan below to see the details.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="plan">

<TabItem value="trial" label="Trial plan">

The **Trial** plan is designed for individual developers or small teams looking to explore and develop on the RisingWave platform. This plan equips you with all the essential resources needed to test and experience the features offered by RisingWave for free.

You can create up to three projects with the Trial plan in your account. Your project will be allocated with 2 RWUs with standalone deployment.

#### **Configuration**

- **Cloud platform**
  
    You can deploy your project on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **project name**

    Name of the project. Assigning a descriptive name to each project can be helpful when managing multiple projects.

</TabItem>

<TabItem value="standard" label="Standard plan">

The **Pro** plan offers a customizable and scalable project suitable for larger teams and more complex projects. You can tailor your project's resources to align with your project's specific needs, with the flexibility to adjust configurations as your project evolves. In the Standard plan, you can customize the resources of each component in the RisingWave project.

You have to [add a payment method](/billing-manage-payment-methods.md) before you can access the **Pro** plan.

#### **Configuration**

- **Cloud platform**
  
    You can deploy your project on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **project name**

    Name of the project. Assigning a descriptive name to each project can be helpful when managing multiple projects.

- **Node configuration**

    Configure each node's instance resources and numbers according to your actual needs.
    
    To learn more about the nodes, see [Understanding nodes in RisingWave](#understanding-nodes-in-risingwave).

</TabItem>

<TabItem value="advanced" label="Advanced plan">

The **Advanced** plan is specifically designed for our enterprise customers. You can either utilize our hosted service or [Bring Your Own Cloud](project-byoc.md). This plan provides unparalleled flexibility, allowing you to customize everything from the underlying infrastructure and project configurations to the pricing plan, which may include exclusive discounts.

To access the Advanced plan, please contact our sales team. We will provide you with an invitation code. Once you receive this code, you can redeem it to activate the Advanced plan across your entire organization.


#### **Configuration**

- **Cloud platform**
  
    You can deploy your project on either AWS or Google Cloud, depending on your cloud provider preferences.

- **Region**

    You can choose the availability region closest to you to minimize latency.

- **project name**

    Name of the project. Assigning a descriptive name to each project can be helpful when managing multiple projects.

- **Node configuration**

    Configure each node's instance resources and numbers according to your actual needs.
    
    To learn more about the nodes, see the [architecture of RisingWave](/docs/current/architecture).

</TabItem>

</Tabs>

## Understanding nodes in RisingWave

RisingWave projects consist of three types of nodes, each serving a distinct role:

1. **Compute node**: Responsible for ingesting data from upstream systems, parsing and running SQL queries, and delivering data to downstream systems.

2. **Frontend node**: Responsible for parsing and validating queries, optimizing query execution plans, and delivering query results.

3. **Compactor node**: Handles data storage and retrieval from object storage. They also perform data compaction to optimize storage efficiency.

4. **Meta node**: Takes charge of managing the metadata of compute and compact nodes and orchestrating operations across the system.

5. **ETCD**: A distributed key-value store that provides a reliable way to store data across a project of machines. This node cannot be scaled manually after the project is created.

For the architecture of RisingWave, see [RisingWave architecture](/docs/current/architecture/).

## Pricing

For information on your service fee, see [Pricing](/billing-pricing.md).