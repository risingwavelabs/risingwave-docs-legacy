---
id: project-check-status-and-metrics
title: Check status and metrics of projects
description: Check and monitor the overall running status and detailed metrics of your projects.
slug: /check-status-and-metrics
---

You can check and monitor your projects' overall running status and detailed metrics.

## Check all project

To browse each project's configuration and running status in your account, go to [**Projects**](https://cloud.risingwave.com/project/home/).

In **Projects**, you can see all the projects in your account and [control their running states](project-stop-and-delete-projects.md). You can also check the current plan, RisingWave version, region, and creation time of each project here.

## Check project details

To enter the project details page and check the information, such as current activities and resource usage, and monitor all metrics of a project, go to [**Projects**](https://cloud.risingwave.com/project/home/) and click on the project.

The project details page includes:

- Current activities
- Current usage
- Configuration details
- Metrics
  - Key indicators — CPU usage, memory usage, throughput, storage usage, and network
  - Streaming — barrier latency, in-flight barrier number, backfilling throughput, backpressure rate
  - Query — query per second, query average latency
  - UDF — UDF call count, UDF latency, UDF throughput
- [PrivateLink](PrivateLink-overview.md)
- [Database users](project-manage-database-users.md)

:::tip

To specify the time range of the metrics, go to the **Metrics** tab, and click on **Last 30 minutes** in the top right corner to customize your time range.

:::
