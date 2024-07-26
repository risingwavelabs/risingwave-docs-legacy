---
id: project-update-database-version
title: Update RisingWave version
description: Update the RisingWave version of a project.
slug: /update-database-version
---

When a newer version of RisingWave is available, you can update the database version of your project to the latest. See the [Release Notes of RisingWave](/release-notes/) for feature updates of each version.

## Prerequisite

Before the upgrade, ensure that all critical data are backed up and all critical tasks are safely paused, because the upgrade will cause temporary downtime and halt the running streaming pipelines. While the project is paused:

- The project will be accessible.

- No streaming pipelines will run.

- You will not incur charges for the compute resources.

## Procedure

1. Go to [**Project**](https://cloud.risingwave.com/project/home/).

2. Click the rocket icon next to the project you want to update the database version.

3. Wait for the update to complete. This may take a few minutes.

:::note
You can only update the RisingWave version of a project to a newer version. You cannot downgrade it.
:::
