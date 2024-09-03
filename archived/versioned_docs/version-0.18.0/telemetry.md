---
id: telemetry
title: Telemetry
slug: /telemetry
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/telemetry/" />
</head>

RisingWave collects anonymous usage statistics to better understand how the community is using RisingWave. The sole intention of this exercise is to help improve the product. These statistics are related to system resource usage, OS versions and system uptime. RisingWave doesn't have access to any user data or metadata running on RisingWave clusters including source connection parameters, sources, materialized views, and tables.

We understand that not everyone wants to share usage statistics. You can disable telemetry by following the instructions below.

## How to opt out?

You can opt out by setting the `telemetry_enabled` system parameter before starting a RisingWave cluster. You can set the system parameter in one of the three ways:

- Add or update the parameter setting in `risinwave/src/config/<your-config>.yaml`.

```shell
[server]
telemetry_enabled = false
```

- macOS or Linux: Set an environment variable in a terminal window:

```shell
export ENABLE_TELEMETRY=false
```

- Use the `ALTER SYSTEM` command via `psql`:

```sql
ALTER SYSTEM SET telemetry_enabled = false
```
