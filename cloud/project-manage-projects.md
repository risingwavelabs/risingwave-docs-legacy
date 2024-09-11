---
id: project-manage-projects
title: Manage projects
description: Manage projects in your RisingWave Cloud account.
slug: /manage-projects
---

<!-- MDX imports -->
import OutlinedCard from "@site/src/components/OutlinedCard";
import Grid2 from "@mui/material/Grid2";

A project in RisingWave Cloud provides the necessary resources for hosting independent data repositories and streaming pipelines. Within a project, you can create and manage database users and databases.

> Currently, access to a project is restricted to one RisingWave Cloud account and cannot be shared among multiple accounts. Future releases will introduce organizational support, allowing for managing multiple accounts and their access to individual projects.
>

## Create a project

To create a project in RisingWave Cloud, follow these steps:

1. Click on the [**Projects**](https://cloud.risingwave.com/project/home/) tab.

2. Select a plan. For more details, refer to the [Choose a project plan](project-choose-a-project-plan.md).

3. Configure the project resources according to your needs.

Once you have completed these steps, your project will be created.

## What's next?

<Grid2 container spacing={1}>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Connect to a project"
content="After getting a project up and running, you need to connect to it to interact with RisingWave. You can use the web console or your local client to connect to your project."
cloud="connect-to-a-project"
style={{height: "87%"}}
/>

</Grid2>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Check status and metrics of projects"
content="You can check and monitor the overall running status and detailed metrics of your projects."
cloud="check-status-and-metrics"
style={{height: "87%"}}
/>

</Grid2>

</Grid2>

<Grid2 container spacing={1}>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Update database version"
content="When a newer version of RisingWave is available, you can update the database version of your project to the latest."
cloud="update-database-version"
style={{height: "87%"}}
/>

</Grid2>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Stop and delete projects"
content="You can manually control the running state of your projects or delete them."
cloud="stop-and-delete-projects"
style={{height: "87%"}}
/>

</Grid2>

</Grid2>
