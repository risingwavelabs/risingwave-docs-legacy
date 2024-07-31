---
id: time-travel-query
title: Time travel query
description: Access historical data at a specific time.
slug: /time-travel-query
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/time-travel-query/" />
</head>

This guide describes how to leverage time travel to access historical data at a specific time.

## Prerequisites

Time travel requires the meta store type to be [SQL-compatible](/docs/deploy/risingwave-docker-compose.md#customize-meta-store). We recommend reserving at least 50 GB of disk space for the meta store.

Ensure that time travel is enabled explicitly. You can enable it by setting `enable_hummock_time_travel = true` and restarting the meta node.

```toml
[meta]
enable_hummock_time_travel = true
```

Enabling time travel introduces additional overhead to both the meta store and the object store. The default data retention period is 1 day, meaning historical data older than 1 day will be deleted and no longer accessible. You can modify `hummock_time_travel_retention_ms` and restart the meta node for the changes to take effect.

```toml
[meta]
hummock_time_travel_retention_ms = 86400000
```

## Syntax

Specify `FOR SYSTEM_TIME AS OF` separately for each table accessing historical data. The following subclauses can be used:

- Unix timestamp in seconds. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF 1721024455;`.

- Datetime. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF '2000-02-29T12:13:14-08:30';`.

- NOW() [ - Interval ]. For example, `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF NOW() - '10' SECOND;`.

Note that if you specify a point in time that is outside the time travel period, the query will return an error, like `time travel: version not found for epoch`.

## Storage space reclamation

Stale time travel data in both the meta and object stores is automatically removed in the background, freeing up storage space. The default cleanup schedule is as below, which is usually sufficient for most situations.

- The interval to reclaim the meta store is 30 seconds by default. You can change this interval by adjusting the `vacuum_interval_sec` setting. After changing this setting, restart the meta node for it to take effect.

- The interval to reclaim the object store is 1 day by default. You can customize this schedule by adjusting two settings: `full_gc_interval_sec` and `min_sst_retention_time_sec`. After modifying these values, restart the meta node to apply the changes.
