---
id: cluster-check-status-and-metrics
title: Check status and metrics of clusters
description: Check and monitor the overall running status and detailed metrics of your clusters.
slug: /check-status-and-metrics
---

You can check and monitor your clusters' overall running status and detailed metrics.

## Check all clusters

To browse each cluster's configuration and running status in your account, go to [**Clusters**](https://cloud.risingwave.com/clusters/).

In **Clusters**, you can see all the clusters in your account and [control their running states](cluster-stop-and-delete-clusters.md). You can also check the current plan, RisingWave version, region, and creation time of each cluster here.

<img
  src={require('./images/clusters.png').default}
  alt="Clusters"
/>

## Check cluster details

To enter the cluster details page and check the information, such as current activities and resource usage, and monitor all metrics of a cluster, go to [**Clusters**](https://cloud.risingwave.com/clusters/) and click on the cluster.

The cluster details page includes:

- Current activities
- Resource metrics — CPU usage, memory usage, throughput, storage usage, and network
- Cluster configuration
- [Materialized views](cluster-monitor-materialized-views.md)
- [Database users](cluster-manage-database-users.md)

<img
  src={require('./images/cluster-details-page.png').default}
  alt="Cluster details page"
/>

You can specify the time range of the metrics:

<img
  src={require('./images/cluster-metrics-timerange.png').default}
  alt="Specify time range"
/>

Or click on any item to view the details:

<img
  src={require('./images/cluster-metrics-details.png').default}
  alt="Metric details"
/>
