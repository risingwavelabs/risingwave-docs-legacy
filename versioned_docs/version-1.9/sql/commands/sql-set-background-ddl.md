---
id: sql-set-background-ddl
title: SET BACKGROUND_DDL
description: Run Data Definition Language (DDL) operations in the background.
slug: /sql-set-background-ddl
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-set-background-ddl/" />
</head>

:::note Beta feature
The `SET BACKGROUND_DDL` command is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

Data Definition Language (DDL) commands, such as creating materialized views, will first **backfill** historical data from the referenced relations, which may take a long time to complete depending on how much data needs to be backfilled.

You can use the `SET BACKGROUND_DDL` command to run DDL commands in the background.

## Syntax

```sql
SET BACKGROUND_DDL = { true | false };
```

- By default, `BACKGROUND_DDL` is set as `false` to disable it, meaning that DDL operations will execute in the foreground. The DDL commands will be blocking and only return until the backfill process is completed.

- When `BACKGROUND_DDL` is set to `true`, any subsequent DDL operations will be executed in the background, allowing you to proceed with other tasks.

## Supported DDL operations

- [CREATE MATERIALIZED VIEW](/sql/commands/sql-create-mv.md)
- [CREATE SINK](/sql/commands/sql-create-sink.md)

## Persistence

For materialized views being created in the background, their table definitions persist while they are being created, even if errors occur during checkpointing. This allows the materialized view jobs to be recovered from where they left off before the failure. Their table definitions and fragments will only be dropped if the job is canceled.

For materialized views being created in the foreground, their table and fragments will be cleaned up if checkpointing fails, if the cluster is restarted, or if the stream job is canceled.

The key difference is during the **creating phase** of a materialized view. After a materialized view is created (i.e. backfilling has completed), both foreground and background materialized views are functionally the same.

## Background management

### Monitor progress

You can monitor the progress of background DDL operations using the [`SHOW JOBS`](/sql/commands/sql-show-jobs.md) command.

### Cancel jobs

Running jobs in the background can be canceled using the [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md) command followed by the job ID.

### Set concurrent jobs

The maximum number of concurrent creating streaming jobs can be adjusted using the `ALTER SYSTEM SET max_concurrent_creating_streaming_jobs` command.

For example, you can set the maximum concurrent creating streaming jobs to 4:

```sql
ALTER SYSTEM SET max_concurrent_creating_streaming_jobs TO 4;
```

## Examples

```sql
CREATE TABLE t (v1 int);

INSERT INTO t SELECT * FROM generate_series(1, 1000000);

SET BACKGROUND_DDL=true;

CREATE MATERIALIZED VIEW m AS SELECT * FROM t; 
-- The "CREATE_MATERIALIZED_VIEW" response will be returned immediately.
```
