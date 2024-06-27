---
id: project-stop-and-delete-projects
title: Stop and delete projects
description: Stop and delete projects.
slug: /stop-and-delete-projects
---

You can manually control the running state of your projects or delete them.

You can go to [**Projects**](https://cloud.risingwave.com/project/home/) to control your projects.

## Stop a project

Click **Pause** to stop running a project when needed.

This will halt the running streaming pipelines and release all the compute resources of the running project.
While the project is paused:

- The project will be accessible.

- No streaming pipelines will run.

- You will not incur charges for the compute resources.

Please ensure that all critical tasks are safely paused before proceeding. You can click **Resume** to restart a stopped project at any time after it has been paused.

## Delete a project

If you no longer need a project and its associated data, you can delete it to free up resources.

:::info
You must delete all projects before [deleting your account](account-manage-your-account.md/?task=delete-account).
:::

This is irreversible and will remove all data and running streaming pipelines in the project permanently.

Please ensure all critical data are backed up and no critical task depend on the project before proceeding.

