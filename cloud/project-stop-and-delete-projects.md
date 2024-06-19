---
id: project-stop-and-delete-projects
title: Stop and delete projects
description: Stop and delete projects.
slug: /stop-and-delete-projects
---

You can manually control the running state of your projects or delete them.

You can go to [**Projects**](https://cloud.risingwave.com/project/home/) to control your projects.


## Stop a project


<grid
 container
 direction="row"
 spacing="20"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

<grid item xs={6} md={6}>

<img
  src={require('./images/cluster-stop.png').default}
  alt="Stop a cluster"
/>

You can click **Stop** to stop running a project when needed. A stopped project will keep all existing data but pause any activities.

</grid>

<grid item xs={6} md={6}>

<img
  src={require('./images/cluster-restart.png').default}
  alt="Restart a stopped cluster"
/>

To restart a stopped project, click **Start**.
  
</grid>

</grid>

## Delete a project

If you no longer need a project and its associated data, you can delete it to free up resources.

:::info
You must delete all projects before [deleting your account](account-manage-your-account.md/?task=delete-account).
:::

<img
  src={require('./images/cluster-delete.gif').default}
  alt="Delete a cluster"
/>
