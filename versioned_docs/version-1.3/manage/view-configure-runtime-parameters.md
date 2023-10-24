---
id: view-configure-runtime-parameters
title: View and configure runtime parameters
description: View the runtime parameters and configure their values if needed.
slug: /view-configure-runtime-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/view-configure-runtime-parameters/" />
</head>

## What are runtime parameters?

Runtime parameters are variables that can be set at runtime to configure the behavior of RisingWave.

## How to view runtime parameters?

You can use the `SHOW ALL` command to view the runtime parameters, their current settings, and some notes about these parameters.

```sql
SHOW ALL;
```

``` title=Parameters
          Name                  |     Setting     |        Description
--------------------------------+-----------------+--------------------------------------
 rw_implicit_flush              | false           | If `RW_IMPLICIT_FLUSH` is on, then every INSERT/UPDATE/DELETE statement will block until the entire dataflow is refreshed.
 create_compaction_group_for_mv | false           | If `CREATE_COMPACTION_GROUP_FOR_MV` is on, dedicated compaction groups will be created in MV creation.
 query_mode                     | auto            | A temporary config variable to force query running in either local or distributed mode. If the value is auto, the system will decide for you automatically.
 extra_float_digits             | 1               | Sets the number of digits displayed for floating-point values.
 application_name               | psql            | Sets the application name to be reported in statistics and logs.
 datestyle                      |                 | It is typically set by an application upon connection to the server.
 rw_batch_enable_lookup_join    | true            | To enable the usage of lookup join instead of hash join when possible for local batch execution.
 rw_batch_enable_sort_agg       | true            | To enable the usage of sort agg instead of hash join when order property is satisfied for batch execution.
 max_split_range_gap            | 8               | It's the max gap allowed to transform small range scan scan into multi point lookup.
 search_path                    | "$user", public | Sets the order in which schemas are searched when an object (table, data type, function, etc.) is referenced by a simple name with no schema specified
 visibility_mode                | default         | If `VISIBILITY_MODE` is all, we will support querying data without checkpoint.
 query_epoch                    | 1               | Sets the historical epoch for querying data. If 0, querying latest data.
 timezone                       | UTC             | The session timezone. This will affect how timestamps are cast into timestamps with timezone.
 streaming_parallelism          | 0               | Sets the parallelism for streaming. If 0, use default value.
 rw_streaming_enable_delta_join | false           | Enable delta join in streaming queries.
 rw_streaming_enable_bushy_join | true            | Enable bushy join in streaming queries.
 rw_enable_join_ordering        | true            | Enable join ordering for streaming and batch queries.
 rw_enable_two_phase_agg        | true            | Enable two phase aggregation.
 rw_force_two_phase_agg         | false           | Force two phase aggregation.
 rw_enable_share_plan           | true            | Enable sharing of common sub-plans. This means that DAG structured query plans can be constructed, rather than only tree structured query plans.
 intervalstyle                  |                 | It is typically set by an application upon connection to the server.
 batch_parallelism              | 0               | Sets the parallelism for batch. If 0, use default value.
 server_version                 | 8.3.0           | The version of the server.
 server_version_num             | 80300           | The version number of the server.
 rw_force_split_distinct_agg    | false           | Enable split the distinct aggregation.
```

## How to configure runtime parameters?

You can use `SET` command or the `set_config()` function to change the setting of a runtime parameter.

The syntax of the `SET` command is:

```sql
SET parameter_name { TO | = } { value | 'value' };
```

Where `parameter_name` is the name of the parameter, and `value` or `'value'` is the new value of the parameter.

For details about the `set_config()` function, see [System administration functions](/sql/functions-operators/sql-function-sys-admin.md#set_config).
