---
id: cluster-stop-and-delete-clusters
title: Stop and delete clusters
description: Stop and delete clusters.
slug: /stop-and-delete-clusters
---

You can manually control the running state of your clusters or delete them.

You can go to [**Clusters**](https://cloud.risingwave.com/clusters/) to control your clusters.

## Stop a cluster

<ResponsiveGrid
 container
 direction="row"
 spacing="20"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

<ResponsiveGrid item xs={6} md={6}>

<img
src={require('./images/cluster-stop.png').default}
alt="Stop a cluster"
/>

You can click **Stop** to stop running a cluster when needed. A stopped cluster will keep all existing data but pause any activities.

</ResponsiveGrid>

<ResponsiveGrid item xs={6} md={6}>

<img
src={require('./images/cluster-restart.png').default}
alt="Restart a stopped cluster"
/>

To restart a stopped cluster, click **Start**.

</ResponsiveGrid>

</ResponsiveGrid>

## Delete a cluster

If you no longer need a cluster and its associated data, you can delete it to free up resources.

:::info
You must delete all clusters before [deleting your account](account-manage-your-account.md).
:::

<img
src={require('./images/cluster-delete.gif').default}
alt="Delete a cluster"
/>
