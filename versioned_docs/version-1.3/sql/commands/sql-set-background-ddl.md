---
id: sql-set-background-ddl
title: SET BACKGROUND_DDL
description: Run Data Definition Language (DDL) operations in the background.
slug: /sql-set-background-ddl
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-set-background-ddl/" />
</head>

:::note Beta Feature
The `SET BACKGROUND_DDL` command is currently in Beta. Please contact us if you encounter any issues or have feedback.

Currently, if the cluster crashes while a background DDL operation is still running, recovery is not supported.
:::

Use the `SET BACKGROUND_DDL` command to run Data Definition Language (DDL) operations, such as creating materialized views in the background.

## Syntax

```sql
SET BACKGROUND_DDL = { true | false };
```

- When `BACKGROUND_DDL` is set to true, any subsequent DDL operations will be executed in the background, allowing you to proceed with other tasks.

- When `BACKGROUND_DDL` is set to false (or not set at all), the DDL operations will execute as normal.

## Supported DDL operations

- [CREATE MATERIALIZED VIEW](/sql/commands/sql-create-mv.md)

## Background management

### Monitor progress

You can monitor the progress of background DDL operations using the [`SHOW JOBS`](/sql/commands/sql-show-jobs.md) command.

### Cancel jobs

Running jobs in the background can be cancelled using the [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md) command followed by the job ID.

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
