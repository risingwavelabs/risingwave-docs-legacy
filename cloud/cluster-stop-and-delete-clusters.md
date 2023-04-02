---
id: cluster-stop-and-delete-clusters
title: Stop and delete clusters
description: Stop and delete clusters.
slug: /cluster-stop-and-delete-clusters
---

You can manually control the running state of your clusters or delete them.

Go to [**Clusters**](https://risingwave-cloud.com/clusters/) to control your clusters.


## Stop a cluster

<grid
nums={2}
cols={2}
children={[

<div>

<img
  src={require('./images/cluster-stop.gif').default}
  alt="Stop a cluster"
/>

You can click **Stop** to stop running a cluster when needed.

A stopped cluster will keep all existing data but pause any activities.

</div>,

<div>

<img
  src={require('./images/cluster-restart.gif').default}
  alt="Restart a stopped cluster"
/>

To restart a stopped cluster, click **Start**.

</div>
]}
/>

## Delete a cluster

If you no longer need a cluster or its associated data, you can delete the cluster to free up resources.

:::info
You must delete all clusters before [deleting your account](/cloud/account-manage-your-account/?task=delete-account).
:::

<img
  src={require('./images/cluster-delete.gif').default}
  alt="Delete a cluster"
/>