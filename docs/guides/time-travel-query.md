---
id: time-travel-query
title: Time Travel Query
description: Access historical data at a specific time.
slug: /time-travel-query
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/time-travel-query/" />
</head>

This guide describes how to leverage time travel to access historical data at a specific time.

## Prerequisites

Time travel requires the meta store type to be [SQL compatible](/docs/current/risingwave-docker-compose/#customize-meta-store). We recommend reserving at least 50 GB of disk space for the meta store.

Time travel need to be enabled explicitly, by set `enable_hummock_time_travel = true` and restart the meta node. 
```toml
[meta]
enable_hummock_time_travel = true
```

Enabling time travel introduces additional overhead to both the meta store and the object store. The default data retention period is 1 day, meaning historical data older than 1 day will be deleted and no longer accessible. You can modify `hummock_time_travel_retention_ms` and restart the meta node for the changes to take effect.
```toml
[meta]
hummock_time_travel_retention_ms = 86400000
```

## Query Syntax

Specify `FOR SYSTEM_TIME AS OF` separately for each table accessing historical data. The following subclauses can be used:
- Unix timestamp in seconds. e.g., `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF 1721024455;`.
- Datetime. e.g., `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF '2000-02-29T12:13:14-08:30';`.
- NOW() [ - Interval ]. e.g., `SELECT * FROM t_foo FOR SYSTEM_TIME AS OF NOW() - '10' SECOND;`.

Note that if you specify a point in time that is outside the time travel period, the query'll return an error such as `time travel: version not found for epoch`.

## Storage Space Reclaimation

The storage space in both the meta store and object store occupied by stale time travel data is reclaimed asynchronously. In most cases the default reclaimation interval works just fine.
- The interval to reclaim meta store is 30 seconds by default, which can be modified via `vacuum_interval_sec` followed by a meta node restart.
- The interval to reclaim object store is 1 day by default, which can be modified via `full_gc_interval_sec` and `min_sst_retention_time_sec` followed by a meta node restart.
