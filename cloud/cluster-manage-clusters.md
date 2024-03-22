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
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

 <grid item xs={6} md={6}>

  <img
    src={require('./images/cluster-create-button.png').default}
    alt="Create cluster button"
  />

  You can find the **Create cluster** button in [**Clusters**](https://cloud.risingwave.com/clusters/).

 </grid>

 <grid item xs={6} sm={6} md={6}>

  <img
    src={require('./images/cluster-create-plans.png').default}
    alt="Cluster plans"
  />

  When creating a cluster, you can [choose a cluster plan](cluster-choose-a-cluster-plan.md) and configure cluster resources according to your needs.

 </grid>

</grid>


## What's next?

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Connect to a cluster"
content="After getting a cluster up and running, you need to connect to it to interact with RisingWave. You can use the web console or your local client to connect to your cluster."
cloud="connect-to-a-cluster"
style={{height: "87%"}}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Check status and metrics of clusters"
content="You can check and monitor the overall running status and detailed metrics of your clusters."
cloud="check-status-and-metrics"
style={{height: "87%"}}
/>
  
</grid>

</grid>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Update database version"
content="When a newer version of RisingWave is available, you can update the database version of your cluster to the latest."
cloud="update-database-version"
style={{height: "87%"}}
/>
  
</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Stop and delete clusters"
content="You can manually control the running state of your clusters or delete them."
cloud="stop-and-delete-clusters"
style={{height: "87%"}}
/>
  
</grid>

</grid>
