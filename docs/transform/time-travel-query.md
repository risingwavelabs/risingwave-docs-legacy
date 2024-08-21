---
id: time-travel-queries
title: Time travel queries
description: Access historical data at a specific time.
slug: /time-travel-queries
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/time-travel-queries/" />
</head>

This guide describes how to leverage the time travel feature. This feature helps access historical data at a specific time.

:::info Public Preview
This feature is in the public preview stage. This means it's nearing the final product, but not fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Prerequisites

Time travel requires the meta store type to be [SQL-compatible](/docs/deploy/risingwave-docker-compose.md#customize-meta-store). We recommend reserving at least 50 GB of disk space for the meta store.

The system parameter `time_travel_retention_ms` controls time travel functionality. By default, it's set to `0`, which means time travel is turned off. To enable time travel, you need to [alter this system parameter](/manage/view-configure-system-parameters.md#how-to-configure-system-parameters) to a non-zero value.

For example, you can set `time_travel_retention_ms` to `86400000` (1 day). Then historical data older than this period will be deleted and no longer accessible.

:::note
Enabling time travel will introduce additional overhead to both the meta store and the object store.
:::

## Syntax

Specify `FOR SYSTEM_TIME AS OF` separately for each table accessing historical data. The following subclauses can be used:

- Unix timestamp in seconds. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF 1721024455;`.

- Datetime. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF '2000-02-29T12:13:14-08:30';`.

- NOW() [ - Interval ]. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF NOW() - '10' SECOND;`.

:::note
If you specify a point in time that is outside the time travel period, the query will return an error, like `time travel: version not found for epoch`.
:::

## Storage space reclamation

Stale time travel data in both the meta and object stores is automatically removed in the background, freeing up storage space. The default cleanup schedule is as below, which is usually sufficient for most situations.

- The interval to reclaim the meta store is 30 seconds by default. You can change this interval by adjusting the `vacuum_interval_sec` setting. After changing this setting, restart the meta node for it to take effect.

- The interval to reclaim the object store is 1 day by default. You can customize this schedule by adjusting two settings: `full_gc_interval_sec` and `min_sst_retention_time_sec`. After modifying these values, restart the meta node to apply the changes.
