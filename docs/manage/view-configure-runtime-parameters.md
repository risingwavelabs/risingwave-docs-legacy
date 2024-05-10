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

For example, you may see a table similar to this:


```plain text title="Runtime Parameters"
          Name                  |     Setting     |        Description
--------------------------------+-----------------+--------------------------------------
 rw_implicit_flush              | false           | If `RW_IMPLICIT_FLUSH` is on, then every INSERT/UPDATE/DELETE statement will block until the entire dataflow is refreshed.
 create_compaction_group_for_mv | false           | If `CREATE_COMPACTION_GROUP_FOR_MV` is on, dedicated compaction groups will be created in MV creation.
 query_mode                     | auto            | A temporary config variable to force query running in either local or distributed mode. If the value is auto, the system will decide for you automatically.
 ...
```

Below is the detailed information about the parameters you may see after using the `SHOW ALL` command:

|                 Name                  |     Values or value examples     |                                                                                                                                                    Description                                                                                                                                                     |
|---------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| rw_implicit_flush                     | `true`/`false`           | If `RW_IMPLICIT_FLUSH` is on, then every INSERT/UPDATE/DELETE statement will block until the entire dataflow is refreshed. In other words, every related table & MV will be able to see the write.                                                                                                              |
| create_compaction_group_for_mv        | `true`/`false`          | If `CREATE_COMPACTION_GROUP_FOR_MV` is on, dedicated compaction groups will be created in MV creation.                                                                                                                                                                                                       |
| query_mode                            | `auto`           | A temporary config variable to force query running in either local or distributed mode. The default value is auto which means let the system decide to run batch queries in local or distributed mode automatically.                                                                                             |
| extra_float_digits                    | `1`              | Set the number of digits displayed for floating-point values. See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#:~:text=for%20more%20information.-,extra_float_digits,-(integer)) for details.                                                                                                   |
| application_name                      | psql            | Set the application name to be reported in statistics and logs. See [here](https://www.postgresql.org/docs/14/runtime-config-logging.html#:~:text=What%20to%20Log-,application_name,-(string)) for details.                                                                                                             |
| datestyle                             | `DMY`                | It is typically set by an application upon connection to the server. See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DATESTYLE) for details.                                                                                                                                            |
| rw_batch_enable_lookup_join           | `true`/`false`           | Force the use of lookup join instead of hash join when possible for local batch execution.                                                                                                                                                                                                                    |
| rw_batch_enable_sort_agg              | `true`/`false`            | Enable usage of sortAgg instead of hash agg when order property is satisfied in batch execution.                                                                                                                                                                                                               |
| batch_enable_distributed_dml          | `true`/`false`            | Enable distributed DML, allowing INSERT/UPDATE/DELETE statements to be executed in a distributed way, such as running on multiple compute nodes. Defaults to false.                                                                    |
| max_split_range_gap                   | 8               | The max gap allowed to transform small range scan into multi point lookup.                                                                                                                                                                                                                                |
| search_path                           | "$user", public | Set the order in which schemas are searched when an object (table, data type, function, etc.) is referenced by a simple name with no schema specified. See [here](https://www.postgresql.org/docs/14/runtime-config-client.html#GUC-SEARCH-PATH) for details.                                                                |
| visibility_mode                       | default         | If `VISIBILITY_MODE` is all, we will support querying data without checkpoint.                                                                                                                                                                                                                                 |
| transaction_isolation                 | read committed  | See [here](https://www.postgresql.org/docs/current/transaction-iso.html) for details.                                                                                                                                                                                                                                     |
| query_epoch                           | 0               | Select as of specific epoch. Sets the historical epoch for querying data. If 0, querying latest data.                                                                                                                                                                                                         |
| timezone                              | UTC             | Session timezone. Defaults to UTC.                                                                                                                                                                                                                                                                           |
| streaming_parallelism                 | `ADAPTIVE`/`0`,`1`,`2`,...               | If `STREAMING_PARALLELISM` is non-zero, CREATE MATERIALIZED VIEW/TABLE/INDEX will use it as streaming parallelism.                                                                                                                                                                                          |
| rw_streaming_enable_delta_join        | `true`/`false`           | Enable delta join for streaming queries. Defaults to false.                                                                                                                                                                                                                                                  |
| rw_streaming_enable_bushy_join        | `true`/`false`            | Enable bushy join for streaming queries. Defaults to true.                                                                                                                                                                                                                                                   |
| streaming_enable_arrangement_backfill | `true`/`false`           | Enable arrangement backfill for streaming queries. Defaults to false.                                                                                                                                                                                                                                        |
| rw_enable_join_ordering               | `true`/`false`            | Enable join ordering for streaming and batch queries. Defaults to true.                                                                                                                                                                                                                                      |
| rw_enable_two_phase_agg               | `true`/`false`            | Enable two phase agg optimization. Defaults to true. Setting this to true will always set `FORCE_TWO_PHASE_AGG` to false.                                                                                                                                                                                    |
| rw_force_two_phase_agg                | `true`/`false`           | Force two phase agg optimization whenever there's a choice between optimizations. Defaults to false. Setting this to true will always set `ENABLE_TWO_PHASE_AGG` to false.                                                                                                                                 |
| rw_enable_share_plan                  | `true`/`false`            | Enable sharing of common sub-plans. This means that DAG structured query plans can be constructed, rather than only tree structured query plans.                                                                                                                                                                |
| rw_force_split_distinct_agg           | `true`/`false`           | Enable split distinct agg.                                                                                                                                                                                                                                                                                     |
| intervalstyle                         |`postgres`               | Set the display format for interval values. It is typically set by an application upon connection to the server. See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-INTERVALSTYLE) for details.                                                                                                                                                                                                            |
| batch_parallelism                     | 0               | If `BATCH_PARALLELISM` is non-zero, batch queries will use this parallelism.                                                                                                                                                                                                                                  |
| server_version                        | 9.5.0           | The version of PostgreSQL that Risingwave claims to be.|
| server_version_num                    | 90500           | The version of PostgreSQL that Risingwave claims to be.                                                                                                                                                                                                                                                       |
| client_min_messages                   | notice          | See [here](https://www.postgresql.org/docs/15/runtime-config-client.html#GUC-CLIENT-MIN-MESSAGES) for details.                                                                                                                                                                                                             |
| client_encoding                       | UTF8            | See [here](https://www.postgresql.org/docs/15/runtime-config-client.html#GUC-CLIENT-ENCODING) for details.                                                                                                                                                                                                                |
| sink_decouple                         | default         | Enable decoupling sink and internal streaming graph or not.                                                                                                                                                                                                                                                   |
| synchronize_seqscans                  | `true`/`false`           | See [here](https://www.postgresql.org/docs/current/runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION) for details. Unused in RisingWave, support for compatibility.                                                                                                                                              |
| statement_timeout                     | 3600               | Abort query statement that takes more than the specified amount of time in sec. If log_min_error_statement is set to ERROR or lower, the statement that timed out will also be logged. The default value is 1 hour. |
| lock_timeout                          | 0               | See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT) for details. Unused in RisingWave, support for compatibility.                                                                                                                                                            |
| row_security                          | `true`/`false`            | See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-ROW-SECURITY) for details. Unused in RisingWave, support for compatibility.                                                                                                                                                          |
| standard_conforming_strings           | on              | See [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STANDARD-CONFORMING-STRINGS)  for details.                                                                                                                                                                                              |
| streaming_rate_limit                  |  `default`/ A positive integer / `0`  | Set the maximum number of records per second per source, for each parallelism. The source here refers to an upstream source or snapshot read in the backfilling process. <br/><br/>The value can be `default`, `0`, or a positive integer. `SET STREAMING_RATE_LIMIT TO 0` will pause the snapshot read stream for backfill and pause the source read for sources (Previously, this disabled the rate limit within the session). `SET STREAMING_RATE_LIMIT TO DEFAULT` will disable the rate limit within the session, but it will not change the rate limits of existing DDLs.<br/><br/>Note that the total throughput of a streaming job is determined by multiplying the parallelism with the throttle rate. To obtain the parallelism value for a streaming job, you can refer to the `streaming_parallelism` runtime parameter in this table.<br/><br/>Besides, we support altering rate limits in [sources](/sql/commands/sql-alter-source.md#set-streaming_rate_limit) and [tables that have source](/docs/sql/commands/sql-alter-table.md#set-streaming_rate_limit).                                                                                        |
| rw_streaming_over_window_cache_policy | full            | Cache policy for partition cache in streaming over window. Can be "full", "recent", "recent_first_n" or "recent_last_n".                                                                                                                                                                                     |
| background_ddl                        | `true`/`false`           | Run DDL statements in background.                                                                                                                                                                                                                                                                               |
| server_encoding                       | UTF8            | Show the server-side character set encoding. At present, this parameter can be shown but not set, because the encoding is determined at database creation time.                                                                                                                                               |
| bytea_output                          | `hex`           | Set the output format for values of type bytea. Valid values are hex (the default) and escape (the traditional PostgreSQL format). See Section 8.4 for more information. The bytea type always accepts both formats on input, regardless of this setting. |


If you just want to view a specific parameter's value, you can also use the `SHOW` command.

```sql
SHOW parameter_name;
```

## How to configure runtime parameters?

You can use `SET` command or the `set_config()` function to change the setting of a runtime parameter.

The syntax of the `SET` command is:

```sql
SET parameter_name { TO | = } { value | 'value' | DEFAULT};
```

Where `parameter_name` is the name of the parameter, and `value` or `'value'` is the new value of the parameter. `DEFAULT` can be written to specify resetting the parameter to its default value.

For details about the `set_config()` function, see [System administration functions](/sql/functions-operators/sql-function-sys-admin.md#set_config), and for details about the `SET` command, see [`SET`](/sql/commands/sql-set.md).


You can also use the [`ALTER SYSTEM SET`](/sql/commands/sql-alter-system.md) command to set a system-wide default value for a runtime parameter. This configuration will then be applied to every new session.

```sql title="Syntax"
ALTER SYSTEM SET session_param_name TO session_param_value;
```

