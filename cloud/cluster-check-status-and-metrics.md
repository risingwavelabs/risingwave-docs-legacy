---
id: cluster-check-status-and-metrics
title: Check status and metrics of clusters
description: Check and monitor the overall running status and detailed metrics of your clusters.
slug: /check-status-and-metrics
---

You can check and monitor your clusters' overall running status and detailed metrics.

## Check the overall condition

<grid
 container
 direction="row"
 spacing="20"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

<grid item xs={6} md={6}>

To check the overall condition of the clusters in your account, go to [**Dashboard**](https://risingwave-cloud.com/dashboard/).
    
In **Dashboard**, you can get an overview of the clusters in your account, including the number of clusters, their plan selections, and running statuses. You can also click on a cluster to check its running metrics.

<img
  src={require('./images/dashboard.png').default}
  alt="Dashboard"
/>

</grid>

<grid item xs={6} md={6}>

To browse each cluster's configuration and running status in your account, go to [**Clusters**](https://risingwave-cloud.com/clusters/).
    
In **Clusters**, you can see all the clusters in your account and [control their running states](cluster-stop-and-delete-clusters.md). You can also check the current plan, RisingWave Database version, region, and creation time of each cluster here.
    
<img
  src={require('./images/clusters.png').default}
  alt="Clusters"
/>
  
</grid>
</grid>


## Check cluster details

To enter the cluster details page and check the information such as current activities and resource usage and monitor all metrics of a cluster, go to [**Clusters**](https://risingwave-cloud.com/clusters/) and click on the cluster.

The cluster details page includes:

- Current activities
- Resource usage — CPU usage, memory usage, throughput, storage usage, and network
- Materialized views
- Database users


<img
  src={require('./images/cluster-details-page.png').default}
  alt="Cluster details page"
/>

<br/><br/>


<grid
 container
 direction="row"
 spacing="20"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

<grid item xs={6} md={6}>

You can specify the time range of the metrics:

<img
  src={require('./images/cluster-metrics-timerange.png').default}
  alt="Specify time range"
/>

</grid>

<grid item xs={6} md={6}>

You can click on any item to view the details:

<img
  src={require('./images/cluster-metrics-details.png').default}
  alt="Metric details"
/>
  
</grid>

</grid>