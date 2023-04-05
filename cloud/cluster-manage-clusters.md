---
id: cluster-manage-clusters
title: Manage clusters
description: Manage clusters in your RisingWave Cloud account.
slug: /manage-clusters
---


A cluster in RisingWave Cloud provides the necessary resources for hosting independent data repositories and streaming pipelines. Within a cluster, you can create and manage database users and databases.

> Currently, access to a cluster is restricted to one RisingWave Cloud account and cannot be shared among multiple accounts. Future releases will introduce organizational support, allowing for managing multiple accounts and their access to individual clusters.
> 

## Create a cluster

<grid
nums={2}
cols={2}
children={[

<div>

You can find the **Create cluster** button in [**Clusters**](https://risingwave-cloud.com/clusters/).
<br/>
<img
  src={require('./images/cluster-create-button.png').default}
  alt="Create cluster button"
/>

</div>,

<div>

When creating a cluster, you can [choose a cluster plan](cluster-choose-a-cluster-plan.md) and configure cluster resources according to your needs.

<img
  src={require('./images/cluster-create-plans.png').default}
  alt="Cluster plans"
/>

</div>,

<card
title="Choose a cluster plan"
content="When creating a cluster, you can choose a cluster plan and configure cluster resources according to your needs."
cloud="cluster-choose-a-cluster-plan"
/>
]}
/>


## What's next?

<grid
nums={3}
cols={3}
children={[

<card
title="Connect to a cluster"
content="After getting a cluster up and running, you need to connect to it to interact with RisingWave Database. You can use the web console or your local client to connect to your cluster."
cloud="cluster-connect-to-a-cluster"
/>,
<card
title="Check status and metrics of clusters"
content="You can check and monitor the overall running status and detailed metrics of your clusters."
cloud="cluster-check-status-and-metrics"
/>,
<card
title="Stop and delete clusters"
content="You can manually control the running state of your clusters or delete them."
cloud="cluster-stop-and-delete-clusters"
/>
]}
/>